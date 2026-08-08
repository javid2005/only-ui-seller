import { IconButton, Menu, Portal, Text } from '@chakra-ui/react'
import { MoreVertical } from 'lucide-react'
import { ROW_ACTIONS } from './data'

/**
 * منوی عملیات یک سفارش (ellipsis ⋮) — مشترک بین جدول و کارت.
 * آیتم‌ها از Figma «Orders / CTmenu / More»: مشاهده جزئیات · کپی لینک.
 * Chakra Menu، RTL (Positioner dir="rtl").
 */
export function OrderRowActionsMenu({ size = 'sm' }: { size?: 'xs' | 'sm' | 'md' }) {
  return (
    <Menu.Root positioning={{ placement: 'bottom-end' }}>
      <Menu.Trigger asChild>
        <IconButton variant="ghost" size={size} aria-label="عملیات سفارش" color="fg.muted">
          <MoreVertical size={16} />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner dir="rtl">
          <Menu.Content minW="180px" p="1">
            {ROW_ACTIONS.map((a) => (
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
