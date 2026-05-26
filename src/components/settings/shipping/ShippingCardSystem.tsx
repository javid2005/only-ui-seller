import { Box, Flex, Text, Separator, Switch } from '@chakra-ui/react'
import { MapPin } from 'lucide-react'
import comingSoonTag from '@/assets/Icons/Shipping-Logo/CommingSoon-Tag.svg'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ShippingCardSystemProps {
  id: string
  name: string
  city: string
  logoSrc?: string
  enabled?: boolean
  disabled?: boolean
  comingSoon?: boolean
  onToggle?: (enabled: boolean) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ShippingCardSystem({
  name,
  city,
  logoSrc,
  enabled = true,
  disabled = false,
  comingSoon = false,
  onToggle,
}: ShippingCardSystemProps) {
  const isVisuallyDisabled = disabled || !enabled

  return (
    <Flex
      direction="column"
      gap="4"
      p="4"
      bg={isVisuallyDisabled || comingSoon ? 'bg.panel' : 'bg.subtle'}
      borderWidth="1px"
      borderColor={isVisuallyDisabled || comingSoon ? 'border.muted' : 'border'}
      rounded="lg"
      w="full"
      position="relative"
      _hover={isVisuallyDisabled || comingSoon ? undefined : { bg: 'bg.teal', borderColor: 'teal.focusRing' }}
    >
      {/* Top — RTL: content FIRST=right, logo LAST=left */}
      <Flex align="start" gap="4" opacity={comingSoon || isVisuallyDisabled ? 0.4 : 1}>
        {/* Content — rightmost */}
        <Flex direction="column" gap="1" flex="1" minW="0">
          <Text fontSize="sm" fontWeight="semibold" color="fg" lineHeight="1.428">
            {name}
          </Text>
          {/* City — RTL: icon FIRST=right, text SECOND=left */}
          <Flex align="center" gap="2">
            <Box color="teal.solid" flexShrink={0}>
              <MapPin size={16} />
            </Box>
            <Text fontSize="sm" color="fg.muted" lineHeight="1.428">
              {city}
            </Text>
          </Flex>
        </Flex>

        {/* Logo box — leftmost */}
        {logoSrc && (
          <Box
            bg="bg.muted"
            borderWidth="1px"
            borderColor="border.muted"
            rounded="md"
            p="1.5"
            flexShrink={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
            w="14"
            h="14"
          >
            <img src={logoSrc} width={40} height={40} alt={name} />
          </Box>
        )}
      </Flex>

      <Separator />

      {/* Footer */}
      {comingSoon ? (
        <Box position="relative" h="10">
          <Box position="absolute" insetInlineStart="-25px" bottom="0">
            <img src={comingSoonTag} width={117} height={40} alt="بزودی" />
          </Box>
        </Box>
      ) : (
        /* Switch row — RTL: switch FIRST=right, text SECOND=left */
        <Flex align="center" gap="2.5">
          <Switch.Root
            colorPalette="teal"
            size="sm"
            checked={enabled}
            disabled={disabled}
            onCheckedChange={(e) => onToggle?.(e.checked)}
          >
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch.Root>
          <Text fontSize="sm" color="fg" lineHeight="1.428">
            {enabled ? 'فعال' : 'غیرفعال'}
          </Text>
        </Flex>
      )}
    </Flex>
  )
}
