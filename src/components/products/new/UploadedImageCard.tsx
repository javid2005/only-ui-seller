import { Box, Flex, Text, Badge, IconButton, Menu, Portal } from '@chakra-ui/react'
import { Trash2, X, GripVertical, FolderInput, SearchCheck, TriangleAlert, PencilLine, EllipsisVertical, Star, Tags } from 'lucide-react'
import { MediaThumb } from './MediaThumb'
import type { MediaFolder, MediaFolderId } from './data'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface UploadedImageCardProps {
  /** dataURL/URL پیش‌نمایش */
  src: string
  /** لیبل نمایشی — «تصویر ۱» (از ایندکس ساخته می‌شود) */
  label: string
  /** تصویر شاخص (اصلی) محصول؟ */
  featured: boolean
  /** تنوع‌های تخصیص‌یافته به این تصویر (label از VARIANT_GROUPS) */
  variantTags: string[]
  /** متن جایگزین؛ خالی بودنش کنار عنوان هشدار می‌دهد (بررسی «ALT تصاویر» در مرحلهٔ سئو) */
  alt: string
  onRemove: () => void
  onSetFeatured: () => void
  /** باز کردن دیالوگ «انتخاب تنوع» */
  onSelectVariant: () => void
  /** باز کردن دیالوگ «سئوی تصویر» (ALT و کپشن) */
  onEditSeo: () => void
  /** باز کردن دیالوگ «نام فایل» */
  onRename: () => void
  onRemoveTag?: (tag: string) => void
  /** پوشهٔ فعلی این رسانه — برای منوی «انتقال به پوشه» */
  folder?: MediaFolderId
  folders?: MediaFolder[]
  onMoveToFolder?: (target: MediaFolderId) => void
  // ── مرتب‌سازی با drag & drop (در هر پوشه) ──
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
 * UploadedImageCard — کارت یک تصویر آپلودشده در گالری محصول.
 *
 * RTL DOM order (first child = rightmost):
 *   [Thumbnail — راست]  [Content — چپ، flex:1]
 * Content (ستون): عنوان + شاخص‌badge · chipهای تنوع · ردیف دکمه‌ها (در hover)
 *
 * Figma: New Product / gallery — UploadedImage-Card (node 1301:20107)
 * توکن semantic: hover → brand.bg + brand.border (teal، dark-safe).
 */
export function UploadedImageCard({
  src,
  label,
  featured,
  variantTags,
  alt,
  onRemove,
  onSetFeatured,
  onSelectVariant,
  onEditSeo,
  onRename,
  onRemoveTag,
  folder,
  folders = [],
  onMoveToFolder,
  draggable,
  isDragging = false,
  someoneDragging = false,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: UploadedImageCardProps) {
  return (
    <Flex
      role="group"
      className="group"
      gap="3"
      p="2.5"
      rounded="lg"
      borderWidth="1px"
      /* همان قاعدهٔ نمای شبکه‌ای: کارتِ کشیده‌شده قابِ برند = موقعیت درج */
      borderColor={isDragging ? 'brand.solid' : 'border'}
      boxShadow={isDragging ? '0 0 0 2px var(--chakra-colors-brand-solid)' : undefined}
      bg="bg.panel"
      transition="background 0.15s, border-color 0.15s, opacity 0.15s, box-shadow 0.15s"
      _hover={{ borderColor: 'brand.border', bg: 'brand.bg' }}
      align="center"
      w="full"
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      opacity={someoneDragging && !isDragging ? 0.5 : 1}
      cursor={draggable ? 'grab' : undefined}
    >

      {/* FIRST = rightmost: دستگیرهٔ جابه‌جایی — در همهٔ پوشه‌ها فعال است */}
      {draggable && (
        <Flex
          align="center"
          alignSelf="stretch"
          color="fg.muted"
          flexShrink={0}
          aria-hidden
          opacity={isDragging ? 1 : 0}
          transition="opacity .15s"
          _groupHover={{ opacity: 1 }}
          css={{ '@media (hover: none)': { opacity: 1 } }}
        >
          <GripVertical size={16} />
        </Flex>
      )}
      {/* FIRST = rightmost: Thumbnail — بدون فریم، فقط یک حاشیهٔ نازکِ دیده‌شدنی */}
      <MediaThumb
        src={src}
        alt={label}
        boxSize="54px"
        flexShrink={0}
        rounded="10px"
        borderWidth="1px"
        borderColor="border"
      />

      {/* SECOND = left: Content */}
      <Flex direction="column" gap="1" flex="1" minW="0">

        {/* عنوان + شاخص badge — title راست، badge چپ */}
        <Flex align="center" justify="space-between" w="full" gap="2">
          <Text fontSize="xs" fontWeight="semibold" color="fg" whiteSpace="nowrap">
            {label}
          </Text>
          <Flex align="center" gap="2" flexShrink={0}>
            {/* FIRST = rightmost: شاخص ← هشدار ALT (چپ‌تر) */}
            {featured && (
              <Badge colorPalette="purple" variant="subtle" size="xs" rounded="l2">
                شاخص
              </Badge>
            )}
            {alt.trim().length === 0 && (
              <Badge
                colorPalette="orange"
                variant="subtle"
                size="xs"
                rounded="l2"
                gap="1"
                cursor="pointer"
                onClick={onEditSeo}
                title="متن جایگزین (ALT) ثبت نشده"
              >
                {/* FIRST = rightmost: آیکن (leading) */}
                <TriangleAlert size={12} />
                بدون ALT
              </Badge>
            )}
          </Flex>
        </Flex>

        {/* chipهای تنوع — راست‌چین، wrap (این پاس فقط نمایش) */}
        {variantTags.length > 0 && (
          <Flex wrap="wrap" align="start" gap="1.5" w="full">
            {variantTags.map((tag) => (
              <Badge
                key={tag}
                colorPalette="gray"
                variant="outline"
                size="xs"
                rounded="l2"
                gap="1.5"
                flexShrink={0}
              >
                {/* FIRST = rightmost: label · X سمت چپ */}
                {tag}
                <Box
                  as="span"
                  role="button"
                  display="inline-flex"
                  aria-label={`حذف ${tag}`}
                  onClick={() => onRemoveTag?.(tag)}
                  cursor="pointer"
                >
                  <X size={12} />
                </Box>
              </Badge>
            ))}
          </Flex>
        )}

      </Flex>

      {/* LAST = leftmost: منوی سه‌نقطه — جایگزین ردیف دکمه‌ها (بازخورد کاربر،
          مورد ۶). آن ردیف در مانیتور کوچک سرریز می‌کرد؛ همان عملیات حالا داخل
          یک منو است، دقیقاً مثل نمای شبکه‌ای. همیشه دیده می‌شود (نه فقط hover)
          تا روی لمسی هم در دسترس باشد. */}
      <Menu.Root>
        <Menu.Trigger asChild>
          <IconButton
            size="xs"
            variant="ghost"
            boxSize="28px"
            minW="28px"
            rounded="md"
            flexShrink={0}
            aria-label={`عملیات ${label}`}
          >
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
              <Menu.Item value="rename" onSelect={onRename}>
                <PencilLine size={14} />نام فایل
              </Menu.Item>
              <Menu.Item value="seo" onSelect={onEditSeo}>
                <SearchCheck size={14} />سئوی تصویر
              </Menu.Item>
              {onMoveToFolder && (
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
              )}
              <Menu.Separator />
              <Menu.Item value="remove" color="red.fg" onSelect={onRemove}>
                <Trash2 size={14} />حذف رسانه
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Flex>
  )
}
