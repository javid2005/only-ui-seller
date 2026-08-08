import { Avatar, Badge, Flex, Text } from '@chakra-ui/react'
import { Truck } from 'lucide-react'
import { TitleBar } from '@/components/ui/TitleBar'
import { toPersianDigits } from '@/utils/numbers'
import { ManualReviewPrdCard } from './ManualReviewPrdCard'
import type { ManualCustomer, ManualProduct, SelectedProductLine, ShippingMethod } from './manualOrderData'

/** برچسبِ زیربخش (مشتری/اقلام سفارش/روش ارسال) — Figma: fg.subtle، md، semibold، بدون divider */
function SubLabel({ title }: { title: string }) {
  return (
    <Text fontSize="md" fontWeight="semibold" color="fg.subtle" w="full" textAlign="start">
      {title}
    </Text>
  )
}

interface OrderReviewPanelProps {
  customer: ManualCustomer
  lines: SelectedProductLine[]
  products: ManualProduct[]
  shippingMethod: ShippingMethod
}

/**
 * OrderReviewPanel — پنل «بررسی نهایی سفارش» مرحلهٔ ۵ ویزارد (Figma node 2258:45597 / 4941:75164).
 * فقط-نمایشی — بازبینیِ مشتری، اقلام سفارش، و روش ارسالِ انتخاب‌شده در مراحل قبل.
 */
export function OrderReviewPanel({ customer, lines, products, shippingMethod }: OrderReviewPanelProps) {
  return (
    <Flex
      direction="column"
      gap="10"
      w="full"
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border"
      rounded="2xl"
      p="6"
    >
      <TitleBar
        title="بررسی نهایی سفارش"
        subtitle="پیش از ارسال لینک پرداخت، اطلاعات زیر را تأیید کنید."
        divider
      />

      {/* مشتری — RTL: آواتار (راست) → نام/شماره (چپ)، هم‌الگو با CustomerCard.
          align="start" روی column flex در RTL = راست (نه end — طبق قاعدهٔ پروژه). */}
      <Flex direction="column" gap="2" w="full" align="start">
        <SubLabel title="مشتری" />
        <Flex align="center" gap="2">
          <Avatar.Root size="md" bg="brand.solid" color="brand.contrast" flexShrink={0}>
            <Avatar.Fallback name={customer.name} />
          </Avatar.Root>
          <Flex direction="column" gap="1" align="start">
            <Text fontSize="sm" fontWeight="semibold" color="fg" w="full" textAlign="start">{customer.name}</Text>
            <Text fontSize="xs" color="fg.muted" w="full" textAlign="start">{toPersianDigits(customer.phone)}</Text>
          </Flex>
        </Flex>
      </Flex>

      {/* اقلام سفارش */}
      <Flex direction="column" gap="2" w="full" align="start">
        <SubLabel title="اقلام سفارش" />
        <Flex direction="column" gap="2" w="full">
          {lines.map((line) => {
            const product = products.find((p) => p.id === line.productId)
            if (!product) return null
            return <ManualReviewPrdCard key={line.id} product={product} line={line} />
          })}
        </Flex>
      </Flex>

      {/* روش ارسال — RTL: آیکن کامیون+عنوان (راست) → بج‌های فاصله/پیش‌کرایه (چپ)، طبق screenshot طرح */}
      <Flex direction="column" gap="2" w="full" align="start">
        <SubLabel title="روش ارسال" />
        <Flex align="center" justify="space-between" w="full">
          <Flex align="center" gap="4">
            <Truck size={24} color="var(--chakra-colors-brand-solid)" />
            <Flex direction="column" gap="1" align="start">
              <Text fontSize="sm" fontWeight="semibold" color="fg" w="full" textAlign="start">{shippingMethod.title}</Text>
              <Text fontSize="xs" color="fg.muted" w="full" textAlign="start">{shippingMethod.duration}</Text>
            </Flex>
          </Flex>

          <Flex align="center" gap="2">
            <Badge size="xs" colorPalette="blue" variant="subtle">{shippingMethod.distanceTag}</Badge>
            <Text fontSize="sm" color="fg.muted">•</Text>
            <Badge size="xs" colorPalette="purple" variant="subtle">پیش کرایه</Badge>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
