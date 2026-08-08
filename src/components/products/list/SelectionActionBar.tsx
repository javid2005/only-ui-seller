import { Badge, Button, Flex, IconButton, Menu, Portal, Text } from '@chakra-ui/react'
import { Archive, Download, MoreVertical, SquareCheckBig, Trash2, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { toPersianDigits } from '@/utils/numbers'

interface SelectionActionBarProps {
  count: number
  isCompact?: boolean
  onCancel: () => void
  onPublish?: () => void
  onArchive?: () => void
  onDownload?: () => void
  onDelete?: () => void
}

interface ActionDef {
  key: string
  label: string
  icon: LucideIcon
  onClick?: () => void
  /** bg/color برای دکمه desktop */
  palette: string
  danger?: boolean
}

/**
 * نوار عملیات گروهی — وقتی ≥۱ آیتم انتخاب شد زیر فیلترها میاد.
 * RTL: شمارنده FIRST = راست‌ترین.
 * - desktop: گروه دکمه‌ها چپ‌ترین (انتشار · آرشیو · دانلود · حذف · انصراف)
 * - mobile/compact: همه دکمه‌ها در یک منوی ⋮ جمع می‌شن
 */
export function SelectionActionBar({
  count, isCompact, onCancel, onPublish, onArchive, onDownload, onDelete,
}: SelectionActionBarProps) {
  // ترتیب راست→چپ در RTL: انتشار اول (راست‌ترین گروه) … انصراف آخر (چپ‌ترین)
  const actions: ActionDef[] = [
    { key: 'publish',  label: 'انتشار',    icon: SquareCheckBig, onClick: onPublish,  palette: 'teal' },
    { key: 'archive',  label: 'آرشیو',     icon: Archive,        onClick: onArchive,  palette: 'gray' },
    { key: 'download', label: 'دانلود xls', icon: Download,       onClick: onDownload, palette: 'gray' },
    { key: 'delete',   label: 'حذف',       icon: Trash2,         onClick: onDelete,   palette: 'red', danger: true },
    { key: 'cancel',   label: 'انصراف',    icon: X,              onClick: onCancel,   palette: 'gray' },
  ]

  return (
    <Flex align="center" justify="space-between" gap="3" flexWrap="wrap" mb="5">
      {/* شمارنده — راست‌ترین */}
      <Flex align="center" gap="2" flexShrink={0}>
        <Badge colorPalette="green" variant="subtle" size="md">{toPersianDigits(count)}</Badge> {/* dev-engine-ignore */}
        <Text fontSize="sm" color="fg">محصول انتخاب شده</Text>
      </Flex>

      {/* ── ellipsis menu: base → lg، یا وقتی isCompact ── */}
      <Menu.Root positioning={{ placement: 'bottom-end' }}>
        <Menu.Trigger asChild>
          <IconButton
            variant="outline" size="sm" aria-label="عملیات گروهی" flexShrink={0}
            display={{ base: 'inline-flex', lg: isCompact ? 'inline-flex' : 'none' }}
          >
            <MoreVertical size={16} />
          </IconButton>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner dir="rtl">
            <Menu.Content minW="180px" p="1">
              {actions.map((a) => {
                const Icon = a.icon
                return (
                  <Menu.Item
                    key={a.key}
                    value={a.key}
                    onClick={a.onClick}
                    _hover={{ bg: a.danger ? 'red.subtle' : 'bg.muted' }}
                  >
                    {/* RTL: icon FIRST = راست */}
                    <Flex w="full" align="center" gap="2">
                      <Flex color={a.danger ? 'fg.error' : 'fg.muted'} flexShrink={0}>
                        <Icon size={16} />
                      </Flex>
                      <Text fontSize="sm" flex="1" textAlign="start" color={a.danger ? 'fg.error' : 'fg'}>
                        {a.label}
                      </Text>
                    </Flex>
                  </Menu.Item>
                )
              })}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>

      {/* ── desktop inline buttons: lg+ وقتی !isCompact ── */}
      <Flex
        gap="2" align="center" flexWrap="wrap"
        display={{ base: 'none', lg: isCompact ? 'none' : 'flex' }}
      >
        {actions.map((a) => {
          const Icon = a.icon
          return (
            <Button
              key={a.key}
              size="sm"
              bg={`${a.palette}.subtle`}
              color={`${a.palette}.fg`}
              _hover={{ bg: `${a.palette}.muted` }}
              onClick={a.onClick}
            >
              {/* RTL: icon FIRST = راست */}
              {a.key !== 'cancel' && <Icon size={16} />}
              {a.label}
            </Button>
          )
        })}
      </Flex>
    </Flex>
  )
}
