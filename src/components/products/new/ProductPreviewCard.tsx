import { useEffect, useRef, useState } from 'react'
import { Box, Flex, Text, chakra } from '@chakra-ui/react'
import { Maximize2, Minimize2 } from 'lucide-react'
import { toPersianDigits, formatThousands } from '@/utils/numbers'
import { MediaThumb } from './MediaThumb'
import { currencyLabel, type ProductForm } from './data'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface ProductPreviewCardProps {
  form: ProductForm
  /**
   * `rail` — کارت شناور ستون راست (دسکتاپ).
   * `dock` — نوار فشرده چسبیده به پایین صفحه با کلید ماکسیمایز (موبایل).
   */
  variant?: 'rail' | 'dock'
}

const money = (v: string | number) => toPersianDigits(formatThousands(Number(v) || 0))

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * ProductPreviewCard — کارت پیش‌نمایش زندهٔ محصول.
 *
 * شکلش از طرح تأییدشده گرفته شده: تصویر **تمام‌عرض و بدون فریم** که مستقیم به یک
 * بدنهٔ سفید می‌چسبد، و داخل بدنه قیمت، موجودی و انتخابگرهای تنوع. عنوانی مثل
 * «پیش‌نمایش محصول» بالایش نیست — کاربر از شکل کارت می‌فهمد این چیست.
 *
 * جلب توجه در بروزرسانی: هر بار محتوای کارت عوض می‌شود یک نوار باریکِ برند از بالا
 * رد می‌شود و قاب کارت برای ~۶۰۰ms حلقهٔ برند می‌گیرد. ملایم است، جای چیزی را
 * جابه‌جا نمی‌کند، و `prefers-reduced-motion` خاموشش می‌کند.
 *
 * RTL DOM order هر ردیف تنوع (first = rightmost): عنوان تنوع ← مقدارها.
 */
