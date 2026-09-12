import { useEffect, useState } from 'react'
import {
  Box, Flex, Text, Button, EmptyState, Alert, Switch, IconButton,
  Select, createListCollection, Portal, Dialog, CloseButton,
} from '@chakra-ui/react'
import { Plus, Snowflake, ListFilter } from 'lucide-react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { TitleBar } from '@/components/ui/TitleBar'
import { ButtonFooter } from '@/components/ui/ButtonFooter'
import { VariantAccordion } from './VariantAccordion'
import { VariantCombinationCard } from './VariantCombinationCard'
import { VariantImagePickerDialog } from './VariantImagePickerDialog'
import {
  MAX_VARIANTS, newVariant, buildCombinations,
  type ProductForm, type ProductVariant,
} from './data'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface VariantsTabProps {
  form: ProductForm
  onChange: (patch: Partial<ProductForm>) => void
  onBack: () => void
  onSave: () => void
}

// ─── Filters (فقط نمایش — state محلی، در form ذخیره نمی‌شود) ────────────────────

interface ComboFilters {
  values: (string | null)[]
  showInactive: boolean
  onlyUnlimited: boolean
  onlyDiscount: boolean
}

const EMPTY_FILTERS: ComboFilters = { values: [null, null], showInactive: false, onlyUnlimited: false, onlyDiscount: false }

// ─── FiltersDialog — نسخهٔ compact/موبایل (سوییچ‌ها) — دراِفت تا «فیلترکن» ─────────
// Figma: filter trigger (node 1446:86251) · Dialog (node 3923:74822)

