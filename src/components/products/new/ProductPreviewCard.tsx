import { useState } from 'react'
import { Flex, Box, Text, Badge, Collapsible, chakra } from '@chakra-ui/react'
import { ChevronDown, Eye } from 'lucide-react'
import { toPersianDigits, formatThousands } from '@/utils/numbers'
import { MediaThumb } from './MediaThumb'
import { currencyLabel, type ProductForm } from './data'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface ProductPreviewCardProps {
  form: ProductForm
  /** موبایل/compact → فشرده و قابل بازشدن */
  collapsible?: boolean
}

const money = (v: string) => toPersianDigits(formatThousands(Number(v) || 0))

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * ProductPreviewCard — پیش‌نمایش زندهٔ محصول، زیر استپر.
 *
 * هر چیزی که اینجا دیده می‌شود از همان state فرم می‌آید؛ با تایپ کاربر بلافاصله
 * عوض می‌شود. نقشش این است که فروشنده قبل از انتشار ببیند خریدار چه می‌بیند.
 *
 * روی موبایل به یک نوار فشرده جمع می‌شود که با کلیک باز می‌شود (بند ۱۴ دور
 * «چاکرا طراح»: پیش‌نمایش در موبایل فشرده و قابل بازشدن باشد).
 *
 * RTL DOM order (first = rightmost): تصویر ← عنوان و قیمت.
 */
export function ProductPreviewCard({ form, collapsible = false }: ProductPreviewCardProps) {
  const [open, setOpen] = useState(!collapsible)

  const featured = form.gallery.find((img) => img.featured) ?? form.gallery[0]
  const title = form.name.trim() || 'نام محصول'
  const unit = currencyLabel(form.currency)

  const priceNum = Number(form.price) || 0
  const discountNum = Number(form.discountValue) || 0
  const finalPrice =
    form.hasDiscount && priceNum && discountNum
      ? Math.max(0, Math.round(
          form.discountType === 'percent' ? priceNum - (priceNum * discountNum) / 100 : priceNum - discountNum,
        ))
      : priceNum

  const hasDiscount = form.hasDiscount && finalPrice !== priceNum && priceNum > 0

  const body = (
    <Flex direction="column" gap="3" w="full">

      {/* FIRST = rightmost: تصویر شاخص · سپس عنوان و قیمت */}
      <Flex gap="3" align="start" w="full">
        <MediaThumb
          src={featured?.src}
          alt={title}
          boxSize="64px"
          flexShrink={0}
          rounded="lg"
          borderWidth="1px"
          borderColor="border.muted"
        />
        <Box flex="1" minW="0">
          <Text fontSize="sm" fontWeight="semibold" color="fg" textAlign="start" lineClamp={2}>
            {title}
          </Text>
          <Flex align="baseline" gap="2" wrap="wrap" mt="1">
            {/* FIRST = rightmost: قیمت نهایی · قیمت خط‌خورده سمت چپ */}
            <Text fontSize="sm" fontWeight="semibold" color="brand.fg" whiteSpace="nowrap">
              {form.phoneSale ? 'تماس بگیرید' : `${money(String(finalPrice))} ${unit}`}
            </Text>
            {hasDiscount && (
              <Text fontSize="xs" color="fg.muted" textDecoration="line-through" whiteSpace="nowrap">
                {money(form.price)} {unit}
              </Text>
            )}
          </Flex>
        </Box>
      </Flex>

      {/* موجودی */}
      <Flex align="center" gap="2" wrap="wrap">
        <Badge colorPalette="gray" variant="subtle" size="xs" rounded="l2">
          {form.unlimitedInventory
            ? 'موجودی: نامحدود'
            : `موجودی: ${toPersianDigits(form.inventory || '۰')} عدد`}
        </Badge>
        {form.hasVariants && (
          <Badge colorPalette="purple" variant="subtle" size="xs" rounded="l2">
            {toPersianDigits(form.combinations.length)} ترکیب
          </Badge>
        )}
      </Flex>

      {/* چیپ‌های تنوع — هر تنوع یک ردیف: عنوان راست، مقدارها چپ */}
      {form.variants.filter((v) => v.values.length > 0).map((variant) => (
        <Flex key={variant.id} align="center" gap="2" w="full">
          <Text fontSize="2xs" color="fg.muted" flexShrink={0} whiteSpace="nowrap">
            {variant.title || 'تنوع'}
          </Text>
          <Flex gap="1.5" wrap="wrap" flex="1" justify="end">
            {variant.values.map((val, i) => (
              <Badge
                key={val.id}
                colorPalette={i === 0 ? 'brand' : 'gray'}
                variant={i === 0 ? 'subtle' : 'outline'}
                size="xs"
                rounded="l2"
              >
                {val.label}
              </Badge>
            ))}
          </Flex>
        </Flex>
      ))}

    </Flex>
  )

  if (!collapsible) {
    return (
      <Box bg="bg.panel" borderWidth="1px" borderColor="border" rounded="xl" p="4" w="full">
        <Flex align="center" gap="2" mb="3">
          {/* FIRST = rightmost: آیکن */}
          <Box color="fg.muted"><Eye size={15} /></Box>
          <Text fontSize="xs" fontWeight="medium" color="fg.muted" flex="1" textAlign="start">
            پیش‌نمایش محصول
          </Text>
        </Flex>
        {body}
      </Box>
    )
  }

  return (
    <Collapsible.Root open={open} onOpenChange={(e) => setOpen(e.open)} w="full">
      <Box bg="bg.panel" borderWidth="1px" borderColor="border" rounded="xl" w="full" overflow="hidden">
        <Collapsible.Trigger asChild>
          <chakra.button
            type="button"
            display="flex"
            alignItems="center"
            gap="2"
            w="full"
            px="4"
            h="12"
            bg="transparent"
            _focusVisible={{ outline: '2px solid', outlineColor: 'brand.focusRing', outlineOffset: '-2px' }}
          >
            {/* FIRST = rightmost: آیکن · عنوان · chevron چپ‌ترین */}
            <Box color="fg.muted"><Eye size={15} /></Box>
            <Text fontSize="xs" fontWeight="medium" color="fg.muted" flex="1" textAlign="start">
              پیش‌نمایش محصول
            </Text>
            <Box
              color="fg.muted"
              transform={open ? 'rotate(180deg)' : undefined}
              transition="transform 0.18s"
            >
              <ChevronDown size={16} />
            </Box>
          </chakra.button>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <Box px="4" pb="4">{body}</Box>
        </Collapsible.Content>
      </Box>
    </Collapsible.Root>
  )
}
