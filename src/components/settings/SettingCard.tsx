import { Box, Flex, Text } from '@chakra-ui/react'
import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export type SettingCardState = 'default' | 'disabled'

export interface SettingCardProps {
  title: string
  description: string
  /** Icon element — 24×24 recommended (e.g. lucide icon) */
  icon: ReactNode
  /** Chakra semantic token for icon container bg, e.g. 'teal.subtle' */
  iconBg: string
  /** Chakra semantic token for icon color, e.g. 'teal.fg' */
  iconColor: string
  /** React-router path for navigation */
  to?: string
  state?: SettingCardState
}

/**
 * Settings navigation card — RTL layout:
 *   [icon]  [title + description]  [chevron]
 *   right          middle            left
 */
export function SettingCard({
  title,
  description,
  icon,
  iconBg,
  iconColor,
  to,
  state = 'default',
}: SettingCardProps) {
  const isDisabled = state === 'disabled'

  const cardProps = {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
    gap: '4',
    w: 'full',
    overflow: 'hidden',
    p: '6',
    rounded: 'lg',
    borderWidth: '1px',
    borderColor: isDisabled ? 'border.muted' : 'border',
    bg: 'bg.panel',
    cursor: isDisabled ? 'default' : 'pointer',
    transition: 'all 0.15s',
    textDecoration: 'none',
    _hover: isDisabled
      ? {}
      : { bg: 'bg.teal', borderColor: 'brand.border' },
  }

  const content = (
    <>
      {/* bgBlur — decorative gradient behind icon area */}
      <Box
        position="absolute"
        insetInlineStart="0"
        top="-75px"
        w="256px"
        h="160px"
        pointerEvents="none"
        opacity={isDisabled ? 0.25 : 0.6}
        bg={iconBg}
        filter="blur(40px)"
        borderRadius="full"
        zIndex={0}
      />

      {/* Icon — FIRST in DOM = rightmost in RTL */}
      <Box
        bg={iconBg}
        color={iconColor}
        p="2"
        rounded="md"
        flexShrink={0}
        opacity={isDisabled ? 0.4 : 1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        zIndex={1}
      >
        {icon}
      </Box>

      {/* Text content — SECOND = middle */}
      <Flex
        flex="1"
        direction="column"
        gap="4"
        alignItems="flex-start"
        minW="0"
        position="relative"
        zIndex={1}
      >
        <Text
          fontSize="lg"
          fontWeight="semibold"
          color={isDisabled ? 'fg.subtle' : 'fg'}
          textAlign="right"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          w="full"
        >
          {title}
        </Text>
        <Text
          fontSize="sm"
          color={isDisabled ? 'fg.subtle' : 'fg.muted'}
          textAlign="right"
          w="full"
        >
          {description}
        </Text>
      </Flex>

      {/* Chevron — LAST in DOM = leftmost in RTL */}
      <Box
        color={isDisabled ? 'fg.subtle' : 'fg.muted'}
        flexShrink={0}
        display="flex"
        alignItems="center"
        position="relative"
        zIndex={1}
      >
        <ChevronLeft size={24} />
      </Box>
    </>
  )

  if (isDisabled || !to) {
    return <Box {...cardProps}>{content}</Box>
  }

  return (
    <Box as={Link} to={to} {...(cardProps as any)}>
      {content}
    </Box>
  )
}
