import {
  Box, Flex, Grid, Text, Input, InputGroup, NativeSelect,
  Select, Switch, Alert, Field, TagsInput,
  Collapsible, createListCollection, Portal,
} from '@chakra-ui/react'
import { DollarSign } from 'lucide-react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { TitleBar } from '@/components/ui/TitleBar'
import { ButtonFooter } from '@/components/ui/ButtonFooter'
import { RichTextEditor } from '@/components/ui/RichTextEditor'
import { NumberField } from '@/components/ui/NumberField'
import { GoldInfoCard } from './GoldInfoCard'
import { toPersianDigits, toLatinDigits, formatThousands, toPersianWords } from '@/utils/numbers'
import {
  categoryCollection, CURRENCY_UNITS, DISCOUNT_TYPES, currencyLabel,
  USD_RATE, USD_RATE_UPDATED, GOLD_GRAM_PRICE, pricingModeOf,
  type ProductForm,
} from './data'

// ─── UnitSelect — NativeSelect inline addon داخل InputGroup endElement ──────────
// dev-engine-disable
// NativeSelect صحیح است اینجا: addon درون InputGroup، نه فیلد standalone (الگوی AddShippingMethod).
export function UnitSelect({
  value, onChange, options,
}: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <NativeSelect.Root size="xs" variant="plain" width="auto">
      <NativeSelect.Field
        value={value}
        onChange={(e) => onChange(e.target.value)}
        fontSize="sm"
        color="fg"
        dir="rtl"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  )
}
// dev-engine-enable

