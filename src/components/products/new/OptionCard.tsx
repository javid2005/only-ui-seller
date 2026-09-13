import { useState } from 'react'
import { Box, Flex, Grid, Text, IconButton, Popover, Portal, chakra } from '@chakra-ui/react'
import { Trash2, Plus, X } from 'lucide-react'
import { Tooltip } from '@/components/ui/Tooltip'
import { isColorOption, colorForValue, NAMED_COLORS, type ProductVariant, type VariantValueItem } from './data'
import { valuesForOption, optionsForCategory } from './categoryKnowledge'
import { SuggestInput } from './SuggestInput'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface OptionCardProps {
  option: ProductVariant
  /** شمارهٔ تنوع — در طرح روی کارت دیده می‌شود چون ترتیب تنوع‌ها ترتیب ستون‌های مدل است */
  index: number
  /** دسته‌بندی محصول — مبنای پیشنهادِ عنوان و مقادیر */
  category: string
  onChange: (patch: Partial<ProductVariant>) => void
  onRemove: () => void
}

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * OptionCard — یک «انتخاب مشتری» (رنگ، حافظه، …) با مقادیرش.
 *
 * عنوان قابل تایپ است، نه ثابت: چیپ پیشنهادی فقط کارت را با یک عنوان می‌سازد و
 * کاربر می‌تواند عوضش کند.
 *
 * مقدارها با Enter یا دکمهٔ «+» اضافه می‌شوند. اگر عنوان تنوع «رنگ» باشد، هر مقدار
 * یک سواچ می‌گیرد که با کلیک قابل تغییر است — همان سواچ مبنای ته‌رنگ ردیف‌های
 * جدول مدل‌هاست، پس رنگ اینجا فقط تزئین نیست.
 *
 * RTL DOM order سرتیتر (first = rightmost): شمارهٔ تنوع ← عنوان ← حذف (چپ‌ترین).
 */
