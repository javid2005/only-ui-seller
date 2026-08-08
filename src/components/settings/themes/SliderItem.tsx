import { useState } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { GripVertical } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SliderItemProps {
  label: string
  selected?: boolean
  onSelect?: () => void
  /** Horizontal chip mode — no grip, no drag, whiteSpace nowrap */
  horizontal?: boolean
  draggable?: boolean
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void
  onDragEnd?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * SliderItem — draggable slide list item for the theme customize page.
 *
 * States: default (no bg) | hover (bg.muted) | selected (brand.muted + brand.fg)
 *
 * RTL DOM (first = rightmost):
 *   Text (FIRST = right) | GripVertical (SECOND = left)
 */
export function SliderItem({
  label,
  selected = false,
  onSelect,
  horizontal = false,
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: SliderItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const showHover = isHovered && !selected

  // ── Horizontal chip variant (mobile / < lg) ───────────────────────────────
  if (horizontal) {
    return (
      <Flex
        align="center"
        gap="1.5"
        px="3"
        py="2"
        rounded="sm"
        flexShrink={0}
        cursor="pointer"
        bg={selected ? 'brand.muted' : showHover ? 'bg.muted' : 'transparent'}
        transition="background 0.1s"
        onClick={onSelect}
        draggable={draggable}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragEnd={onDragEnd}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* GripVertical — FIRST = rightmost in RTL ✓ */}
        <Box
          flexShrink={0}
          color={selected ? 'brand.fg' : 'fg.subtle'}
          cursor="grab"
          display="flex"
          alignItems="center"
        >
          <GripVertical size={14} />
        </Box>
        {/* Text — SECOND = leftmost ✓ */}
        <Text
          fontSize="sm"
          color={selected ? 'brand.fg' : 'fg'}
          whiteSpace="nowrap"
          lineHeight="1.5"
        >
          {label}
        </Text>
      </Flex>
    )
  }

  // ── Vertical draggable variant (desktop / lg+) ────────────────────────────
  return (
    <Flex
      align="center"
      gap="3"
      p="2"
      rounded="sm"
      overflow="hidden"
      w="full"
      cursor="pointer"
      bg={selected ? 'brand.muted' : showHover ? 'bg.muted' : 'transparent'}
      transition="background 0.1s"
      onClick={onSelect}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* GripVertical — FIRST = rightmost in RTL ✓ */}
      <Box
        flexShrink={0}
        color={selected ? 'brand.fg' : 'fg.subtle'}
        cursor="grab"
        display="flex"
        alignItems="center"
      >
        <GripVertical size={16} />
      </Box>

      {/* Text — SECOND = leftmost ✓ */}
      <Text
        flex="1"
        fontSize="sm"
        color={selected ? 'brand.fg' : 'fg'}
        textAlign="start"
        minW="0"
        lineHeight="1.5"
      >
        {label}
      </Text>
    </Flex>
  )
}
