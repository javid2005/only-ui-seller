import { Flex, Separator, Text } from '@chakra-ui/react'
import { TitleBar } from '@/components/ui/TitleBar'
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
  /** هزینهٔ ارسال، فرمت‌شدهٔ فارسی با « ت» — نبود یعنی هنوز از مرحلهٔ «روش ارسال» عبور نشده */
  shippingPrice?: string
  /** مبلغِ تخفیفِ اعمال‌شده، فرمت‌شدهٔ فارسی با « ت» (بدون علامت منفی) — نبود یعنی تخفیفی اعمال نشده */
  discountAmount?: string
}

/**
 * OrderDraftSummary — پنل «جزئیات سفارش» ویزارد سفارش دستی.
 * تا وقتی چیزی انتخاب نشده، مقادیر «-» می‌مانند. ردیفِ هزینهٔ ارسال فقط از مرحلهٔ «روش ارسال»
 * به بعد نمایش داده می‌شود.
 */
export function OrderDraftSummary({ itemCount, itemsTotal, payable, shippingPrice, discountAmount }: OrderDraftSummaryProps) {
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
      <TitleBar title="جزئیات سفارش" divider />

      <Flex direction="column" gap="2" w="full">
        <Flex direction="column" w="full">
          <Row label="تعداد اقلام سفارش" value={itemCount != null ? toPersianDigits(itemCount) : '-'} />
          <Row label="جمع قیمت اقلام" value={itemsTotal ?? '-'} />
        </Flex>

        {shippingPrice != null && (
          <>
            <Separator />
            <Row label="هزینه ارسال" value={shippingPrice} />
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
