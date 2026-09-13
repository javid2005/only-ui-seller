import { Tabs, Text, Flex, Box, Icon } from '@chakra-ui/react'
import { pressable } from './motion'
import { Check, TriangleAlert, CircleDashed } from 'lucide-react'
import { STEPS, type ProductStep, type StepId } from './data'
import { toPersianDigits } from '@/utils/numbers'
import { Tooltip } from '@/components/ui/Tooltip'

// ─── وضعیت هر مرحله ─────────────────────────────────────────────────────────────
/**
 * سه حالت، نه دو تا.
 *
 * ⚠️ قبلاً فقط «کامل / ناقص» بود و مرحله‌هایی که هیچ فیلد اجباری‌ای ندارند
 * (مشخصات، تنوع) از همان ابتدا تیک سبز می‌گرفتند — بدون اینکه کاربر چیزی وارد
 * کرده باشد. حالا:
 *
 *   done    ✓ سبز    — هم اجباری‌ها پر است هم اختیاری‌های مهم
 *   partial ● سبزِ کم‌رنگ — اجباری‌ها پر است، ولی چیزی باقی مانده که بهتر است پر شود
 *   todo    ⚠ نارنجی — هنوز چیزی که لازم است وارد نشده
 *
 * `missing` فهرستِ تیتروارِ چیزهای باقی‌مانده است و در تولتیپ همان مرحله دیده
 * می‌شود — «در انتظار تکمیل» به‌تنهایی به کاربر نمی‌گفت چه چیزی کم است.
 */
export type StepState = 'done' | 'partial' | 'todo'

export interface StepStatus {
  state: StepState
  /** عنوان‌های کوتاهِ چیزهای باقی‌مانده — حداکثر چند کلمه */
  missing: string[]
}

/** متن تولتیپ: عنوان مرحله + وضعیت + فهرست تیتروارِ باقی‌مانده‌ها */
function statusHint(label: string, status: StepStatus): string {
  if (status.state === 'done') return `${label} — کامل`
  const list = status.missing.slice(0, 4).join(' · ')
  const more = status.missing.length > 4 ? ` و ${toPersianDigits(status.missing.length - 4)} مورد دیگر` : ''
  if (status.state === 'partial') {
    return list ? `${label} — می‌ماند: ${list}${more}` : `${label} — کامل`
  }
  return list ? `${label} — لازم است: ${list}${more}` : `${label} — در انتظار تکمیل`
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
  if (status.state === 'done') {
    return (
      <Icon size="sm" color="green.fg" flexShrink={0}>
        <Check />
      </Icon>
    )
  }
  if (status.state === 'partial') {
    // سبزِ کم‌رنگ، نه نارنجی: اجباری‌ها کامل‌اند و چیزی «خراب» نیست
    return (
      <Icon size="sm" color="green.fg" opacity={0.55} flexShrink={0}>
        <CircleDashed />
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
      bg={show ? 'border' : 'transparent'}
      rounded="full"
      overflow="hidden"
      position="relative"
    >
      {/* لایهٔ سبز روی خط خاکستری می‌نشیند و با کامل‌شدن مرحله «پر» می‌شود */}
      <Box
        position="absolute"
        insetInlineStart="0"
        top="0"
        bg="brand.solid"
        rounded="full"
        transition="width .45s ease, height .45s ease"
        {...(horizontal
          ? { h: 'full', w: show && isDone ? 'full' : '0' }
          : { w: 'full', h: show && isDone ? 'full' : '0' })}
        _motionReduce={{ transition: 'none' }}
      />
    </Box>
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
  /** مراحل نمایش‌داده‌شده — محصول ساده مرحلهٔ «تنوع ها» ندارد. پیش‌فرض: همه */
  steps?: ProductStep[]
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
  steps = STEPS,
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
        {steps.map((step, i) => {
          const status = statuses[step.id]
          const StepIcon = step.icon
          const isActive = step.id === active
          // «طی‌شده» یعنی اجباری‌هایش پر است — partial هم حساب می‌شود، چون کاربر
          // واقعاً از آن مرحله عبور کرده
          const isDone = status.state !== 'todo'
          const prev = i > 0 ? statuses[steps[i - 1].id] : undefined
          const prevDone = prev !== undefined && prev.state !== 'todo'

          return (
            <Tooltip
              key={step.id}
              content={statusHint(step.label, status)}
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
                {...pressable}
              >
                <Connector
                  horizontal={isHorizontal}
                  hasPrev={i > 0}
                  hasNext={i < steps.length - 1}
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
                  // دایره، نه مربع — مثل پروتوتایپ‌های آخرِ تأییدشده
                  rounded="full"
                  align="center"
                  justify="center"
                  borderWidth="1px"
                  transition="background 0.18s, border-color 0.18s, color 0.18s, transform 0.18s, box-shadow 0.18s"
                  bg={isActive ? 'brand.solid' : isDone ? 'brand.bg' : 'bg.subtle'}
                  borderColor={isActive ? 'brand.solid' : isDone ? 'brand.border' : 'border'}
                  color={isActive ? 'brand.contrast' : isDone ? 'brand.fg' : 'fg.muted'}
                  // مرحلهٔ فعال کمی بزرگ‌تر و دارای هاله — همان «کجا هستم» بدون متن اضافه
                  transform={isActive ? 'scale(1.06)' : undefined}
                  boxShadow={isActive ? '0 0 0 3px var(--chakra-colors-brand-subtle)' : 'none'}
                  _motionReduce={{ transform: 'none', transition: 'none' }}
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
