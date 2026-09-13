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
  const featured = form.gallery.find((img) => img.featured) ?? form.gallery[0]
  const title = form.name.trim() || 'نام محصول'
  const unit = currencyLabel(form.currency)

  const priceNum = Number(form.price) || 0
  const saleNum = Number(form.salePrice) || 0
  const hasDiscount = saleNum > 0 && priceNum > 0 && saleNum < priceNum
  const finalPrice = hasDiscount ? saleNum : priceNum

  // انتخاب‌های نمایشی — پیش‌نمایش تعاملی است، مثل صفحهٔ محصول
  const [picked, setPicked] = useState<Record<string, string>>({})
  const [expanded, setExpanded] = useState(false)

  // ─── جلب توجه هنگام بروزرسانی ────────────────────────────────────────────────
  const [pulse, setPulse] = useState(0)
  const signature = JSON.stringify([
    title, form.price, form.salePrice, form.inventory, form.unlimitedInventory,
    featured?.src ?? '', form.currency, form.phoneSale,
    form.variants.map((v) => [v.title, v.values.map((x) => x.label)]),
  ])
  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    setPulse((n) => n + 1)
  }, [signature])

  const body = (
    <Box p="2.5">
      <Text fontSize="sm" fontWeight="extrabold" color="fg" textAlign="start" px="0.5" mb="2" lineClamp={2}>
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
        {/* FIRST = rightmost: قیمت نهایی */}
        <Text fontSize="md" fontWeight="black" color="fg" whiteSpace="nowrap">
          {form.phoneSale ? 'تماس بگیرید' : `${money(finalPrice)} ${unit}`}
        </Text>
        {hasDiscount && (
          <Text fontSize="2xs" color="fg.muted" textDecoration="line-through" whiteSpace="nowrap">
            {money(form.price)} {unit}
          </Text>
        )}
      </Flex>

      <Text fontSize="xs" color="fg.muted" textAlign="start" mt="1.5" px="2" py="1.5" rounded="7px" bg="bg.subtle">
        {form.unlimitedInventory
          ? 'موجودی: نامحدود'
          : `موجودی: ${toPersianDigits(form.inventory || '0')} عدد`}
      </Text>

      {/* انتخابگرهای تنوع */}
      {form.variants.filter((v) => v.values.length > 0).length > 0 && (
        <Flex direction="column" gap="1.5" mt="2.5">
          {form.variants.filter((v) => v.values.length > 0).map((variantOpt) => {
            const active = picked[variantOpt.id] ?? variantOpt.values[0]?.id
            return (
              <Flex key={variantOpt.id} align="center" gap="1.5">
                {/* FIRST = rightmost: عنوان تنوع */}
                <Text fontSize="2xs" color="fg.muted" w="48px" flexShrink={0} textAlign="start" truncate>
                  {variantOpt.title || 'تنوع'}
                </Text>
                <Flex gap="1" wrap="wrap" flex="1" minW="0">
                  {variantOpt.values.map((val) => {
                    const on = val.id === active
                    return (
                      <chakra.button
                        key={val.id}
                        type="button"
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
                        transition="border-color .18s, background .18s, color .18s"
                        borderColor={on ? 'brand.solid' : 'border'}
                        bg={on ? 'brand.bg' : 'bg.panel'}
                        color={on ? 'brand.fg' : 'fg.muted'}
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

      <MediaThumb src={featured?.src} alt={title} aspectRatio="1.1" w="full" padRatio={0.08} />
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
      <Box maxW="480px" mx="auto" pointerEvents="auto">
        {expanded && <Box mb="2">{card}</Box>}

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
            src={featured?.src}
            alt={title}
            boxSize="34px"
            flexShrink={0}
            rounded="lg"
            borderWidth="1px"
            borderColor="border.muted"
          />
          <Box flex="1" minW="0">
            <Text fontSize="2xs" color="fg" textAlign="start" truncate>{title}</Text>
            <Text fontSize="2xs" color="brand.fg" fontWeight="bold" textAlign="start" truncate>
              {form.phoneSale ? 'تماس بگیرید' : `${money(finalPrice)} ${unit}`}
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