const categorySelectCollection = createListCollection({ items: categoryCollection.items })

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface InfoTabProps {
  form: ProductForm
  onChange: (patch: Partial<ProductForm>) => void
  onBack: () => void
  onSave: () => void
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function InfoTab({ form, onChange, onBack, onSave }: InfoTabProps) {
  const isCompact = useCompactMode()
  const twoCol = isCompact ? '1fr' : { base: '1fr', md: '1fr 1fr' }


  // ─── Pricing (محاسبهٔ کلاینت — این پاس بدون API) ──────────────────────────────
  const num = (s: string) => Number(toLatinDigits(s).replace(/[^\d.]/g, '')) || 0
  const isGold = pricingModeOf(form.category) === 'gold'
  const isUsd = !isGold && form.currency === 'usd'

  const priceNum = num(form.price)
  const hasManualPrice = form.price.trim() !== '' && priceNum > 0

  // ── طلا: قیمت نهایی = پایه×(۱+اجرت)×(۱+سود) + مالیاتِ (اجرت+سود) ──
  const goldWeight = num(form.goldWeight)
  const goldBase = goldWeight * GOLD_GRAM_PRICE
  const goldAddedValue = goldBase * (1 + num(form.goldWage) / 100) * (1 + num(form.goldProfit) / 100) - goldBase
  const goldTaxAmount = goldAddedValue * (num(form.goldTax) / 100)
  const goldFinal = Math.round(goldBase + goldAddedValue + goldTaxAmount)
  const goldHasValue = goldWeight > 0

  // قیمتِ مؤثر برای محاسبهٔ تخفیف/معادل تومانی + اینکه قیمت معتبر داریم یا نه
  const effectivePrice = isGold ? goldFinal : priceNum
  const hasPrice = isGold ? goldHasValue : hasManualPrice
  const priceUnit = isGold ? 'تومان' : currencyLabel(form.currency)

  // help text زیر «قیمت اصلی / نهایی»
  const tomanValue = isUsd ? priceNum * USD_RATE : effectivePrice
  const priceHelp = isGold
    ? 'طلا فقط با واحد تومان — محاسبه بر اساس فرمول طلا'
    : !hasPrice
      ? 'قیمت به تومان و به حروف نمایش داده می شود'
      : isUsd
        ? `(~ ${toPersianDigits(formatThousands(tomanValue))} تومان) ${toPersianWords(tomanValue)} تومان`
        : `${toPersianWords(priceNum)} تومان`

  // «قیمت بعد از تخفیف» = derived از قیمتِ مؤثر + مقدار/نوع تخفیف (در واحد قیمت)
  const discountNum = num(form.discountValue)
  const hasDiscountVal = form.discountValue.trim() !== '' && Number.isFinite(discountNum)
  const finalPrice = hasPrice && hasDiscountVal
    ? Math.max(0, Math.round(form.discountType === 'percent' ? effectivePrice - (effectivePrice * discountNum) / 100 : effectivePrice - discountNum))
    : null
  const finalPriceDisplay = finalPrice !== null ? toPersianDigits(formatThousands(finalPrice)) : ''

  // ─── Inventory ────────────────────────────────────────────────────────────────
  // با وجود تنوع: موجودی و تاگل نامحدود read-only (مدیریت از تب تنوع‌ها)
  return (
    <Flex direction="column" gap="10" w="full">

      {/* ═══ اطلاعات پایه ═══════════════════════════════════════════════════════ */}
      <Box>
        <TitleBar title="اطلاعات اصلی" subtitle="این اطلاعات در صفحه محصول نمایش داده می‌شود" size="xl" divider />
        <Grid templateColumns={twoCol} gap="4" pt="4">

          {/* نام محصول * — FIRST = راست */}
          <Field.Root required>
            <Field.Label fontSize="sm" fontWeight="semibold">
              نام محصول<Field.RequiredIndicator />
            </Field.Label>
            <Input
              placeholder="نام محصول"
              value={form.name}
              onChange={(e) => onChange({ name: e.target.value })}
            />
          </Field.Root>

          {/* دسته بندی * */}
          <Field.Root required>
            <Field.Label fontSize="sm" fontWeight="semibold">
              دسته بندی<Field.RequiredIndicator />
            </Field.Label>
            <Select.Root
              collection={categorySelectCollection}
              value={form.category ? [form.category] : []}
              onValueChange={(e) => onChange({ category: e.value[0] ?? '' })}
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="دسته بندی" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content dir="rtl">
                    {categorySelectCollection.items.map((item) => (
                      <Select.Item key={item.value} item={item}>
                        <Select.ItemText>{item.label}</Select.ItemText>
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Field.Root>

        </Grid>
      </Box>

      {/* ═══ قیمت گذاری ═════════════════════════════════════════════════════════ */}
      <Box>
        <TitleBar title="قیمت گذاری" subtitle="قیمت اصلی و تخفیف محصول را تنظیم کنید." size="xl" divider />
        <Flex direction="column" gap="4" pt="4">

          {/* کارت اطلاعات اختصاصی طلا — فقط دستهٔ طلا */}
          {isGold && <GoldInfoCard form={form} onChange={onChange} />}

          {/* قیمت اصلی/نهایی + واحد + تخفیف دارد */}
          <Flex gap="4" align={isCompact ? 'stretch' : { base: 'stretch', sm: 'end' }} direction={isCompact ? 'column' : { base: 'column', sm: 'row' }}>
            <Field.Root required flex={isCompact ? '1' : { base: 'none', sm: '1' }} w={isCompact ? undefined : { base: 'full', sm: 'auto' }}>
              <Field.Label fontSize="sm" fontWeight="semibold">
                {isGold ? 'قیمت نهایی' : 'قیمت اصلی'}<Field.RequiredIndicator />
              </Field.Label>
              <NumberField
                placeholder={isGold ? 'قیمت نهایی' : 'قیمت اصلی'}
                value={isGold ? (goldHasValue ? String(goldFinal) : '') : form.price}
                onChange={isGold ? () => {} : (v) => onChange({ price: v })}
                disabled={isGold || form.phoneSale || form.hasVariants}
                endElement={
                  isGold ? (
                    <Text fontSize="sm" color="fg.muted" px="2">تومان</Text>
                  ) : (
                    <UnitSelect
                      value={form.currency}
                      onChange={(v) => onChange({ currency: v })}
                      options={CURRENCY_UNITS}
                    />
                  )
                }
                endElementProps={{ px: '1' }}
              />
              <Field.HelperText>{priceHelp}</Field.HelperText>
            </Field.Root>

            {/* تخفیف دارد — RTL: Switch FIRST=راست، Text LAST=چپ */}
            <Flex align="center" gap="2.5" pb={isCompact ? '0' : { base: '0', sm: '7' }} flexShrink={0}>
              <Switch.Root
                colorPalette="brand"
                checked={form.hasDiscount}
                onCheckedChange={(e) => onChange({ hasDiscount: e.checked })}
              >
                <Switch.HiddenInput />
                <Switch.Control><Switch.Thumb /></Switch.Control>
              </Switch.Root>
              <Text fontSize="sm" color="fg" whiteSpace="nowrap">تخفیف دارد</Text>
            </Flex>
          </Flex>

          {/* Discount Box — با انیمیشن باز/بسته (Collapsible) */}
          <Collapsible.Root open={form.hasDiscount} unmountOnExit>
            <Collapsible.Content>
              <Box bg="bg.muted" borderWidth="1px" borderColor="border" rounded="lg" p="4">
                <Flex gap="4" align="start" direction={isCompact ? 'row' : { base: 'column', sm: 'row' }}>

                  {/* تخفیف * — FIRST = راست · مقدار + نوع (درصد/مبلغ) */}
                  <Field.Root required flex="1" w={isCompact ? undefined : { base: 'full', sm: 'auto' }}>
                    <Field.Label fontSize="sm" fontWeight="semibold">
                      تخفیف<Field.RequiredIndicator />
                    </Field.Label>
                    <NumberField
                      placeholder="مقدار تخفیف را وارد کنید"
                      value={form.discountValue}
                      onChange={(v) => onChange({ discountValue: v })}
                      inputProps={{ bg: 'bg.panel' }}
                      endElement={
                        <UnitSelect
                          value={form.discountType}
                          onChange={(v) => onChange({ discountType: v })}
                          options={DISCOUNT_TYPES}
                        />
                      }
                      endElementProps={{ px: '1' }}
                    />
                  </Field.Root>

                  {/* قیمت بعد از تخفیف — SECOND = چپ · محاسبه‌شده (read-only) */}
                  <Field.Root flex="1" w={isCompact ? undefined : { base: 'full', sm: 'auto' }}>
                    <Field.Label fontSize="sm" fontWeight="semibold">قیمت بعد از تخفیف</Field.Label>
                    <InputGroup
                      endElement={<Text fontSize="sm" color="fg.muted" px="2">{priceUnit}</Text>}
                    >
                      <Input
                        bg="bg.panel"
                        placeholder="قیمت بعد از تخفیف"
                        value={finalPriceDisplay}
                        disabled
                      />
                    </InputGroup>
                  </Field.Root>

                </Flex>
              </Box>
            </Collapsible.Content>
          </Collapsible.Root>

          {/* نرخ زندهٔ دلار — فقط در حالت ارزی */}
          {isUsd && (
            <Alert.Root status="success" variant="subtle">
              <Alert.Indicator><DollarSign size={16} /></Alert.Indicator>
              <Alert.Content gap="0.5">
                <Text fontSize="sm" fontWeight="semibold">
                  نرخ دلار: {toPersianDigits(formatThousands(USD_RATE))} تومان
                </Text>
                <Text fontSize="xs">
                  قیمت هر ۱۰ دقیقه بروزرسانی می‌شود — آخرین بروزرسانی: ساعت {USD_RATE_UPDATED}
                </Text>
              </Alert.Content>
            </Alert.Root>
          )}

          {/* فروش تلفنی — Switch FIRST=راست، Text چپ */}
          <Flex align="center" gap="2.5">
            <Switch.Root
              colorPalette="brand"
              checked={form.phoneSale}
              onCheckedChange={(e) => onChange({ phoneSale: e.checked })}
            >
              <Switch.HiddenInput />
              <Switch.Control><Switch.Thumb /></Switch.Control>
            </Switch.Root>
            <Text fontSize="sm" color="fg" whiteSpace="nowrap">فروش تلفنی</Text>
          </Flex>

          {/* Alert اطلاع‌رسانی فروش تلفنی */}
          <Alert.Root status="info" variant="subtle">
            <Alert.Indicator />
            <Alert.Content gap="1">
              <Text fontSize="xs">• با فعال کردن این گزینه قیمت اصلی غیرفعال می‌شود.</Text>
              <Text fontSize="xs">• این آیتم برای هر تنوع میتواند بصورت جداگانه فعال شود.</Text>
              <Text fontSize="xs">• در صورت فعال شدن برای هر تنوع، گزینه فروش تلفنی در این صفحه باید غیرفعال شود.</Text>
            </Alert.Content>
          </Alert.Root>

        </Flex>
      </Box>

      {/* ═══ توضیحات اجمالی ═════════════════════════════════════════════════════ */}
      <Box>
        <TitleBar title="توضیحات اجمالی درباره محصول" subtitle="توضیحات کامل محصول را وارد کنید." size="xl" divider />
        <Box pt="4">
          <RichTextEditor
            value={form.description}
            onChange={(html) => onChange({ description: html })}
            placeholder="توضیحات محصول را وارد کنید..."
          />
        </Box>
      </Box>

      {/* ═══ برچسب ها ═══════════════════════════════════════════════════════════ */}
      <Box>
        <TitleBar
          title="برچسب ها"
          subtitle="کلمات یا عبارات کوتاهی که به معرفی بهتر کالا کمک می کنند."
          size="xl"
          divider
        />
        <Box pt="4">
          {/* عرض ۱۰۰٪: نه فقط روی Root — خودِ Control هم باید کشیده شود، وگرنه
              والد عرض را محدود می‌کند و فیلد باریک می‌ماند (ریشهٔ بازخورد تکرارشده). */}
          <TagsInput.Root
            value={form.tags}
            onValueChange={(e) => onChange({ tags: e.value })}
            w="full"
            maxW="none"
          >
            <TagsInput.Control w="full" minW="0">
              <TagsInput.Context>
                {(api) =>
                  api.value.map((value, index) => (
                    <TagsInput.Item key={`${value}-${index}`} index={index} value={value}>
                      <TagsInput.ItemPreview>
                        <TagsInput.ItemText>{value}</TagsInput.ItemText>
                        <TagsInput.ItemDeleteTrigger />
                      </TagsInput.ItemPreview>
                      <TagsInput.ItemInput />
                    </TagsInput.Item>
                  ))
                }
              </TagsInput.Context>
              <TagsInput.Input placeholder="افزودن ..." />
            </TagsInput.Control>
            <TagsInput.HiddenInput />
          </TagsInput.Root>
        </Box>
      </Box>

      {/* ═══ Footer ═════════════════════════════════════════════════════════════ */}
      <ButtonFooter
        primary={{ label: 'ذخیره و ادامه', onClick: onSave }}
        back={{ label: 'بازگشت به لیست', onClick: onBack }}
      />

    </Flex>
  )
}
