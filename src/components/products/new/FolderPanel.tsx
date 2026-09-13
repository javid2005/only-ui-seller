import { useState } from 'react'
import { Flex, Text, Box, Icon, IconButton, Input, Menu, Portal, chakra } from '@chakra-ui/react'
import {
  Images as ImagesIcon, Folder, Plus, EllipsisVertical, Pencil, Trash2,
  ChevronUp, ChevronDown, Video, Boxes, Layers, Sparkles,
} from 'lucide-react'
import { toPersianDigits } from '@/utils/numbers'
import { Tooltip } from '@/components/ui/Tooltip'
import { pressable } from './motion'
import { isSmartFolder, type MediaFolder, type MediaFolderId, type MediaFolderSource } from './data'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface FolderPanelProps {
  folders: MediaFolder[]
  active: MediaFolderId
  onSelect: (id: MediaFolderId) => void
  /** تعداد رسانهٔ هر پوشه */
  counts: Record<MediaFolderId, number>
  onCreate: () => void
  onRename: (id: MediaFolderId, label: string) => void
  onRemove: (id: MediaFolderId) => void
  onMove: (id: MediaFolderId, dir: -1 | 1) => void
}

const SOURCE_ICON: Record<MediaFolderSource, typeof Folder> = {
  product: ImagesIcon,
  manual: Folder,
  'my-images': ImagesIcon,
  'my-videos': Video,
  'other-products': Boxes,
  'same-category': Layers,
}

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * FolderPanel — ستون پوشه‌های کتابخانهٔ رسانه.
 *
 * فقط یک پوشهٔ ثابت داریم: «رسانه‌های این محصول». بقیه را کاربر می‌سازد و هر کدام
 * یا خالی است یا **هوشمند** (نمای ذخیره‌شده روی کتابخانه). پوشهٔ هوشمند نشان
 * ✦ می‌گیرد تا معلوم باشد محتوایش محاسبه می‌شود و ترتیب دستی ندارد.
 *
 * RTL DOM order هر ردیف (first = rightmost):
 *   [آیکن پوشه — راست] [عنوان flex:1] [تعداد] [منو — چپ]
 */
export function FolderPanel({
  folders, active, onSelect, counts, onCreate, onRename, onRemove, onMove,
}: FolderPanelProps) {
  const [editing, setEditing] = useState<MediaFolderId | null>(null)
  const [draft, setDraft] = useState('')

  const commit = () => {
    if (editing && draft.trim()) onRename(editing, draft.trim())
    setEditing(null)
  }

  return (
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
        <Tooltip content="ساخت پوشهٔ تازه">
          <IconButton
            size="xs"
            variant="outline"
            colorPalette="brand"
            bg="bg.panel"
            rounded="l2"
            aria-label="ساخت پوشهٔ تازه"
            onClick={onCreate}
            {...pressable}
          >
            <Plus size={14} />
          </IconButton>
        </Tooltip>
      </Flex>

      <Flex direction="column" gap="1" w="full">
        {folders.map((folder, i) => {
          const isActive = folder.id === active
          const FolderIcon = SOURCE_ICON[folder.source]
          const smart = isSmartFolder(folder)

          if (editing === folder.id) {
            return (
              <Input
                key={folder.id}
                autoFocus
                size="sm"
                bg="bg.panel"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commit()
                  if (e.key === 'Escape') setEditing(null)
                }}
              />
            )
          }

          return (
            <Flex
              key={folder.id}
              align="center"
              gap="1"
              w="full"
              h="11"
              px="2"
              rounded="9px"
              borderWidth="1px"
              transition="background 0.15s, color 0.15s, border-color 0.15s"
              bg={isActive ? 'brand.bg' : 'transparent'}
              borderColor={isActive ? 'brand.muted' : 'transparent'}
              color={isActive ? 'brand.fg' : 'fg.muted'}
              _hover={{ bg: isActive ? 'brand.bg' : 'bg.panel' }}
            >
              {/* FIRST = rightmost: خودِ پوشه (انتخاب) */}
              <chakra.button
                type="button"
                aria-pressed={isActive}
                onClick={() => onSelect(folder.id)}
                display="flex"
                alignItems="center"
                gap="2"
                flex="1"
                minW="0"
                h="full"
                bg="transparent"
                color="inherit"
                cursor="pointer"
                fontWeight={isActive ? 'bold' : 'normal'}
              >
                <Icon size="sm" flexShrink={0}><FolderIcon /></Icon>
                <Text flex="1" textAlign="start" fontSize="sm" truncate>
                  {folder.label}
                </Text>
                {smart && (
                  <Tooltip content="پوشهٔ هوشمند — خودکار پر می‌شود">
                    <Icon size="xs" flexShrink={0} color="brand.fg" aria-label="پوشهٔ هوشمند">
                      <Sparkles />
                    </Icon>
                  </Tooltip>
                )}
                <Text fontSize="xs" flexShrink={0}>
                  {toPersianDigits(counts[folder.id] ?? 0)}
                </Text>
              </chakra.button>

              {/* LAST = leftmost: منوی پوشه — پوشهٔ ثابت منو ندارد */}
              {!folder.locked && (
                <Menu.Root>
                  <Menu.Trigger asChild>
                    <IconButton
                      size="2xs"
                      variant="ghost"
                      color="inherit"
                      rounded="md"
                      flexShrink={0}
                      aria-label={`تنظیمات ${folder.label}`}
                    >
                      <EllipsisVertical size={14} />
                    </IconButton>
                  </Menu.Trigger>
                  <Portal>
                    <Menu.Positioner dir="rtl">
                      <Menu.Content>
                        <Menu.Item
                          value="rename"
                          onSelect={() => { setDraft(folder.label); setEditing(folder.id) }}
                        >
                          <Pencil size={14} />تغییر نام
                        </Menu.Item>
                        <Menu.Item
                          value="up"
                          disabled={i === 0 || folders[i - 1].locked}
                          onSelect={() => onMove(folder.id, -1)}
                        >
                          <ChevronUp size={14} />بالاتر
                        </Menu.Item>
                        <Menu.Item
                          value="down"
                          disabled={i === folders.length - 1}
                          onSelect={() => onMove(folder.id, 1)}
                        >
                          <ChevronDown size={14} />پایین‌تر
                        </Menu.Item>
                        <Menu.Separator />
                        <Menu.Item value="remove" color="red.fg" onSelect={() => onRemove(folder.id)}>
                          <Trash2 size={14} />حذف پوشه
                        </Menu.Item>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
              )}
            </Flex>
          )
        })}
      </Flex>

      <Box borderWidth="1px" borderColor="border.muted" bg="bg.panel" rounded="lg" p="2.5">
        <Text fontSize="xs" color="fg.muted" textAlign="start" lineHeight="1.9">
          پوشه‌ها برای نظم کتابخانه‌اند. جابه‌جا کردن رسانه بین پوشه‌ها فایل اصلی را
          حذف نمی‌کند و همان رسانه می‌تواند در محصولات دیگر هم استفاده شود.
        </Text>
      </Box>
    </Flex>
  )
}
