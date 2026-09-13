import {
  Box, Flex, Grid, Text, Input, NativeSelect, chakra,
  Select, Switch, Alert, TagsInput,
  Collapsible, createListCollection, Portal,
} from '@chakra-ui/react'
import { DollarSign, Eye, CalendarClock, Phone } from 'lucide-react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { ButtonFooter } from '@/components/ui/ButtonFooter'
import { RichTextEditor } from '@/components/ui/RichTextEditor'
import { NumberField } from '@/components/ui/NumberField'
import { GoldInfoCard } from './GoldInfoCard'
import { SectionCard } from './SectionCard'
import { NotchedField, bareControl } from './NotchedField'
import { ToggleCard } from './ToggleCard'
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
    <Flex direction="column" gap="5" w="full">

      {/* ═══ اطلاعات اصلی ══════════════════════════════════════════════════════ */}
      <SectionCard
        title="اطلاعات اصلی"
        subtitle="این اطلاعات در صفحه محصول نمایش داده می‌شود"
        helpTopic="اطلاعات اصلی محصول"
      >
        <Flex direction="column" gap="4">
          {/* FIRST = rightmost: نام محصول · سپس دسته‌بندی */}
          <Grid templateColumns={twoCol} gap="4">
            <NotchedField label="نام محصول" required>
              <Input
                {...bareControl}
                placeholder="نام محصول"
                value={form.name}
                onChange={(e) => onChange({ name: e.target.value })}
              />
            </NotchedField>

            <NotchedField label="دسته‌بندی" required>
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
        </Flex>
      </SectionCard>

      {/* ═══ قیمت گذاری ═════════════════════════════════════════════════════════ */}
      <SectionCard
        title="قیمت‌گذاری"
        subtitle="قیمت را با تومان یا دلار تعیین کنید؛ در حالت دلار، مبلغ تومانی به‌صورت زنده محاسبه می‌شود"
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

          {/* قیمت اصلی/نهایی + واحد + تخفیف دارد */}
          <Flex gap="4" align={isCompact ? 'stretch' : { base: 'stretch', sm: 'end' }} direction={isCompact ? 'column' : { base: 'column', sm: 'row' }}>
            <Box flex={isCompact ? '1' : { base: 'none', sm: '1' }} w={isCompact ? undefined : { base: 'full', sm: 'auto' }} minW="0">
              <NotchedField
                label={isGold ? 'قیمت نهایی' : 'قیمت اصلی'}
                required
                hint={priceHelp}
                disabled={isGold || form.phoneSale || form.hasVariants}
                endElement={<Text fontSize="xs" color="fg.muted">{priceUnit}</Text>}
              >
                <NumberField
                  placeholder={isGold ? 'قیمت نهایی' : 'قیمت اصلی'}
                  value={isGold ? (goldHasValue ? String(goldFinal) : '') : form.price}
                  onChange={isGold ? () => {} : (v) => onChange({ price: v })}
                  disabled={isGold || form.phoneSale || form.hasVariants}
                  inputProps={bareControl}
                />
              </NotchedField>
            </Box>

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
                  <Box flex="1" w={isCompact ? undefined : { base: 'full', sm: 'auto' }} minW="0">
                    <NotchedField
                      label="تخفیف"
                      required
                      endElement={
                        <UnitSelect
                          value={form.discountType}
                          onChange={(v) => onChange({ discountType: v })}
                          options={DISCOUNT_TYPES}
                        />
                      }
                    >
                      <NumberField
                        placeholder="مقدار تخفیف را وارد کنید"
                        value={form.discountValue}
                        onChange={(v) => onChange({ discountValue: v })}
                        inputProps={bareControl}
                      />
                    </NotchedField>
                  </Box>

                  {/* قیمت بعد از تخفیف — SECOND = چپ · محاسبه‌شده (read-only) */}
                  <Box flex="1" w={isCompact ? undefined : { base: 'full', sm: 'auto' }} minW="0">
                    <NotchedField
                      label="قیمت بعد از تخفیف"
                      disabled
                      endElement={<Text fontSize="xs" color="fg.muted">{priceUnit}</Text>}
                    >
                      <Input
                        {...bareControl}
                        placeholder="قیمت بعد از تخفیف"
                        value={finalPriceDisplay}
                        disabled
                      />
                    </NotchedField>
                  </Box>

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

        </Flex>
      </SectionCard>

      {/* ═══ وضعیت نمایش و فروش ═════════════════════════════════════════════════ */}
      <SectionCard
        title="وضعیت نمایش و فروش"
        subtitle="تنظیمات رایج محصول در فروشگاه"
        helpTopic="وضعیت نمایش و فروش"
      >
        <Flex direction="column" gap="4">
          {/* FIRST = rightmost: نمایش در ویترین ← پیشنهاد ویژه ← فروش تلفنی */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="3">
            <ToggleCard
              icon={<Eye size={17} />}
              label="نمایش در ویترین"
              hint="در فهرست و جستجوی فروشگاه دیده شود"
              checked={form.showInStorefront}
              onChange={(v) => onChange({ showInStorefront: v })}
            />
            <ToggleCard
              icon={<CalendarClock size={17} />}
              label="پیشنهاد ویژه"
              hint="در بخش پیشنهادهای ویژه نمایش داده شود"
              checked={form.specialOffer}
              onChange={(v) => onChange({ specialOffer: v })}
              accent
            />
            <ToggleCard
              icon={<Phone size={17} />}
              label="فروش تلفنی"
              hint="با فعال‌سازی، قیمت از ویترین پنهان و دکمهٔ خرید به «تماس» تبدیل می‌شود"
              checked={form.phoneSale}
              onChange={(v) => onChange({ phoneSale: v })}
            />
          </Grid>

          {/* Alert اطلاع‌رسانی فروش تلفنی — فقط وقتی روشن است */}
          {form.phoneSale && (
            <Alert.Root status="info" variant="subtle">
              <Alert.Indicator />
              <Alert.Content gap="1">
                <Text fontSize="xs">• با فعال کردن این گزینه قیمت اصلی غیرفعال می‌شود.</Text>
                <Text fontSize="xs">• این آیتم برای هر تنوع میتواند بصورت جداگانه فعال شود.</Text>
                <Text fontSize="xs">• در صورت فعال شدن برای هر تنوع، گزینه فروش تلفنی در این صفحه باید غیرفعال شود.</Text>
              </Alert.Content>
            </Alert.Root>
          )}
        </Flex>
      </SectionCard>

      {/* ═══ برچسب ها ═══════════════════════════════════════════════════════════ */}
      <SectionCard
        title="برچسب‌های محصول"
        subtitle="کلمات یا عبارات کوتاهی که به معرفی بهتر کالا کمک می‌کنند"
        helpTopic="برچسب‌های محصول"
      >
        <Box>
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
      </SectionCard>

      {/* ═══ Footer ═════════════════════════════════════════════════════════════ */}
      <ButtonFooter
        primary={{ label: 'ذخیره و ادامه', onClick: onSave }}
        back={{ label: 'بازگشت به لیست', onClick: onBack }}
      />

    </Flex>
  )
}
