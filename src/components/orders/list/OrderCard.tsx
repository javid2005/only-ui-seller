import { Badge, Box, Flex, Link, Spacer, Text } from '@chakra-ui/react'
import { STATUS_COLOR, TYPE_COLOR, type Order } from './data'
import { OrderRowActionsMenu } from './OrderRowActionsMenu'

interface OrderCardProps {
  order: Order
}

/**
 * کارت سفارش — معادل ردیف جدول در حالت موبایل (Figma node 5253:87246، Default/Hover).
 *
 * ⚠️ RTL: کانتینر app روی dir=rtl است → **اولین فرزند DOM = راست‌ترین**.
 * پس ترتیب DOM = ترتیب منطقی راست→چپ (نه ترتیب source چپ‌چین Figma — تأیید شده با
 * get_design_context روی همین node، نه حدس):
 *  - عنوان: شماره/نوع سفارش (راست) … Badge وضعیت (چپ)
 *  - متا:   نام • موبایل (راست) … تاریخ (چپ)
 *  - فوتر:  مبلغ + بج دلاری (راست) … منوی ⋮ (چپ)
 *
 * ⚠️ بدون Separator بین هدر/فوتر — طبق طرح خط جداکننده نیست، فقط فوتر همیشه
 * bg.subtle داره (هدر همیشه شفاف/bg کارت). state=hover فقط دو چیز رو عوض می‌کنه:
 * border کل کارت → brand.focusRing، و bg فوتر → brand.bg (هدر دست‌نخورده می‌مونه) —
 * با role="group" + _groupHover روی خودِ فوتر پیاده شده، نه bg روی کل Box.
 */
export function OrderCard({ order: o }: OrderCardProps) {
  return (
    <Box
      role="group"
      borderWidth="1px"
      borderColor="border"
      rounded="lg"
      bg="bg.panel"
      overflow="hidden"
      _hover={{ borderColor: 'brand.focusRing' }}
      transition="border-color 0.15s"
    >
      {/* ── Header ── */}
      <Flex direction="column" gap="1" p="4">
        {/* ردیف ۱: شماره/نوع (راست) … وضعیت (چپ) */}
        <Flex w="full" align="center" gap="2">
          <Flex align="center" gap="2" minW="0">
            {/* شماره اول = راست‌ترین، نوع چپِ آن */}
            <Link href="#" fontSize="md" fontWeight="semibold" color="brand.fg">{o.orderNo}</Link>
            <Badge size="sm" colorPalette={TYPE_COLOR[o.type]} variant="subtle">{o.type}</Badge>
          </Flex>
          <Spacer />
          <Badge size="sm" colorPalette={STATUS_COLOR[o.status]} variant="subtle">
            {o.status}
          </Badge>
        </Flex>

        {/* ردیف ۲: نام • موبایل (راست) … تاریخ (چپ) */}
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

      {/* ── Footer: مبلغ + بج دلاری (راست) … منوی ⋮ (چپ) — همیشه bg.subtle، hover→brand.bg ── */}
      <Flex w="full" align="center" gap="2" p="4" bg="bg.subtle" _groupHover={{ bg: 'brand.bg' }} transition="background 0.15s">
        <Flex direction="column" gap="0.5" flex="1" minW="0" align="start">
          {/* خط مبلغ: قیمت (راست) + badge دلاری (چپ) */}
          <Flex align="center" gap="2">
            <Text fontSize="sm" fontWeight="semibold" color="fg">{o.amount}</Text>
            {o.amountBadge && (
              <Badge size="xs" colorPalette="gray" variant="subtle">{o.amountBadge}</Badge>
            )}
          </Flex>
        </Flex>
        <OrderRowActionsMenu variant="outline" />
      </Flex>
    </Box>
  )
}
