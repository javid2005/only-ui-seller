import { Box, Flex, Text, Separator } from '@chakra-ui/react'
import { MOCK_ORDER, CURRENCY } from './orderData'

interface RowProps {
  label: string
  value: string
  valueColor?: string
  strong?: boolean
}

function Row({ label, value, valueColor = 'fg', strong = false }: RowProps) {
  return (
    <Flex align="center" justify="space-between" gap="3" w="full">
      <Text fontSize="sm" color="fg.muted">{label}</Text>
      <Text fontSize="sm" fontWeight={strong ? 'bold' : 'semibold'} color={valueColor}>
        {value}
      </Text>
    </Flex>
  )
}

/**
 * OrderSummaryCard — پنل «خلاصه سفارش» (ستون End — سمت چپ).
 * accent teal روی عنوان، ردیف‌های label/value.
 */
export function OrderSummaryCard() {
  const { code, itemsCount, totals, customer, shipMethod } = MOCK_ORDER
  const money = (v: string) => `${v} ${CURRENCY}`

  return (
    <Box
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border"
      rounded="2xl"
      overflow="clip"
      w="full"
    >
      {/* Header — teal accent */}
      <Box bg="teal.subtle" px="6" py="4" borderBottomWidth="1px" borderColor="border">
        <Text fontSize="md" fontWeight="semibold" color="teal.fg" textAlign="right">
          خلاصه سفارش
        </Text>
      </Box>

      {/* Rows */}
      <Flex direction="column" gap="3" px="6" py="5">
        <Row label="شماره سفارش" value={code} />
        <Row label="تعداد اقلام" value={itemsCount} />

        <Separator />

        <Row label="جمع کل"    value={money(totals.sum)} />
        <Row label="تخفیف"     value={money(totals.discount)} valueColor="green.fg" />
        <Row label="مبلغ پرداختی" value={money(totals.payable)} strong />

        <Separator />

        <Row label="مشتری"     value={customer.name} />
        <Row label="روش ارسال" value={shipMethod} />
      </Flex>
    </Box>
  )
}