export function OptionCard({ option, index, category, onChange, onRemove }: OptionCardProps) {
  // پیشنهادها از درخت دانشِ دسته‌بندی می‌آیند؛ مقادیری که کاربر افزوده حذف می‌شوند
  const titleSuggestions = optionsForCategory(category).map((o) => o.title)
  const valueSuggestions = valuesForOption(category, option.title)
    .filter((v) => !option.values.some((x) => x.label === v))
  const [draft, setDraft] = useState('')
  const isColor = isColorOption(option.title)

  const addValue = () => {
    const label = draft.trim()
    if (!label) return
    if (option.values.some((v) => v.label === label)) { setDraft(''); return }
    const value: VariantValueItem = {
      id: `value_${option.id}_${Date.now()}`,
      label,
      ...(isColor ? { color: colorForValue(label) } : {}),
    }
    onChange({ values: [...option.values, value] })
    setDraft('')
  }

  const patchValue = (id: string, patch: Partial<VariantValueItem>) =>
    onChange({ values: option.values.map((v) => (v.id === id ? { ...v, ...patch } : v)) })

  const removeValue = (id: string) =>
    onChange({ values: option.values.filter((v) => v.id !== id) })

  return (
    /* کارت در طرح ته‌رنگی است روی سطح سفیدِ بخش — همین تمایز است که چشم را به هر
       «انتخاب مشتری» جدا معطوف می‌کند. اندازه‌ها از طرح: radius ۱۲px، padding ۱۰px. */
    <Box borderWidth="1px" borderColor="border.muted" rounded="xl" bg="bg.subtle" p="2.5" w="full">

      {/* سرتیتر — بدون خط جداکننده؛ در طرح فقط فاصله است */}
      <Flex align="center" gap="2.5" pb="2">
        {/* FIRST = rightmost: شمارهٔ تنوع */}
        <Flex
          boxSize="7" rounded="lg" flexShrink={0} align="center" justify="center"
          bg="bg.panel" borderWidth="1px" borderColor="border"
          color="fg.muted" fontSize="xs" fontWeight="bold"
        >
          {index}
        </Flex>
        <SuggestInput
          value={option.title}
          onChange={(title) => onChange({ title })}
          suggestions={titleSuggestions}
          placeholder="مثلاً رنگ"
          variant="flushed"
          size="sm"
          fontWeight="semibold"
        />
        {/* LAST = leftmost: حذف تنوع */}
        <Tooltip content="حذف تنوع">
          <IconButton size="xs" variant="ghost" colorPalette="red" aria-label="حذف تنوع" onClick={onRemove}>
            <Trash2 size={15} />
          </IconButton>
        </Tooltip>
      </Flex>

      {/* مقادیر */}
      <Box>
        <Text fontSize="xs" fontWeight="medium" color="fg.muted" textAlign="start" mb="2">
          مقادیر {option.title || 'تنوع'}
        </Text>

        {/* ورود مقدار — FIRST = rightmost: خود ورودی · دکمهٔ + سمت چپ */}
        <chakra.form
          display="flex"
          gap="2"
          onSubmit={(e) => { e.preventDefault(); addValue() }}
        >
          <SuggestInput
            size="sm"
            bg="bg.panel"
            value={draft}
            onChange={setDraft}
            suggestions={valueSuggestions}
            onPick={(label) => {
              // انتخاب از فهرست یعنی «همین را اضافه کن» — یک کلیک، نه دو تا
              if (option.values.some((v) => v.label === label)) return
              onChange({
                values: [...option.values, {
                  id: `value_${option.id}_${Date.now()}`,
                  label,
                  ...(isColor ? { color: colorForValue(label) } : {}),
                }],
              })
              setDraft('')
            }}
            placeholder={isColor ? 'مثال: مشکی، سفید یا آبی' : `مثال: مقدار ${option.title || 'تنوع'}`}
          />
          <IconButton
            type="submit"
            size="sm"
            colorPalette="brand"
            aria-label="افزودن مقدار"
            disabled={!draft.trim()}
            flexShrink={0}
          >
            <Plus size={16} />
          </IconButton>
        </chakra.form>

        {/* چیپ‌های مقدار */}
        {option.values.length > 0 && (
          <Flex gap="2" wrap="wrap" mt="3">
            {option.values.map((v) => (
              <Flex
                key={v.id}
                align="center"
                gap="1.5"
                ps={isColor ? '1' : '2.5'}
                pe="1"
                h="7"
                rounded="l2"
                borderWidth="1px"
                borderColor="border"
                bg="bg.panel"
              >
                {/* FIRST = rightmost: سواچ رنگ (فقط تنوع رنگی) */}
                {isColor && (
                  <Popover.Root positioning={{ placement: 'bottom' }}>
                    <Popover.Trigger asChild>
                      <chakra.button
                        type="button"
                        aria-label={`تغییر رنگ ${v.label}`}
                        boxSize="5"
                        rounded="md"
                        borderWidth="1px"
                        borderColor="border"
                        bg={v.color ?? '#9aa6ad'}
                        flexShrink={0}
                      />
                    </Popover.Trigger>
                    <Portal>
                      <Popover.Positioner dir="rtl">
                        <Popover.Content w="auto" p="2">
                          {/* کلیک روی سواچ **کل مقدار** را عوض می‌کند — نام و
                              رنگ با هم (بازخورد کاربر، مورد ۱۰). قبلاً فقط رنگ
                              عوض می‌شد و مقداری به نام «زرد» می‌توانست قرمز
                              بماند. چون جدول مدل‌ها هم `label` و هم `color` را
                              از همین مقدار می‌خواند، تغییر همان لحظه در جدول و
                              پیش‌نمایش دیده می‌شود.
                              نام هر سواچ زیرش نوشته شده تا انتخاب کور نباشد. */}
                          <Text fontSize="2xs" color="fg.muted" textAlign="start" mb="1.5">
                            رنگ را انتخاب کنید — نام مقدار هم با آن عوض می‌شود
                          </Text>
                          <Grid
                            templateColumns="repeat(5, 1fr)"
                            gap="1"
                            w="252px"
                            maxH="280px"
                            overflowY="auto"
                          >
                            {NAMED_COLORS.map((c) => {
                              const active = v.color === c.hex && v.label === c.name
                              return (
                                <chakra.button
                                  key={c.name}
                                  type="button"
                                  title={c.name}
                                  aria-label={c.name}
                                  aria-pressed={active}
                                  display="flex"
                                  flexDirection="column"
                                  alignItems="center"
                                  gap="0.5"
                                  p="1"
                                  rounded="md"
                                  bg={active ? 'brand.bg' : 'transparent'}
                                  _hover={{ bg: 'bg.subtle' }}
                                  onClick={() => patchValue(v.id, { label: c.name, color: c.hex })}
                                >
                                  <Box
                                    boxSize="6"
                                    rounded="md"
                                    bg={c.hex}
                                    borderWidth="2px"
                                    borderColor={active ? 'brand.solid' : 'border'}
                                  />
                                  <Text fontSize="8px" color="fg.muted" truncate w="full" textAlign="center">
                                    {c.name}
                                  </Text>
                                </chakra.button>
                              )
                            })}
                          </Grid>
                        </Popover.Content>
                      </Popover.Positioner>
                    </Portal>
                  </Popover.Root>
                )}

                <Text fontSize="xs" color="fg" whiteSpace="nowrap">{v.label}</Text>

                {/* LAST = leftmost: حذف مقدار */}
                <IconButton
                  size="2xs"
                  variant="ghost"
                  aria-label={`حذف ${v.label}`}
                  onClick={() => removeValue(v.id)}
                >
                  <X size={12} />
                </IconButton>
              </Flex>
            ))}
          </Flex>
        )}
      </Box>
    </Box>
  )
}
