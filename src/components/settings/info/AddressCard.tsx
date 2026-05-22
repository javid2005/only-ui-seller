import { Box, Flex, Text, Separator, IconButton, Menu, Portal, Switch } from '@chakra-ui/react'
import {
  MapPin, Map, Mailbox, Phone as PhoneIcon,
  EllipsisVertical, Pencil, Trash2,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AddressCardProps {
  id: string
  /** عنوان آدرس — مثل "دفتر مرکزی" */
  title: string
  /** استان */
  province: string
  /** شهر */
  city: string
  /** کد پستی */
  postal: string
  /** آدرس کامل */
  address: string
  /** تلفن(های) مرتبط */
  phone?: string
  /** فعال / غیرفعال */
  active: boolean
  onToggleActive?: (id: string, value: boolean) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

// ─── Sub: InfoRow ─────────────────────────────────────────────────────────────

function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <Flex align="center" gap="2" w="full">
      {/* FIRST = rightmost in RTL — icon */}
      <Box color="fg.muted" flexShrink={0} display="flex" alignItems="center">
        {icon}
      </Box>
      {/* text */}
      <Text
        fontSize="sm"
        color="fg.muted"
        lineHeight="1.428"
        flex="1"
        minW="0"
        noOfLines={2}
        textAlign="right"
      >
        {text}
      </Text>
    </Flex>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * AddressCard — نمایش یک آدرس با نقشه placeholder
 *
 * ساختار:
 *   ┌─ Map placeholder (128px) ─┐
 *   │  bg.muted + pin icon       │
 *   ├─ Content (bg.subtle) ──────┤
 *   │  Title                     │
 *   │  InfoRows (province, city, │
 *   │    postal, address, phone) │
 *   │  Separator                 │
 *   │  Footer: ⋮ | Switch        │
 *   └────────────────────────────┘
 */
export function AddressCard({
  id, title, province, city, postal, address, phone,
  active, onToggleActive, onEdit, onDelete,
}: AddressCardProps) {
  return (
    <Flex
      direction="column"
      borderWidth="1px"
      borderColor="border"
      rounded="md"
      overflow="hidden"
      w="full"
    >
      {/* ── Map placeholder ───────────────────────────────────────── */}
      <Box
        h="128px"
        bg="bg.muted"
        position="relative"
        flexShrink={0}
        overflow="hidden"
      >
        {/* Grid lines decorative */}
        <Box
          position="absolute"
          inset="0"
          opacity={0.3}
          backgroundImage="linear-gradient(to right, var(--chakra-colors-border-default) 1px, transparent 1px), linear-gradient(to bottom, var(--chakra-colors-border-default) 1px, transparent 1px)"
          backgroundSize="32px 32px"
        />
        {/* Pin icon centered */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          color="brand.solid"
        >
          <MapPin size={32} fill="currentColor" />
        </Box>
      </Box>

      {/* ── Content ───────────────────────────────────────────────── */}
      <Flex
        direction="column"
        gap="2"
        p="4"
        bg="bg.subtle"
        align="flex-start"  /* flex-start = RIGHT in RTL column */
      >
        {/* Title */}
        <Text fontSize="md" fontWeight="semibold" color="fg" lineHeight="1.5" textAlign="right" w="full">
          {title}
        </Text>

        {/* Address detail rows */}
        <Flex direction="column" gap="2" w="full">
          {/* City + Province in a row */}
          <Flex gap="4" w="full">
            <Flex align="center" gap="2" flex="1" minW="0">
              <Box color="fg.muted" flexShrink={0}><Map size={16} /></Box>
              <Text fontSize="sm" color="fg.muted" noOfLines={1} flex="1" textAlign="right">
                {province}، {city}
              </Text>
            </Flex>
            {postal && (
              <Flex align="center" gap="2" flex="1" minW="0">
                <Box color="fg.muted" flexShrink={0}><Mailbox size={16} /></Box>
                <Text fontSize="sm" color="fg.muted" noOfLines={1} flex="1" textAlign="right">
                  {postal}
                </Text>
              </Flex>
            )}
          </Flex>

          {/* Full address */}
          <InfoRow icon={<MapPin size={16} />} text={address} />

          {/* Phone */}
          {phone && (
            <InfoRow icon={<PhoneIcon size={16} />} text={phone} />
          )}
        </Flex>

        {/* Separator */}
        <Separator w="full" />

        {/* Footer: ⋮ menu | Switch */}
        <Flex align="center" justify="space-between" w="full">
          {/* FIRST = rightmost in RTL — switch */}
          <Switch.Root
            checked={active}
            onCheckedChange={(e) => onToggleActive?.(id, e.checked)}
            colorPalette="teal"
            dir="rtl"
          >
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Label fontSize="sm" color="fg">
              {active ? 'فعال' : 'غیرفعال'}
            </Switch.Label>
          </Switch.Root>

          {/* LAST = leftmost in RTL — 3-dot menu */}
          <Menu.Root>
            <Menu.Trigger asChild>
              <IconButton
                variant="ghost"
                size="sm"
                aria-label="گزینه‌ها"
              >
                <EllipsisVertical size={20} />
              </IconButton>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner dir="rtl">
                <Menu.Content minW="40">
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
