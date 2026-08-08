import { Badge, Box, Flex, Link, Separator, Spacer, Text } from '@chakra-ui/react'
import { STATUS_COLOR, TYPE_COLOR, type Order } from './data'
import { OrderRowActionsMenu } from './OrderRowActionsMenu'

interface OrderCardProps {
  order: Order
}

/**
 * کارت سفارش — معادل ردیف جدول در حالت موبایل (Figma Order-Card).
 *
 * ⚠️ RTL: کانتینر app روی dir=rtl است → **اولین فرزند DOM = راست‌ترین**.
 * پس ترتیب DOM = ترتیب منطقی راست→چپ (نه ترتیب source چپ‌چین Figma):
 *  - عنوان: شماره/نوع سفارش (راست) … Badge وضعیت (چپ)
 *  - متا:   نام • تلفن (راست) … تاریخ (چپ)
 *  - فوتر:  مبلغ + تخفیف (راست) … منوی ⋮ (چپ)
 * state=hover → border/bg برند (teal).
 */
export function OrderCard({ order: o }: OrderCardProps) {
  return (
    <Box
      borderWidth="1px"
      borderColor="border"
      rounded="lg"
      bg="bg.panel"
      p="4"
      display="flex"
      flexDirection="column"
      gap="4"
      _hover={{ bg: 'brand.bg', borderColor: 'brand.solid' }}
      transition="border-color 0.15s, background 0.15s"
    >
      {/* ── Header ── */}
      <Flex direction="column" gap="1">
        {/* ردیف ۱: شماره/نوع (راست) … وضعیت (چپ) */}
        <Flex w="full" align="center" gap="2">
          <Flex align="center" gap="2" minW="0">
            {/* شماره اول = راست‌ترین، نوع چپِ آن */}
            <Link href="#" fontSize="md" fontWeight="semibold" color="teal.fg">{o.orderNo}</Link>
            <Badge size="sm" colorPalette={TYPE_COLOR[o.type]} variant="subtle">{o.type}</Badge>
          </Flex>
          <Spacer />
          <Badge size="sm" colorPalette={STATUS_COLOR[o.status]} variant="subtle">
            {o.status}
          </Badge>
        </Flex>

        {/* ردیف ۲: نام • تلفن (راست) … تاریخ (چپ) */}
        <Flex w="full" align="center" gap="2">
          <Flex align="center" gap="1.5" minW="0">
            <Text fontSize="xs" color="fg.muted" lineClamp={1}>{o.customer}</Text>
            <Text fontSize="xs" color="fg.muted">•</Text>
            <Text fontSize="xs" color="fg.muted">{o.phone}</Text>
          </Flex>
          <Spacer />
          <Text fontSize="xs" color="fg.muted" flexShrink={0}>{o.date}</Text>
        </Flex>
      </Flex>

      <Separator borderColor="border" />

      {/* ── Footer: مبلغ + تخفیف (راست) … منوی ⋮ (چپ) ── */}
      <Flex w="full" align="center" gap="2">
        <Flex direction="column" gap="0.5" flex="1" minW="0" align="start">
          {/* خط مبلغ: قیمت (راست) + badge دلاری (چپ) */}
          <Flex align="center" gap="2">
            <Text fontSize="sm" fontWeight="semibold" color="fg">{o.amount}</Text>
            {o.amountBadge && (
              <Badge size="xs" colorPalette="gray" variant="subtle">{o.amountBadge}</Badge>
            )}
          </Flex>
          {/* خط تخفیف: متن سبز solid (راست) + badge درصد نارنجی solid (چپ) */}
          {o.discount && (
            <Flex align="center" gap="2">
              <Text fontSize="xs" color="green.solid">{o.discount}</Text>
              {o.discountBadge && (
                <Badge size="xs" colorPalette="orange" variant="solid">{o.discountBadge}</Badge>
              )}
            </Flex>
          )}
        </Flex>
        <OrderRowActionsMenu />
      </Flex>
    </Box>
  )
}
