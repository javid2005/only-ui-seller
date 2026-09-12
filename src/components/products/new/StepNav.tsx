import { Tabs, Text, Flex, Box, Icon } from '@chakra-ui/react'
import { Check, TriangleAlert } from 'lucide-react'
import { STEPS, type StepId } from './data'
import { toPersianDigits } from '@/utils/numbers'
import { Tooltip } from '@/components/ui/Tooltip'

// ─── وضعیت هر مرحله ─────────────────────────────────────────────────────────────
// pending → موارد ضروری ناقص · complete → کامل · number → شمارش ترکیب‌های تنوع
export type StepStatus = 'pending' | 'complete' | number

/** متن تولتیپ: عنوان کامل + وضعیت — همان اطلاعاتی که قبلاً badge متنی نشان می‌داد */
function statusHint(status: StepStatus): string {
  if (typeof status === 'number') {
    return status > 0 ? `${toPersianDigits(status)} ترکیب ساخته شده` : 'بدون ترکیب — اختیاری'
  }
  return status === 'complete' ? 'کامل شده' : 'در انتظار تکمیل'
}

// ─── هندسهٔ مشترک rail ───────────────────────────────────────────────────────────
// خط اتصال دقیقاً از همین ثابت‌ها مرکز می‌گیرد (نه از offset دستی) — به همین دلیل با
// هر تغییر اندازهٔ آیکن باز هم وسط می‌ماند. سابقه: در پروتوتایپ offset ثابت
// (`right:27px`) بود و با بزرگ‌شدن آیکن از مرکز خارج شد.
const ICON_SIZE = '34px'   // ابعاد کادر آیکن (هر دو حالت)
const ROW_H = '52px'       // ارتفاع ثابت ردیف عمودی → فاصلهٔ مرکز تا مرکز = همین عدد
const ROW_PX = '2.5'       // padding افقی ردیف عمودی (۱۰px) = فاصلهٔ لبه تا کادر آیکن
const COMPACT_PT = '2'     // padding بالای آیتم فشرده (۸px) = فاصلهٔ لبه تا کادر آیکن

// ─── Status glyph ───────────────────────────────────────────────────────────────
/**
 * نشانگر وضعیت — فقط یک glyph کوچک، نه badge متنی.
 * دلیل: بازخورد «تیک و هشدارها شلوغی ایجاد کرده‌اند»؛ متن وضعیت به تولتیپ منتقل شد.
 */
function StatusGlyph({ status }: { status: StepStatus }) {
  if (typeof status === 'number') {
    return (
      <Text fontSize="xs" color="fg.muted" flexShrink={0} lineHeight="1">
        {toPersianDigits(status)}
      </Text>
    )
  }
  if (status === 'complete') {
    return (
      <Icon size="sm" color="green.fg" flexShrink={0}>
        <Check />
      </Icon>
    )
  }
  return (
    <Icon size="sm" color="orange.fg" flexShrink={0}>
      <TriangleAlert />
    </Icon>
  )
}

// ─── Connector ──────────────────────────────────────────────────────────────────
/**
 * خط اتصال بین مراحل.
 *
 * هر مرحله فقط **نیمهٔ خودش** را می‌کشد: نیمهٔ رو به مرحلهٔ قبل و نیمهٔ رو به مرحلهٔ
 * بعد. دو نیمهٔ مجاور به هم می‌رسند و خط پیوسته می‌شود.
 *
 * چرا این‌طور و نه یک خط که از آیتم بیرون بزند:
 *   ۱. هیچ عددِ جادویی و هیچ offset فیزیکی لازم نیست — کانتینر دقیقاً روی ردِ کادر
 *      آیکن می‌افتد و مرکزیابی را flex انجام می‌دهد. سابقه: پروتوتایپ offset ثابت
 *      (`right:27px`) داشت و با تغییر اندازهٔ آیکن از مرکز خارج شد.
 *   ۲. چیزی از مرزِ آیتم بیرون نمی‌زند، پس نه انتهای rail خط اضافه می‌ماند و نه
 *      پس‌زمینهٔ تبِ بعدی رویش می‌افتد.
 *
 * ترتیب دو نیمه در حالت افقی = همان قاعدهٔ DOM پروژه: فرزند اول = سمت start
 * (راست در RTL) = رو به مرحلهٔ قبل.
 */
function Connector({
  horizontal, hasPrev, hasNext, prevDone, done,
}: {
  horizontal: boolean
  hasPrev: boolean
  hasNext: boolean
  prevDone: boolean
  done: boolean
}) {
  const half = (show: boolean, isDone: boolean) => (
    <Box
      flex="1"
      w={horizontal ? 'full' : '2px'}
      h={horizontal ? '2px' : 'full'}
      bg={show ? (isDone ? 'brand.emphasized' : 'border') : 'transparent'}
      rounded="full"
    />
  )

  return (
    <Flex
      aria-hidden
      position="absolute"
      pointerEvents="none"
      direction={horizontal ? 'row' : 'column'}
      align="center"
      {...(horizontal
        ? { insetInline: '0', top: COMPACT_PT, h: ICON_SIZE }
        : { insetBlock: '0', insetInlineStart: ROW_PX, w: ICON_SIZE })}
    >
      {/* FIRST = رو به مرحلهٔ قبل (بالا در عمودی · راست در RTL افقی) */}
      {half(hasPrev, prevDone)}
      {/* LAST = رو به مرحلهٔ بعد */}
      {half(hasNext, done)}
    </Flex>
  )
}

