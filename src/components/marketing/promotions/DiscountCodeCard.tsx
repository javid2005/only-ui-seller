import type { ReactNode } from 'react'
import { Badge, Box, Flex, IconButton, Progress, Separator, Text } from '@chakra-ui/react'
import { Copy } from 'lucide-react'
import { toaster } from '@/components/ui/toaster'
import { toPersianDigits } from '@/utils/numbers'
import {
  DISCOUNT_STATUS_COLOR,
  DISCOUNT_STATUS_LABEL,
  DISCOUNT_TYPE_COLOR,
  DISCOUNT_TYPE_LABEL,
  usageProgressColor,
  type DiscountCodeItem,
} from './discountCodesData'
import { DiscountCodeRowActionsMenu } from './DiscountCodeRowActionsMenu'

interface DiscountCodeCardProps {
  item: DiscountCodeItem
}

/** ردیف «لیبل … خط‌چین … مقدار» — لیبل FIRST (راست‌ترین)، مقدار LAST (چپ‌ترین)، طبق Figma. */
function LeaderRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Flex align="center" gap="2" px="4" w="full">
      <Text fontSize="xs" fontWeight="medium" color="fg.muted" flexShrink={0}>{label}</Text>
      <Box flex="1" minW="4" borderBottomWidth="1px" borderStyle="dashed" borderColor="border.muted" />
      {children}
    </Flex>
  )
}

/**
 * کارت موبایل کد تخفیف — Figma «Discount-Card» (instance 3122:71946؛ node لوکالِ داده‌شده
 * 3077:71869 توسط Figma API resolve نشد — از instance معادل در همان صفحهٔ موبایل استفاده شد).
 * RTL DOM order (با x مختصات + screenshot تأیید شده — نه ترتیب خام export که LTR canvas است):
 *  Header       → عنوان+بج نوع(راست‌ترین) FIRST ← دکمه سه‌نقطه(چپ‌ترین) LAST
 *  هر LeaderRow → لیبل(راست‌ترین) FIRST ← خط‌چین ← مقدار(چپ‌ترین) LAST
 *  Row پایانی   → زمان شروع(راست‌ترین) FIRST ← زمان پایان ← وضعیت(چپ‌ترین) LAST
 *
 * ⚠️ قانون بازگشتی است: هر container افقی — از جمله زوج‌های *داخل* هر LeaderRow —
 * باید جدا sort نزولی روی x بشه. INCIDENT 2026-08-08: قاعده فقط روی ردیف بیرونی
 * اعمال شد و سه زوج داخلی (Badge/سقف، کد/کپی، Progress/عدد) آینه‌ای ship شدن.
 */
export function DiscountCodeCard({ item }: DiscountCodeCardProps) {
  const handleCopy = () => {
    navigator.clipboard?.writeText(item.code)
    toaster.create({ id: `copy-discount-code-${item.code}`, title: 'کد کپی شد', type: 'success', duration: 2000 })
  }

  return (
    <Box borderWidth="1px" borderColor="border" rounded="lg" overflow="hidden" w="full" bg="bg.panel">
      <Flex align="center" justify="space-between" gap="2" borderBottomWidth="1px" borderColor="border.muted" px="4" py="2">
        <Flex align="center" gap="2" flex="1" minW="0">
          <Text fontSize="sm" fontWeight="semibold" color="fg" truncate>{item.title}</Text>
          <Badge size="xs" colorPalette={DISCOUNT_TYPE_COLOR[item.type]} variant="subtle" flexShrink={0}>
            {DISCOUNT_TYPE_LABEL[item.type]}{/* dev-engine-ignore — لیبل فارسی از پیش تعیین‌شده، عدد نیست */}
          </Badge>
        </Flex>
        <DiscountCodeRowActionsMenu item={item} size="sm" />
      </Flex>

      <Flex direction="column" gap="3" py="3">
        <LeaderRow label="مقدار تخفیف">
          {item.type === 'percentage' ? (
            /* سقف FIRST=راست‌تر (x=37) ← Badge LAST=چپ‌تر (x=0) */
            <Flex align="center" gap="2" flexShrink={0}>
              <Text fontSize="xs" color="fg.muted">{item.amountCap}{/* dev-engine-ignore */}</Text>
              <Badge size="xs" colorPalette="orange" variant="solid">{item.amountValue}{/* dev-engine-ignore */}</Badge>
            </Flex>
          ) : (
            <Text fontSize="sm" color="fg" flexShrink={0}>{item.amountValue}{/* dev-engine-ignore */}</Text>
          )}
        </LeaderRow>

        <LeaderRow label="کد تخفیف">
          {/* آیکون کپی FIRST=راست‌تر (x=92) ← کد LAST=چپ‌تر (x=0) */}
          <Flex align="center" gap="2" flexShrink={0}>
            <IconButton aria-label={`کپی کد ${item.code}`} variant="ghost" size="2xs" color="fg.muted" onClick={handleCopy}>
              <Copy size={14} />
            </IconButton>
            <Text fontSize="sm" color="fg">{item.code}</Text>
          </Flex>
        </LeaderRow>

        <LeaderRow label="استفاده شده">
          {item.usage.limit === null ? (
            <Text fontSize="sm" color="fg" flexShrink={0}>{toPersianDigits(item.usage.used)}</Text>
          ) : (
            /* عدد FIRST=راست‌تر (x=114.5) ← Progress LAST=چپ‌تر (x=0) */
            <Flex align="center" gap="4" flex="1" minW="0">
              <Text fontSize="sm" color="fg" flexShrink={0}>
                {toPersianDigits(item.usage.limit)} / {toPersianDigits(item.usage.used)}
              </Text>
              <Progress.Root
                value={(item.usage.used / item.usage.limit) * 100}
                size="xs" shape="full" colorPalette={usageProgressColor(item.status)} flex="1"
              >
                <Progress.Track>
                  <Progress.Range />
                </Progress.Track>
              </Progress.Root>
            </Flex>
          )}
        </LeaderRow>
      </Flex>

      <Flex align="center" bg="bg.subtle" borderWidth="1px" borderColor="border.muted" borderBottomRadius="md" py="2">
        <Flex flex="1" direction="column" align="center" gap="2" p="2">
          <Text fontSize="xs" fontWeight="medium" color="fg.muted">زمان شروع</Text>
          <Text fontSize="sm" fontWeight="semibold" color="fg">{item.startDate ?? '-'}</Text>
        </Flex>
        <Separator orientation="vertical" h="6" />
        <Flex flex="1" direction="column" align="center" gap="2" p="2">
          <Text fontSize="xs" fontWeight="medium" color="fg.muted">زمان پایان</Text>
          <Text fontSize="sm" fontWeight="semibold" color="fg">{item.endDate ?? '-'}</Text>
        </Flex>
        <Separator orientation="vertical" h="6" />
        <Flex flex="1" direction="column" align="center" gap="2" p="2">
          <Text fontSize="xs" fontWeight="medium" color="fg.muted">وضعیت</Text>
          <Badge size="xs" colorPalette={DISCOUNT_STATUS_COLOR[item.status]} variant="subtle">
            {DISCOUNT_STATUS_LABEL[item.status]}{/* dev-engine-ignore — لیبل فارسی از پیش تعیین‌شده، عدد نیست */}
          </Badge>
        </Flex>
      </Flex>
    </Box>
  )
}
