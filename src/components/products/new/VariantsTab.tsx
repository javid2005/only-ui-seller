import { useEffect, useState } from 'react'
import { Box, Flex, Grid, Text, Button, chakra } from '@chakra-ui/react'
import { Plus, LayoutGrid } from 'lucide-react'
import { TitleBar } from '@/components/ui/TitleBar'
import { StepVideoButton } from './StepVideo'
import { ButtonFooter } from '@/components/ui/ButtonFooter'
import { Tooltip } from '@/components/ui/Tooltip'
import { toPersianDigits } from '@/utils/numbers'
import { SectionCard } from './SectionCard'
import { OptionCard } from './OptionCard'
import { OptionPickerDialog } from './OptionPickerDialog'
import { ModelSettingsDialog } from './ModelSettingsDialog'
import { ModelsTable, ModelFilterSegment, type ModelFilter } from './ModelsTable'
import { VariantImagePickerDialog } from './VariantImagePickerDialog'
import {
  MAX_VARIANTS, newVariant, buildCombinations, suggestionsFor, applyInheritance, currencyLabel,
  type ProductForm, type ProductVariant, type VariantCombination,
} from './data'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface VariantsTabProps {
  form: ProductForm
  onChange: (patch: Partial<ProductForm>) => void
  onSave: () => void
  /** برای بنر حالت ساده: تغییر نوع محصول یا برگشت به مرحلهٔ قبل */
  onMakeVaried?: () => void
  onLeave?: () => void
}

const key = (values: string[]) => values.join('|')

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * VariantsTab — مرحلهٔ ۵: «مدل‌ها و تنوع».
 *
 * دو بخش طرح تأییدشده:
 *   ۱. انتخاب‌های مشتری — چیپ‌های پیشنهادی بر اساس دسته‌بندی + کارت هر تنوع.
 *   ۲. مدل‌های قابل فروش — جدولی که **در لحظه** از انتخاب‌ها ساخته می‌شود.
 *
 * تفاوت کلیدی با پیاده‌سازی قبلی: دکمهٔ «ایجاد ترکیب تنوع‌ها» حذف شد. هر مقدار که
 * اضافه یا حذف شود، مدل‌ها همان لحظه بازساخته می‌شوند و مقادیر واردشدهٔ قبلی با
 * کلیدِ ترکیب حفظ می‌مانند. کاربر دیگر نمی‌تواند فراموش کند دکمه را بزند.
 */
