import { useEffect, useState } from 'react'
import { Dialog, Portal, CloseButton, Text, Flex, Button, Box, chakra } from '@chakra-ui/react'
import { Sparkles } from 'lucide-react'
import { NumberField } from '@/components/ui/NumberField'
import { DatePicker } from '@/components/ui/DatePicker'
import { toPersianDigits, formatThousands } from '@/utils/numbers'
import { pressable } from './motion'
import { dialogEnterSubmit } from './enterSubmit'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface DiscountValue {
  /** 'percent' یا 'amount' */
  type: string
  /** مقدار تخفیف (درصد یا مبلغ) — لاتینِ تمیز */
  value: string
  /** تاریخ پایان تخفیف (ISO میلادی) یا خالی */
  until: string
}

export interface DiscountDialogProps {
  open: boolean
  onClose: () => void
  /** قیمت اصلی — مبنای محاسبه */
  basePrice: string
  unit: string
  current: DiscountValue
  onConfirm: (v: DiscountValue) => void
  onRemove: () => void
}

/** قیمت بعد از تخفیف — همان فرمولی که فروشگاه استفاده می‌کند */
export function finalPriceOf(basePrice: string, type: string, value: string): number | null {
  const base = Number(basePrice) || 0
  const amount = Number(value) || 0
  if (!base || !amount) return null
  const result = type === 'percent' ? base - (base * amount) / 100 : base - amount
  return Math.max(0, Math.round(result))
}

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * DiscountDialog — تعیین تخفیف با درصد یا مبلغ.
 *
 * چرا دوباره به این شکل برگشت: در نسخهٔ قبل «قیمت با تخفیف» یک فیلد ساده بود و
 * فروشنده باید خودش درصد را حساب می‌کرد. مالک محصول همان مکانیزم قدیمی را
 * می‌خواست — درصد یا مبلغ وارد کن، مبلغ نهایی خودش محاسبه شود.
 *
 * تاریخ پایان هم **همین‌جاست**، نه در یک باکس جدا: داشتن تاریخ پایان همان چیزی
 * است که محصول را «پیشنهاد شگفت‌انگیز» می‌کند، پس باید کنار خودِ تخفیف تصمیم
 * گرفته شود نه سه بخش آن‌طرف‌تر. همین یک جا، سه گزینهٔ تکراریِ قبلی را حذف کرد.
 */
