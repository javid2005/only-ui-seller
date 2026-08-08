import { Flex, IconButton, Menu, Portal, Text } from '@chakra-ui/react'
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react'
import type { DiscountCodeItem } from './discountCodesData'

interface DiscountCodeRowActionsMenuProps {
  item: DiscountCodeItem
  size?: 'xs' | 'sm' | 'md'
}

/**
 * منوی عملیات کد تخفیف (ellipsis ⋮) — Figma «MenuContent» (node 3122:74399).
 * چیدمان عمودی — ترتیب بالا به پایین طبق Figma تغییر نمی‌کند: ویرایش → حذف.
 * هر ردیف داخلی: آیکون (راست‌ترین) FIRST ← متن (چپ‌تر) SECOND، justify="start" (RTL=راست)
 * تا جفت آیکون+متن به لبه راست بچسبد — طبق قرارداد پروژه (الگوی BulkSmsRowActionsMenu).
 */
export function DiscountCodeRowActionsMenu({ item, size = 'sm' }: DiscountCodeRowActionsMenuProps) {
  return (
    <Menu.Root positioning={{ placement: 'bottom-end' }}>
      <Menu.Trigger asChild>
        <IconButton aria-label={`عملیات بیشتر روی ${item.title}`} variant="ghost" size={size} color="fg.muted" flexShrink={0}>
          <EllipsisVertical size={20} />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner dir="rtl">
          <Menu.Content minW="160px" p="1">
            <Menu.Item value="edit">
              <Flex align="center" justify="start" w="full" gap="2">
                <Pencil size={16} />
                <Text fontSize="sm" color="fg">ویرایش</Text>
              </Flex>
            </Menu.Item>
            <Menu.Item value="delete">
              <Flex align="center" justify="start" w="full" gap="2" color="red.fg">
                <Trash2 size={16} />
                <Text fontSize="sm" color="red.fg">حذف</Text>
              </Flex>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
