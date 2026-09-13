import { Box, Flex, Text, Badge, Menu, Portal, IconButton, Checkbox } from '@chakra-ui/react'
import { EllipsisVertical, Star, Trash2, Tags, FolderInput, GripVertical, SearchCheck, TriangleAlert, PencilLine } from 'lucide-react'
import { MediaThumb } from './MediaThumb'
import type { MediaFolder, MediaFolderId } from './data'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface MediaCardProps {
  src: string
  label: string
  featured: boolean
  variantTags: string[]
  /** متن جایگزین؛ خالی بودنش روی کارت هشدار می‌دهد (بررسی «ALT تصاویر» در مرحلهٔ سئو) */
  alt: string
  folder: MediaFolderId
  folders: MediaFolder[]
  selected: boolean
  onSelect: (checked: boolean) => void
  onRemove: () => void
  onSetFeatured: () => void
  onSelectVariant: () => void
  onEditSeo: () => void
  /** باز کردن دیالوگ «نام فایل» */
  onRename: () => void
  onMoveToFolder: (target: MediaFolderId) => void
  // ── مرتب‌سازی ──
  draggable?: boolean
  isDragging?: boolean
  /** کارتی (هر کدام) در حال کشیده‌شدن است — بقیه کم‌رنگ می‌شوند */
  someoneDragging?: boolean
  onDragStart?: () => void
  onDragOver?: (e: React.DragEvent) => void
  onDrop?: () => void
  onDragEnd?: () => void
}

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * MediaCard — کارت رسانه در نمای شبکه‌ای.
 *
 * عملیات کارت پشت یک منوی سه‌نقطه است، نه ردیفی از دکمه‌ها. آیکن سه‌نقطه یک
 * آیکن واقعی است و همیشه دیده می‌شود — بند ۶ دور «چاکرا اصلاح» که می‌گفت این
 * دکمه سفیدِ بی‌آیکن است.
 *
 * RTL DOM order نوار بالای تصویر (first = rightmost): چک‌باکس ← دستگیره ← منو.
 */
