import { Flex, Text, Box, Icon, chakra } from '@chakra-ui/react'
import { Images as ImagesIcon, Folder } from 'lucide-react'
import { toPersianDigits } from '@/utils/numbers'
import { MEDIA_FOLDERS, type MediaFolderId } from './data'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface FolderPanelProps {
  active: MediaFolderId
  onSelect: (id: MediaFolderId) => void
  /** تعداد رسانهٔ هر پوشه */
  counts: Record<MediaFolderId, number>
}

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * FolderPanel — ستون پوشه‌های کتابخانهٔ رسانه در تب گالری.
 *
 * RTL DOM order هر ردیف (first = rightmost):
 *   [آیکن پوشه — راست] [عنوان flex:1] [تعداد — چپ]
 *
 * پوشه‌ها فقط نما هستند: «افزودن به محصول» فایل را جابه‌جا نمی‌کند و همان رسانه
 * می‌تواند در محصولات دیگر هم استفاده شود.
 */
export function FolderPanel({ active, onSelect, counts }: FolderPanelProps) {
  return (
    <Flex direction="column" gap="3" w="full">
      <Text fontSize="sm" fontWeight="semibold" color="fg" textAlign="start">
        پوشه‌ها
      </Text>

      <Flex direction="column" gap="1" w="full">
        {MEDIA_FOLDERS.map((folder) => {
          const isActive = folder.id === active
          const FolderIcon = folder.id === 'products' ? ImagesIcon : Folder
          return (
            <chakra.button
              key={folder.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(folder.id)}
              display="flex"
              alignItems="center"
              gap="2.5"
              w="full"
              px="3"
              h="10"
              rounded="l2"
              transition="background 0.15s, color 0.15s"
              bg={isActive ? 'brand.bg' : 'transparent'}
              color={isActive ? 'brand.fg' : 'fg.muted'}
              _hover={{ bg: isActive ? 'brand.bg' : 'bg.subtle' }}
            >
              {/* FIRST = rightmost: آیکن پوشه */}
              <Icon size="sm" flexShrink={0}><FolderIcon /></Icon>
              <Text flex="1" textAlign="start" fontSize="sm" truncate>
                {folder.label}
              </Text>
              {/* LAST = leftmost: تعداد */}
              <Text fontSize="xs" flexShrink={0}>
                {toPersianDigits(counts[folder.id] ?? 0)}
              </Text>
            </chakra.button>
          )
        })}
      </Flex>

      <Box
        borderWidth="1px"
        borderColor="border.muted"
        bg="bg.subtle"
        rounded="l2"
        p="3"
      >
        <Text fontSize="xs" color="fg.muted" textAlign="start" lineHeight="1.9">
          پوشه‌ها برای نظم کتابخانه‌اند. جابه‌جا کردن رسانه بین پوشه‌ها فایل اصلی را
          حذف نمی‌کند و همان رسانه می‌تواند در محصولات دیگر هم استفاده شود.
        </Text>
      </Box>
    </Flex>
  )
}