export function ProductPreviewCard({ form, variant = 'rail' }: ProductPreviewCardProps) {
  const featuredImage = form.gallery.find((img) => img.featured) ?? form.gallery[0]
  const title = form.name.trim() || 'نام محصول'
  const unit = currencyLabel(form.currency)

  // انتخاب‌های نمایشی — پیش‌نمایش تعاملی است، مثل صفحهٔ محصول
  const [picked, setPicked] = useState<Record<string, string>>({})
  const [expanded, setExpanded] = useState(false)

  // ─── حل «مدلِ انتخاب‌شده» ─────────────────────────────────────────────────────
  /**
   * این بلوک قلبِ پیش‌نمایشِ زنده است (بازخورد کاربر، مورد ۱۲).
   *
   * قبلاً کارت فقط `form.variants` (تعریفِ انتخاب‌ها) و قیمتِ سطحِ محصول را
   * می‌خواند — پس غیرفعال‌کردن یک مدل، قیمتِ اختصاصی یا تصویرِ اختصاصیِ آن هیچ
   * اثری نداشت و کلیک روی چیپ فقط رنگِ خودِ چیپ را عوض می‌کرد. حالا از
   * `form.combinations` — همان منبعی که جدول مدل‌ها می‌نویسد — خوانده می‌شود،
   * پس هر تغییر در آن جدول همان لحظه در پیش‌نمایش دیده می‌شود.
   *
   * ترتیب `activeOptions` عمداً همان ترتیبی است که `buildCombinations` استفاده
   * می‌کند (تنوع‌های دارای مقدار، به ترتیب `form.variants`) — وگرنه تطبیقِ
   * `values` با ترکیب‌ها به‌هم می‌ریزد.
   */
  const activeOptions = form.variants.filter((v) => v.values.length > 0)
  const hasModels = form.hasVariants && activeOptions.length > 0 && form.combinations.length > 0

  /** آیا این مقدار از این تنوع، در کنار انتخاب‌های فعلیِ بقیه، مدلِ فعالی دارد؟ */
  const labelOf = (optIndex: number, over?: { index: number; label: string }) => {
    const opt = activeOptions[optIndex]
    if (over && over.index === optIndex) return over.label
    const pickedId = picked[opt.id]
    const hit = opt.values.find((v) => v.id === pickedId)
    return (hit ?? opt.values[0])?.label ?? ''
  }
  const comboFor = (over?: { index: number; label: string }) => {
    const wanted = activeOptions.map((_, i) => labelOf(i, over))
    return form.combinations.find(
      (c) => c.values.length === wanted.length && c.values.every((v, i) => v === wanted[i]),
    )
  }
  const isValueAvailable = (optIndex: number, label: string) => {
    if (!hasModels) return true
    // همهٔ ترکیب‌هایی که این مقدار را دارند؛ اگر هیچ‌کدام فعال نیست، مقدار ناموجود است
    return form.combinations.some((c) => c.values[optIndex] === label && c.active)
  }

  const combo = hasModels ? comboFor() : undefined
  const soldOut = hasModels && (!combo || !combo.active)

  // ─── قیمت، موجودی و تصویر — از مدل، نه از سطح محصول ──────────────────────────
  const phoneSale = hasModels ? Boolean(combo?.phoneSale ?? form.phoneSale) : form.phoneSale
  const basePriceSrc = hasModels ? (combo?.price ?? '') : form.price
  const salePriceSrc = hasModels ? (combo?.salePrice ?? '') : form.salePrice

  const priceNum = Number(basePriceSrc) || 0
  const saleNum = Number(salePriceSrc) || 0
  const hasDiscount = saleNum > 0 && priceNum > 0 && saleNum < priceNum
  const finalPrice = hasDiscount ? saleNum : priceNum

  const unlimited = hasModels ? Boolean(combo?.unlimitedInventory) : form.unlimitedInventory
  const stock = hasModels ? (combo?.inventory ?? '') : form.inventory

  // تصویر اختصاصی مدل بر تصویر شاخص اولویت دارد — همان رفتار ویترین
  const shownImage = (hasModels && combo?.image) || featuredImage?.src || ''

  // ─── جلب توجه هنگام بروزرسانی ────────────────────────────────────────────────
  const [pulse, setPulse] = useState(0)
  const signature = JSON.stringify([
    title, form.price, form.salePrice, form.inventory, form.unlimitedInventory,
    featuredImage?.src ?? '', form.currency, form.phoneSale,
    form.variants.map((v) => [v.title, v.values.map((x) => x.label), v.values.map((x) => x.color)]),
    // مدل‌ها هم بخشی از امضا هستند: غیرفعال‌کردن یا قیمت‌گذاریِ یک مدل باید
    // همان انیمیشنِ «چیزی عوض شد» را بگیرد (بازخورد کاربر، مورد ۱۲).
    form.combinations.map((c) => [c.values.join('|'), c.active, c.price, c.salePrice, c.inventory, c.unlimitedInventory, c.image, c.phoneSale]),
  ])
  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    setPulse((n) => n + 1)
  }, [signature])

  const body = (
    <Box p="3.5">
      <Text fontSize="sm" fontWeight="extrabold" color="fg" textAlign="start" px="0.5" mb="2.5" lineClamp={2}>
        {title}
      </Text>

      {/* قیمت — کادر ته‌رنگی، قیمت اصلی راست و قیمت خط‌خورده چپ */}
      <Flex
        align="end"
        justify="space-between"
        gap="2"
        px="2.5"
        py="2.25"
        rounded="10px"
        borderWidth="1px"
        borderColor="brand.muted"
        bgGradient="to-bl"
        gradientFrom="bg.panel"
        gradientTo="brand.bg"
      >
        {/* FIRST = rightmost: قیمت نهایی — مدلِ غیرفعال اصلاً قیمت نشان نمی‌دهد،
            دقیقاً مثل ویترین */}
        <Text fontSize="md" fontWeight="black" color={soldOut ? 'fg.muted' : 'fg'} whiteSpace="nowrap">
          {soldOut ? 'ناموجود' : phoneSale ? 'تماس بگیرید' : `${money(finalPrice)} ${unit}`}
        </Text>
        {!soldOut && !phoneSale && hasDiscount && (
          <Text fontSize="2xs" color="fg.muted" textDecoration="line-through" whiteSpace="nowrap">
            {money(basePriceSrc)} {unit}
          </Text>
        )}
      </Flex>

      <Text
        fontSize="xs"
        color={soldOut ? 'orange.fg' : 'fg.muted'}
        textAlign="start"
        mt="2"
        px="2.5"
        py="2"
        rounded="8px"
        bg={soldOut ? 'orange.bg' : 'bg.subtle'}
      >
        {soldOut
          ? 'این مدل غیرفعال است و در فروشگاه قابل خرید نیست.'
          : unlimited
            ? 'موجودی: نامحدود'
            : `موجودی: ${toPersianDigits(stock || '0')} عدد`}
      </Text>

      {/* انتخابگرهای تنوع — `activeOptions` تا ایندکسِ هر تنوع با ستون متناظرش در
          `combinations.values` یکی بماند */}
      {activeOptions.length > 0 && (
        <Flex direction="column" gap="2" mt="3">
          {activeOptions.map((variantOpt, optIndex) => {
            const active = picked[variantOpt.id] ?? variantOpt.values[0]?.id
            return (
              <Flex key={variantOpt.id} align="center" gap="2">
                {/* FIRST = rightmost: عنوان تنوع */}
                <Text fontSize="2xs" color="fg.muted" w="48px" flexShrink={0} textAlign="start" truncate>
                  {variantOpt.title || 'تنوع'}
                </Text>
                <Flex gap="1.5" wrap="wrap" flex="1" minW="0">
                  {variantOpt.values.map((val) => {
                    const on = val.id === active
                    /* مقداری که همهٔ مدل‌هایش غیرفعال‌اند، در ویترین خط‌خورده و
                       غیرقابل‌انتخاب دیده می‌شود — همان‌جا هم انتخابش ممکن نیست. */
                    const available = isValueAvailable(optIndex, val.label)
                    return (
                      <chakra.button
                        key={val.id}
                        type="button"
                        title={available ? val.label : `${val.label} — ناموجود`}
                        aria-disabled={!available}
                        onClick={() => setPicked((prev) => ({ ...prev, [variantOpt.id]: val.id }))}
                        display="inline-flex"
                        alignItems="center"
                        gap="1.5"
                        minH="25px"
                        px="1.5"
                        rounded="6px"
                        fontSize="2xs"
                        cursor="pointer"
                        borderWidth="1px"
                        transition="border-color .18s, background .18s, color .18s, opacity .18s"
                        borderColor={on ? 'brand.solid' : 'border'}
                        bg={on ? 'brand.bg' : 'bg.panel'}
                        color={on ? 'brand.fg' : 'fg.muted'}
                        opacity={available ? 1 : 0.45}
                        textDecoration={available ? undefined : 'line-through'}
                      >
                        {/* FIRST = rightmost: نقطهٔ رنگ (فقط تنوع رنگی) */}
                        {val.color && (
                          <Box
                            boxSize="11px"
                            rounded="full"
                            flexShrink={0}
                            bg={val.color}
                            borderWidth="1px"
                            borderColor="blackAlpha.200"
                          />
                        )}
                        {val.label}
                      </chakra.button>
                    )
                  })}
                </Flex>
              </Flex>
            )
          })}
        </Flex>
      )}
    </Box>
  )

  const card = (
    <Box
      key={variant}
      position="relative"
      w="full"
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border"
      rounded="15px"
      overflow="hidden"
      boxShadow="0 8px 24px rgba(30, 51, 60, 0.075)"
      css={{
        '@media (prefers-reduced-motion: no-preference)': {
          animation: pulse > 0 ? 'previewPulse .6s ease-out' : undefined,
        },
        '@keyframes previewPulse': {
          '0%':   { boxShadow: '0 0 0 0 var(--chakra-colors-brand-solid)' },
          '35%':  { boxShadow: '0 0 0 3px var(--chakra-colors-brand-muted)' },
          '100%': { boxShadow: '0 8px 24px rgba(30, 51, 60, 0.075)' },
        },
        '@keyframes previewSweep': { from: { width: '0%' }, to: { width: '100%' } },
      }}
    >
      {/* نوار باریکِ بالا — هر بروزرسانی یک‌بار از راست به چپ پر می‌شود */}
      {pulse > 0 && (
        <Box
          key={pulse}
          position="absolute"
          top="0"
          insetInlineStart="0"
          h="3px"
          zIndex="1"
          bgGradient="to-l"
          gradientFrom="brand.emphasized"
          gradientTo="brand.solid"
          css={{ animation: 'previewSweep .65s ease both' }}
          aria-hidden
        />
      )}

      {/* سقف ارتفاع: تصویرِ بلند ریل را از پنجره بلندتر می‌کرد و انتهای کارت
          هیچ‌وقت دیده نمی‌شد */}
      <MediaThumb src={shownImage} alt={title} aspectRatio="1.25" w="full" maxH="190px" />
      {body}
    </Box>
  )

  if (variant === 'rail') return card

  // ─── حالت موبایل: فشرده در پایین صفحه، با ماکسیمایز ──────────────────────────
  return (
    <Box
      position="fixed"
      insetInline="0"
      bottom="0"
      zIndex="sticky"
      px="3"
      pb="3"
      pointerEvents="none"
    >
      <Box maxW="360px" mx="auto" pointerEvents="auto">
        {/* حالت باز: عمداً کوچک و جمع — کاربر باید هم‌زمان بخشی از فرم زیرش را
            هم ببیند، نه اینکه کل صفحه پوشیده شود */}
        {expanded && (
          <Box mb="2" maxH="52dvh" overflowY="auto" rounded="15px" boxShadow="0 16px 40px rgba(30, 51, 60, 0.22)">
            {card}
          </Box>
        )}

        {/* نوار فشرده — همیشه دیده می‌شود */}
        <Flex
          align="center"
          gap="2"
          h="12"
          px="2.5"
          bg="bg.panel"
          borderWidth="1px"
          borderColor="border"
          rounded="2xl"
          boxShadow="0 8px 24px rgba(30, 51, 60, 0.16)"
        >
          {/* FIRST = rightmost: بندانگشتی ← عنوان و قیمت ← کلید باز/بسته (چپ‌ترین) */}
          <MediaThumb
            src={shownImage}
            alt={title}
            boxSize="34px"
            flexShrink={0}
            rounded="lg"
            borderWidth="1px"
            borderColor="border.muted"
          />
          <Box flex="1" minW="0">
            <Text fontSize="2xs" color="fg" textAlign="start" truncate>{title}</Text>
            <Text
              fontSize="2xs"
              color={soldOut ? 'orange.fg' : 'brand.fg'}
              fontWeight="bold"
              textAlign="start"
              truncate
            >
              {soldOut ? 'ناموجود' : phoneSale ? 'تماس بگیرید' : `${money(finalPrice)} ${unit}`}
            </Text>
          </Box>
          <chakra.button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? 'بستن پیش‌نمایش' : 'باز کردن پیش‌نمایش'}
            aria-expanded={expanded}
            display="grid"
            placeItems="center"
            boxSize="8"
            flexShrink={0}
            rounded="lg"
            cursor="pointer"
            color="brand.fg"
            bg="brand.bg"
            _hover={{ bg: 'brand.subtle' }}
          >
            {expanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </chakra.button>
        </Flex>
      </Box>
    </Box>
  )
}