// ─── StepNav ─────────────────────────────────────────────────────────────────────

export interface StepNavProps {
  active: StepId
  onSelect: (id: StepId) => void
  /** وضعیت هر مرحله */
  statuses: Record<StepId, StepStatus>
  /** عمودی (rail دسکتاپ) یا افقی (بالای فرم در موبایل/compact) */
  orientation?: 'vertical' | 'horizontal'
  /** غیرفعال‌سازی مراحلی که هنوز پیاده نشده‌اند */
  disabled?: StepId[]
}

/**
 * StepNav — استپر ساخت محصول (اطلاعات محصول / گالری / تنوع‌ها).
 *
 * دو instance با state مشترک (عمودی دسکتاپ + افقی موبایل)؛ محتوای مرحله جدا در
 * NewProduct رندر می‌شود، نه با Tabs.Content. پایهٔ a11y از Chakra `Tabs` می‌آید
 * (roving tabindex + پیمایش با فلش) و ظاهر استپر روی همان سوار شده است.
 *
 * RTL DOM order هر مرحله (first = rightmost):
 *   عمودی:  [آیکن — راست] [عنوان flex:1] [glyph وضعیت — چپ]
 *   افقی:   ستونی — آیکن بالا، عنوان کوتاه زیرش
 *
 * عنوان در هیچ حالتی حذف نمی‌شود؛ در حالت فشرده کوتاه می‌شود و متن کامل + وضعیت
 * در تولتیپ می‌آید.
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
        gap="0"
        overflow="visible"
        pt={isHorizontal ? '0' : '2'}
      >
        {STEPS.map((step, i) => {
          const status = statuses[step.id]
          const StepIcon = step.icon
          const isActive = step.id === active
          const isDone = status === 'complete' || (typeof status === 'number' && status > 0)
          // خط اتصالِ رسیده به این مرحله وقتی «طی‌شده» است که مرحلهٔ قبل کامل باشد
          const prev = i > 0 ? statuses[STEPS[i - 1].id] : undefined
          const prevDone = prev === 'complete' || (typeof prev === 'number' && prev > 0)

          return (
            <Tooltip
              key={step.id}
              content={`${step.label} — ${statusHint(status)}`}
              positioning={{ placement: isHorizontal ? 'bottom' : 'left' }}
            >
              <Tabs.Trigger
                value={step.id}
                disabled={disabled.includes(step.id)}
                position="relative"
                w={isHorizontal ? 'auto' : 'full'}
                flex={isHorizontal ? '1' : undefined}
                minW="0"
                h={isHorizontal ? 'auto' : ROW_H}
                px={isHorizontal ? '1' : ROW_PX}
                pt={isHorizontal ? COMPACT_PT : undefined}
                pb={isHorizontal ? '2' : undefined}
                rounded="l2"
                fontSize="sm"
                fontWeight="normal"
                flexDirection={isHorizontal ? 'column' : 'row'}
                justifyContent={isHorizontal ? 'start' : 'end'}
                alignItems="center"
                gap={isHorizontal ? '1.5' : '2.5'}
              >
                <Connector
                  horizontal={isHorizontal}
                  hasPrev={i > 0}
                  hasNext={i < STEPS.length - 1}
                  prevDone={prevDone}
                  done={isDone}
                />

                {/* FIRST = rightmost (عمودی) / بالا (افقی): کادر آیکن.
                    zIndex=1 → خط اتصال پشتش پنهان می‌شود و به لبه‌اش می‌چسبد. */}
                <Flex
                  position="relative"
                  zIndex="1"
                  boxSize={ICON_SIZE}
                  flexShrink={0}
                  rounded="l2"
                  align="center"
                  justify="center"
                  borderWidth="1px"
                  transition="background 0.15s, border-color 0.15s, color 0.15s"
                  bg={isActive ? 'brand.solid' : isDone ? 'brand.bg' : 'bg.subtle'}
                  borderColor={isActive ? 'brand.solid' : isDone ? 'brand.muted' : 'border'}
                  color={isActive ? 'brand.contrast' : isDone ? 'brand.fg' : 'fg.muted'}
                >
                  <StepIcon size={18} strokeWidth={1.7} />
                </Flex>

                {isHorizontal ? (
                  /* عنوان کوتاه زیر آیکن — حذف نمی‌شود */
                  <Text fontSize="xs" lineHeight="1.5" whiteSpace="nowrap" truncate maxW="full">
                    {step.shortLabel}
                  </Text>
                ) : (
                  <>
                    {/* عنوان کامل — flex:1 تا glyph وضعیت به لبهٔ چپ بچسبد */}
                    <Text flex="1" textAlign="start" whiteSpace="nowrap" truncate>
                      {step.label}
                    </Text>
                    {/* LAST = leftmost: نشانگر وضعیت */}
                    <StatusGlyph status={status} />
                  </>
                )}
              </Tabs.Trigger>
            </Tooltip>
          )
        })}
      </Tabs.List>
    </Tabs.Root>
  )
}