export function MediaCard({
  src, label, featured, variantTags, alt, folder, folders,
  selected, onSelect, onRemove, onSetFeatured, onSelectVariant, onEditSeo, onRename, onMoveToFolder,
  draggable, isDragging = false, someoneDragging = false, onDragStart, onDragOver, onDrop, onDragEnd,
}: MediaCardProps) {
  return (
    <Box
      role="group"
      borderWidth="1px"
      /* در حین کشیدن، خودِ کارتِ کشیده‌شده قابِ برند می‌گیرد = همان «خط موقعیت
         درج»؛ چون مرتب‌سازی زنده است، جای فعلی‌اش دقیقاً جای افتادنش است. */
      borderColor={
        isDragging ? 'brand.solid'
          : selected ? 'brand.solid'
            : featured ? 'brand.border'
              : 'border.muted'
      }
      boxShadow={isDragging ? '0 0 0 2px var(--chakra-colors-brand-solid)' : undefined}
      rounded="12px"
      overflow="hidden"
      bg="bg.panel"
      /* تصویرِ در حال کشیدن کاملاً واضح می‌ماند؛ بقیه نصفه‌رنگ می‌شوند و با
         رهاکردن برمی‌گردند (بازخورد کاربر، مورد ۶). */
      opacity={someoneDragging && !isDragging ? 0.5 : 1}
      transition="border-color 0.15s, opacity 0.15s, box-shadow 0.15s"
      _hover={{ borderColor: 'brand.border' }}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      cursor={draggable ? 'grab' : undefined}
      w="full"
    >
      <Box position="relative">
        {/* نسبت کادر تصویر از طرح: ۱۹۲×۱۵۵ ≈ ۱.۲۴ (نه مربع) */}
        <MediaThumb src={src} alt={label} aspectRatio="1.24" w="full" roundedTop="12px" />

        {/* نوار کنترل روی تصویر */}
        <Flex
          position="absolute"
          top="1.5"
          insetInline="1.5"
          align="center"
          gap="1"
        >
          {/* FIRST = rightmost: انتخاب گروهی */}
          <Checkbox.Root
            size="sm"
            checked={selected}
            onCheckedChange={(e) => onSelect(e.checked === true)}
            bg="bg.panel"
            rounded="sm"
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
          </Checkbox.Root>

          {/* دستگیره فقط در hover — روی موبایل (بدون hover) همیشه دیده می‌شود
              وگرنه راهی برای جابه‌جایی نمی‌ماند (بازخورد کاربر، مورد ۶). */}
          {draggable && (
            <Flex
              boxSize="26px"
              flexShrink={0}
              align="center"
              justify="center"
              bg="bg.panel"
              borderWidth="1px"
              borderColor="border.muted"
              rounded="md"
              color="fg.muted"
              aria-hidden
              opacity={isDragging ? 1 : 0}
              transition="opacity .15s"
              _groupHover={{ opacity: 1 }}
              css={{ '@media (hover: none)': { opacity: 1 } }}
            >
              <GripVertical size={14} />
            </Flex>
          )}

          <Box flex="1" />

          {/* LAST = leftmost: منوی سه‌نقطه */}
          <Menu.Root>
            <Menu.Trigger asChild>
              <IconButton
                size="xs"
                variant="subtle"
                boxSize="26px"
                minW="26px"
                bg="bg.panel"
                borderWidth="1px"
                borderColor="border.muted"
                rounded="md"
                aria-label={`عملیات ${label}`}
              >
                <EllipsisVertical size={14} />
              </IconButton>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner dir="rtl">
                <Menu.Content>
                  {!featured && (
                    <Menu.Item value="featured" onSelect={onSetFeatured}>
                      <Star size={14} />انتخاب به‌عنوان تصویر اصلی
                    </Menu.Item>
                  )}
                  <Menu.Item value="variant" onSelect={onSelectVariant}>
                    <Tags size={14} />تخصیص تنوع
                  </Menu.Item>
                  <Menu.Item value="rename" onSelect={onRename}>
                    <PencilLine size={14} />نام فایل
                  </Menu.Item>
                  <Menu.Item value="seo" onSelect={onEditSeo}>
                    <SearchCheck size={14} />سئوی تصویر
                  </Menu.Item>
                  <Menu.Root positioning={{ placement: 'left-start' }}>
                    <Menu.TriggerItem>
                      <FolderInput size={14} />انتقال به پوشه
                    </Menu.TriggerItem>
                    <Portal>
                      <Menu.Positioner dir="rtl">
                        <Menu.Content>
                          {folders.filter((f) => f.id !== folder).map((f) => (
                            <Menu.Item key={f.id} value={f.id} onSelect={() => onMoveToFolder(f.id)}>
                              {f.label}
                            </Menu.Item>
                          ))}
                        </Menu.Content>
                      </Menu.Positioner>
                    </Portal>
                  </Menu.Root>
                  <Menu.Separator />
                  <Menu.Item value="remove" color="red.fg" onSelect={onRemove}>
                    <Trash2 size={14} />حذف رسانه
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Flex>

        {/* هشدار ALT خالی — پایین-چپ؛ کلیک روی آن مستقیم به دیالوگ سئو می‌برد */}
        {alt.trim().length === 0 && (
          <Badge
            position="absolute"
            insetInlineEnd="1.5"
            bottom="1.5"
            colorPalette="orange"
            variant="solid"
            size="xs"
            rounded="l2"
            gap="1"
            cursor="pointer"
            onClick={onEditSeo}
            title="متن جایگزین (ALT) ثبت نشده"
          >
            <TriangleAlert size={11} />ALT
          </Badge>
        )}

        {/* نشان تصویر اصلی — پایین-راست روی تصویر */}
        {featured && (
          <Badge
            position="absolute"
            insetInlineStart="1.5"
            bottom="1.5"
            colorPalette="brand"
            variant="solid"
            size="xs"
            rounded="l2"
            gap="1"
          >
            <Star size={11} />اصلی
          </Badge>
        )}
      </Box>

      <Box px="2" py="1.5" borderTopWidth="1px" borderColor="border.muted">
        <Text fontSize="2xs" fontWeight="medium" color="fg" truncate textAlign="start">{label}</Text>
        {variantTags.length > 0 && (
          <Text fontSize="2xs" color="fg.muted" truncate textAlign="start">
            {variantTags.join(' · ')}
          </Text>
        )}
      </Box>
    </Box>
  )
}
