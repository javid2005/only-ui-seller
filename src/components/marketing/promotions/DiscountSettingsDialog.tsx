'use client'

import { useEffect, useState } from 'react'
import {
  Alert, Button, CloseButton, createListCollection, Dialog, Field,
  Flex, Portal, SegmentGroup, Select, Text,
} from '@chakra-ui/react'
import { Percent } from 'lucide-react'
import { NumberField } from '@/components/ui/NumberField'

export type DiscountType = 'percent' | 'value'

export interface DiscountFormValues {
  discountType: DiscountType
  /** درصد تخفیف — لاتینِ تمیز (فقط discountType=percent) */
  percentValue: string
  /** مبلغ تخفیف — لاتینِ تمیز (فقط discountType=value) */
  amountValue: string
  /** سقف مبلغ تخفیف — لاتینِ تمیز (فقط discountType=percent) */
  capAmount: string
  /** حداقل مبلغ سفارش — لاتینِ تمیز */
  minOrderAmount: string
  /** مدت اعتبار کد به روز — لاتینِ تمیز، فقط وقتی showValidityField=true */
  validityDays: string
}

const EMPTY_VALUES: DiscountFormValues = {
  discountType: 'percent',
  percentValue: '',
  amountValue: '',
  capAmount: '',
  minOrderAmount: '',
  validityDays: '',
}

const VALIDITY_OPTIONS = [
  { value: '3', label: '۳ روز' },
  { value: '7', label: '۷ روز' },
  { value: '14', label: '۱۴ روز' },
  { value: '30', label: '۳۰ روز' },
]
const VALIDITY_COLLECTION = createListCollection({ items: VALIDITY_OPTIONS })

export interface DiscountSettingsDialogProps {
  open: boolean
  onClose: () => void
  onSave: (values: DiscountFormValues) => void
  title: string
  alertText: string
  /** فیلد «مدت اعتبار کد» — فقط سیاست‌های تخفیف خرید بعدی (کد پیامکی) این رو داره */
  showValidityField?: boolean
  initialValues?: Partial<DiscountFormValues>
}

/**
 * دیالوگ تنظیمات تخفیف — دو استفاده: «تنظیمات تخفیف خرید اول» (node 2700:43295 درصدی /
 * 2700:43551 مقداری) و «سیاست‌های تخفیف خرید بعدی» (node 2700:43660 درصدی / 2700:43661 مقداری
 * + select «مدت اعتبار کد» با آیتم‌های node 2700:46617). هر دو دیالوگ فقط در عنوان، متن Alert و
 * وجود فیلد اعتبار کد فرق دارن — بقیه ساختار عیناً یکیه، پس یک کامپوننت پارامتری شده.
 *
 * RTL DOM order (از روی screenshot طرح، نه ترتیب خام JSX که LTR canvas است):
 *  SegmentGroup toggle → «درصدی» FIRST=راست‌ترین، «مقداری» SECOND=چپ‌ترین (برعکسِ ترتیب
 *  CampaignFeeInput.tsx که در طرح دیگه‌ای مقداری راسته — این دو کامپوننت جدا از هم طراحی شدن).
 *  Dialog footer → انصراف FIRST=راست‌ترین، ذخیره(primary) LAST=چپ‌ترین — طبق قرارداد پروژه
 *  (ButtonFooter/NewCampaignDialog).
 *  Input addon (٪ / تومان) → endElement (چپ سمت داخل input) — طبق قرارداد NumberField پروژه
 *  (InfoTab.tsx، CampaignFeeInput.tsx) نه startElement.
 */
