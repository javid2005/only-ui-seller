import { Flex, Text, Box, Icon, IconButton, chakra } from '@chakra-ui/react'
import { Images as ImagesIcon, Folder, Plus } from 'lucide-react'
import { toPersianDigits } from '@/utils/numbers'
import type { MediaFolder, MediaFolderId } from './data'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface FolderPanelProps {
  folders: MediaFolder[]
  active: MediaFolderId
  onSelect: (id: MediaFolderId) => void
  /** تعداد رسانهٔ هر پوشه */
  counts: Record<MediaFolderId, number>
  /** ساخت پوشهٔ تازه در کتابخانه */
  onCreate?: () => void
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
export function FolderPanel({ folders, active, onSelect, counts, onCreate }: FolderPanelProps) {
  return (
    /* در طرح، ستون پوشه‌ها یک پنلِ کادردارِ ته‌رنگی است (۲۶۴px، radius ۱۲px،
       padding ۱۰px) — نه یک ستون شناور. همین کادر مرز «کتابخانه» را از «رسانه‌های
       این محصول» جدا می‌کند. */
    <Flex
      direction="column"
      gap="3"
      w="full"
      borderWidth="1px"
      borderColor="border.muted"
      bg="bg.subtle"
      rounded="xl"
      p="2.5"
    >
      {/* FIRST = rightmost: عنوان · LAST = leftmost: ساخت پوشه */}
      <Flex align="center" gap="2" w="full">
        <Text fontSize="sm" fontWeight="semibold" color="fg" textAlign="start" flex="1">
          پوشه‌ها
        </Text>
        {onCreate && (
          <IconButton
            size="xs"
            variant="outline"
            colorPalette="brand"
            rounded="l2"
            aria-label="ساخت پوشه در کتابخانه"
            onClick={onCreate}
          >
            <Plus size={14} />
          </IconButton>
        )}
      </Flex>

      <Flex direction="column" gap="1" w="full">
        {folders.map((folder) => {
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
              gap="2"
              w="full"
              px="2"
              h="11"
              rounded="9px"
              borderWidth="1px"
              transition="background 0.15s, color 0.15s, border-color 0.15s"
              bg={isActive ? 'brand.bg' : 'transparent'}
              borderColor={isActive ? 'brand.muted' : 'transparent'}
              color={isActive ? 'brand.fg' : 'fg.muted'}
              fontWeight={isActive ? 'bold' : 'normal'}
              _hover={{ bg: isActive ? 'brand.bg' : 'bg.panel' }}
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
        bg="bg.panel"
        rounded="lg"
        p="2.5"
      >
        <Text fontSize="xs" color="fg.muted" textAlign="start" lineHeight="1.9">
          پوشه‌ها برای نظم کتابخانه‌اند. جابه‌جا کردن رسانه بین پوشه‌ها فایل اصلی را
          حذف نمی‌کند و همان رسانه می‌تواند در محصولات دیگر هم استفاده شود.
        </Text>
      </Box>
    </Flex>
  )
}
