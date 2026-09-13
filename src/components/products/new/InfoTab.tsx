import { useState } from 'react'
import {
  Box, Flex, Grid, Text, Input, NativeSelect, Button, Switch, chakra,
  Select, Alert, createListCollection, Portal,
} from '@chakra-ui/react'
import { DollarSign, Eye, Phone, Tag, Sparkles } from 'lucide-react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { ButtonFooter } from '@/components/ui/ButtonFooter'
import { TitleBar } from '@/components/ui/TitleBar'
import { StepVideoButton } from './StepVideo'
import { RichTextEditor } from '@/components/ui/RichTextEditor'
import { NumberField } from '@/components/ui/NumberField'
import { GoldInfoCard } from './GoldInfoCard'
import { SectionCard } from './SectionCard'
import { MainImageField } from './MainImageField'
import { NotchedField, bareControl } from './NotchedField'
import { pressable, enterItem } from './motion'
import { DiscountDialog, finalPriceOf } from './DiscountDialog'
import { formatJalaliDate } from '@/utils/dates'
import { toPersianDigits, toLatinDigits, formatThousands, toPersianWords } from '@/utils/numbers'
import {
  categoryCollection, CURRENCY_UNITS, currencyLabel,
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
  onSave: () => void
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function InfoTab({ form, onChange, onSave }: InfoTabProps) {
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

  /**
   * تخفیف در طرح تأییدشده **مستقیم** وارد می‌شود: «قیمت با تخفیف» کنار «قیمت اصلی».
   * سوییچ «تخفیف دارد» و ماشین‌حساب درصد/مبلغ فقط در نسخهٔ اول (chakra-review)
   * بودند و از نسخهٔ دوم به بعد حذف شدند — پس اینجا هم نیستند.
   */
  const [discountOpen, setDiscountOpen] = useState(false)

  /**
   * قیمت وقتی «قفل» است که ویرایشش معنا ندارد: طلا (محاسبه‌شده)، فروش تلفنی
   * (نمایش داده نمی‌شود) یا محصول متنوع (قیمت هر مدل در جدول مدل‌هاست).
   */
  const priceLocked = isGold || form.phoneSale || form.hasVariants

  const hasDiscount = form.discountValue.trim() !== '' && form.salePrice.trim() !== ''
  const saleDisplay = toPersianDigits(formatThousands(Number(form.salePrice) || 0))

  // ─── Inventory ────────────────────────────────────────────────────────────────
  // با وجود تنوع: موجودی و تاگل نامحدود read-only (مدیریت از تب تنوع‌ها)
  return (
    <Flex direction="column" gap="5" w="full">

      {/* سرتیتر مرحله — مثل بقیهٔ مراحل، با آیکن ویدئوی آموزش در سمت چپ */}
      <TitleBar
        title="مشخصات اولیه"
        subtitle="اطلاعات اصلی، قیمت و وضعیت فروش"
        size="xl"
        divider
        cta={<StepVideoButton step="basic" title="مشخصات اولیه" />}
      />

      {/* ═══ اطلاعات اصلی ══════════════════════════════════════════════════════ */}
      <SectionCard
        title="اطلاعات اصلی"
        subtitle="این اطلاعات و وضعیت نمایش محصول در صفحهٔ فروشگاه دیده می‌شوند"
        helpTopic="اطلاعات اصلی محصول"
      >
        {/* در طرح، کارت دو ستون دارد: فیلدها (راست) و «تصویر اصلی» (چپ، ۳۰۰px).
            FIRST = rightmost: ستون فیلدها · LAST = leftmost: تصویر اصلی */}
        <Grid
          templateColumns={{ base: '1fr', lg: 'minmax(0, 1fr) 300px' }}
          gap="4"
          alignItems="start"
        >
        <Flex direction="column" gap="4" minW="0">
          {/* FIRST = rightmost: نام محصول · سپس دسته‌بندی */}
          <Grid templateColumns={twoCol} gap="4">
            <NotchedField label="نام محصول" required dataField="name">
              <Input
                {...bareControl}
                placeholder="نام محصول"
                value={form.name}
                onChange={(e) => onChange({ name: e.target.value })}
              />
            </NotchedField>

            <NotchedField label="دسته‌بندی" required dataField="category">
              <Select.Root
                collection={categorySelectCollection}
                value={form.category ? [form.category] : []}
                onValueChange={(e) => onChange({ category: e.value[0] ?? '' })}
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger border="none" px="0" bg="transparent">
                    <Select.ValueText placeholder="دسته‌بندی" />
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
            </NotchedField>
          </Grid>

          <NotchedField label="توضیح کوتاه">
            <Input
              {...bareControl}
              placeholder="یک جملهٔ کوتاه که زیر نام محصول دیده می‌شود"
              value={form.shortDescription}
              onChange={(e) => onChange({ shortDescription: e.target.value })}
            />
          </NotchedField>

          {/* توضیحات محصول — ویرایشگر داخل کادر، مثل بقیهٔ فیلدها (بند ۴ دور «چاکرا اصلاح») */}
          <Box>
            <Text fontSize="xs" fontWeight="medium" color="fg.muted" textAlign="start" mb="1.5">
              توضیحات محصول
            </Text>
            <RichTextEditor
              value={form.description}
              onChange={(html) => onChange({ description: html })}
              placeholder="توضیحات محصول را وارد کنید..."
            />
          </Box>

          {/* «نمایش در ویترین» از بخشِ حذف‌شدهٔ «وضعیت نمایش و فروش» اینجا آمد:
            این یک تصمیمِ اطلاعاتِ پایه است (محصول اصلاً دیده شود یا نه)، نه یک
            تصمیم قیمتی. زیرِ توضیحات می‌نشیند تا آخرین چیزی باشد که در این کارت
            تعیین می‌شود. */}
          <Flex
            align="center"
            gap="2.5"
            p="11px"
            rounded="xl"
            borderWidth="1px"
            borderColor={form.showInStorefront ? 'brand.muted' : 'border.muted'}
            bg={form.showInStorefront ? 'brand.bg' : 'bg.subtle'}
            transition="background .18s, border-color .18s"
          >
            {/* FIRST = rightmost: آیکن ← عنوان و توضیح … سوییچ (چپ‌ترین) */}
            <Box color={form.showInStorefront ? 'brand.fg' : 'fg.muted'} flexShrink={0} display="flex">
              <Eye size={17} />
            </Box>
            <Box flex="1" minW="0">
              <chakra.label
                htmlFor="show-in-storefront"
                display="block"
                fontSize="sm"
                fontWeight="medium"
                color="fg"
                textAlign="start"
                cursor="pointer"
              >
                نمایش در ویترین
              </chakra.label>
              <Text fontSize="xs" color="fg.muted" textAlign="start" lineHeight="1.9">
                {form.showInStorefront
                  ? 'در فهرست و جست‌وجوی فروشگاه دیده می‌شود.'
                  : 'فعلاً پنهان است؛ اطلاعاتش حفظ می‌شود و هر وقت خواستید روشنش کنید.'}
              </Text>
            </Box>
            <Switch.Root
              id="show-in-storefront"
              size="sm"
              colorPalette="brand"
              checked={form.showInStorefront}
              onCheckedChange={(e) => onChange({ showInStorefront: e.checked })}
              flexShrink={0}
            >
              <Switch.HiddenInput />
              <Switch.Control><Switch.Thumb /></Switch.Control>
            </Switch.Root>
          </Flex>
        </Flex>

          {/* LAST = leftmost: تصویر اصلی */}
          <MainImageField
            gallery={form.gallery}
            onSelect={(src) =>
              onChange({
                gallery: form.gallery.map((img) => ({ ...img, featured: img.src === src })),
              })}
          />
        </Grid>
      </SectionCard>

      {/* ═══ قیمت گذاری ═════════════════════════════════════════════════════════ */}
      <SectionCard
        title="قیمت‌گذاری"
        subtitle="قیمت، تخفیف و اینکه اصلاً قیمت به خریدار نشان داده شود یا نه"
        helpTopic="قیمت‌گذاری"
        actions={
          /* سگمنت واحد در سرتیتر — در طرح انتخاب واحد اینجاست، نه داخل خود فیلد.
             این‌طور واحد یک تصمیمِ سطحِ بخش دیده می‌شود، نه یک addon گمِ کنار عدد. */
          !isGold ? (
            <Flex gap="1" bg="bg.subtle" rounded="l2" p="1" flexShrink={0}>
              {CURRENCY_UNITS.map((u) => (
                <chakra.button
                  key={u.value}
                  type="button"
                  aria-pressed={form.currency === u.value}
                  onClick={() => onChange({ currency: u.value })}
                  px="3"
                  h="7"
                  rounded="l1"
                  fontSize="xs"
                  fontWeight={form.currency === u.value ? 'semibold' : 'normal'}
                  bg={form.currency === u.value ? 'bg.panel' : 'transparent'}
                  color={form.currency === u.value ? 'brand.fg' : 'fg.muted'}
                  boxShadow={form.currency === u.value ? 'xs' : 'none'}
                  {...pressable}
                >
                  {u.label}
                </chakra.button>
              ))}
            </Flex>
          ) : undefined
        }
      >
        <Flex direction="column" gap="4">

          {/* کارت اطلاعات اختصاصی طلا — فقط دستهٔ طلا */}
          {isGold && <GoldInfoCard form={form} onChange={onChange} />}

          {/*
            کادر قیمت — سه تصمیم، به ترتیبی که واقعاً گرفته می‌شوند:
              ۱. اصلاً قیمت نشان داده شود؟  → «فروش تلفنی» بالای کادر
              ۲. قیمت چند است؟               → «قیمت اصلی»
              ۳. تخفیف دارد؟                 → دکمهٔ تخفیف و خلاصه‌اش

            سه باکسِ جداگانهٔ «وضعیت نمایش و فروش» حذف شد: «نمایش در ویترین» به
            کارت اطلاعات اصلی رفت، «فروش تلفنی» به همین‌جا، و «پیشنهاد ویژه» در
            تاریخِ پایانِ تخفیف حل شد — چون در عمل همان بود و سه‌جا تکرار می‌شد.
          */}
          <Box bg="bg.subtle" borderWidth="1px" borderColor="border.muted" rounded="xl" p="11px">

            {/* ۱. فروش تلفنی — بالاترین تصمیم، چون بقیه را غیرفعال می‌کند */}
            <Flex
              align="center"
              gap="2.5"
              px="2.5"
              py="2"
              rounded="lg"
              borderWidth="1px"
              borderColor={form.phoneSale ? 'orange.muted' : 'border.muted'}
              bg={form.phoneSale ? 'orange.bg' : 'bg.panel'}
              transition="background .18s, border-color .18s"
              mb="2.5"
            >
              {/* FIRST = rightmost: آیکن ← عنوان و توضیح … سوییچ (چپ‌ترین) */}
              <Box color={form.phoneSale ? 'orange.fg' : 'fg.muted'} flexShrink={0} display="flex">
                <Phone size={16} />
              </Box>
              <Box flex="1" minW="0">
                <chakra.label
                  htmlFor="phone-sale"
                  display="block"
                  fontSize="sm"
                  fontWeight="medium"
                  color="fg"
                  textAlign="start"
                  cursor="pointer"
                >
                  فروش تلفنی
                </chakra.label>
                <Text fontSize="xs" color="fg.muted" textAlign="start" lineHeight="1.9">
                  {form.phoneSale
                    ? 'خریدار هیچ قیمتی نمی‌بیند؛ به‌جای دکمهٔ خرید، دکمهٔ «تماس» نشان داده می‌شود.'
                    : 'با روشن‌کردن، قیمت از ویترین پنهان و دکمهٔ خرید به «تماس» تبدیل می‌شود.'}
                </Text>
              </Box>
              <Switch.Root
                id="phone-sale"
                size="sm"
                colorPalette="orange"
                checked={form.phoneSale}
                onCheckedChange={(e) => onChange({ phoneSale: e.checked })}
                flexShrink={0}
              >
                <Switch.HiddenInput />
                <Switch.Control><Switch.Thumb /></Switch.Control>
              </Switch.Root>
            </Flex>

            {/* ۲ و ۳. قیمت اصلی + تخفیف */}
            <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }} gap="2.5" alignItems="start">
              <NotchedField
                label={isGold ? 'قیمت نهایی' : 'قیمت اصلی'}
                required
                dataField="price"
                hint={priceHelp}
                disabled={priceLocked}
                endElement={<Text fontSize="xs" color="fg.muted">{priceUnit}</Text>}
              >
                {/* بدون کلید +/− — بند ۳ بازخورد: قیمت هرگز کلید بالا/پایین ندارد */}
                <NumberField
                  placeholder={isGold ? 'قیمت نهایی' : 'قیمت اصلی'}
                  value={isGold ? (goldHasValue ? String(goldFinal) : '') : form.price}
                  onChange={isGold ? () => {} : (v) => onChange({ price: v })}
                  disabled={priceLocked}
                  inputProps={bareControl}
                />
              </NotchedField>

              {/* تخفیف: تا وقتی نیست فقط یک دکمه است؛ با ثبت، خلاصه‌اش می‌آید */}
              <Box data-field="salePrice">
                {hasDiscount ? (
                  <Flex
                    direction="column"
                    gap="1.5"
                    px="2.5"
                    py="2"
                    rounded="lg"
                    borderWidth="1px"
                    borderColor={form.salePriceUntil ? 'orange.muted' : 'brand.muted'}
                    bg={form.salePriceUntil ? 'orange.bg' : 'brand.bg'}
                    {...enterItem}
                  >
                    <Flex align="center" gap="2">
                      {/* FIRST = rightmost: مقدار تخفیف … ویرایش (چپ‌ترین) */}
                      <Text fontSize="xs" fontWeight="bold" color="fg" flex="1" textAlign="start">
                        {form.discountType === 'percent'
                          ? `${toPersianDigits(form.discountValue)}٪ تخفیف`
                          : `${toPersianDigits(formatThousands(Number(form.discountValue) || 0))} ${priceUnit} تخفیف`}
                      </Text>
                      <Button
                        size="2xs"
                        variant="ghost"
                        colorPalette="brand"
                        rounded="l2"
                        onClick={() => setDiscountOpen(true)}
                        disabled={priceLocked}
                        {...pressable}
                      >
                        ویرایش
                      </Button>
                    </Flex>
                    <Text fontSize="sm" fontWeight="bold" color="brand.fg" textAlign="start">
                      {saleDisplay} {priceUnit}
                    </Text>
                    <Flex align="center" gap="1.5">
                      {/* FIRST = rightmost: آیکن */}
                      <Box color={form.salePriceUntil ? 'orange.fg' : 'fg.muted'} flexShrink={0} display="flex">
                        <Sparkles size={12} />
                      </Box>
                      <Text fontSize="2xs" color="fg.muted" textAlign="start" lineHeight="1.8">
                        {form.salePriceUntil
                          ? `در «پیشنهادهای شگفت‌انگیز» تا ${formatJalaliDate(new Date(form.salePriceUntil))}`
                          : 'بدون تاریخ پایان — در پیشنهادهای شگفت‌انگیز دیده نمی‌شود'}
                      </Text>
                    </Flex>
                  </Flex>
                ) : (
                  <Button
                    variant="outline"
                    w="full"
                    h="11"
                    rounded="lg"
                    bg="bg.panel"
                    gap="1.5"
                    fontSize="13px"
                    disabled={priceLocked || !form.price.trim()}
                    onClick={() => setDiscountOpen(true)}
                    {...pressable}
                  >
                    {/* FIRST = rightmost: آیکن (leading) */}
                    <Tag size={14} />
                    افزودن تخفیف
                  </Button>
                )}
              </Box>
            </Grid>

            {form.phoneSale && (
              <Text fontSize="2xs" color="orange.fg" textAlign="start" mt="2" lineHeight="1.9">
                با فعال‌بودن فروش تلفنی، قیمت و تخفیف ثبت می‌مانند ولی در فروشگاه نمایش داده نمی‌شوند.
              </Text>
            )}
          </Box>

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

        </Flex>
      </SectionCard>

      {/* ═══ دیالوگ تخفیف ═══════════════════════════════════════════════════════
          درصد/مبلغ + قیمت محاسبه‌شده + تاریخ پایان، همه در یک جا. */}
      <DiscountDialog
        open={discountOpen}
        onClose={() => setDiscountOpen(false)}
        basePrice={form.price}
        unit={priceUnit}
        current={{ type: form.discountType, value: form.discountValue, until: form.salePriceUntil }}
        onConfirm={({ type, value, until }) => {
          const final = finalPriceOf(form.price, type, value)
          onChange({
            discountType: type,
            discountValue: value,
            salePrice: final === null ? '' : String(final),
            salePriceUntil: until,
            hasDiscount: final !== null,
            // «پیشنهاد شگفت‌انگیز» دیگر یک کلید جدا نیست: داشتن تاریخ پایان
            // همان چیزی است که محصول را در آن بخش می‌نشاند.
            specialOffer: Boolean(until),
            specialOfferUntil: until,
          })
        }}
        onRemove={() => onChange({
          discountValue: '',
          salePrice: '',
          salePriceUntil: '',
          hasDiscount: false,
          specialOffer: false,
          specialOfferUntil: '',
        })}
      />

      <ButtonFooter
        primary={{ label: 'ذخیره و ادامه', onClick: onSave }}
      />

    </Flex>
  )
}
