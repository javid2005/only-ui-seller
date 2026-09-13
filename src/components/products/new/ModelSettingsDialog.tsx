import { useEffect, useState } from 'react'
import {
  Dialog, Portal, CloseButton, Text, Flex, Button, Box, Switch, chakra,
} from '@chakra-ui/react'
import { Link2, Link2Off, ImagePlus, Trash2 } from 'lucide-react'
import { Tooltip } from '@/components/ui/Tooltip'
import { NumberField } from '@/components/ui/NumberField'
import { toPersianDigits, formatThousands } from '@/utils/numbers'
import { MediaThumb } from './MediaThumb'
import { NotchedField } from './NotchedField'
import { pressable } from './motion'
import { colorForValue } from './data'
import type { VariantCombination } from './data'
import { dialogEnterSubmit } from './enterSubmit'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface ModelSettingsDialogProps {
  combo: VariantCombination | null
  onClose: () => void
  unit: string
  /** مقادیر محصول اصلی — مبنای ارث‌بری */
  source: { price: string; inventory: string; image: string }
  onChange: (patch: Partial<VariantCombination>) => void
  onPickImage: () => void
}

// ─── Section ────────────────────────────────────────────────────────────────────
/**
 * یک گروه از تنظیمات، با سرتیترِ ریزِ خودش.
 *
 * بازطراحی این دیالوگ (بازخورد کاربر، مورد ۱۱) از همین‌جا شروع شد: نسخهٔ قبلی
 * چهار بلوکِ بی‌گروه بود که هر کدام شکل خودش را داشت — یکی بج داشت، یکی لینکِ
 * زیرخط‌دار، یکی کادر نارنجی. حالا سه گروهِ روشن («تصویر»، «قیمت»، «موجودی»)
 * با یک idiom واحد: همان `NotchedField` بقیهٔ فرم، به‌علاوهٔ یک کلیدِ پیوند.
 */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box>
      <Text fontSize="10px" fontWeight="bold" color="fg.muted" textAlign="start" mb="2">
        {title}
      </Text>
      {children}
    </Box>
  )
}

// ─── LinkToggle ─────────────────────────────────────────────────────────────────
/**
 * کلیدِ «از محصول اصلی ارث ببر / مقدار مستقل».
 *
 * جای بج + لینکِ زیرخط‌دارِ قبلی را گرفت: آن دو با هم سه عنصرِ رقیب در یک ردیف
 * می‌ساختند و هیچ‌کدام هم کلیدِ اصلی نبود. حالا یک کلید است، هم‌قدِ فیلد، با
 * tooltip که همان جملهٔ توضیحی را نگه می‌دارد.
 */
function LinkToggle({
  inherited, onToggle, sourceText,
}: { inherited: boolean; onToggle: () => void; sourceText: string }) {
  return (
    <Tooltip
      content={inherited
        ? `از محصول اصلی می‌آید (${sourceText}). برای مقدار مستقل کلیک کنید.`
        : `مقدار مستقل دارد. برای برگرداندن به ${sourceText} کلیک کنید.`}
    >
      <chakra.button
        type="button"
        aria-pressed={inherited}
        onClick={onToggle}
        display="grid"
        placeItems="center"
        boxSize="11"
        flexShrink={0}
        rounded="lg"
        borderWidth="1px"
        borderColor={inherited ? 'brand.border' : 'border'}
        bg={inherited ? 'brand.bg' : 'bg.subtle'}
        color={inherited ? 'brand.fg' : 'fg.muted'}
        {...pressable}
      >
        {inherited ? <Link2 size={16} /> : <Link2Off size={16} />}
      </chakra.button>
    </Tooltip>
  )
}

// ─── SwitchRow ──────────────────────────────────────────────────────────────────
/** ردیف سوییچِ یک‌خطی — هر سه سوییچِ این دیالوگ دقیقاً یک شکل دارند */
function SwitchRow({
  id, label, hint, checked, onChange, palette = 'brand',
}: {
  id: string
  label: string
  hint: string
  checked: boolean
  onChange: (v: boolean) => void
  palette?: string
}) {
  return (
    <Tooltip content={hint}>
      <Flex
        align="center"
        gap="2"
        px="2.5"
        h="9"
        rounded="lg"
        borderWidth="1px"
        borderColor={checked ? `${palette}.muted` : 'border.muted'}
        bg={checked ? `${palette}.bg` : 'bg.subtle'}
        transition="background .18s, border-color .18s"
      >
        {/* FIRST = rightmost: برچسب … سوییچ (چپ‌ترین) */}
        <chakra.label
          htmlFor={id}
          flex="1"
          minW="0"
          fontSize="xs"
          fontWeight="medium"
          color="fg"
          textAlign="start"
          cursor="pointer"
          truncate
        >
          {label}
        </chakra.label>
        <Switch.Root
          id={id}
          size="sm"
          colorPalette={palette}
          checked={checked}
          onCheckedChange={(e) => onChange(e.checked)}
          flexShrink={0}
        >
          <Switch.HiddenInput />
          <Switch.Control><Switch.Thumb /></Switch.Control>
        </Switch.Root>
      </Flex>
    </Tooltip>
  )
}

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * ModelSettingsDialog — تنظیمات یک مدل، پشت دکمهٔ ⋮ همان ردیف.
 *
 * چرا دیالوگ و نه ستون‌های بیشتر در جدول: جدول مدل‌ها همین حالا هفت ستون دارد و
 * افزودن «فروش تلفنی» و «موجودی نامحدود» به‌ازای هر ردیف، آن را غیرقابل خواندن
 * می‌کرد. این تنظیم‌ها هم کم‌استفاده‌اند — برای استثناها، نه برای هر مدل.
 *
 * سرتیتر، خودِ مدل را نشان می‌دهد (تصویر، چیپِ هر مقدار با سواچ رنگش، شناسه) —
 * قبلاً فقط یک خط متنی بود و کاربر مطمئن نمی‌شد کدام ردیف را باز کرده.
 */
