import { Field, Flex, Grid, Input, Select, Separator, Text, Textarea } from '@chakra-ui/react'
import { TitleBar } from '@/components/ui/TitleBar'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { MANUAL_CITIES, MANUAL_PROVINCES } from './manualOrderData'

export interface ShippingAddressValue {
  province: string
  city: string
  postal: string
  address: string
  note: string
}

interface ShippingAddressFormProps {
  value: ShippingAddressValue
  onChange: (value: ShippingAddressValue) => void
  /** true بعد از اولین تلاش ناموفقِ «ادامه» — فیلدهای الزامیِ خالی را invalid نشان می‌دهد */
  attemptedSubmit?: boolean
}

const REQUIRED_MSG = 'این فیلد الزامی است'

/**
 * ShippingAddressForm — بخش «اطلاعات ارسال» ویزارد سفارش دستی (Figma node 2101:38449).
 *
 * ردیف اول (RTL، اولین DOM = راست‌ترین — بر اساس x-metadata طرح):
 *   استان (راست) → شهر (وسط) → کد پستی (چپ)
 * از sm به بالا (و در حالت کامپکت که خودش شبیه‌سازِ ۵۱۲px است)، استان+شهر در یک ردیفِ
 * دوستونه می‌مانند و کد پستی به ردیف مستقلِ تمام‌عرض زیرشان می‌رود (`gridColumn: span 2`)
 * — مطابق Figma mobile frame. زیرِ sm (موبایل واقعیِ باریک)، هر سه فیلد تک‌ستونه زیر هم
 * می‌افتند تا فیلدهای استان/شهر روی صفحه‌های خیلی باریک فشرده نشوند.
 *
 * اعتبارسنجی: دکمهٔ «ادامه» فقط با انتخابِ روش ارسال فعال می‌شود (نه تکمیلِ این فرم) —
 * اگر کاربر بدون پرکردنِ فیلدهای الزامی «ادامه» را بزند، `attemptedSubmit` از والد true
 * می‌شود و همینجا خطای هر فیلدِ خالی نشان داده می‌شود (الگوی Field.Root/Field.ErrorText،
 * هم‌الگو با AddCustomerDialog.tsx).
 */
export function ShippingAddressForm({ value, onChange, attemptedSubmit = false }: ShippingAddressFormProps) {
  const isCompact = useCompactMode()

  function patch(key: keyof ShippingAddressValue, v: string) {
    onChange({ ...value, [key]: v })
  }

  const missing = (key: keyof ShippingAddressValue) => attemptedSubmit && !value[key].trim()

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
      <TitleBar title="اطلاعات ارسال" subtitle="آدرس گیرنده را وارد کنید." divider />

      <Flex direction="column" gap="4" w="full">
        <Grid templateColumns={isCompact ? '1fr 1fr' : { base: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }} gap="4" w="full">
          <Field.Root required invalid={missing('province')}>
            <Field.Label fontSize="sm" color="fg">
              استان
              <Field.RequiredIndicator />
            </Field.Label>
            <Select.Root
              collection={MANUAL_PROVINCES}
              value={value.province ? [value.province] : []}
              onValueChange={(e) => patch('province', e.value[0] ?? '')}
              invalid={missing('province')}
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="استان را انتخاب کنید" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Select.Positioner>
                <Select.Content>
                  {MANUAL_PROVINCES.items.map((item) => (
                    <Select.Item key={item.value} item={item}>
                      <Select.ItemText>{item.label}</Select.ItemText>
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
            {missing('province') && <Field.ErrorText fontSize="xs">{REQUIRED_MSG}</Field.ErrorText>}
          </Field.Root>

          <Field.Root required invalid={missing('city')}>
            <Field.Label fontSize="sm" color="fg">
              شهر
              <Field.RequiredIndicator />
            </Field.Label>
            <Select.Root
              collection={MANUAL_CITIES}
              value={value.city ? [value.city] : []}
              onValueChange={(e) => patch('city', e.value[0] ?? '')}
              invalid={missing('city')}
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="شهر را انتخاب کنید" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Select.Positioner>
                <Select.Content>
                  {MANUAL_CITIES.items.map((item) => (
                    <Select.Item key={item.value} item={item}>
                      <Select.ItemText>{item.label}</Select.ItemText>
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
            {missing('city') && <Field.ErrorText fontSize="xs">{REQUIRED_MSG}</Field.ErrorText>}
          </Field.Root>

          <Field.Root
            required
            invalid={missing('postal')}
            gridColumn={isCompact ? 'span 2' : { base: 'span 1', sm: 'span 2', lg: 'auto' }}
          >
            <Field.Label fontSize="sm" color="fg">
              کد پستی
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              placeholder="کد پستی را وارد کنید"
              value={value.postal}
              onChange={(e) => patch('postal', e.target.value)}
              dir="ltr"
              textAlign="right"
              type="tel"
            />
            {missing('postal') && <Field.ErrorText fontSize="xs">{REQUIRED_MSG}</Field.ErrorText>}
          </Field.Root>
        </Grid>

        <Field.Root required invalid={missing('address')}>
          <Field.Label fontSize="sm" color="fg">
            آدرس
            <Field.RequiredIndicator />
          </Field.Label>
          <Input
            placeholder="آدرس را وارد کنید"
            value={value.address}
            onChange={(e) => patch('address', e.target.value)}
          />
          {missing('address') && <Field.ErrorText fontSize="xs">{REQUIRED_MSG}</Field.ErrorText>}
        </Field.Root>

        <Separator />

        <Field.Root>
          <Field.Label fontSize="sm" color="fg">یادداشت فروشنده</Field.Label>
          <Textarea
            placeholder="نکات مهم در مورد این سفارش را اینجا بنویسید..."
            value={value.note}
            onChange={(e) => patch('note', e.target.value)}
            rows={2}
          />
          <Text fontSize="xs" color="fg.muted">(اختیاری — فقط برای شما قابل مشاهده است)</Text>
        </Field.Root>
      </Flex>
    </Flex>
  )
}
