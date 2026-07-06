import { useMemo, useRef, useState } from 'react'
import {
  Box, Flex, Text, Badge, Field, IconButton, Separator, Collapsible,
  Combobox, createListCollection, Portal,
} from '@chakra-ui/react'
import { ChevronDown, ChevronUp, Trash2, Check, X } from 'lucide-react'
import { toPersianDigits } from '@/utils/numbers'
import { VARIANT_GROUPS, type ProductVariant } from './data'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface VariantAccordionProps {
  variant: ProductVariant
  /** برای برچسب «تنوع ۱ / تنوع ۲» (ordinal ثابت — نه عنوان کاربر) */
  index: number
  /** عنوان سایر تنوع‌ها — برای جلوگیری از عنوان تکراری و حذف آن از پیشنهادها */
  otherTitles: string[]
  onChange: (patch: Partial<ProductVariant>) => void
  onToggleOpen: () => void
  onRemove: () => void
}

// ─── SuggestCombobox — عنوان/مقدار: open on click + پیشنهاد پیش‌فرض + متن آزاد ──
// Component Resolution: DS second — Chakra `Combobox` (openOnClick + allowCustomValue).
// inputValue را کنترل‌شده (`inputValue` prop) نگه نمی‌داریم — با `allowCustomValue`
// ترکیب inputValue کنترل‌شده گاهی رویداد تایپ را گم می‌کرد. uncontrolled
// (`defaultInputValue`) + خواندن مستقیم از DOM (ref) در لحظهٔ ثبت، منبع اعتماد است.

