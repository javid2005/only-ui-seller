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
 *   [back arrow?]  [icon?]  [title + badge + subtitle]  [cta?]
 *   rightmost ←─────────────────────────────────────────→ leftmost
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

  return (
    <Box w="full" flexShrink={0}>
      <Flex align="center" pb={divider ? '3' : '0'} w="full" gap="3">

        {/* Back arrow — FIRST in DOM = rightmost in RTL ✓ */}
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

        {/* Optional icon — after back arrow, before title */}
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

        {/* Content: title + badge + subtitle — SECOND = middle, flex-1 */}
        <Flex flex="1" direction="column" gap="0.5" minW="0" alignItems="flex-start">
          {/* Title row */}
          <Flex align="center" gap="3" w="full">
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

        {/* CTA — LAST in DOM = leftmost in RTL ✓ */}
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
