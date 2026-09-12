import {
  Box, Flex, Grid, Text, Input, InputGroup, NativeSelect,
  Select, Switch, Badge, Alert, IconButton, Button, Field, TagsInput,
  Collapsible, createListCollection, Portal,
} from '@chakra-ui/react'
import { Plus, Trash2, DollarSign } from 'lucide-react'
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
  type ProductForm, type Attribute,
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

let _aid = 0
const newAttr = (): Attribute => ({ id: `attr_${++_aid}`, name: '', value: '' })

// ─── Component ─────────────────────────────────────────────────────────────────

export function InfoTab({ form, onChange, onBack, onSave }: InfoTabProps) {
  const isCompact = useCompactMode()
  const twoCol = isCompact ? '1fr' : { base: '1fr', md: '1fr 1fr' }

  // ─── Attributes ─────────────────────────────────────────────────────────────
  const addAttr = () => onChange({ attributes: [...form.attributes, newAttr()] })
  const removeAttr = (id: string) =>
    onChange({ attributes: form.attributes.filter((a) => a.id !== id) })
  const patchAttr = (id: string, patch: Partial<Attribute>) =>
    onChange({ attributes: form.attributes.map((a) => (a.id === id ? { ...a, ...patch } : a)) })

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
  const inventoryLocked = form.hasVariants
  const inventoryNum = Number(toLatinDigits(form.inventory).replace(/[^\d]/g, ''))
  // alert «موجودی صفر» فقط وقتی: نه تنوع، نه نامحدود، و موجودی خالی/صفر باشد
  const showZeroInventoryAlert =
    !inventoryLocked && !form.unlimitedInventory && (form.inventory.trim() === '' || inventoryNum === 0)

  return (
    <Flex direction="column" gap="10" w="full">

      {/* ═══ اطلاعات پایه ═══════════════════════════════════════════════════════ */}
      <Box>
        <TitleBar title="اطلاعات پایه" subtitle="اطلاعات پایه و اصلی محصول را وارد نمایید." size="xl" divider />
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

          {/* شناسه کالا — auto badge + قابل ویرایش */}
          <Field.Root>
            <Field.Label fontSize="sm" fontWeight="semibold">شناسه کالا</Field.Label>
            <InputGroup
              startElement={
                <Badge colorPalette="gray" variant="subtle" size="xs" rounded="l2">auto</Badge>
              }
              startElementProps={{ pointerEvents: 'none' }}
            >
              <Input
                placeholder="مثال: SKU-1234"
                value={form.sku}
                onChange={(e) => onChange({ sku: e.target.value })}
                dir="ltr"
                disabled
              />
            </InputGroup>
            <Field.HelperText>بصورت خودکار تولید می‌شود، قابل ویرایش است</Field.HelperText>
          </Field.Root>

          {/* وزن */}
          <Field.Root>
            <Field.Label fontSize="sm" fontWeight="semibold">وزن</Field.Label>
            <NumberField
              placeholder="۰"
              value={form.weight}
              onChange={(v) => onChange({ weight: v })}
              allowDecimals
              showSteppers
            />
            <Field.HelperText>برای محاسبه هزینه ارسال استفاده می‌شود</Field.HelperText>
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

      {/* ═══ موجودی ═════════════════════════════════════════════════════════════ */}
      <Box>
        <TitleBar title="موجودی" subtitle="تعداد موجودی انبار را مشخص کنید." size="xl" divider />
        <Flex direction="column" gap="4" pt="4">

          {/* Alert تنوع — بالای فیلد، فقط وقتی محصول تنوع دارد */}
          {inventoryLocked && (
            <Alert.Root status="info" variant="subtle">
              <Alert.Indicator />
              <Alert.Content>
                <Text fontSize="xs">موجودی کل برابر مجموع موجودی تنوع‌های فعال محاسبه می‌شود.</Text>
              </Alert.Content>
            </Alert.Root>
          )}

          <Flex gap="4" align={isCompact ? 'stretch' : { base: 'stretch', sm: 'end' }} direction={isCompact ? 'column' : { base: 'column', sm: 'row' }}>
            <Field.Root required flex={isCompact ? '1' : { base: 'none', sm: '1' }} w={isCompact ? undefined : { base: 'full', sm: 'auto' }}>
              <Field.Label fontSize="sm" fontWeight="semibold">
                موجودی<Field.RequiredIndicator />
              </Field.Label>
              <NumberField
                placeholder="۰"
                value={form.inventory}
                onChange={(v) => onChange({ inventory: v })}
                disabled={form.unlimitedInventory || inventoryLocked}
                showSteppers
              />
            </Field.Root>

            {/* موجودی نامحدود — Switch FIRST=راست، Text چپ */}
            <Flex align="center" gap="2.5" pb={isCompact ? '0' : { base: '0', sm: '1.5' }} flexShrink={0}>
              <Switch.Root
                colorPalette="brand"
                checked={form.unlimitedInventory}
                onCheckedChange={(e) => onChange({ unlimitedInventory: e.checked })}
                disabled={inventoryLocked}
              >
                <Switch.HiddenInput />
                <Switch.Control><Switch.Thumb /></Switch.Control>
              </Switch.Root>
              <Text fontSize="sm" color="fg" whiteSpace="nowrap">موجودی نامحدود (محدودیت تعداد ندارد)</Text>
            </Flex>
          </Flex>

          {/* Alert هشدار موجودی صفر — فقط وقتی موجودی صفر/خالی است */}
          {showZeroInventoryAlert && (
            <Alert.Root status="warning" variant="subtle">
              <Alert.Indicator />
              <Alert.Content>
                <Text fontSize="xs">
                  موجودی صفر — محصول به انتهای ویترین منتقل شده و برچسب «ناموجود» می‌گیرد.
                </Text>
              </Alert.Content>
            </Alert.Root>
          )}

        </Flex>
      </Box>

      {/* ═══ ویژگی های محصول ════════════════════════════════════════════════════ */}
      <Box>
        <TitleBar
          title="ویژگی های محصول"
          subtitle="ویژگی‌های اختصاصی این محصول را وارد کنید. (حداکثر ۲۰ کاراکتر)"
          size="xl"
          divider
          cta={
            <Button
              size="sm"
              variant="outline"
              colorPalette="brand"
              onClick={addAttr}
              disabled={!form.category}
            >
              <Plus size={16} />افزودن ویژگی
            </Button>
          }
        />
        <Box pt="4">
          {form.attributes.length === 0 ? (
            <Alert.Root status="info" variant="subtle">
              <Alert.Indicator />
              <Alert.Content>
                <Text fontSize="xs">
                  ابتدا دسته‌بندی محصول را انتخاب کنید تا ویژگی‌های پیش‌فرض بارگذاری شوند.
                </Text>
              </Alert.Content>
            </Alert.Root>
          ) : (
            <Flex direction="column" gap="3">
              {form.attributes.map((attr, idx) => (
                /* RTL DOM order: نام ویژگی FIRST=راست · مقدار · حذف LAST=چپ
                   label فقط روی ردیف اول؛ alignItems=end تا دکمه حذف هم‌تراز input بماند */
                <Grid key={attr.id} templateColumns="1fr 1fr auto" gap="3" alignItems="end">
                  <Field.Root>
                    {idx === 0 && (
                      <Field.Label fontSize="sm" fontWeight="semibold">نام ویژگی</Field.Label>
                    )}
                    <Input
                      placeholder="نام ویژگی"
                      value={attr.name}
                      maxLength={20}
                      onChange={(e) => patchAttr(attr.id, { name: e.target.value })}
                    />
                  </Field.Root>
                  <Field.Root>
                    {idx === 0 && (
                      <Field.Label fontSize="sm" fontWeight="semibold">مقدار</Field.Label>
                    )}
                    <Input
                      placeholder="مقدار"
                      value={attr.value}
                      maxLength={20}
                      onChange={(e) => patchAttr(attr.id, { value: e.target.value })}
                    />
                  </Field.Root>
                  <IconButton
                    aria-label="حذف ویژگی"
                    variant="outline"
                    colorPalette="red"
                    size="md"
                    onClick={() => removeAttr(attr.id)}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </Grid>
              ))}
            </Flex>
          )}
        </Box>
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
        primary={{ label: 'ذخیره', onClick: onSave }}
        back={{ label: 'بازگشت', onClick: onBack }}
      />

    </Flex>
  )
}
