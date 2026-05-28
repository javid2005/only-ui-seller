import { Box, Flex, Text, Badge, Separator, Switch, IconButton, Menu, Portal } from '@chakra-ui/react'
import { MapPin, Bike, Truck, EllipsisVertical, Pencil, Trash2 } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ShippingMethod = 'free' | 'fixed' | 'weight'

export interface ShippingRoute {
  label: string
  icon: 'bike' | 'truck'
  days: string
  paymentType?: string
  method: ShippingMethod
}

export interface ShippingCardCustomProps {
  id: string
  name: string
  city: string
  isDefault?: boolean
  enabled?: boolean
  disabled?: boolean
  routes?: ShippingRoute[]
  onToggle?: (enabled: boolean) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const METHOD_LABEL: Record<ShippingMethod, string> = {
  free:   'رایگان',
  fixed:  'ثابت',
  weight: 'وزنی',
}

const METHOD_COLOR: Record<ShippingMethod, { bg: string; color: string }> = {
  free:   { bg: 'green.subtle',   color: 'green.fg'   },
  fixed:  { bg: 'blue.subtle',    color: 'blue.fg'    },
  weight: { bg: 'orange.subtle',  color: 'orange.fg'  },
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ShippingCardCustom({
  id,
  name,
  city,
  isDefault = false,
  enabled = true,
  disabled = false,
  routes = [],
  onToggle,
  onEdit,
  onDelete,
}: ShippingCardCustomProps) {
  const isVisuallyDisabled = disabled || !enabled

  return (
    <Flex
      data-group=""
      direction="column"
      gap="4"
      p="4"
      bg={isVisuallyDisabled ? 'bg.panel' : 'bg.subtle'}
      borderWidth="1px"
      borderColor={isVisuallyDisabled ? 'border.muted' : 'border'}
      rounded="lg"
      w="full"
      overflow="hidden"
      position="relative"
      _hover={isVisuallyDisabled ? undefined : { bg: 'brand.bg', borderColor: 'brand.focusRing' }}
    >
      {/* Header */}
      <Flex direction="column" gap="1" opacity={isVisuallyDisabled ? 0.4 : 1}>
        {/* Title row — RTL: name FIRST=right, badge LAST=left */}
        <Flex align="center" gap="4" w="full">
          {/* name — rightmost */}
          <Text fontSize="sm" fontWeight="semibold" color="fg" lineHeight="1.428" flex="1" minW="0">
            {name}
          </Text>
          {/* پیش فرض badge — leftmost */}
          {isDefault && (
            <Badge bg="gray.solid" color="gray.contrast" size="sm" flexShrink={0}>
              پیش فرض
            </Badge>
          )}
        </Flex>

        {/* City row — RTL: icon FIRST=right, text SECOND=left */}
        <Flex align="center" gap="2">
          <Box color="brand.solid" flexShrink={0}>
            <MapPin size={16} />
          </Box>
          <Text fontSize="sm" color="fg.muted" lineHeight="1.428">
            {city}
          </Text>
        </Flex>
      </Flex>

      {/* Routes */}
      {routes.length > 0 && (
        <Flex direction="column" gap="2" opacity={isVisuallyDisabled ? 0.4 : 1}>
          {routes.map((route, i) => (
            <Flex key={i} align="center" gap="4" w="full">
              {/* label + icon — RTL: icon FIRST=rightmost, text SECOND */}
              <Flex align="center" gap="2" flexShrink={0}>
                <Box color="brand.solid">
                  {route.icon === 'bike' ? <Bike size={16} /> : <Truck size={16} />}
                </Box>
                <Text fontSize="sm" fontWeight="semibold" color="fg" lineHeight="1.428" minW="20">
                  {route.label}
                </Text>
              </Flex>

              {/* data — RTL: LAST=leftmost */}
              <Flex align="center" gap="2" flex="1" minW="0">
                <Badge
                  bg={METHOD_COLOR[route.method].bg}
                  color={METHOD_COLOR[route.method].color}
                  size="sm"
                  flexShrink={0}
                >
                  {METHOD_LABEL[route.method]}
                </Badge>
                {route.paymentType && (
                  <>
                    <Text fontSize="sm" color="fg.muted">•</Text>
                    <Text fontSize="sm" color="fg.muted" lineHeight="1.428">{route.paymentType}</Text>
                  </>
                )}
                <Text fontSize="sm" color="fg.muted">•</Text>
                <Text fontSize="sm" color="fg.muted" lineHeight="1.428">{route.days}</Text>
              </Flex>
            </Flex>
          ))}
        </Flex>
      )}

      <Separator />

      {/* Footer — RTL: SwitchBase FIRST=rightmost, ellipsis LAST=leftmost */}
      <Flex align="center" w="full">
        {/* SwitchBase — FIRST = rightmost: Switch(right) ← text(left) */}
        <Flex align="center" gap="2.5" flexShrink={0}>
          <Switch.Root
            colorPalette="brand"
            size="sm"
            checked={enabled}
            disabled={disabled || isDefault}
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

        {/* Spacer + Ellipsis — LAST = leftmost (justify flex-end pushes icon to far left) */}
        <Flex flex="1" minW="0" justify="flex-end" align="center">
          <Menu.Root>
            <Menu.Trigger asChild>
              <IconButton
                variant="ghost"
                size="sm"
                flexShrink={0}
                disabled={disabled}
                opacity={isVisuallyDisabled ? 0.4 : 1}
                aria-label="گزینه‌ها"
              >
                <EllipsisVertical size={20} />
              </IconButton>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner dir="rtl">
                <Menu.Content minW="36">
                  <Menu.Item value="edit" onClick={() => onEdit?.(id)}>
                    <Pencil size={14} />
                    ویرایش
                  </Menu.Item>
                  <Menu.Item
                    value="delete"
                    onClick={() => onDelete?.(id)}
                    color="fg.error"
                    _hover={{ bg: 'bg.error', color: 'fg.error' }}
                  >
                    <Trash2 size={14} />
                    حذف
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Flex>
      </Flex>
    </Flex>
  )
}