function FiltersDialog({
  open, onClose, filters, onApply,
}: { open: boolean; onClose: () => void; filters: ComboFilters; onApply: (f: ComboFilters) => void }) {
  const [draft, setDraft] = useState(filters)

  useEffect(() => { if (open) setDraft(filters) }, [open, filters])

  const apply = () => { onApply(draft); onClose() }
  const clear = () => { onApply(EMPTY_FILTERS); onClose() }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl" py="6">
          <Dialog.Content maxW="384px" w="full" mx="4">
            <Dialog.Header pb="4" pt="6" px="6" position="relative">
              <Dialog.Title fontSize="lg" fontWeight="semibold" textAlign="start" w="full">
                فیلترها
              </Dialog.Title>
              <Dialog.CloseTrigger asChild position="absolute" top="3" insetEnd="3">
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body px="6" pt="2" pb="4">
              <Flex direction="column" gap="0.5" w="full">
                {/* هر ردیف — FIRST=راست: Switch · LAST=چپ: Text (قرارداد پروژه) */}
                <Flex align="center" gap="2.5" w="full" py="2.5">
                  <Switch.Root
                    size="sm"
                    colorPalette="brand"
                    checked={draft.onlyUnlimited}
                    onCheckedChange={(e) => setDraft((prev) => ({ ...prev, onlyUnlimited: e.checked }))}
                  >
                    <Switch.HiddenInput />
                    <Switch.Control><Switch.Thumb /></Switch.Control>
                  </Switch.Root>
                  <Text fontSize="xs" whiteSpace="nowrap">موجودی نامحدود</Text>
                </Flex>
                <Flex align="center" gap="2.5" w="full" py="2.5">
                  <Switch.Root
                    size="sm"
                    colorPalette="brand"
                    checked={draft.onlyDiscount}
                    onCheckedChange={(e) => setDraft((prev) => ({ ...prev, onlyDiscount: e.checked }))}
                  >
                    <Switch.HiddenInput />
                    <Switch.Control><Switch.Thumb /></Switch.Control>
                  </Switch.Root>
                  <Text fontSize="xs" whiteSpace="nowrap">تخفیف دارد</Text>
                </Flex>
                <Flex align="center" gap="2.5" w="full" py="2.5">
                  <Switch.Root
                    size="sm"
                    colorPalette="brand"
                    checked={draft.showInactive}
                    onCheckedChange={(e) => setDraft((prev) => ({ ...prev, showInactive: e.checked }))}
                  >
                    <Switch.HiddenInput />
                    <Switch.Control><Switch.Thumb /></Switch.Control>
                  </Switch.Root>
                  <Text fontSize="xs" whiteSpace="nowrap">فعال/غیرفعال</Text>
                </Flex>
              </Flex>
            </Dialog.Body>

            <Dialog.Footer px="6" pt="2" pb="4">
              <Flex justify="space-between" align="center" w="full">
                {/* FIRST = rightmost */}
                <Button variant="plain" color="red.fg" px="0" onClick={clear}>
                  حذف فیلترها
                </Button>
                {/* LAST = leftmost subgroup: لغو (راست‌ترِ subgroup) → فیلترکن (چپ‌ترین) */}
                <Flex gap="3">
                  <Button variant="outline" onClick={onClose}>
                    لغو
                  </Button>
                  <Button colorPalette="brand" onClick={apply}>
                    فیلترکن
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

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * VariantsTab — تب «تنوع‌ها»: گروه‌های تنوع (Accordion) + ماتریس ترکیب‌ها.
 *
 * Figma:
 *  - Empty state (بدون تنوع)         node 1191:21315
 *  - Variant-Accordion (باز/بسته)     node 1720:30952
 *  - ماتریس ترکیب‌ها (کارت‌ها + فیلتر) node 4374:73571
 */
export function VariantsTab({ form, onChange, onBack, onSave }: VariantsTabProps) {
  const isCompact = useCompactMode()
  const [filters, setFilters] = useState<ComboFilters>(EMPTY_FILTERS)
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)

  const variants = form.variants
  const combinations = form.combinations
  const hasDuplicateTitles = variants.some((v, i) => {
    const t = v.title.trim()
    return t !== '' && variants.some((other, j) => j !== i && other.title.trim() === t)
  })
  const validVariants = variants.filter((v) => v.title.trim() && v.values.length > 0)
  const canGenerate = validVariants.length > 0 && !hasDuplicateTitles

  const patchVariant = (id: string, patch: Partial<ProductVariant>) =>
    onChange({ variants: variants.map((v) => (v.id === id ? { ...v, ...patch } : v)) })

  const addVariant = () => {
    if (variants.length >= MAX_VARIANTS) return
    onChange({ variants: [...variants, newVariant()], hasVariants: true })
  }

  const removeVariant = (id: string) =>
    onChange({ variants: variants.filter((v) => v.id !== id), combinations: [] })

  // ─── ایجاد/بازسازی ماتریس ترکیب‌ها — آکاردیون‌ها با انیمیشن بسته می‌شوند ─────────
  const generateCombinations = () => {
    const fresh = buildCombinations(variants, form.sku)
    const key = (values: string[]) => values.join('§')
    const merged = fresh.map((nc) => {
      const prev = combinations.find((c) => key(c.values) === key(nc.values))
      return prev ? { ...nc, ...prev, sku: nc.sku } : nc
    })
    onChange({
      combinations: merged,
      variants: variants.map((v) => ({ ...v, open: false })),
      hasVariants: true,
    })
  }

  const patchCombo = (id: string, patch: Partial<typeof combinations[number]>) =>
    onChange({ combinations: combinations.map((c) => (c.id === id ? { ...c, ...patch } : c)) })

  // ترکیبی که انتخابگر تصویرش باز است
  const [imagePickerComboId, setImagePickerComboId] = useState<string | null>(null)
  const imagePickerCombo = combinations.find((c) => c.id === imagePickerComboId) ?? null

  // ─── فیلتر لیست کارت‌ها (فقط نمایش) ─────────────────────────────────────────────
  // پیش‌فرض: همهٔ آیتم‌ها (فعال+غیرفعال) نمایش داده می‌شوند. «نمایش غیرفعال‌ها» یعنی
  // فقط غیرفعال‌ها نمایش داده شوند (فیلتر روی حالت، نه مخفی‌کردن غیرفعال‌ها).
  const filteredCombos = combinations.filter((c) => {
    if (filters.showInactive && c.active) return false
    if (filters.onlyUnlimited && !c.unlimitedInventory) return false
    if (filters.onlyDiscount && !c.hasDiscount) return false
    for (let i = 0; i < variants.length; i++) {
      const wanted = filters.values[i]
      if (wanted && c.values[i] !== wanted) return false
    }
    return true
  })

  const hasActiveFilters =
    filters.values.some(Boolean) || filters.showInactive || filters.onlyUnlimited || filters.onlyDiscount

  return (
    <Flex direction="column" gap="10" w="full">

      {/* ═══ Section: تنوع‌ها ═══════════════════════════════════════════════════ */}
      <Box>
        <TitleBar
          title="تنوع‌ها (Variants)"
          subtitle="حداکثر ۲ ویژگی مؤثر بر قیمت مانند رنگ و سایز"
          size="xl"
          divider
          cta={
            <Button
              size="sm"
              variant="outline"
              colorPalette="brand"
              onClick={addVariant}
              disabled={variants.length >= MAX_VARIANTS}
            >
              <Plus size={16} />افزودن تنوع
            </Button>
          }
        />

        {variants.length === 0 ? (
          <EmptyState.Root size="sm" pt="4">
            <EmptyState.Content>
              <EmptyState.Indicator><Snowflake /></EmptyState.Indicator>
              <EmptyState.Title>هیچ تنوعی تعریف نشده</EmptyState.Title>
              <EmptyState.Description>
                اگر محصول شما در رنگ‌ها یا سایزهای مختلف عرضه می‌شود، اینجا تنوع اضافه کنید.
              </EmptyState.Description>
              <Button variant="outline" colorPalette="brand" onClick={addVariant} mt="2">
                <Plus size={16} />افزودن اولین تنوع
              </Button>
            </EmptyState.Content>
          </EmptyState.Root>
        ) : (
          <Flex direction="column" gap="4" pt="4">
            {variants.length >= MAX_VARIANTS && (
              <Alert.Root status="warning" variant="subtle">
                <Alert.Indicator />
                <Alert.Content>
                  <Text fontSize="xs">
                    به حداکثر تعداد تنوع رسیدید. برای افزودن تنوع جدید، ابتدا یکی از تنوع‌های موجود را حذف کنید.
                  </Text>
                </Alert.Content>
              </Alert.Root>
            )}
            {variants.map((v, i) => (
              <VariantAccordion
                key={v.id}
                variant={v}
                index={i}
                otherTitles={variants.filter((other) => other.id !== v.id).map((other) => other.title.trim()).filter(Boolean)}
                onChange={(patch) => patchVariant(v.id, patch)}
                onToggleOpen={() => patchVariant(v.id, { open: !v.open })}
                onRemove={() => removeVariant(v.id)}
              />
            ))}
          </Flex>
        )}
      </Box>

      {/* ═══ Section: ماتریس ترکیب‌ها ═══════════════════════════════════════════ */}
      {variants.length > 0 && (
        <Box>
          <TitleBar
            title="ماتریس ترکیب ها"
            subtitle="قیمت و موجودی هر ترکیب را وارد کنید."
            size="xl"
            divider
            cta={
              <Button
                size="sm"
                variant="outline"
                colorPalette="brand"
                onClick={generateCombinations}
                disabled={!canGenerate}
              >
                <Plus size={16} />ایجاد ترکیب تنوع ها
              </Button>
            }
          />

          {combinations.length === 0 ? (
            <EmptyState.Root size="sm" pt="4">
              <EmptyState.Content>
                <EmptyState.Indicator><Snowflake /></EmptyState.Indicator>
                <EmptyState.Title>هیچ ترکیب تنوعی ایجاد نشده است</EmptyState.Title>
                <EmptyState.Description>
                  جهت ایجاد ترکیب تنوع ها، ابتدا تنوع های مورد نظر خود را اضافه نمایید.
                </EmptyState.Description>
                <Button variant="outline" colorPalette="brand" onClick={generateCombinations} disabled={!canGenerate} mt="2">
                  <Plus size={16} />ایجاد ترکیب تنوع ها
                </Button>
              </EmptyState.Content>
            </EmptyState.Root>
          ) : (
            <Flex direction="column" gap="4" pt="4">
              <Alert.Root status="info" variant="subtle">
                <Alert.Indicator />
                <Alert.Content>
                  <Text fontSize="xs">
                    با ساخت اولین تنوع، قیمت و موجودی در بخش «اطلاعات محصول» به حالت فقط‌خواندنی تبدیل می‌شوند.
                  </Text>
                </Alert.Content>
              </Alert.Root>

              {/* Filter row — دسکتاپ: ردیف کامل · FIRST=راست: Selectها · LAST=چپ: حذف فیلترها
                  isCompact هم لحاظ می‌شود (نه فقط breakpoint) چون isCompact واقعیتِ viewport را عوض نمی‌کند */}
              <Flex display={isCompact ? 'none' : { base: 'none', md: 'flex' }} gap="4" align="center" justify="start" wrap="wrap" w="full">
                {[...variants].reverse().map((v) => {
                  const idx = variants.indexOf(v)
                  const collection = createListCollection({
                    items: v.values.map((val) => ({ value: val.label, label: val.label })),
                  })
                  return (
                    <Select.Root
                      key={v.id}
                      collection={collection}
                      value={filters.values[idx] ? [filters.values[idx] as string] : []}
                      onValueChange={(e) =>
                        setFilters((prev) => {
                          const next = [...prev.values]
                          next[idx] = e.value[0] ?? null
                          return { ...prev, values: next }
                        })
                      }
                      flex="1"
                      minW="140px"
                    >
                      <Select.HiddenSelect />
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText placeholder={v.title || `تنوع ${idx + 1}`} />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Portal>
                        <Select.Positioner>
                          <Select.Content dir="rtl">
                            {collection.items.map((item) => (
                              <Select.Item key={item.value} item={item}>
                                <Select.ItemText>{item.label}</Select.ItemText>
                                <Select.ItemIndicator />
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Portal>
                    </Select.Root>
                  )
                })}

                <Flex gap="4" align="center" wrap="wrap">
                  <Flex align="center" gap="2.5">
                    <Switch.Root
                      size="sm"
                      colorPalette="brand"
                      checked={filters.onlyDiscount}
                      onCheckedChange={(e) => setFilters((prev) => ({ ...prev, onlyDiscount: e.checked }))}
                    >
                      <Switch.HiddenInput />
                      <Switch.Control><Switch.Thumb /></Switch.Control>
                    </Switch.Root>
                    <Text fontSize="xs" whiteSpace="nowrap">تخفیف دارد</Text>
                  </Flex>
                  <Flex align="center" gap="2.5">
                    <Switch.Root
                      size="sm"
                      colorPalette="brand"
                      checked={filters.onlyUnlimited}
                      onCheckedChange={(e) => setFilters((prev) => ({ ...prev, onlyUnlimited: e.checked }))}
                    >
                      <Switch.HiddenInput />
                      <Switch.Control><Switch.Thumb /></Switch.Control>
                    </Switch.Root>
                    <Text fontSize="xs" whiteSpace="nowrap">موجودی نامحدود</Text>
                  </Flex>
                  <Flex align="center" gap="2.5">
                    <Switch.Root
                      size="sm"
                      colorPalette="brand"
                      checked={filters.showInactive}
                      onCheckedChange={(e) => setFilters((prev) => ({ ...prev, showInactive: e.checked }))}
                    >
                      <Switch.HiddenInput />
                      <Switch.Control><Switch.Thumb /></Switch.Control>
                    </Switch.Root>
                    <Text fontSize="xs" whiteSpace="nowrap">نمایش غیرفعال ها</Text>
                  </Flex>
                </Flex>

                <Button
                  variant="plain"
                  color="red.fg"
                  size="xs"
                  onClick={() => setFilters(EMPTY_FILTERS)}
                  disabled={!hasActiveFilters}
                >
                  حذف فیلترها
                </Button>
              </Flex>

              {/* Filter row — compact/موبایل: Selectها + دکمهٔ «فیلترها» (مودال) — Figma node 1446:86251 */}
              <Flex display={isCompact ? 'flex' : { base: 'flex', md: 'none' }} gap="2" align="center" justify="start" w="full">
                {[...variants].reverse().map((v) => {
                  const idx = variants.indexOf(v)
                  const collection = createListCollection({
                    items: v.values.map((val) => ({ value: val.label, label: val.label })),
                  })
                  return (
                    <Select.Root
                      key={v.id}
                      collection={collection}
                      value={filters.values[idx] ? [filters.values[idx] as string] : []}
                      onValueChange={(e) =>
                        setFilters((prev) => {
                          const next = [...prev.values]
                          next[idx] = e.value[0] ?? null
                          return { ...prev, values: next }
                        })
                      }
                      flex="1"
                    >
                      <Select.HiddenSelect />
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText placeholder={v.title || `تنوع ${idx + 1}`} />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Portal>
                        <Select.Positioner>
                          <Select.Content dir="rtl">
                            {collection.items.map((item) => (
                              <Select.Item key={item.value} item={item}>
                                <Select.ItemText>{item.label}</Select.ItemText>
                                <Select.ItemIndicator />
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Portal>
                    </Select.Root>
                  )
                })}
                <IconButton
                  aria-label="فیلترها"
                  variant="outline"
                  flexShrink={0}
                  onClick={() => setFilterDialogOpen(true)}
                >
                  <ListFilter size={20} />
                </IconButton>
              </Flex>

              <FiltersDialog
                open={filterDialogOpen}
                onClose={() => setFilterDialogOpen(false)}
                filters={filters}
                onApply={setFilters}
              />

              {/* Cards list */}
              {filteredCombos.length === 0 ? (
                <EmptyState.Root size="sm">
                  <EmptyState.Content>
                    <EmptyState.Indicator><Snowflake /></EmptyState.Indicator>
                    <EmptyState.Title>موردی یافت نشد</EmptyState.Title>
                  </EmptyState.Content>
                </EmptyState.Root>
              ) : (
                <Flex direction="column" gap="4">
                  {filteredCombos.map((c) => (
                    <VariantCombinationCard
                      key={c.id}
                      combo={c}
                      onChange={(patch) => patchCombo(c.id, patch)}
                      onPickImage={() => setImagePickerComboId(c.id)}
                    />
                  ))}
                </Flex>
              )}
            </Flex>
          )}
        </Box>
      )}

      <ButtonFooter
        primary={{ label: 'ذخیره', onClick: onSave }}
        back={{ label: 'بازگشت', onClick: onBack }}
      />

      {/* ═══ انتخابگر تصویر ترکیب — منبع: گالری محصول ═══════════════════════════ */}
      <VariantImagePickerDialog
        open={imagePickerCombo !== null}
        onClose={() => setImagePickerComboId(null)}
        images={form.gallery}
        selected={imagePickerCombo?.image ?? ''}
        onConfirm={(src) => imagePickerCombo && patchCombo(imagePickerCombo.id, { image: src })}
      />

    </Flex>
  )
}
