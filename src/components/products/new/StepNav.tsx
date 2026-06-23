import { Tabs, Badge, Text } from '@chakra-ui/react'
import { STEPS, type StepId } from './data'
import { toPersianDigits } from '@/utils/numbers'

// ─── Status badge ───────────────────────────────────────────────────────────────
// pending → نارنجی «درانتظار تکمیل» · complete → سبز «کامل شده» · number → شمارش تنوع
export type StepStatus = 'pending' | 'complete' | number

function StatusBadge({ status }: { status: StepStatus }) {
  if (typeof status === 'number') {
    return (
      <Badge colorPalette="orange" variant="subtle" size="xs" rounded="l2" flexShrink={0}>
        {toPersianDigits(status)}
      </Badge>
    )
  }
  if (status === 'complete') {
    return (
      <Badge colorPalette="green" variant="subtle" size="xs" rounded="l2" flexShrink={0}>
        کامل شده
      </Badge>
    )
  }
  return (
    <Badge colorPalette="orange" variant="subtle" size="xs" rounded="l2" flexShrink={0}>
      درانتظار تکمیل
    </Badge>
  )
}

// ─── StepNav ─────────────────────────────────────────────────────────────────────

export interface StepNavProps {
  active: StepId
  onSelect: (id: StepId) => void
  /** وضعیت هر تب */
  statuses: Record<StepId, StepStatus>
  /** عمودی (ستون راست دسکتاپ) یا افقی (بالای فرم در موبایل/compact) */
  orientation?: 'vertical' | 'horizontal'
  /** غیرفعال‌سازی تب‌هایی که هنوز پیاده نشده‌اند */
  disabled?: StepId[]
}

/**
 * StepNav — نویگیشن مرحله‌ای ساخت محصول (اطلاعات محصول / گالری / تنوع‌ها).
 *
 * از Chakra `Tabs` (variant subtle) استفاده می‌کند — همان الگوی ThemeCustomize:
 * دو instance (عمودی دسکتاپ + افقی موبایل) با state مشترک کنترل می‌شوند؛
 * محتوای تب جدا (در NewProduct) رندر می‌شود نه با Tabs.Content.
 *
 * RTL DOM order هر Trigger (first = rightmost):
 *   [label — flex:1 راست‌چین]  [status badge — چپ]
 */
export function StepNav({
  active,
  onSelect,
  statuses,
  orientation = 'vertical',
  disabled = [],
}: StepNavProps) {
  const isHorizontal = orientation === 'horizontal'

  return (
    <Tabs.Root
      value={active}
      onValueChange={(d) => onSelect(d.value as StepId)}
      variant="subtle"
      w="full"
    >
      <Tabs.List
        flexDirection={isHorizontal ? 'row' : 'column'}
        w="full"
        gap={isHorizontal ? '2' : '0.5'}
        overflowX={isHorizontal ? 'auto' : undefined}
        overflowY={isHorizontal ? 'clip' : undefined}
        pt={isHorizontal ? '0' : '6'}
      >
        {STEPS.map((step) => (
          <Tabs.Trigger
            key={step.id}
            value={step.id}
            disabled={disabled.includes(step.id)}
            w={isHorizontal ? 'auto' : 'full'}
            flexShrink={isHorizontal ? 0 : undefined}
            justifyContent="flex-end"
            gap="2.5"
            px="4"
            h="10"
            rounded="l2"
            fontSize="sm"
            fontWeight="normal"
          >
            {/* FIRST = rightmost: label */}
            <Text
              flex={isHorizontal ? undefined : '1'}
              textAlign="start"
              whiteSpace="nowrap"
            >
              {step.label}
            </Text>
            {/* LAST = leftmost: status badge */}
            <StatusBadge status={statuses[step.id]} />
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  )
}
