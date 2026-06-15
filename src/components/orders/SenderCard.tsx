import { RadioCard, Flex, Box, Badge } from '@chakra-ui/react'
import { MapPin } from 'lucide-react'

// ─── Types + mock data ──────────────────────────────────────────────────────────

export interface SenderAddress {
  id: string
  title: string
  address: string
  isDefault?: boolean
}

/** آدرس‌های فرستنده (mock — Figma: انتخاب آدرس فرستنده). */
export const SENDER_ADDRESSES: SenderAddress[] = [
  { id: 'dist',   title: 'دفتر پخش',  address: 'تهران، خیابان ولیعصر، نبش خیابان شریعتی', isDefault: true },
  { id: 'main',   title: 'دفتر مرکزی', address: 'نور، بلوار ارتش، خیابان درزی کلا، جنب بانک ملت' },
  { id: 'depot',  title: 'انبار',      address: 'تهران، خیابان جردن، نبش خیابان شریعتی' },
]

// ─── Component ────────────────────────────────────────────────────────────────

interface SenderCardProps {
  value: string
  title: string
  address: string
  isDefault?: boolean
}

/**
 * SenderCard — کارت انتخاب آدرس فرستنده (Figma local component «Sender-Card»).
 *
 * کاملاً با part‌های radio-card خود Chakra ساخته شده:
 *   Item · ItemHiddenInput · ItemControl · ItemContent · ItemText · ItemDescription · ItemIndicator
 * (فقط map-pin یک <Box> ساده است — DS برای آیکون tail part جدا ندارد.)
 * باید داخل <RadioCard.Root> استفاده شود.
 *
 * States (از token، نه hardcode):
 *   default  → bg.panel + border.muted
 *   hover    → brand.bg  + brand.border
 *   checked  → brand.bg  + brand.solid
 *
 * RTL DOM order داخل ItemControl (راست‌ترین = اولین child):
 *   map-pin (راست) → ItemContent (وسط) → ItemIndicator (چپ)
 */
export function SenderCard({ value, title, address, isDefault }: SenderCardProps) {
  return (
    <RadioCard.Item
      value={value}
      w="full"
      rounded="lg"
      p="4"
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border.muted"
      boxShadow="none"
      cursor="pointer"
      _hover={{ bg: 'brand.bg', borderColor: 'brand.border', boxShadow: 'none' }}
      _checked={{ bg: 'brand.bg', borderColor: 'brand.solid', boxShadow: 'none' }}
    >
      <RadioCard.ItemHiddenInput />
      <RadioCard.ItemControl
        gap="4"
        p="0"
        border="none"
        bg="transparent"
        boxShadow="none"
        alignItems="flex-start"
        w="full"
      >
        {/* map-pin — FIRST = راست‌ترین */}
        <Box bg="bg.muted" rounded="md" p="2" flexShrink={0} color="brand.solid">
          <MapPin size={24} />
        </Box>

        {/* محتوا — عنوان(+badge) و آدرس */}
        <RadioCard.ItemContent flex="1" minW="0" gap="1" alignItems="flex-end">
          {/* RTL: عنوان راست (اول)، badge چپ (آخر) */}
          <Flex align="center" gap="2" w="full" justify="flex-end">
            <RadioCard.ItemText fontSize="sm" fontWeight="semibold" color="fg">{title}</RadioCard.ItemText>
            {isDefault && (
              <Badge colorPalette="purple" variant="subtle" size="sm">پیش فرض</Badge>
            )}
          </Flex>
          <RadioCard.ItemDescription fontSize="xs" color="fg.muted" w="full" textAlign="right" m="0">
            {address}
          </RadioCard.ItemDescription>
        </RadioCard.ItemContent>

        {/* indicator رادیو — LAST = چپ‌ترین */}
        <RadioCard.ItemIndicator colorPalette="teal" flexShrink={0} />
      </RadioCard.ItemControl>
    </RadioCard.Item>
  )
}
