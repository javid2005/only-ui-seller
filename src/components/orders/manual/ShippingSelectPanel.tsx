import { Badge, Flex, RadioCard, Text } from '@chakra-ui/react'
import { TitleBar } from '@/components/ui/TitleBar'
import type { ShippingMethod } from './manualOrderData'

/**
 * ShippingCard — یک کارت در لیست «روش ارسال» (Figma local component «Manual-Shipping-Card»).
 * باید داخل <RadioCard.Root> استفاده شود.
 *
 * RTL DOM order داخل ItemControl (اولین child = راست‌ترین — بر اساس x-metadata طرح،
 * نه ترتیب خروجی خام Figma که LTR است):
 *   Content (عنوان/مدت/بج‌ها — راست) → ItemIndicator (چپ)
 * داخل ردیف بج‌ها هم به همین ترتیب: بجِ فاصله (راست) → «•» → بجِ «پیش کرایه» (چپ)
 */
function ShippingCard({ method }: { method: ShippingMethod }) {
  return (
    <RadioCard.Item
      value={method.id}
      flex="1 0 0"
      minW="240px"
      rounded="lg"
      p="4"
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border.muted"
      boxShadow="none"
      cursor="pointer"
      _hover={{ bg: 'brand.bg', borderColor: 'brand.border', boxShadow: 'none' }}
      _checked={{ bg: 'brand.bg', borderColor: 'brand.solid', boxShadow: 'none' }}
    >
      <RadioCard.ItemHiddenInput />
      <RadioCard.ItemControl
        gap="4"
        p="0"
        border="none"
        bg="transparent"
        boxShadow="none"
        alignItems="flex-start"
        justifyContent="space-between"
        w="full"
      >
        <RadioCard.ItemContent gap="2" minW="0" alignItems="flex-start" flex="1">
          <RadioCard.ItemText fontSize="md" fontWeight="semibold" color="fg" w="full" textAlign="right">
            {method.title}
          </RadioCard.ItemText>
          <Text fontSize="sm" color="fg.muted" w="full" textAlign="right">
            {method.duration}
          </Text>
          <Flex align="center" gap="2">
            <Badge size="xs" colorPalette="blue" variant="subtle">{method.distanceTag}</Badge>
            <Text fontSize="sm" color="fg.muted">•</Text>
            <Badge size="xs" colorPalette="purple" variant="subtle">پیش کرایه</Badge>
          </Flex>
        </RadioCard.ItemContent>

        {/* indicator رادیو — LAST = چپ‌ترین */}
        <RadioCard.ItemIndicator colorPalette="teal" flexShrink={0} />
      </RadioCard.ItemControl>
    </RadioCard.Item>
  )
}

interface ShippingSelectPanelProps {
  methods: ShippingMethod[]
  value: string | null
  onChange: (id: string) => void
}

export function ShippingSelectPanel({ methods, value, onChange }: ShippingSelectPanelProps) {
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
      <TitleBar title="روش ارسال" subtitle="روش ارسال مناسب را انتخاب کنید." divider />

      <RadioCard.Root value={value ?? undefined} onValueChange={(e) => e.value && onChange(e.value)}>
        <Flex wrap="wrap" gap="2">
          {methods.map((m) => (
            <ShippingCard key={m.id} method={m} />
          ))}
        </Flex>
      </RadioCard.Root>
    </Flex>
  )
}
