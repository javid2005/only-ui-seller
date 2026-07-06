import { Box, Flex, Text, Badge, Field, Switch } from '@chakra-ui/react'
import { NumberField } from '@/components/ui/NumberField'
import { UnitSelect } from './InfoTab'
import { DISCOUNT_TYPES, type VariantCombination } from './data'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface VariantCombinationCardProps {
  combo: VariantCombination
  onChange: (patch: Partial<VariantCombination>) => void
}

// ─── Toggle row — الگوی پروژه: Switch FIRST=راست، Text LAST=چپ ──────────────────

function ToggleRow({
  label, checked, onChange, disabled,
}: { label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <Flex align="center" gap="2.5" flexShrink={0}>
      <Switch.Root
        size="sm"
        colorPalette="brand"
        checked={checked}
        onCheckedChange={(e) => onChange(e.checked)}
        disabled={disabled}
      >
        <Switch.HiddenInput />
        <Switch.Control><Switch.Thumb /></Switch.Control>
      </Switch.Root>
      <Text fontSize="xs" color="fg" whiteSpace="nowrap">{label}</Text>
    </Flex>
  )
}

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * VariantCombinationCard — یک ردیف ماتریس ترکیب تنوع‌ها (قیمت/موجودی/تخفیف هر ترکیب).
 *
 * DOM order تأییدشده با screenshot مستقیم از Figma (نه کپی verbatim):
 *   Header: [SKU + badgeهای مقدار — راست] ... [تخفیف‌دارد, موجودی‌نامحدود, فروش‌تلفنی, فعال — چپ]
 *   Fields (بدون تخفیف): [موجودی — راست] [قیمت — چپ]
 *   Fields (با تخفیف):   [موجودی] [قیمت] [تخفیف] [قیمت بعد از تخفیف — چپ‌ترین]
 *
 * Figma: New Product / Variants — ماتریس ترکیب‌ها cards (نمونه node 1194:16240 و ...)
 */
export function VariantCombinationCard({ combo, onChange }: VariantCombinationCardProps) {
  const { active } = combo
  const priceDisabled = !active || combo.phoneSale
  const inventoryDisabled = !active || combo.unlimitedInventory
  const fieldsDisabled = !active

  const priceNum = Number(combo.price.replace(/[^\d.]/g, '')) || 0
  const discountNum = Number(combo.discountValue.replace(/[^\d.]/g, '')) || 0
  const priceAfterDiscount =
    combo.price && combo.discountValue
      ? Math.max(0, Math.round(
          combo.discountType === 'percent' ? priceNum - (priceNum * discountNum) / 100 : priceNum - discountNum,
        ))
      : null

  // badges: SKU راست‌ترین، بعد مقدارهای تنوع (معکوسِ ترتیب تنوع۱/تنوع۲ — تأییدشده با screenshot)
  const orderedValues = [...combo.values].reverse()

  return (
    <Box
      borderWidth="1px"
      borderColor={active ? 'brand.focusRing' : 'border.muted'}
      rounded="lg"
      overflow="hidden"
      w="full"
    >
      {/* Header — FIRST=راست: SKU+badgeها · LAST=چپ: سوییچ‌ها */}
      <Flex
        bg={active ? 'brand.bg' : 'bg.subtle'}
        align="center"
        justify="space-between"
        px="4"
        py="2"
        w="full"
        wrap="wrap"
        gap="2"
      >
        {/* موبایل (<sm): ردیف badgeها زیر SKU · sm+: همه در یک ردیف */}
        <Flex direction={{ base: 'column', sm: 'row' }} align={{ base: 'flex-end', sm: 'center' }} gap="2">
          <Text fontSize="sm" fontWeight="semibold" color="fg.muted" whiteSpace="nowrap">{combo.sku}</Text>
          <Flex gap="2" wrap="wrap" justify="flex-start">
            {orderedValues.map((label, i) => (
              <Badge key={i} colorPalette="gray" variant="subtle" size="sm" rounded="l2">{label}</Badge>
            ))}
          </Flex>
        </Flex>

        <Flex align="center" gap="4" wrap="wrap">
          <ToggleRow
            label="تخفیف دارد"
            checked={combo.hasDiscount}
            onChange={(v) => onChange({ hasDiscount: v })}
            disabled={fieldsDisabled}
          />
          <ToggleRow
            label="موجودی نامحدود"
            checked={combo.unlimitedInventory}
            onChange={(v) => onChange({ unlimitedInventory: v })}
            disabled={fieldsDisabled}
          />
          <ToggleRow
            label="فروش تلفنی"
            checked={combo.phoneSale}
            onChange={(v) => onChange({ phoneSale: v })}
            disabled={fieldsDisabled}
          />
          <ToggleRow
            label={active ? 'فعال' : 'غیرفعال'}
            checked={active}
            onChange={(v) => onChange({ active: v })}
          />
        </Flex>
      </Flex>

      {/* Fields — FIRST=راست: موجودی · قیمت · [تخفیف · قیمت بعد از تخفیف]=چپ */}
      <Flex gap="4" align="flex-end" px="4" pb="4" pt="4" w="full" wrap="wrap">
        <Field.Root flex="1" minW="140px" required>
          <Field.Label fontSize="sm" fontWeight="semibold">موجودی</Field.Label>
          <NumberField
            placeholder="موجودی"
            value={combo.inventory}
            onChange={(v) => onChange({ inventory: v })}
            showSteppers
            disabled={inventoryDisabled}
          />
        </Field.Root>

        <Field.Root flex="1" minW="140px" required>
          <Field.Label fontSize="sm" fontWeight="semibold">قیمت (تومان/$)</Field.Label>
          <NumberField
            placeholder="قیمت"
            value={combo.price}
            onChange={(v) => onChange({ price: v })}
            disabled={priceDisabled}
          />
        </Field.Root>

        {combo.hasDiscount && (
          <>
            <Field.Root flex="1" minW="140px">
              <Field.Label fontSize="sm" fontWeight="semibold">تخفیف</Field.Label>
              <NumberField
                placeholder="تخفیف"
                value={combo.discountValue}
                onChange={(v) => onChange({ discountValue: v })}
                disabled={fieldsDisabled}
                endElement={
                  <UnitSelect
                    value={combo.discountType}
                    onChange={(v) => onChange({ discountType: v })}
                    options={DISCOUNT_TYPES}
                  />
                }
                endElementProps={{ px: '1' }}
              />
            </Field.Root>

            <Field.Root flex="1" minW="140px">
              <Field.Label fontSize="sm" fontWeight="semibold">قیمت بعد از تخفیف (تومان/$)</Field.Label>
              <NumberField
                placeholder="قیمت بعد از تخفیف"
                value={priceAfterDiscount !== null ? String(priceAfterDiscount) : ''}
                onChange={() => {}}
                disabled
              />
            </Field.Root>
          </>
        )}
      </Flex>
    </Box>
  )
}