export function VariantsTab({
  form, onChange, onSave, onMakeVaried, onLeave,
}: VariantsTabProps) {
  const options = form.variants
  const combos = form.combinations
  const isSimple = form.productType === 'simple'

  const [modelFilter, setModelFilter] = useState<ModelFilter>('all')
  const [imagePickerComboId, setImagePickerComboId] = useState<string | null>(null)
  const [settingsId, setSettingsId] = useState<string | null>(null)

  // تصویر شاخصِ محصول — مبنای ارث‌بریِ تصویر مدل‌ها
  const featuredImage =
    (form.gallery.find((img) => img.featured) ?? form.gallery[0])?.src ?? ''
  const imagePickerCombo = combos.find((c) => c.id === imagePickerComboId) ?? null

  // ─── ساخت زندهٔ مدل‌ها ────────────────────────────────────────────────────────
  // هر تغییر در انتخاب‌ها بلافاصله مدل‌ها را بازمی‌سازد؛ مقادیر واردشده با کلیدِ
  // ترکیب حفظ می‌شوند تا ویرایش‌های کاربر با افزودن یک مقدار تازه پاک نشوند.
  useEffect(() => {
    const fresh = buildCombinations(options, form.sku, form.price)
    const merged = fresh.map((nc) => {
      const prev = combos.find((c) => key(c.values) === key(nc.values))
      return prev ? { ...nc, ...prev, sku: nc.sku, values: nc.values } : nc
    })
    /**
     * ارث‌بری: مدل‌هایی که هنوز مقدار مستقل نگرفته‌اند، قیمت/موجودی/تصویرِ محصول
     * را می‌گیرند. این هر بار اجرا می‌شود، نه فقط موقع ساخت — پس اگر کاربر اول
     * تنوع بسازد و بعد تصویر اضافه کند، همان لحظه تصویر مدل‌ها هم پر می‌شود.
     */
    const withInheritance = applyInheritance(merged, {
      price: form.price,
      inventory: form.inventory,
      image: featuredImage,
      phoneSale: form.phoneSale,
    })

    const changed =
      withInheritance.length !== combos.length ||
      withInheritance.some((m, i) => {
        const prev = combos[i]
        return !prev
          || key(m.values) !== key(prev.values)
          || m.price !== prev.price
          || m.inventory !== prev.inventory
          || m.image !== prev.image
      })
    if (changed) onChange({ combinations: withInheritance, hasVariants: withInheritance.length > 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, form.sku, form.price, form.inventory, featuredImage])

  const addOption = (title = '') => {
    if (options.length >= MAX_VARIANTS) return
    onChange({ variants: [...options, { ...newVariant(), title }] })
  }
  const patchOption = (id: string, patch: Partial<ProductVariant>) =>
    onChange({ variants: options.map((o) => (o.id === id ? { ...o, ...patch } : o)) })
  const removeOption = (id: string) =>
    onChange({ variants: options.filter((o) => o.id !== id) })

  const atMax = options.length >= MAX_VARIANTS
  /**
   * پیشنهادهای استفاده‌شده **حذف نمی‌شوند، غیرفعال می‌شوند** — دقیقاً مثل طرح
   * تأییدشده. با حذف‌شدن، نوار هر بار جابه‌جا می‌شد و کاربر جای چیپ بعدی را گم
   * می‌کرد؛ غیرفعال‌شدن هم چیدمان را ثابت نگه می‌دارد هم می‌گوید «قبلاً اضافه شده».
   */
  const [pickerOpen, setPickerOpen] = useState(false)
  const suggestions = suggestionsFor(form.category)
  const usedTitles = new Set(options.map((o) => o.title))

  // ─── بنر حالت ساده ───────────────────────────────────────────────────────────
  if (isSimple) {
    return (
      <Flex direction="column" gap="5" w="full">
        <TitleBar title="مدل‌ها و تنوع" subtitle="انتخاب‌ها و مدل‌های قابل فروش" size="xl" cta={<StepVideoButton step="models" title="مدل‌ها و تنوع" />} />
        <Flex
          gap="3"
          p="5"
          rounded="xl"
          borderWidth="1px"
          borderColor="border"
          bg="bg.subtle"
          align="start"
        >
          {/* FIRST = rightmost: آیکن */}
          <Flex
            boxSize="10" rounded="xl" flexShrink={0} align="center" justify="center"
            bg="bg.panel" color="fg.muted"
          >
            <LayoutGrid size={19} />
          </Flex>
          <Box minW="0">
            <Text fontSize="sm" fontWeight="semibold" color="fg" textAlign="start">
              این محصول در حالت ساده قرار دارد
            </Text>
            <Text fontSize="xs" color="fg.muted" textAlign="start" lineHeight="1.9" mt="1">
              بخش مدل‌ها و تنوع فقط برای محصولاتی کاربرد دارد که خریدار باید بین گزینه‌هایی
              مثل رنگ، سایز یا حافظه انتخاب کند. اطلاعات قبلی شما محفوظ مانده و حذف نشده است.
            </Text>
            <Flex gap="2" mt="3" wrap="wrap">
              {/* FIRST = rightmost: اقدام اصلی */}
              <Button size="sm" colorPalette="brand" onClick={onMakeVaried}>
                تغییر به محصول متنوع
              </Button>
              <Button size="sm" variant="outline" onClick={onLeave}>
                بازگشت به مشخصات
              </Button>
            </Flex>
          </Box>
        </Flex>
        <ButtonFooter
          noDivider
          primary={{ label: 'ذخیره و ادامه', onClick: onSave }}
        />
      </Flex>
    )
  }

  return (
    <Flex direction="column" gap="5" w="full">

      <TitleBar title="مدل‌ها و تنوع" subtitle="انتخاب‌ها و مدل‌های قابل فروش" size="xl" cta={<StepVideoButton step="models" title="مدل‌ها و تنوع" />} />

      {/* ═══ انتخاب‌های مشتری ═══════════════════════════════════════════════════ */}
      <SectionCard
        title="انتخاب‌های مشتری"
        subtitle={`حداکثر ۴ انتخاب مانند رنگ، حافظه، سایز یا گارانتی • حداکثر ${toPersianDigits(MAX_VARIANTS)} تنوع`}
        helpTopic="انتخاب‌های مشتری"
      >
        <Flex direction="column" gap="4">

          {/* نوار پیشنهادها — در طرح یک نوارِ کادردارِ ته‌رنگی است، نه چیپ‌های شناور.
              FIRST = rightmost: چیپ‌ها · LAST = leftmost: سفارشی */}
          <Flex
            align="center"
            gap="2"
            wrap="wrap"
            w="full"
            p="2"
            rounded="10px"
            borderWidth="1px"
            borderColor="border.muted"
            bg="bg.subtle"
          >
            <Flex gap="2" wrap="wrap" flex="1" minW="0">
              {suggestions.map((title) => {
                const used = usedTitles.has(title)
                const disabled = used || atMax
                return (
                  <Tooltip
                    key={title}
                    content={
                      used
                        ? `${title} قبلاً اضافه شده است`
                        : atMax
                          ? `حداکثر ${toPersianDigits(MAX_VARIANTS)} تنوع قابل تعریف است`
                          : `افزودن ${title}`
                    }
                  >
                    <chakra.button
                      type="button"
                      onClick={() => addOption(title)}
                      disabled={disabled}
                      display="flex"
                      alignItems="center"
                      gap="1"
                      px="2.5"
                      h="29px"
                      rounded="lg"
                      fontSize="11px"
                      borderWidth="1px"
                      borderColor="border"
                      color="fg.muted"
                      bg="bg.panel"
                      transition="border-color 0.15s, color 0.15s, background 0.15s"
                      _hover={{ borderColor: 'brand.border', color: 'brand.fg', bg: 'brand.bg' }}
                      _disabled={{ opacity: 0.5, cursor: 'not-allowed', _hover: {} }}
                    >
                      {/* FIRST = rightmost: علامت + */}
                      <Plus size={12} />{title}
                    </chakra.button>
                  </Tooltip>
                )
              })}
            </Flex>
            <Tooltip content={atMax ? `حداکثر ${toPersianDigits(MAX_VARIANTS)} تنوع قابل تعریف است` : 'افزودن تنوع سفارشی'}>
              <Button
                size="sm"
                variant="outline"
                bg="bg.panel"
                h="31px"
                rounded="lg"
                fontSize="12px"
                fontWeight="semibold"
                gap="1.5"
                onClick={() => setPickerOpen(true)}
                disabled={atMax}
                flexShrink={0}
              >
                {/* FIRST = rightmost: آیکن (leading) */}
                <Plus size={14} />انتخاب سفارشی
              </Button>
            </Tooltip>
          </Flex>

          {/* کارت‌های تنوع — دو ستون، مثل طرح */}
          {options.length > 0 && (
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="3">
              {options.map((option, i) => (
                <OptionCard
                  key={option.id}
                  option={option}
                  index={i + 1}
                  category={form.category}
                  onChange={(patch) => patchOption(option.id, patch)}
                  onRemove={() => removeOption(option.id)}
                />
              ))}
            </Grid>
          )}

        </Flex>
      </SectionCard>

      {/* ═══ مدل‌های قابل فروش ══════════════════════════════════════════════════ */}
      <SectionCard
        title="مدل‌های قابل فروش"
        subtitle={
          combos.length > 0
            ? `${toPersianDigits(combos.length)} ترکیب ساخته شده است`
            : 'با افزودن مقدار به انتخاب‌ها، مدل‌ها همین‌جا ساخته می‌شوند'
        }
        helpTopic="مدل‌های قابل فروش"
        actions={<ModelFilterSegment value={modelFilter} onChange={setModelFilter} />}
      >
        <ModelsTable
          options={options}
          combos={combos}
          onChange={(next: VariantCombination[]) => onChange({ combinations: next })}
          onPickImage={setImagePickerComboId}
          onOpenSettings={setSettingsId}
          filter={modelFilter}
          onFilterChange={setModelFilter}
        />
      </SectionCard>

      <ButtonFooter
        noDivider
        primary={{ label: 'ذخیره و ادامه', onClick: onSave }}
      />

      {/* تنظیمات یک مدل — پشت ⋮ همان ردیف */}
      <ModelSettingsDialog
        combo={combos.find((c) => c.id === settingsId) ?? null}
        onClose={() => setSettingsId(null)}
        unit={currencyLabel(form.currency)}
        source={{ price: form.price, inventory: form.inventory, image: featuredImage }}
        onChange={(patch) =>
          onChange({
            combinations: combos.map((c) => (c.id === settingsId ? { ...c, ...patch } : c)),
          })}
        onPickImage={() => { setImagePickerComboId(settingsId); setSettingsId(null) }}
      />

      {/* فهرست کامل انتخاب‌ها — پشت «انتخاب سفارشی» */}
      <OptionPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        category={form.category}
        used={options.map((o) => o.title)}
        onPick={(title) => addOption(title)}
      />

      <VariantImagePickerDialog
        open={imagePickerCombo !== null}
        onClose={() => setImagePickerComboId(null)}
        images={form.gallery}
        selected={imagePickerCombo?.image ?? ''}
        onConfirm={(src) =>
          imagePickerCombo &&
          onChange({
            combinations: combos.map((c) =>
              c.id === imagePickerCombo.id ? { ...c, image: src } : c),
          })}
      />

    </Flex>
  )
}
