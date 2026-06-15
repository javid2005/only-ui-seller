import { Box, Flex, Text, Badge, Separator } from '@chakra-ui/react'
import { TitleBar } from '@/components/ui/TitleBar'
import { ORDER_ITEMS, MOCK_ORDER, CURRENCY } from './orderData'

const ROW_NUMS = ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸']

function ItemRow({ index, name, attrs, qty, total, unit }: {
  index: number; name: string; attrs: string; qty: string; total: string; unit: string
}) {
  return (
    <Flex align="center" justify="space-between" gap="4" w="full">
      {/* RTL راست: شماره + تصویر + مشخصات. minW=0 + truncate → روی قیمت سرریز نمی‌کند */}
      <Flex align="center" gap="3" minW="0">
        <Text fontSize="sm" color="fg.muted" flexShrink={0}>{ROW_NUMS[index]}</Text>
        <Box boxSize="14" rounded="lg" bg="bg.muted" flexShrink={0} />
        <Box minW="0">
          <Text fontSize="sm" fontWeight="semibold" color="fg" truncate>{name}</Text>
          <Text fontSize="xs" color="fg.muted" truncate>{attrs}</Text>
          <Text fontSize="xs" color="fg.muted">{qty}</Text>
        </Box>
      </Flex>

      {/* RTL چپ: قیمت کل + فی واحد */}
      <Box textAlign="left" flexShrink={0}>
        <Text fontSize="sm" fontWeight="semibold" color="fg" whiteSpace="nowrap">{`${total} ${CURRENCY}`}</Text>
        <Text fontSize="xs" color="fg.muted" whiteSpace="nowrap">{`فی: ${unit} ${CURRENCY}`}</Text>
      </Box>
    </Flex>
  )
}

/**
 * OrderItemsPanel — پنل «اقلام سفارش» + جمع‌بندی مبالغ.
 */
export function OrderItemsPanel() {
  const { totals } = MOCK_ORDER
  const money = (v: string) => `${v} ${CURRENCY}`

  return (
    <Box
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border"
      rounded="2xl"
      p="6"
      w="full"
    >
      <TitleBar
        title="اقلام سفارش"
        size="md"
        cta={<Text fontSize="sm" color="fg.muted">{`${ROW_NUMS[ORDER_ITEMS.length - 1]} قلم کالا`}</Text>}
      />

      {/* Items */}
      <Flex direction="column" gap="4" pt="4">
        {ORDER_ITEMS.map((it, i) => (
          <ItemRow key={it.id} index={i} {...it} />
        ))}
      </Flex>

      {/* Totals */}
      <Box bg="bg.subtle" rounded="xl" p="4" mt="5">
        <Flex direction="column" gap="3">
          <Flex align="center" justify="space-between">
            <Text fontSize="sm" color="fg.muted">جمع اقلام</Text>
            <Text fontSize="sm" fontWeight="semibold" color="fg">{money(totals.sum)}</Text>
          </Flex>

          <Flex align="center" justify="space-between" gap="3">
            <Flex align="center" gap="2" minW="0">
              <Text fontSize="sm" color="fg.muted">تخفیف</Text>
              <Badge colorPalette="green" variant="subtle" size="sm">{`کد: ${totals.discountCode}`}</Badge>
            </Flex>
            <Text fontSize="sm" fontWeight="semibold" color="green.fg">{money(totals.discount)}</Text>
          </Flex>

          <Separator />

          <Flex align="center" justify="space-between">
            <Text fontSize="sm" fontWeight="semibold" color="fg">مبلغ نهایی</Text>
            <Text fontSize="md" fontWeight="bold" color="fg">{money(totals.payable)}</Text>
          </Flex>
        </Flex>
      </Box>
    </Box>
  )
}