function SuggestCombobox({
  placeholder, defaultValue, onValueChange, suggestions, onKeyDown, inputRef, invalid,
}: {
  placeholder: string
  defaultValue: string
  onValueChange: (v: string) => void
  suggestions: string[]
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  inputRef?: React.Ref<HTMLInputElement>
  invalid?: boolean
}) {
  const collection = useMemo(
    () => createListCollection({ items: suggestions.map((s) => ({ value: s, label: s })) }),
    [suggestions],
  )

  return (
    <Combobox.Root
      collection={collection}
      defaultInputValue={defaultValue}
      onInputValueChange={(e) => onValueChange(e.inputValue)}
      openOnClick
      allowCustomValue
      selectionBehavior="replace"
      invalid={invalid}
      width="full"
    >
      <Combobox.Control>
        <Combobox.Input ref={inputRef} placeholder={placeholder} bg="bg.panel" onKeyDown={onKeyDown} />
        <Combobox.IndicatorGroup>
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content dir="rtl">
            {collection.items.map((item) => (
              <Combobox.Item key={item.value} item={item}>
                <Combobox.ItemText>{item.label}</Combobox.ItemText>
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
            <Combobox.Empty>موردی یافت نشد</Combobox.Empty>
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * VariantAccordion — یک گروه تنوع (عنوان + مقادیر badge) با آکاردیون باز/بسته.
 *
 * نکتهٔ کلیدی از Figma (تأییدشده با screenshot، نه حدس): برچسب هدر آکاردیون
 * همیشه «تنوع ۱»/«تنوع ۲» (ordinal ثابت) است — نه مقدار عنوانِ واردشدهٔ کاربر.
 *
 * RTL DOM order (تأییدشده با x-coordinate + screenshot، نه کپی verbatim از Figma):
 *   Header: [عنوان+badge — راست] ... [chevron — چپ]
 *   Fields: [عنوان — راست] [مقدار] [✓ افزودن] [🗑 حذف تنوع — چپ]
 *   Values: ترتیب درج = ترتیب DOM (اولین مقدار افزوده‌شده = راست‌ترین، جدیدترین = چپ‌ترین)
 *
 * Figma: New Product / Variants — Variant-Accordion (node 1720:30952)
 */
export function VariantAccordion({ variant, index, otherTitles, onChange, onToggleOpen, onRemove }: VariantAccordionProps) {
  // مقدار موقتِ «مقدار» فقط برای remount-reset لازم است؛ خواندن مقدارِ لحظهٔ ثبت
  // مستقیماً از DOM (ref) انجام می‌شود، نه از این state (تا با هیچ تایمینگی رویداد گم نشود).
  const [resetKey, setResetKey] = useState(0)
  const valueInputRef = useRef<HTMLInputElement>(null)

  const isDuplicateTitle = variant.title.trim() !== '' && otherTitles.includes(variant.title.trim())
  // عنوان‌های پیش‌فرض سیستم که در تنوع‌های دیگر قبلاً انتخاب شده‌اند، پیشنهاد نمی‌شوند
  const titleSuggestions = useMemo(
    () => VARIANT_GROUPS.map((g) => g.label).filter((label) => !otherTitles.includes(label)),
    [otherTitles],
  )
  const valueSuggestions = useMemo(
    () => (VARIANT_GROUPS.find((g) => g.label === variant.title)?.options ?? []).map((o) => o.label),
    [variant.title],
  )

  const addValue = (raw?: string) => {
    const label = (raw ?? valueInputRef.current?.value ?? '').trim()
    setResetKey((k) => k + 1)
    if (!label || variant.values.some((v) => v.label === label)) return
    onChange({ values: [...variant.values, { id: `value_${variant.id}_${Date.now()}`, label }] })
  }

  const removeValue = (id: string) => onChange({ values: variant.values.filter((v) => v.id !== id) })

  return (
    <Box bg="bg.subtle" borderWidth="1px" borderColor="border" rounded="lg" p="4">

      {/* Header — FIRST=راست: عنوان+badge+subtitle · LAST=چپ: chevron */}
      <Flex
        as="button"
        onClick={onToggleOpen}
        align="center"
        justify="space-between"
        w="full"
        cursor="pointer"
      >
        <Flex direction="column" align="flex-start" gap="0.5" flex="1" minW="0">
          <Flex align="center" gap="4">
            <Text fontSize="sm" fontWeight="semibold" color="fg" whiteSpace="nowrap">
              تنوع {toPersianDigits(index + 1)}
            </Text>
            {variant.values.length > 0 && (
              <Badge colorPalette="purple" variant="subtle" size="sm" rounded="l2">
                {toPersianDigits(variant.values.length)} آیتم
              </Badge>
            )}
          </Flex>
          <Text fontSize="xs" color="fg.muted" textAlign="right" w="full">
            عنوان و مقدار را از لیست پیشنهادی انتخاب و یا دستی وارد نمایید
          </Text>
        </Flex>
        {variant.open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </Flex>

      <Collapsible.Root open={variant.open} unmountOnExit>
        <Collapsible.Content>
          <Flex direction="column" gap="4" pt="4">
            <Separator />

            {/*
              Fields — دسکتاپ (sm+): ردیف افقی [عنوان راست · مقدار · دکمه‌ها چپ‌ترین]، vertical-align top
              موبایل (<sm): عنوان/مقدار ستونی و full-width؛ دکمه‌ها ردیف جدا زیر فیلدها، چپ‌چین
            */}
            <Flex direction={{ base: 'column', sm: 'row' }} gap="4" align={{ base: 'stretch', sm: 'flex-start' }} justify="flex-start" w="full">
              <Field.Root flex="1" w={{ base: 'full', sm: 'auto' }} invalid={isDuplicateTitle}>
                <Field.Label fontSize="sm" fontWeight="semibold">عنوان</Field.Label>
                <SuggestCombobox
                  placeholder="مثال: رنگ"
                  defaultValue={variant.title}
                  onValueChange={(v) => onChange({ title: v })}
                  suggestions={titleSuggestions}
                  invalid={isDuplicateTitle}
                />
                {isDuplicateTitle && (
                  <Field.ErrorText fontSize="xs">عنوان تنوع تکراری می باشد</Field.ErrorText>
                )}
              </Field.Root>
              <Field.Root flex="1" w={{ base: 'full', sm: 'auto' }}>
                <Field.Label fontSize="sm" fontWeight="semibold">مقدار</Field.Label>
                <SuggestCombobox
                  key={resetKey}
                  inputRef={valueInputRef}
                  placeholder="مقدار"
                  defaultValue=""
                  onValueChange={() => {}}
                  suggestions={valueSuggestions}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addValue(e.currentTarget.value) } }}
                />
              </Field.Root>
              {/* دکمه‌ها — sm+: کنار فیلدها (چپ‌ترین) · موبایل: ردیف جدا زیر فیلدها، چپ‌چین */}
              <Flex gap="4" justify={{ base: 'flex-end', sm: 'flex-start' }} w={{ base: 'full', sm: 'auto' }} flexShrink={0}>
                {/* برچسب مخفی هم‌ارتفاعِ Field.Label — فقط sm+ لازم است تا دکمه با ردیف input هم‌تراز شود */}
                <Flex direction="column" gap="1.5">
                  <Text fontSize="sm" fontWeight="semibold" visibility="hidden" aria-hidden display={{ base: 'none', sm: 'block' }}>‌</Text>
                  <IconButton
                    aria-label="افزودن مقدار"
                    bg="brand.subtle"
                    color="brand.fg"
                    _hover={{ bg: 'brand.muted' }}
                    onClick={() => addValue()}
                  >
                    <Check size={20} />
                  </IconButton>
                </Flex>
                <Flex direction="column" gap="1.5">
                  <Text fontSize="sm" fontWeight="semibold" visibility="hidden" aria-hidden display={{ base: 'none', sm: 'block' }}>‌</Text>
                  <IconButton
                    aria-label="حذف تنوع"
                    bg="red.subtle"
                    color="red.fg"
                    _hover={{ bg: 'red.muted' }}
                    onClick={onRemove}
                  >
                    <Trash2 size={20} />
                  </IconButton>
                </Flex>
              </Flex>
            </Flex>

            {/* Values — راست‌چین (RTL) · ترتیب درج = ترتیب DOM (بدون reverse) */}
            {variant.values.length > 0 && (
              <Flex gap="2" wrap="wrap" justify="flex-start" w="full">
                {variant.values.map((v) => (
                  <Badge key={v.id} colorPalette="gray" variant="subtle" size="md" rounded="l2" gap="1.5">
                    {v.label}
                    <Box
                      as="button"
                      onClick={() => removeValue(v.id)}
                      display="flex"
                      aria-label={`حذف ${v.label}`}
                    >
                      <X size={14} />
                    </Box>
                  </Badge>
                ))}
              </Flex>
            )}
          </Flex>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  )
}
