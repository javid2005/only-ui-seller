import { Avatar, Flex, Separator, Text } from '@chakra-ui/react'
import { TitleBar } from '@/components/ui/TitleBar'
import { toPersianDigits } from '@/utils/numbers'
import type { ManualCustomer } from './manualOrderData'

/** RTL: برچسب اولِ DOM = راست · مقدار آخر = چپ */
function Row({ label, value, size = 'sm' }: { label: string; value: string; size?: 'sm' | 'md' }) {
  return (
    <Flex align="center" justify="space-between" gap="3" w="full" py="2">
      <Text fontSize="xs" fontWeight="medium" color="fg.subtle">{label}</Text>
      <Text fontSize={size} fontWeight="semibold" color="fg.subtle">{value}</Text>
    </Flex>
  )
}

interface OrderDraftSummaryProps {
  customer: ManualCustomer | null
}

/**
 * OrderDraftSummary — پنل «جزئیات سفارش» ویزارد سفارش دستی.
 * تا وقتی چیزی انتخاب نشده، مقادیر «-» و رنگ fg.subtle می‌مانند.
 */
export function OrderDraftSummary({ customer }: OrderDraftSummaryProps) {
  return (
    <Flex
      direction="column"
      gap="6"
      w="full"
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border"
      rounded="2xl"
      p="6"
    >
      <TitleBar title="جزئیات سفارش" divider />

      <Flex direction="column" gap="2" w="full">
        {/* مشتری — خالی: متن راهنما · انتخاب‌شده: آواتار + نام/شماره */}
        <Flex pb="2" w="full">
          {customer ? (
            // RTL: آواتار اولِ DOM = راست · متن بعدش = چپ
            <Flex align="center" gap="3" w="full">
              <Avatar.Root size="sm" bg="brand.solid" color="brand.contrast" flexShrink={0}>
                <Avatar.Fallback name={customer.name} />
              </Avatar.Root>
              <Flex direction="column" gap="0.5" minW="0" align="flex-start">
                <Text fontSize="sm" fontWeight="semibold" color="fg">{customer.name}</Text>
                <Text fontSize="xs" color="fg.muted">{toPersianDigits(customer.phone)}</Text>
              </Flex>
            </Flex>
          ) : (
            <Text fontSize="sm" color="fg.subtle">مشتری انتخاب نشده است.</Text>
          )}
        </Flex>

        <Separator />

        <Flex direction="column" w="full">
          <Row label="تعداد اقلام سفارش" value="-" />
          <Row label="جمع قیمت اقلام" value="-" />
        </Flex>

        <Separator />

        <Row label="مبلغ قابل پرداخت" value="-" size="md" />
      </Flex>
    </Flex>
  )
}
