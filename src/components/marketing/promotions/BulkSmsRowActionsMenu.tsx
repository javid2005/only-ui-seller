import { Flex, IconButton, Menu, Portal, Text } from '@chakra-ui/react'
import { Archive, EllipsisVertical, Pencil, RefreshCcw } from 'lucide-react'
import type { BulkSmsHistoryItem } from './bulkSmsData'

interface BulkSmsRowActionsMenuProps {
  item: BulkSmsHistoryItem
  size?: 'xs' | 'sm' | 'md'
}

/**
 * منوی عملیات یک ارسال (ellipsis ⋮) — Figma «MenuContent» (node 3126:79818).
 * چیدمان عمودی — ترتیب بالا به پایین طبق Figma تغییر نمی‌کند: ارسال مجدد → ویرایش → آرشیو
 * («ارسال مجدد» فقط برای وضعیت «ارسال شد»، مطابق ستون عملیات جدول دسکتاپ).
 * هر ردیف داخلی: آیکون (راست‌ترین) FIRST ← متن (چپ‌تر) SECOND، justify="flex-start" (RTL=راست)
 * تا جفت آیکون+متن به لبه راست بچسبد — طبق بازخورد کاربر (نه ترتیب trailing-icon خام فیگما).
 */
export function BulkSmsRowActionsMenu({ item, size = 'sm' }: BulkSmsRowActionsMenuProps) {
  return (
    <Menu.Root positioning={{ placement: 'bottom-end' }}>
      <Menu.Trigger asChild>
        <IconButton aria-label="عملیات بیشتر" variant="ghost" size={size} color="fg.muted" flexShrink={0}>
          <EllipsisVertical size={20} />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner dir="rtl">
          <Menu.Content minW="160px" p="1">
            {item.status === 'sent' && (
              <Menu.Item value="resend">
                <Flex align="center" justify="flex-start" w="full" gap="2">
                  <RefreshCcw size={16} />
                  <Text fontSize="sm" color="fg">ارسال مجدد</Text>
                </Flex>
              </Menu.Item>
            )}
            <Menu.Item value="edit">
              <Flex align="center" justify="flex-start" w="full" gap="2">
                <Pencil size={16} />
                <Text fontSize="sm" color="fg">ویرایش</Text>
              </Flex>
            </Menu.Item>
            <Menu.Item value="archive">
              <Flex align="center" justify="flex-start" w="full" gap="2">
                <Archive size={16} />
                <Text fontSize="sm" color="fg">آرشیو</Text>
              </Flex>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