export function ModelSettingsDialog({
  combo, onClose, unit, source, onChange, onPickImage,
}: ModelSettingsDialogProps) {
  const [draft, setDraft] = useState<VariantCombination | null>(combo)
  useEffect(() => { setDraft(combo) }, [combo])

  if (!draft) {
    return <Dialog.Root open={false} onOpenChange={() => {}}><Portal /></Dialog.Root>
  }

  const set = (patch: Partial<VariantCombination>) =>
    setDraft((d) => (d ? { ...d, ...patch } : d))

  const setInherit = (key: 'price' | 'inventory' | 'image', on: boolean) =>
    setDraft((d) => {
      if (!d) return d
      const inherits = { ...d.inherits, [key]: on }
      // برگشت به ارث‌بری یعنی همان لحظه مقدار محصول اصلی بنشیند
      const value = on
        ? key === 'price' ? { price: source.price }
          : key === 'inventory' ? { inventory: source.inventory }
            : { image: source.image }
        : {}
      return { ...d, inherits, ...value }
    })

  const save = () => {
    onChange({
      active: draft.active,
      price: draft.price,
      salePrice: draft.salePrice,
      inventory: draft.inventory,
      image: draft.image,
      phoneSale: draft.phoneSale,
      unlimitedInventory: draft.unlimitedInventory,
      inherits: draft.inherits,
    })
    onClose()
  }

  const priceSource = `${toPersianDigits(formatThousands(Number(source.price) || 0))} ${unit}`
  const stockSource = `${toPersianDigits(source.inventory || '0')} عدد`

  return (
    <Dialog.Root open onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl" py="6">
          <Dialog.Content maxW="520px" w="full" mx="4" {...dialogEnterSubmit(save)}>

            <Dialog.Header pt="5" px="6" pb="3" position="relative" pe="12">
              <Dialog.Title fontSize="md" fontWeight="semibold" textAlign="start" w="full">
                تنظیمات مدل
              </Dialog.Title>
              {/* شناسنامهٔ مدل — FIRST = rightmost: بندانگشتی ← چیپ‌ها و شناسه */}
              <Flex align="center" gap="2.5" mt="2.5">
                <MediaThumb
                  src={draft.image}
                  boxSize="38px"
                  flexShrink={0}
                  rounded="lg"
                  borderWidth="1px"
                  borderColor="border"
                />
                <Box minW="0">
                  <Flex gap="1" wrap="wrap">
                    {draft.values.map((v) => (
                      <Flex
                        key={v}
                        align="center"
                        gap="1"
                        px="1.5"
                        h="5"
                        rounded="l2"
                        borderWidth="1px"
                        borderColor="border"
                        bg="bg.subtle"
                      >
                        {/* FIRST = rightmost: نقطهٔ رنگ (اگر مقدارِ رنگی باشد) */}
                        <Box
                          boxSize="9px"
                          rounded="full"
                          flexShrink={0}
                          bg={colorForValue(v)}
                          borderWidth="1px"
                          borderColor="blackAlpha.200"
                        />
                        <Text fontSize="2xs" color="fg" whiteSpace="nowrap">{v}</Text>
                      </Flex>
                    ))}
                  </Flex>
                  <Text fontSize="2xs" color="fg.muted" textAlign="start" dir="ltr" mt="1" truncate>
                    {draft.sku}
                  </Text>
                </Box>
              </Flex>
              <Dialog.CloseTrigger asChild position="absolute" top="3" insetEnd="3">
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body px="6" pt="1" pb="4">
              <Flex direction="column" gap="4">

                {/* ── وضعیت ──────────────────────────────────────────────── */}
                <SwitchRow
                  id="model-active"
                  label="این مدل در فروشگاه قابل خرید است"
                  hint="خاموش‌کردنش مدل را از ویترین برمی‌دارد ولی قیمت و موجودی‌اش را نگه می‌دارد."
                  checked={draft.active}
                  onChange={(v) => set({ active: v })}
                />

                {/* ── تصویر ──────────────────────────────────────────────── */}
                <Section title="تصویر مدل">
                  <Flex gap="2.5" align="center">
                    {/* FIRST = rightmost: بندانگشتی ← دکمه‌ها … کلید پیوند (چپ‌ترین) */}
                    <MediaThumb
                      src={draft.image}
                      boxSize="11"
                      flexShrink={0}
                      rounded="lg"
                      borderWidth="1px"
                      borderColor="border"
                    />
                    <Button
                      size="sm"
                      h="11"
                      variant="outline"
                      rounded="lg"
                      flex="1"
                      onClick={onPickImage}
                    >
                      {/* FIRST = rightmost: آیکن (leading) */}
                      <ImagePlus size={15} />
                      انتخاب از گالری
                    </Button>
                    {!draft.inherits.image && (
                      <Tooltip content="برگرداندن به تصویر اصلی محصول">
                        <chakra.button
                          type="button"
                          aria-label="حذف تصویر اختصاصی"
                          display="grid"
                          placeItems="center"
                          boxSize="11"
                          flexShrink={0}
                          rounded="lg"
                          borderWidth="1px"
                          borderColor="border"
                          bg="bg.subtle"
                          color="red.fg"
                          onClick={() => setInherit('image', true)}
                          {...pressable}
                        >
                          <Trash2 size={15} />
                        </chakra.button>
                      </Tooltip>
                    )}
                  </Flex>
                  <Text fontSize="2xs" color="fg.muted" textAlign="start" mt="1.5">
                    {draft.inherits.image
                      ? 'تصویر اصلی محصول را نشان می‌دهد؛ با انتخاب از گالری مستقل می‌شود.'
                      : 'تصویر اختصاصی دارد — با انتخاب این مدل در ویترین همین دیده می‌شود.'}
                  </Text>
                </Section>

                {/* ── قیمت ───────────────────────────────────────────────── */}
                <Section title="قیمت">
                  <Flex gap="2.5" align="start">
                    <Box flex="1" minW="0">
                      <NotchedField
                        label="قیمت اصلی"
                        disabled={draft.phoneSale}
                        endElement={<Text fontSize="xs" color="fg.muted">{unit}</Text>}
                      >
                        <NumberField
                          value={draft.price}
                          onChange={(v) => set({ price: v, inherits: { ...draft.inherits, price: false } })}
                          disabled={draft.phoneSale}
                        />
                      </NotchedField>
                    </Box>
                    <Box flex="1" minW="0">
                      <NotchedField
                        label="قیمت با تخفیف"
                        disabled={draft.phoneSale}
                        endElement={<Text fontSize="xs" color="fg.muted">{unit}</Text>}
                      >
                        <NumberField
                          value={draft.salePrice}
                          onChange={(v) => set({ salePrice: v })}
                          disabled={draft.phoneSale}
                        />
                      </NotchedField>
                    </Box>
                    <LinkToggle
                      inherited={draft.inherits.price}
                      sourceText={priceSource}
                      onToggle={() => setInherit('price', !draft.inherits.price)}
                    />
                  </Flex>
                  <Box mt="2.5">
                    <SwitchRow
                      id="model-phone-sale"
                      label="فروش تلفنی این مدل"
                      hint="قیمت این مدل پنهان می‌شود و خریدار به‌جای خرید، دکمهٔ تماس می‌بیند."
                      checked={draft.phoneSale}
                      onChange={(v) => set({ phoneSale: v })}
                      palette="orange"
                    />
                  </Box>
                </Section>

                {/* ── موجودی ─────────────────────────────────────────────── */}
                <Section title="موجودی">
                  <Flex gap="2.5" align="start">
                    <Box flex="1" minW="0">
                      <NotchedField
                        label="تعداد"
                        disabled={draft.unlimitedInventory}
                        endElement={<Text fontSize="xs" color="fg.muted">عدد</Text>}
                      >
                        <NumberField
                          value={draft.inventory}
                          onChange={(v) => set({ inventory: v, inherits: { ...draft.inherits, inventory: false } })}
                          disabled={draft.unlimitedInventory}
                          showSteppers
                        />
                      </NotchedField>
                    </Box>
                    <LinkToggle
                      inherited={draft.inherits.inventory}
                      sourceText={stockSource}
                      onToggle={() => setInherit('inventory', !draft.inherits.inventory)}
                    />
                  </Flex>
                  <Box mt="2.5">
                    <SwitchRow
                      id="model-unlimited"
                      label="موجودی نامحدود"
                      hint="برای کالای دیجیتال یا سفارشی‌ساز که شمارش ندارد."
                      checked={draft.unlimitedInventory}
                      onChange={(v) => set({ unlimitedInventory: v })}
                    />
                  </Box>
                </Section>

              </Flex>
            </Dialog.Body>

            <Dialog.Footer px="6" pt="0" pb="5">
              {/* LAST = leftmost: ذخیره */}
              <Flex justify="end" w="full" gap="3">
                <Button variant="outline" onClick={onClose}>انصراف</Button>
                <Button colorPalette="brand" onClick={save}>ذخیره</Button>
              </Flex>
            </Dialog.Footer>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
