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

// ─── Component ────────────────────────────────────────────────────────────────

export function AddressCard({
  id, title, province, city, postal, address, phone,
  active, onToggleActive, onEdit, onDelete,
}: AddressCardProps) {
  const isDisabled = !active

  return (
    <Flex
      direction="column"
      borderWidth="1px"
      borderColor="border"
      rounded="md"
      overflow="hidden"
      w="full"
      className="group"
      _hover={isDisabled ? undefined : { borderColor: 'brand.focusRing' }}
      cursor="default"
    >
      {/* ── Map placeholder ───────────────────────────────────────── */}
      <Box
        h="128px"
        position="relative"
        flexShrink={0}
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          color="red.solid"
        >
          <MapPin size={32} />
        </Box>
      </Box>

      {/* ── Content ───────────────────────────────────────────────── */}
      <Flex
        direction="column"
        gap="2"
        p="4"
        bg="bg.subtle"
        _groupHover={isDisabled ? undefined : { bg: 'brand.bg' }}
        align="start"
      >
        {/* Title — faded when disabled */}
        <Text
          fontSize="md"
          fontWeight="semibold"
          color="fg"
          lineHeight="1.5"
          textAlign="start"
          w="full"
          opacity={isDisabled ? 0.4 : 1}
        >
          {title}
        </Text>

        {/* Address rows — faded when disabled */}
        <Flex direction="column" gap="2" w="full" opacity={isDisabled ? 0.4 : 1}>

          {/* Row 1: Province/city + Postal — two columns, always visible */}
          <Flex gap="4" w="full">
            {/* FIRST = rightmost in RTL — province/city */}
            <Flex align="center" gap="2" flex="1" minW="0">
              <Box color="brand.solid" flexShrink={0} display="flex" alignItems="center">
                <Map size={16} />
              </Box>
              <Text fontSize="sm" color="fg.muted" lineClamp={1} flex="1" textAlign="end">
                {province && city ? `${province}، ${city}` : province || city || '-'}
              </Text>
            </Flex>
            {/* SECOND = leftmost in RTL — postal */}
            <Flex align="center" gap="2" flex="1" minW="0">
              <Box color="brand.solid" flexShrink={0} display="flex" alignItems="center">
                <Mailbox size={16} />
              </Box>
              <Text fontSize="sm" color="fg.muted" lineClamp={1} flex="1" textAlign="end">
                {postal || '-'}
              </Text>
            </Flex>
          </Flex>

          {/* Row 2: Full address */}
          <Flex align="center" gap="2" w="full">
            <Box color="brand.solid" flexShrink={0} display="flex" alignItems="center">
              <MapPin size={16} />
            </Box>
            <Text
              fontSize="sm"
              color="fg.muted"
              lineHeight="1.428"
              flex="1"
              minW="0"
              lineClamp={2}
              textAlign="end"
            >
              {address || '-'}
            </Text>
          </Flex>

          {/* Row 3: Phone — always visible */}
          <Flex align="center" gap="2" w="full">
            <Box color="brand.solid" flexShrink={0} display="flex" alignItems="center">
              <PhoneIcon size={16} />
            </Box>
            <Text
              fontSize="sm"
              color="fg.muted"
              lineHeight="1.428"
              flex="1"
              minW="0"
              lineClamp={1}
              textAlign="end"
            >
              {phone || '-'}
            </Text>
          </Flex>
        </Flex>

        <Separator w="full" />

        {/* Footer */}
        <Flex align="center" justify="space-between" w="full">
          {/* FIRST = rightmost in RTL — switch (no opacity: it reflects active state) */}
          <Switch.Root
            checked={active}
            onCheckedChange={(e) => onToggleActive?.(id, e.checked)}
            colorPalette="brand"
            dir="rtl"
          >
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Label fontSize="sm" color="fg">
              فعال / غیرفعال
            </Switch.Label>
          </Switch.Root>

          {/* LAST = leftmost in RTL — 3-dot menu, faded when disabled */}
          <Box opacity={isDisabled ? 0.4 : 1}>
            <Menu.Root>
              <Menu.Trigger asChild>
                <IconButton variant="ghost" size="sm" aria-label="گزینه‌ها">
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
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}
