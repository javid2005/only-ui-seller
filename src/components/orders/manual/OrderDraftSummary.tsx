import { Flex, Separator, Text } from '@chakra-ui/react'
import { toPersianDigits } from '@/utils/numbers'

/** RTL: برچسب اولِ DOM = راست · مقدار آخر = چپ. پیش‌فرضِ رنگِ مقدار fg.muted — فقط تخفیف (سبز) و مبلغ قابل‌پرداخت (fg) override می‌شوند */
function Row({ label, value, size = 'sm', valueColor = 'fg.muted' }: { label: string; value: string; size?: 'sm' | 'md'; valueColor?: string }) {
  return (
    <Flex align="center" justify="space-between" gap="3" w="full" py="2">
      <Text fontSize="xs" fontWeight="medium" color="fg.muted">{label}</Text>
      <Text fontSize={size} fontWeight="semibold" color={valueColor}>{value}</Text>
    </Flex>
  )
}

interface OrderDraftSummaryProps {
  /** تعداد کل اقلام (جمع quantity همهٔ ردیف‌ها) — نبود یعنی هنوز محصولی انتخاب نشده */
  itemCount?: number
  /** جمع قیمت اقلام، فرمت‌شدهٔ فارسی با « ت» */
  itemsTotal?: string
  /** مبلغ قابل پرداخت، فرمت‌شدهٔ فارسی با « ت» */
  payable?: string
  /** از مرحلهٔ «روش ارسال» به بعد true — ردیف‌های نوع/هزینهٔ ارسال را نمایش می‌دهد (حتی قبل از انتخابِ روش) */
  showShipping?: boolean
  /** هزینهٔ ارسال، فرمت‌شدهٔ فارسی با « ت» — نبود یعنی هنوز روشی انتخاب نشده («تعیین نشده»/«براساس نوع ارسال» نمایش داده می‌شود) */
  shippingPrice?: string
  /** مبلغِ تخفیفِ اعمال‌شده، فرمت‌شدهٔ فارسی با « ت» (بدون علامت منفی) — نبود یعنی تخفیفی اعمال نشده */
  discountAmount?: string
}

/**
 * OrderDraftSummary — پنل «جزئیات سفارش» ویزارد سفارش دستی.
 * تا وقتی چیزی انتخاب نشده، مقادیر «-» می‌مانند. ردیف‌های نوع/هزینهٔ ارسال از مرحلهٔ «روش ارسال»
 * به بعد نمایش داده می‌شوند — قبل از انتخابِ روشِ خاص، «تعیین نشده»/«براساس نوع ارسال» نشان می‌دهند.
 */
export function OrderDraftSummary({ itemCount, itemsTotal, payable, showShipping, shippingPrice, discountAmount }: OrderDraftSummaryProps) {
  return (
    <Flex
      direction="column"
      gap="6"
      w="full"
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border"
      rounded="2xl"
      p="6"
    >
      <Flex direction="column" gap="2" w="full">
        <Flex direction="column" w="full">
          <Row label="تعداد اقلام سفارش" value={itemCount != null ? toPersianDigits(itemCount) : '-'} />
          <Row label="جمع قیمت اقلام" value={itemsTotal ?? '-'} />
        </Flex>

        {showShipping && (
          <>
            <Separator />
            {/* «پیش کرایه» همون مقدارِ ثابتیه که در ShippingCard/OrderReviewPanel هم نمایش داده می‌شه
                (فعلاً در MANUAL_SHIPPING_METHODS فیلد جدا برای پیش‌کرایه/پس‌کرایه نیست). قبل از
                انتخابِ روش، هر دو ردیف placeholder نشون می‌دن (طبق درخواست کاربر). بدون gap بین
                خودشون — Flex جدا (هم‌الگو با گروه‌های دیگه) که فاصله فقط از py خودِ Row بیاد. */}
            <Flex direction="column" w="full">
              <Row label="نوع ارسال" value={shippingPrice != null ? 'پیش کرایه' : 'تعیین نشده'} />
              <Row label="هزینه ارسال" value={shippingPrice ?? 'براساس نوع ارسال'} />
            </Flex>
          </>
        )}

        <Separator />

        <Flex direction="column" w="full">
          {discountAmount != null && (
            <Row label="تخفیف" value={discountAmount} valueColor="fg.success" />
          )}
          <Row label="مبلغ قابل پرداخت" value={payable ?? '-'} size="md" valueColor="fg" />
        </Flex>
      </Flex>
    </Flex>
  )
}
