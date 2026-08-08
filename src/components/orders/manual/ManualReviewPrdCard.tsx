import { Badge, Flex, Image, Text } from '@chakra-ui/react'
import { toPersianDigits } from '@/utils/numbers'
import type { ManualProduct, SelectedProductLine } from './manualOrderData'

/**
 * ManualReviewPrdCard — کارتِ فقط-نمایشیِ محصول در «بررسی نهایی سفارش» مرحلهٔ ۵
 * (Figma local component «Manual-ReviewPrd-Card», node 4943:75706).
 *
 * RTL DOM order (اولین = راست‌ترین):
 *   تصویر (راست) → عنوان/بج‌های تنوع (وسط) → قیمت+بجِ دلاری/تعداد (چپ)
 * داخلِ ردیفِ قیمت خودش — هم‌الگو با ProductCard مرحلهٔ ۲: بجِ $ FIRST (راستِ قیمت) →
 * قیمت SECOND (طبق درخواست کاربر — بج دلاری سمت راستِ مبلغ تومانی).
 *
 * زیر sm (< 480px، هم‌الگو با SelectedProductRow): ردیف اصلی column می‌شود — تصویر+عنوان
 * در ردیف اول (عنوان wrap می‌شود، نه truncate)، قیمت+تعداد در ردیف دومِ زیرش، همچنان چپ‌چین
 * (`justify="end"` روی خودِ ردیف، چون در حالت column دیگر عضوی از فلکس افقی نیست).
 */
export function ManualReviewPrdCard({ product, line }: { product: ManualProduct; line: SelectedProductLine }) {
  return (
    <Flex
      direction={{ base: 'column', sm: 'row' }}
      align={{ base: 'stretch', sm: 'center' }}
      gap={{ base: '3', sm: '4' }}
      w="full"
      p="4"
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border.muted"
      rounded="lg"
    >
      {/* ردیف تصویر+عنوان — روی موبایل (base) ردیف اول */}
      <Flex align="center" gap="4" flex="1" minW="0">
        {/* تصویر — FIRST = راست‌ترین */}
        <Flex
          align="center"
          justify="center"
          boxSize="12"
          flexShrink={0}
          bg="bg.muted"
          borderWidth="1px"
          borderColor="border.muted"
          rounded="md"
          overflow="hidden"
        >
          <Image src={product.image} alt={product.name} boxSize="full" objectFit="cover" />
        </Flex>

        {/* عنوان + بج‌های تنوع — SECOND. align="start" روی column flex در RTL = راست
            (نه end — طبق قاعدهٔ پروژه، هرچند اینجا چون فرزندها w="full" هستن اثر بصری نداشت).
            زیر sm عنوان wrap می‌شود (بدون lineClamp) تا کامل خوانده شود؛ از sm به بالا یک‌خطی+truncate. */}
        <Flex direction="column" gap="2" flex="1" minW="0" align="start">
          <Text fontSize="sm" fontWeight="semibold" color="fg" w="full" textAlign="start" lineClamp={{ base: undefined, sm: 1 }}>
            {product.name}
          </Text>
          {line.variantLabels && line.variantLabels.length > 0 && (
            <Flex justify="start" gap="1.5" wrap="wrap" w="full">
              {line.variantLabels.map((label) => (
                <Badge key={label} size="xs" colorPalette="gray" variant="outline">{label}</Badge>
              ))}
            </Flex>
          )}
        </Flex>
      </Flex>

      {/* قیمت + تعداد — LAST = چپ‌ترین. align="end" روی column flex در RTL = چپ
          (طبق درخواست کاربر: قیمت و تعدادِ زیرش هر دو چپ‌چین، نه راست‌چین).
          زیر sm این کل بلوک به ردیفِ دومِ جدا می‌رود؛ justify="end" چپ‌چین نگهش می‌دارد. */}
      <Flex
        direction="column"
        gap="1"
        flexShrink={0}
        align="end"
        justify={{ base: 'end', sm: 'start' }}
        w={{ base: 'full', sm: 'auto' }}
      >
        <Flex align="center" gap="2">
          {product.priceToman && product.priceUsd && (
            <Badge size="xs" colorPalette="gray" variant="subtle">{`$ ${product.priceUsd}`}</Badge>
          )}
          <Text fontSize="md" fontWeight="medium" color="fg" whiteSpace="nowrap">
            {product.priceToman ? `${product.priceToman} ت` : `$ ${product.priceUsd}`}
          </Text>
        </Flex>
        <Text fontSize="xs" color="gray.fg" whiteSpace="nowrap">{`${toPersianDigits(line.quantity)} عدد`}</Text>
      </Flex>
    </Flex>
  )
}
