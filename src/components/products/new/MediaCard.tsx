import { Box, Flex, Text, Badge, Menu, Portal, IconButton, Checkbox } from '@chakra-ui/react'
import { EllipsisVertical, Star, Trash2, Tags, FolderInput, GripVertical, SearchCheck, TriangleAlert } from 'lucide-react'
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
  onMoveToFolder: (target: MediaFolderId) => void
  // ── مرتب‌سازی ──
  draggable?: boolean
  isDragging?: boolean
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
  selected, onSelect, onRemove, onSetFeatured, onSelectVariant, onEditSeo, onMoveToFolder,
  draggable, isDragging = false, onDragStart, onDragOver, onDrop, onDragEnd,
}: MediaCardProps) {
  return (
    <Box
      borderWidth="1px"
      borderColor={selected ? 'brand.solid' : featured ? 'brand.border' : 'border'}
      rounded="xl"
      overflow="hidden"
      bg="bg.panel"
      opacity={isDragging ? 0.5 : 1}
      transition="border-color 0.15s, opacity 0.15s"
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
        <MediaThumb src={src} alt={label} aspectRatio="1" w="full" />

        {/* نوار کنترل روی تصویر */}
        <Flex
          position="absolute"
          top="2"
          insetInline="2"
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

          {draggable && (
            <Box color="fg.muted" aria-hidden><GripVertical size={15} /></Box>
          )}

          <Box flex="1" />

          {/* LAST = leftmost: منوی سه‌نقطه */}
          <Menu.Root>
            <Menu.Trigger asChild>
              <IconButton size="xs" variant="subtle" bg="bg.panel" rounded="md" aria-label={`عملیات ${label}`}>
                <EllipsisVertical size={15} />
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
            insetInlineEnd="2"
            bottom="2"
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
            insetInlineStart="2"
            bottom="2"
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

      <Box p="2.5" borderTopWidth="1px" borderColor="border.muted">
        <Text fontSize="xs" fontWeight="medium" color="fg" truncate textAlign="start">{label}</Text>
        {variantTags.length > 0 && (
          <Text fontSize="2xs" color="fg.muted" truncate textAlign="start">
            {variantTags.join(' · ')}
          </Text>
        )}
      </Box>
    </Box>
  )
}
