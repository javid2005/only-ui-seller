import { Flex, Text, Menu, Portal } from '@chakra-ui/react'
import { ChevronDown } from 'lucide-react'
import { STATUS_LABEL, STATUS_ACTIONS } from './orderData'
import type { OrderStatus, OrderAction } from './orderData'

interface OrderStatusMenuProps {
  status: OrderStatus
  onAction: (action: OrderAction) => void
}

/**
 * OrderStatusMenu — کنترل وضعیت سفارش (Chakra split-button + Menu).
 * دکمه وضعیت را نشان می‌دهد؛ کلیک → CTmenu مخصوص همان وضعیت.
 * وضعیت‌های پایانی (لغو/مرجوع) منو ندارند → فقط برچسب.
 */
export function OrderStatusMenu({ status, onAction }: OrderStatusMenuProps) {
  const label = STATUS_LABEL[status]
  const actions = STATUS_ACTIONS[status]

  // Terminal status — static pill, no menu
  if (actions.length === 0) {
    return (
      <Flex
        align="center"
        px="3.5"
        h="9"
        rounded="md"
        borderWidth="1px"
        borderColor="border"
        bg="bg.subtle"
      >
        <Text fontSize="sm" fontWeight="semibold" color="fg.muted">{label}</Text>
      </Flex>
    )
  }

  return (
    <Menu.Root
      positioning={{ placement: 'bottom-end' }}
      onSelect={(d) => onAction(d.value as OrderAction)}
    >
      <Menu.Trigger asChild>
        {/* Single <button> visually split (label | chevron).
            < 360px: label مخفی، فقط آیکون مربعی (منو-مانند) — جای قبلی، بدون wrap */}
        <Flex
          as="button"
          aria-label={label}
          align="stretch"
          h="9"
          rounded="md"
          borderWidth="1px"
          borderColor="border"
          overflow="hidden"
          cursor="pointer"
          bg="bg.panel"
          flexShrink={0}
          _hover={{ bg: 'bg.subtle' }}
          _open={{ bg: 'bg.subtle' }}
        >
          {/* < sm: label مخفی → فقط آیکون مربعی (منو-مانند)، کنار title */}
          <Flex align="center" px="3.5" display={{ base: 'none', sm: 'flex' }}>
            <Text fontSize="sm" fontWeight="semibold" color="fg">{label}</Text>
          </Flex>
          <Flex
            align="center"
            justify="center"
            px="2"
            minW="9"
            color="fg.muted"
            borderInlineStartWidth={{ base: '0', sm: '1px' }}
            borderColor="border"
          >
            <ChevronDown size={16} />
          </Flex>
        </Flex>
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner dir="rtl">
          <Menu.Content minW="180px" p="1">
            {actions.map((a) => (
              <Menu.Item
                key={a.action}
                value={a.action}
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
