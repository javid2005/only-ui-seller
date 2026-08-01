import { Badge, Flex, RadioCard, Text } from '@chakra-ui/react'
import { Tag } from 'lucide-react'
import { TitleBar } from '@/components/ui/TitleBar'
import { formatToman, type ManualDiscount } from './manualOrderData'

/**
 * DiscountCard — یک کارت در لیست «تخفیف‌های موجود» (Figma local component «Manual-Discount-Card»).
 * باید داخل <RadioCard.Root> استفاده شود.
 *
 * RTL DOM order (بر اساس x-metadata طرح، نه ترتیب خروجی خام Figma که LTR است):
 *   ItemIndicator (راست‌ترین، x=364) → Content (تگ+عنوان، سپس بج+جداکننده+کد) → مبلغ تخفیف (چپ‌ترین، x=16)
 *   ردیف تگ+عنوان: تگ (x=332، راست‌تر) → عنوان (x=249، چپ‌تر)
 *   ردیف اطلاعات: بج (x=287، راست‌ترین) → | → جزئیات → | → کد (x=6، چپ‌ترین)
 *
 * زیر sm: ItemControl ستونی می‌شود — گروهِ اندیکاتور+محتوا بالا (راست‌چین، طبق قانونِ ستونیِ
 * RTL: align="flex-start"=راست) و مبلغِ تخفیف زیرش، چپ‌چین (align="flex-end"=چپ) تا روی
 * صفحه‌های باریک به‌جای کشیده‌شدن در کل ارتفاعِ کارت، ردیفِ مستقلِ خودش را بگیرد.
 */
function DiscountCard({ discount }: { discount: ManualDiscount }) {
  return (
    <RadioCard.Item
      value={discount.id}
      w="full"
      rounded="lg"
      p="4"
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border.muted"
      boxShadow="none"
      cursor="pointer"
      _hover={{ bg: 'brand.bg', borderColor: 'brand.focusRing', boxShadow: 'none' }}
      _checked={{ bg: 'brand.bg', borderColor: 'brand.solid', boxShadow: 'none' }}
    >
      <RadioCard.ItemHiddenInput />
      <RadioCard.ItemControl
        gap="4"
        p="0"
        border="none"
        bg="transparent"
        boxShadow="none"
        flexDirection={{ base: 'column', sm: 'row' }}
        justifyContent="space-between"
        w="full"
      >
        <Flex align="center" gap="4" w={{ base: 'full', sm: 'auto' }} alignSelf={{ base: 'flex-start', sm: 'center' }}>
          <RadioCard.ItemIndicator colorPalette="teal" flexShrink={0} />

          <RadioCard.ItemContent gap="2" minW="0" alignItems="flex-start" flex="1">
            <Flex align="center" gap="2">
              <Tag size={16} />
              <RadioCard.ItemText fontSize="sm" fontWeight="semibold" color="fg">{discount.title}</RadioCard.ItemText>
            </Flex>
            <Flex align="center" gap="4">
              <Badge colorPalette="orange" variant="solid" size="xs">{discount.badgeLabel}</Badge>
              <Text fontSize="xs" color="fg.muted">|</Text>
              <Text fontSize="xs" color="fg.muted">{discount.detail}</Text>
              <Text fontSize="xs" color="fg.muted">|</Text>
              <Text fontSize="xs" color="fg.muted">{discount.code}</Text>
            </Flex>
          </RadioCard.ItemContent>
        </Flex>

        <Text
          fontSize="sm"
          fontWeight="semibold"
          color="fg.success"
          flexShrink={0}
          alignSelf={{ base: 'flex-end', sm: 'center' }}
        >
          {formatToman(discount.amount)} ت
        </Text>
      </RadioCard.ItemControl>
    </RadioCard.Item>
  )
}

interface DiscountSelectPanelProps {
  discounts: ManualDiscount[]
  value: string | null
  onChange: (id: string) => void
  /** true وقتی کد تخفیفِ دستی اعمال شده — لیست غیرقابل‌انتخاب می‌شود (هم‌زمان فقط یک نوع تخفیف مجاز است) */
  disabled?: boolean
}

export function DiscountSelectPanel({ discounts, value, onChange, disabled = false }: DiscountSelectPanelProps) {
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
      <TitleBar title="تخفیف‌های موجود" subtitle="یکی از تخفیف‌های از پیش تعریف‌شده را انتخاب کنید." divider />

      {/* value=null صریحاً (نه undefined) — undefined یعنی uncontrolled برای RadioGroup زیرینِ
          Zag و state بیرونی نمی‌تواند انتخاب را پاک کند (هم‌الگو با باگِ Combobox در CLAUDE.md) */}
      <RadioCard.Root value={value} onValueChange={(e) => e.value && onChange(e.value)} disabled={disabled}>
        <Flex direction="column" gap="2">
          {discounts.map((d) => (
            <DiscountCard key={d.id} discount={d} />
          ))}
        </Flex>
      </RadioCard.Root>
    </Flex>
  )
}