export function DiscountSettingsDialog({
  open,
  onClose,
  onSave,
  title,
  alertText,
  showValidityField = false,
  initialValues,
}: DiscountSettingsDialogProps) {
  const [values, setValues] = useState<DiscountFormValues>({ ...EMPTY_VALUES, ...initialValues })

  useEffect(() => {
    if (open) setValues({ ...EMPTY_VALUES, ...initialValues })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const isPercent = values.discountType === 'percent'
  const set = <K extends keyof DiscountFormValues>(key: K, v: DiscountFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: v }))

  const canSave = isPercent ? values.percentValue !== '' : values.amountValue !== ''

  return (
    <Dialog.Root open={open} onOpenChange={({ open: o }) => !o && onClose()} placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl">
          <Dialog.Content maxW="544px" w="full" mx="4">
            <Dialog.Header pt="6" pb="4" px="6">
              <Dialog.Title fontSize="lg" fontWeight="semibold" color="fg">{title}</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body pt="2" pb="6" px="6">
              <Flex direction="column" gap="4" alignItems="flex-end" w="full">
                <Alert.Root status="info" variant="subtle" w="full">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Text fontSize="xs">{alertText}</Text>
                  </Alert.Content>
                </Alert.Root>

                {/* نوع تخفیف — درصدی FIRST=راست‌ترین، مقداری SECOND=چپ‌ترین */}
                <Field.Root w="full">
                  <Field.Label fontSize="sm" fontWeight="semibold" color="fg">نوع تخفیف</Field.Label>
                  <SegmentGroup.Root
                    value={values.discountType}
                    onValueChange={(e) => set('discountType', (e.value ?? 'percent') as DiscountType)}
                    w="full"
                    size="md"
                  >
                    <SegmentGroup.Indicator bg="bg.panel" />
                    <SegmentGroup.Item value="percent" flex="1" justifyContent="center">
                      <SegmentGroup.ItemText>درصدی</SegmentGroup.ItemText>
                      <SegmentGroup.ItemHiddenInput />
                    </SegmentGroup.Item>
                    <SegmentGroup.Item value="value" flex="1" justifyContent="center">
                      <SegmentGroup.ItemText>مقداری</SegmentGroup.ItemText>
                      <SegmentGroup.ItemHiddenInput />
                    </SegmentGroup.Item>
                  </SegmentGroup.Root>
                </Field.Root>

                {isPercent ? (
                  <Field.Root required w="full">
                    <Field.Label fontSize="sm" fontWeight="semibold" color="fg">
                      درصد تخفیف<Field.RequiredIndicator />
                    </Field.Label>
                    <NumberField
                      value={values.percentValue}
                      onChange={(v) => set('percentValue', v)}
                      placeholder="مثال: ۱۵"
                      max={100}
                      endElement={<Percent size={16} />}
                    />
                  </Field.Root>
                ) : (
                  <Field.Root required w="full">
                    <Field.Label fontSize="sm" fontWeight="semibold" color="fg">
                      مبلغ تخفیف<Field.RequiredIndicator />
                    </Field.Label>
                    <NumberField
                      value={values.amountValue}
                      onChange={(v) => set('amountValue', v)}
                      placeholder="مثال: ۱۵۰٬۰۰۰"
                      endElement={<Text fontSize="sm" color="fg.muted" px="2">تومان</Text>}
                    />
                  </Field.Root>
                )}

                {isPercent && (
                  <Field.Root w="full">
                    <Field.Label fontSize="sm" fontWeight="semibold" color="fg">سقف مبلغ تخفیف</Field.Label>
                    <NumberField
                      value={values.capAmount}
                      onChange={(v) => set('capAmount', v)}
                      placeholder="مثال: ۱۵۰٬۰۰۰"
                      endElement={<Text fontSize="sm" color="fg.muted" px="2">تومان</Text>}
                    />
                    <Field.HelperText>حداکثر مبلغ قابل کسر</Field.HelperText>
                  </Field.Root>
                )}

                <Field.Root w="full">
                  <Field.Label fontSize="sm" fontWeight="semibold" color="fg">حداقل مبلغ سفارش</Field.Label>
                  <NumberField
                    value={values.minOrderAmount}
                    onChange={(v) => set('minOrderAmount', v)}
                    placeholder="مثال: ۲۰۰٬۰۰۰"
                    endElement={<Text fontSize="sm" color="fg.muted" px="2">تومان</Text>}
                  />
                </Field.Root>

                {showValidityField && (
                  <Field.Root w="full">
                    <Field.Label fontSize="sm" fontWeight="semibold" color="fg">مدت اعتبار کد</Field.Label>
                    <Select.Root
                      collection={VALIDITY_COLLECTION}
                      value={values.validityDays ? [values.validityDays] : []}
                      onValueChange={(e) => set('validityDays', e.value[0] ?? '')}
                      w="full"
                    >
                      <Select.HiddenSelect />
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText placeholder="انتخاب کنید" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Select.Positioner>
                        <Select.Content>
                          {VALIDITY_COLLECTION.items.map((it) => (
                            <Select.Item key={it.value} item={it}>
                              <Select.ItemText>{it.label}</Select.ItemText>
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Select.Root>
                    <Field.HelperText>
                      مشتری تا این تعداد روز پس از دریافت پیامک می‌تواند از کد استفاده کند
                    </Field.HelperText>
                  </Field.Root>
                )}
              </Flex>
            </Dialog.Body>

            {/* انصراف FIRST=راست‌ترین، ذخیره(primary) LAST=چپ‌ترین */}
            <Dialog.Footer pt="2" pb="4" px="6">
              <Flex justify="flex-end" gap="3" w="full">
                <Button variant="outline" colorPalette="gray" onClick={onClose}>انصراف</Button>
                <Button
                  bg="brand.solid"
                  color="brand.contrast"
                  _hover={{ bg: 'brand.emphasized' }}
                  disabled={!canSave}
                  onClick={() => onSave(values)}
                >
                  ذخیره
                </Button>
              </Flex>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild position="absolute" top="3" insetEnd="3">
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
