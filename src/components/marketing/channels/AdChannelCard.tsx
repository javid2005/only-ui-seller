'use client'

import type { ReactNode } from 'react'
import { Alert, Badge, Box, Button, Flex, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import type { StaticImageData } from 'next/image'
import { useCompactMode } from '@/contexts/CompactModeContext'

export type AdChannelBadgeColor = 'green' | 'gray' | 'orange' | 'blue'
export type AdChannelActionVariant = 'solid' | 'outline' | 'disabled'

export interface AdChannelPrerequisite {
  title: string
  before: string
  linkLabel: string
  linkHref: string
  after: string
}

export interface AdChannelCardProps {
  logo: StaticImageData
  title: string
  description: string
  badgeLabel: string
  badgeColor: AdChannelBadgeColor
  actionLabel: string
  actionVariant: AdChannelActionVariant
  onAction?: () => void
  prerequisite?: AdChannelPrerequisite
}

/**
 * AdChannelCard — Figma «Ad-Channel / List» row (desktop node 2610:30887, mobile node 3033:64133).
 *
 * RTL DOM order (first = rightmost): [Image icon] [Content: title+badge, description,
 * prerequisite?, action?] [action — media≥lg only, sibling]
 *
 * Three-tier responsive behavior (per user direction, beyond what either Figma frame shows):
 *   media≥lg   — icon beside content; action is a row-level sibling, hug width, leftmost.
 *   sm..lg     — icon beside content; action wraps inside Content as its last child, hug
 *                width, aligned left (Content's alignItems="flex-end" = left in column RTL).
 *   media<sm   — icon moves ABOVE content (column stack); action still last in Content,
 *                but full width.
 */
export function AdChannelCard({
  logo,
  title,
  description,
  badgeLabel,
  badgeColor,
  actionLabel,
  actionVariant,
  onAction,
  prerequisite,
}: AdChannelCardProps) {
  const isCompact = useCompactMode()
  const isDisabled = actionVariant === 'disabled'

  const renderAction = (fullWidth: boolean): ReactNode => (
    <Button
      variant={actionVariant === 'solid' ? 'solid' : 'outline'}
      colorPalette={isDisabled ? 'gray' : 'brand'}
      size="md"
      h="10"
      minW="10"
      px="4"
      fontWeight="semibold"
      opacity={isDisabled ? 0.4 : 1}
      disabled={isDisabled}
      onClick={onAction}
      w={fullWidth ? 'full' : undefined}
    >
      {actionLabel}
    </Button>
  )

  return (
    <Flex
      borderWidth="1px"
      borderColor="border.muted"
      rounded="lg"
      p="4"
      gap="6"
      // media<sm: column stack (icon ABOVE content); sm+: row (icon beside content).
      // align="flex-start" covers both correctly — cross-axis flex-start is top in row
      // mode, and right (RTL) in column mode, so no separate align switch is needed.
      direction={isCompact ? 'row' : { base: 'column', sm: 'row' }}
      align="flex-start"
      w="full"
      _hover={{ bg: 'brand.bg', borderColor: 'brand.focusRing' }}
    >
      {/* Image — FIRST in DOM = rightmost in row mode, top in column mode */}
      <Flex
        flexShrink={0}
        align="center"
        justify="center"
        boxSize="12"
        bg="bg.muted"
        borderWidth="1px"
        borderColor="border.muted"
        rounded="lg"
        p="1.5"
      >
        <img src={logo.src} alt={title} width={36} height={36} style={{ objectFit: 'contain' }} />
      </Flex>

      {/* Content — flex-1 in row mode; w="full" keeps it from shrinking to its own
          content width once the parent switches to column (media<sm) */}
      <Flex direction="column" gap="4" flex="1" minW="0" w="full" alignItems="flex-end">
        <Flex direction="column" gap="2" alignItems="flex-end" w="full">
          <Flex align="center" justify="flex-start" gap="2" w="full">
            {/* Title FIRST = rightmost (closer to icon), badge SECOND = leftmost.
                justify="flex-start" (NOT flex-end) — under dir="rtl", flex-start resolves to
                the right side; flex-end resolves to left. This row was previously flex-end,
                which shoved title+badge to the left, off the card's right edge. */}
            <Text fontSize="md" fontWeight="semibold" color="fg">{title}</Text>
            <Badge colorPalette={badgeColor} variant="subtle" size="md" flexShrink={0}>{badgeLabel}</Badge>
          </Flex>
          <Text fontSize="sm" color="fg.muted" textAlign="right" w="full">{description}</Text>

          {prerequisite && (
            <Alert.Root status="warning" variant="subtle" rounded="l3" p="3" w="full">
              <Alert.Indicator />
              <Alert.Content gap="0.5">
                <Alert.Title fontSize="xs">{prerequisite.title}</Alert.Title>
                <Text fontSize="2xs" color="orange.fg">
                  {prerequisite.before}
                  <NextLink href={prerequisite.linkHref}>
                    <Text as="span" fontWeight="bold" textDecoration="underline">
                      {prerequisite.linkLabel}
                    </Text>
                  </NextLink>
                  {prerequisite.after}
                </Text>
              </Alert.Content>
            </Alert.Root>
          )}
        </Flex>

        {/* media<lg — wrapped as last child of Content (below everything).
            width: full at media<sm (fill), hug at sm..lg (fit-content, aligned left via
            Content's alignItems="flex-end" — column direction: flex-end = left under RTL). */}
        <Box
          display={isCompact ? 'block' : { base: 'block', lg: 'none' }}
          w={isCompact ? 'fit-content' : { base: 'full', sm: 'fit-content' }}
        >
          {renderAction(true)}
        </Box>
      </Flex>

      {/* media≥lg — sibling, hug width, LAST = leftmost */}
      <Box display={isCompact ? 'none' : { base: 'none', lg: 'block' }} flexShrink={0}>
        {renderAction(false)}
      </Box>
    </Flex>
  )
}
