import { IconButton, Menu, Portal, Text } from '@chakra-ui/react'
import { MoreVertical } from 'lucide-react'
import { ROW_ACTIONS, type RowAction } from './data'

/**
 * منوی عملیات یک محصول (ellipsis) — مشترک بین جدول و کارت.
 * Chakra Menu، RTL (Positioner dir="rtl"). پیش‌فرض ۶ اکشنِ ROW_ACTIONS؛ caller می‌تونه با
 * `actions` لیست دیگه‌ای بده (مثلاً CARD_ROW_ACTIONS برای کارت موبایل).
 * `onAction` اختیاریه — با value همون آیتم انتخاب‌شده صدا زده می‌شه (مثلاً 'copy'/'delete').
 */
export function RowActionsMenu({
  size = 'sm', actions = ROW_ACTIONS, onAction,
}: { size?: 'xs' | 'sm' | 'md'; actions?: RowAction[]; onAction?: (value: string) => void }) {
  return (
    <Menu.Root positioning={{ placement: 'bottom-end' }} onSelect={(d) => onAction?.(d.value)}>
      <Menu.Trigger asChild>
        <IconButton variant="outline" size={size} aria-label="عملیات" color="fg.muted">
          <MoreVertical size={16} />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner dir="rtl">
          <Menu.Content minW="180px" p="1">
            {actions.map((a) => (
              <Menu.Item
                key={a.value}
                value={a.value}
                _hover={{ bg: a.danger ? 'red.subtle' : 'bg.muted' }}
              >
                <Text fontSize="sm" w="full" textAlign="start" color={a.danger ? 'fg.error' : 'fg'}>
                  {a.label}
                </Text>
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
