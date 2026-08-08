import { Box, Flex, Text, Badge, Button, IconButton } from '@chakra-ui/react'
import { Trash2, X } from 'lucide-react'

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
    >
      {/* FIRST = rightmost: Thumbnail */}
      <Box
        boxSize="106px"
        flexShrink={0}
        rounded="lg"
        overflow="hidden"
        bg="bg.subtle"
      >
        <img
          src={src}
          alt={label}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
          }}
        />
      </Box>

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
          {/* DOM rightmost-first: انتخاب تنوع → انتخاب شاخص (فقط اگر شاخص نیست) → trash (چپ‌ترین) */}
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
