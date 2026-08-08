import { Box, Flex, Text, Separator, IconButton } from '@chakra-ui/react'
import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type TitleBarSize = 'xl' | 'lg' | 'md'

export interface TitleBarProps {
  /** Section or page title */
  title: string
  /** Optional subtitle beneath the title */
  subtitle?: string
  /** Optional badge inline with the title — pass a full <Badge> for custom colorPalette */
  badge?: ReactNode
  /** Optional CTA slot — renders on the left side in RTL */
  cta?: ReactNode
  /** Render a separator line below the title bar */
  divider?: boolean
  /** Optional leading icon next to the title (RTL: right of title) */
  icon?: ReactNode
  /** Show a back/return chevron on the far right (RTL) */
  propReturn?: boolean
  /** Callback for the back button */
  onReturn?: () => void
  /** Title font size variant — xl (20px) | lg (18px) | md (16px) */
  size?: TitleBarSize
}

// ─── Size map ─────────────────────────────────────────────────────────────────

const SIZE_MAP: Record<TitleBarSize, { titleSize: any; subtitleSize: any }> = {
  xl: { titleSize: { base: 'lg', sm: 'xl' }, subtitleSize: { base: 'xs', sm: 'sm' } },
  lg: { titleSize: { base: 'md', sm: 'lg' }, subtitleSize: 'xs' },
  md: { titleSize: { base: 'sm', sm: 'md' }, subtitleSize: 'xs' },
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * TitleBar — section-level heading with optional back button, badge, subtitle, CTA, and divider.
 *
 * RTL DOM order (first = rightmost):
 *   [back arrow?]  [icon + title + badge + subtitle]  [cta?]
 *   rightmost ←────────────────────────────────────→ leftmost
 *
 * back arrow و cta همیشه بیرون از بلوکِ قابل-stack هستن و در ردیف افقیِ اصلی می‌مونن —
 * حتی زیر sm که آن بلوک عمودی می‌شه، این دو کنار بلوک باقی می‌مونن و نسبت به کل ارتفاعش
 * وسط‌چین عمودی می‌شن (اکشن جدا از محتوای توصیفیه، نباید ته یه استکِ بلند گم بشه).
 *
 * Wrapping rule: title and subtitle NEVER truncate — no whiteSpace="nowrap".
 * On narrow screens (360px) long titles wrap to multiple lines. This is intentional.
 * Truncation hides meaning; wrapping preserves it.
 */
export function TitleBar({
  title,
  subtitle,
  badge,
  cta,
  divider = false,
  icon,
  propReturn = false,
  onReturn,
  size = 'xl',
}: TitleBarProps) {
  const { titleSize, subtitleSize } = SIZE_MAP[size]

  // زیر sm، وقتی icon یا badge هست، عنوانِ در حال wrap + badge اینلاین + subtitle همه با هم تنگ می‌شن —
  // به‌جای ردیف افقی، کل بلوک عمودی می‌شه: آیکون (بالا، اگه باشه) → عنوان → badge (زیر عنوان) → توضیحات.
  // بدون icon و بدون badge چیزی عوض نمی‌شه چون تنگی فقط وقتی یکی از این دو سهم افقی می‌گیره پیش میاد.
  const stackMobile = Boolean(icon) || Boolean(badge)

  return (
    <Box w="full" flexShrink={0}>
      <Flex align="center" pb={divider ? '3' : '0'} w="full" gap="3">

        {/* Back arrow — FIRST in DOM = rightmost in RTL ✓ — همیشه بیرون از بلوکِ stack */}
        {propReturn && (
          <IconButton
            variant="ghost"
            size="sm"
            aria-label="بازگشت"
            onClick={onReturn}
            color="fg.muted"
            flexShrink={0}
            _hover={{ bg: 'bg.subtle', color: 'fg' }}
          >
            <ChevronRight size={20} />
          </IconButton>
        )}

        {/* بلوکِ icon + title + badge + subtitle — یه واحد؛ فقط داخلش زیر sm (وقتی icon هست) عمودی می‌شه */}
        <Flex
          flex="1"
          direction={{ base: stackMobile ? 'column' : 'row', sm: 'row' }}
          align={{ base: stackMobile ? 'start' : 'center', sm: 'center' }}
          gap={{ base: stackMobile ? '2' : '3', sm: '3' }}
          minW="0"
        >
          {/* Optional icon — زیر sm (وقتی stackMobile) تنها عنصرِ ردیف بالاست */}
          {icon && (
            <Box
              flexShrink={0}
              color="fg.muted"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {icon}
            </Box>
          )}

          {/* Content: title + badge + subtitle */}
          <Flex flex="1" direction="column" gap="0.5" minW="0" w="full" alignItems="start">
            {/* Title row — زیر sm (وقتی stackMobile) عمودی می‌شه: عنوان بالا، badge زیرش */}
            <Flex
              direction={{ base: stackMobile ? 'column' : 'row', sm: 'row' }}
              align={{ base: stackMobile ? 'start' : 'center', sm: 'center' }}
              gap={{ base: stackMobile ? '1.5' : '3', sm: '3' }}
              w="full"
            >
              <Text
                fontSize={titleSize}
                fontWeight="semibold"
                color="fg"
                lineHeight="1.5"
              >
                {title}
              </Text>
              {badge && (
                <Box flexShrink={0}>{badge}</Box>
              )}
            </Flex>

            {/* Subtitle (optional) */}
            {subtitle && (
              <Text
                fontSize={subtitleSize}
                color="fg.muted"
                lineHeight="1.5"
                w="full"
              >
                {subtitle}
              </Text>
            )}
          </Flex>
        </Flex>

        {/* CTA — LAST in DOM = leftmost in RTL ✓ — همیشه بیرون از بلوکِ stack، وسط‌چین عمودی نسبت به کل بلوک */}
        {cta && (
          <Box flexShrink={0}>
            {cta}
          </Box>
        )}

      </Flex>

      {/* Separator */}
      {divider && <Separator />}
    </Box>
  )
}
