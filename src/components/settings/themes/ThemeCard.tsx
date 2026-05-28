import { useState } from 'react'
import { Box, Flex, Text, Button, Badge } from '@chakra-ui/react'
import { Check } from 'lucide-react'
import comingSoonTag from '@/assets/Icons/Shipping-Logo/CommingSoon-Tag.svg'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ThemeCardProps {
  id: string
  name: string
  thumbnail?: string
  /** First theme in gallery — always the site default */
  isDefault?: boolean
  isSelected?: boolean
  comingSoon?: boolean
  onSelect?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ThemeCard({
  name,
  thumbnail,
  isDefault = false,
  isSelected = false,
  comingSoon = false,
  onSelect,
}: ThemeCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // ── Coming Soon variant ──────────────────────────────────────────────────────
  if (comingSoon) {
    return (
      // No overflow-clip on outer — coming soon tag overflows to the right
      <Box position="relative" rounded="lg" w="full">
        <Box borderWidth="1px" borderColor="border" rounded="md" overflow="hidden" w="full">

          {/* Image — blurred, low-opacity */}
          <Box h="174px" bg="bg.emphasized" position="relative" overflow="hidden" flexShrink={0}>
            {thumbnail && (
              <img
                src={thumbnail}
                alt={name}
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  objectFit: 'cover',
                  filter: 'blur(2px)',
                  opacity: 0.2,
                  pointerEvents: 'none',
                }}
              />
            )}
          </Box>

          {/* Content — bg, title subtle */}
          <Flex direction="column" gap="4" p="4" bg="bg">
            <Text fontSize="md" fontWeight="semibold" color="fg.subtle" textAlign="right">
              {name}
            </Text>
            {/* Placeholder height = button so card height matches normal cards */}
            <Box h="10" />
          </Flex>
        </Box>

        {/* Coming Soon tag — bottom-right (RTL: insetInlineStart = physical right) */}
        <Box position="absolute" bottom="4" insetInlineStart="-9px" zIndex={1}>
          <img src={comingSoonTag} width={117} height={40} alt="بزودی" />
        </Box>
      </Box>
    )
  }

  // ── Normal variant ───────────────────────────────────────────────────────────
  // Hover: border brand.focusRing + content brand.bg
  // Selection: ONLY via button click (not card click)
  const showHover = isHovered && !isSelected

  return (
    <Box
      w="full"
      borderWidth={isSelected ? '2px' : '1px'}
      borderColor={isSelected ? 'brand.solid' : showHover ? 'brand.focusRing' : 'border'}
      rounded="lg"
      overflow="hidden"
      position="relative"
      transition="border-color 0.15s"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image area */}
      <Box h="174px" bg="bg.emphasized" position="relative" overflow="hidden" flexShrink={0}>
        {thumbnail && (
          <img
            src={thumbnail}
            alt={name}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Default badge
            Physical top-left = insetInlineEnd in RTL (end = physical left) */}
        {isDefault && (
          <Badge
            bg="gray.solid"
            color="gray.contrast"
            position="absolute"
            top="4"
            insetInlineEnd="4"
            fontSize="sm"
            fontWeight="normal"
            rounded="sm"
            px="2"
            lineHeight="1.5"
          >
            قالب پیش‌فرض
          </Badge>
        )}
      </Box>

      {/* Content area — default: bg, hover: brand.bg (via JS state) */}
      <Flex
        direction="column"
        gap="4"
        p="4"
        bg={showHover ? 'brand.bg' : 'bg'}
        position="relative"
        transition="background 0.15s"
      >
        <Text fontSize="md" fontWeight="semibold" color="fg" textAlign="right">
          {name}
        </Text>

        {isSelected ? (
          // Selected state — non-interactive button (visual only)
          <Button colorPalette="brand" variant="solid" w="full" size="md" pointerEvents="none">
            {/* RTL DOM: Check FIRST = rightmost (start side) ✓ */}
            <Check size={20} />
            انتخاب شده
          </Button>
        ) : (
          // Selection ONLY via button — NOT card click
          <Button
            colorPalette="brand"
            variant="outline"
            w="full"
            size="md"
            cursor="pointer"
            onClick={() => onSelect?.()}
          >
            انتخاب پوسته
          </Button>
        )}
      </Flex>
    </Box>
  )
}
