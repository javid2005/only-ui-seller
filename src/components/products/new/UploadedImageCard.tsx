import { Box, Flex, Text, Badge, Button, IconButton, Menu, Portal } from '@chakra-ui/react'
import { Trash2, X, GripVertical, FolderInput } from 'lucide-react'
import { MediaThumb } from './MediaThumb'
import { MEDIA_FOLDERS, type MediaFolderId } from './data'

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
  onRemove: () => void
  onSetFeatured: () => void
  /** باز کردن دیالوگ «انتخاب تنوع» */
  onSelectVariant: () => void
  onRemoveTag?: (tag: string) => void
  /** روی موبایلِ واقعی hover نداریم → دکمه‌ها همیشه نمایش داده شوند */
  alwaysShowActions?: boolean
  /** پوشهٔ فعلی این رسانه — برای منوی «انتقال به پوشه» */
  folder?: MediaFolderId
  onMoveToFolder?: (target: MediaFolderId) => void
  // ── مرتب‌سازی با drag & drop (در هر پوشه) ──
  draggable?: boolean
  isDragging?: boolean
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
  onRemove,
  onSetFeatured,
  onSelectVariant,
  onRemoveTag,
  alwaysShowActions = false,
  folder,
  onMoveToFolder,
  draggable,
  isDragging = false,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: UploadedImageCardProps) {
  const actionsDisplay = alwaysShowActions ? 'flex' : 'none'

  return (
    <Flex
      role="group"
      className="group"
      gap="4"
      p="4"
      rounded="lg"
      borderWidth="1px"
      borderColor="border"
      bg="bg.panel"
      transition="background 0.15s, border-color 0.15s"
      _hover={{ borderColor: 'brand.border', bg: 'brand.bg' }}
      align="start"
      w="full"
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      opacity={isDragging ? 0.5 : 1}
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
        >
          <GripVertical size={16} />
        </Flex>
      )}
      {/* FIRST = rightmost: Thumbnail — پس‌زمینهٔ سفید + حاشیهٔ نسبی از MediaThumb */}
      <MediaThumb
        src={src}
        alt={label}
        boxSize="106px"
        flexShrink={0}
        rounded="lg"
        borderWidth="1px"
        borderColor="border.muted"
      />

      {/* SECOND = left: Content */}
      <Flex direction="column" gap="2" flex="1" minW="0" alignSelf="stretch">

        {/* عنوان + شاخص badge — title راست، badge چپ */}
        <Flex align="center" justify="space-between" w="full" gap="2">
          <Text fontSize="sm" fontWeight="semibold" color="fg" whiteSpace="nowrap">
            {label}
          </Text>
          {featured && (
            <Badge colorPalette="purple" variant="subtle" size="sm" rounded="l2" flexShrink={0}>
              شاخص
            </Badge>
          )}
        </Flex>

        {/* chipهای تنوع — راست‌چین، wrap (این پاس فقط نمایش) */}
        {variantTags.length > 0 && (
          <Flex wrap="wrap" align="start" gap="2" w="full">
            {variantTags.map((tag) => (
              <Badge
                key={tag}
                colorPalette="gray"
                variant="outline"
                size="sm"
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
                  <X size={14} />
                </Box>
              </Badge>
            ))}
          </Flex>
        )}

        {/* ردیف دکمه‌ها — در hover (یا همیشه روی موبایل)، سمت چپ (end) */}
        <Flex
          gap="2"
          align="center"
          justify="end"
          w="full"
          mt="auto"
          display={actionsDisplay}
          _groupHover={{ display: 'flex' }}
        >
          {/* DOM rightmost-first: انتقال به پوشه → انتخاب تنوع → انتخاب شاخص → trash (چپ‌ترین) */}
          {onMoveToFolder && (
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button size="xs" variant="outline" rounded="l2" gap="1.5">
                  {/* FIRST = rightmost: آیکن (leading) */}
                  <FolderInput size={14} />
                  انتقال
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner dir="rtl">
                  <Menu.Content>
                    {MEDIA_FOLDERS.filter((f) => f.id !== folder).map((f) => (
                      <Menu.Item key={f.id} value={f.id} onSelect={() => onMoveToFolder(f.id)}>
                        {f.label}
                      </Menu.Item>
                    ))}
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          )}
          <Button size="xs" colorPalette="brand" variant="subtle" rounded="l2" onClick={onSelectVariant}>
            انتخاب تنوع
          </Button>
          {!featured && (
            <Button size="xs" colorPalette="brand" variant="subtle" rounded="l2" onClick={onSetFeatured}>
              انتخاب شاخص
            </Button>
          )}
          <IconButton
            size="xs"
            colorPalette="red"
            variant="subtle"
            rounded="l2"
            aria-label="حذف تصویر"
            onClick={onRemove}
          >
            <Trash2 size={14} />
          </IconButton>
        </Flex>

      </Flex>
    </Flex>
  )
}