export function DiscountDialog({
  open, onClose, basePrice, unit, current, onConfirm, onRemove,
}: DiscountDialogProps) {
  const [type, setType] = useState(current.type || 'percent')
  const [value, setValue] = useState(current.value)
  const [until, setUntil] = useState(current.until)

  useEffect(() => {
    if (open) { setType(current.type || 'percent'); setValue(current.value); setUntil(current.until) }
  }, [open, current])

  const base = Number(basePrice) || 0
  const final = finalPriceOf(basePrice, type, value)
  const invalid = final !== null && final >= base
  const saved = final !== null ? base - final : 0

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl" py="6">
          <Dialog.Content maxW="520px" w="full" mx="4" {...dialogEnterSubmit(() => { onConfirm({ type, value, until }); onClose() }, !invalid && value.trim() !== '')}>

            <Dialog.Header pt="5" px="6" pb="2" position="relative">
              <Dialog.Title fontSize="md" fontWeight="semibold" textAlign="start" w="full">
                تخفیف محصول
              </Dialog.Title>
              <Text fontSize="xs" color="fg.muted" textAlign="start" mt="1" lineHeight="1.9">
                درصد یا مبلغ تخفیف را بنویسید؛ قیمت نهایی خودکار حساب می‌شود.
              </Text>
              <Dialog.CloseTrigger asChild position="absolute" top="3" insetEnd="3">
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body px="6" pt="3" pb="4">
              {/* FIRST = rightmost: نوع تخفیف · سپس مقدار */}
              <Flex gap="2" align="end">
                <Box flexShrink={0}>
                  <Text fontSize="xs" color="fg.muted" textAlign="start" mb="1.5">نوع</Text>
                  <Flex bg="bg.subtle" rounded="l2" p="1" gap="1">
                    {[{ v: 'percent', l: 'درصد' }, { v: 'amount', l: 'مبلغ' }].map((o) => (
                      <chakra.button
                        key={o.v}
                        type="button"
                        aria-pressed={type === o.v}
                        onClick={() => setType(o.v)}
                        px="3"
                        h="8"
                        rounded="l1"
                        fontSize="xs"
                        cursor="pointer"
                        fontWeight={type === o.v ? 'semibold' : 'normal'}
                        bg={type === o.v ? 'bg.panel' : 'transparent'}
                        color={type === o.v ? 'brand.fg' : 'fg.muted'}
                        boxShadow={type === o.v ? 'xs' : 'none'}
                        {...pressable}
                      >
                        {o.l}
                      </chakra.button>
                    ))}
                  </Flex>
                </Box>

                <Box flex="1" minW="0">
                  <Text as="label" fontSize="xs" color="fg.muted" textAlign="start" mb="1.5" display="block">
                    مقدار تخفیف
                  </Text>
                  <NumberField
                    value={value}
                    onChange={setValue}
                    placeholder={type === 'percent' ? 'مثال: ۲۰' : 'مثال: ۵۰٬۰۰۰'}
                    max={type === 'percent' ? 99 : undefined}
                    endElement={
                      <Text fontSize="xs" color="fg.muted">{type === 'percent' ? '٪' : unit}</Text>
                    }
                  />
                </Box>
              </Flex>

              {/* قیمت نهایی — محاسبه‌شده، قابل ویرایش نیست */}
              <Box
                mt="3"
                px="3"
                py="2.5"
                rounded="lg"
                borderWidth="1px"
                borderColor={invalid ? 'red.muted' : 'brand.muted'}
                bg={invalid ? 'red.bg' : 'brand.bg'}
              >
                <Flex align="baseline" justify="space-between" gap="2" wrap="wrap">
                  <Text fontSize="xs" color="fg.muted">قیمت بعد از تخفیف</Text>
                  <Text fontSize="md" fontWeight="bold" color={invalid ? 'red.fg' : 'brand.fg'}>
                    {final === null ? '—' : `${toPersianDigits(formatThousands(final))} ${unit}`}
                  </Text>
                </Flex>
                {final !== null && !invalid && (
                  <Text fontSize="2xs" color="fg.muted" textAlign="start" mt="1">
                    {toPersianDigits(formatThousands(saved))} {unit} ارزان‌تر از قیمت اصلی
                  </Text>
                )}
                {invalid && (
                  <Text fontSize="2xs" color="red.fg" textAlign="start" mt="1">
                    تخفیف باید کمتر از قیمت اصلی باشد.
                  </Text>
                )}
              </Box>

              {/* تاریخ پایان + اثرش */}
              <Box mt="4">
                <Text fontSize="xs" color="fg.muted" textAlign="start" mb="1.5">
                  تاریخ پایان تخفیف (اختیاری)
                </Text>
                <DatePicker value={until} onChange={setUntil} placeholder="بدون تاریخ پایان" />
              </Box>

              <Flex
                align="start"
                gap="2"
                mt="2.5"
                p="2.5"
                rounded="lg"
                borderWidth="1px"
                borderColor={until ? 'orange.muted' : 'border.muted'}
                bg={until ? 'orange.bg' : 'bg.subtle'}
              >
                {/* FIRST = rightmost: آیکن */}
                <Box color={until ? 'orange.fg' : 'fg.muted'} flexShrink={0} display="flex" mt="0.5">
                  <Sparkles size={15} />
                </Box>
                <Text fontSize="2xs" color="fg.muted" textAlign="start" lineHeight="1.9">
                  {until
                    ? 'با داشتن تاریخ پایان، این محصول در بخش «پیشنهادهای شگفت‌انگیز» فروشگاه نمایش داده می‌شود و سر همان تاریخ، تخفیف برداشته شده و از آن بخش خارج می‌شود.'
                    : 'اگر تاریخ پایان بگذارید، محصول در بخش «پیشنهادهای شگفت‌انگیز» فروشگاه هم دیده می‌شود. بدون تاریخ، تخفیف تا وقتی خودتان حذفش کنید ادامه دارد.'}
                </Text>
              </Flex>
            </Dialog.Body>

            <Dialog.Footer px="6" pt="0" pb="5">
              {/* FIRST = rightmost: حذف تخفیف · LAST = leftmost: ذخیره */}
              <Flex align="center" justify="space-between" w="full" gap="3">
                <Button
                  variant="ghost"
                  size="sm"
                  colorPalette="red"
                  disabled={!current.value}
                  onClick={() => { onRemove(); onClose() }}
                >
                  حذف تخفیف
                </Button>
                <Flex gap="3">
                  <Button variant="outline" onClick={onClose}>انصراف</Button>
                  <Button
                    colorPalette="brand"
                    disabled={invalid || !value.trim()}
                    onClick={() => { onConfirm({ type, value, until }); onClose() }}
                  >
                    ذخیره
                  </Button>
                </Flex>
              </Flex>
            </Dialog.Footer>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
