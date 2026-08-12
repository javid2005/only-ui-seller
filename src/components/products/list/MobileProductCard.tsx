import { Badge, Checkbox, Flex, Image, Text } from '@chakra-ui/react'
import { STATUS_COLOR, CARD_ROW_ACTIONS, inventoryBadge, type Product } from '@/components/products/list/data'
import { RowActionsMenu } from '@/components/products/list/RowActionsMenu'

interface MobileProductCardProps {
  product: Product
  isSelected: boolean
  onToggle: () => void
}

/**
 * کارت محصول — نمای موبایل/کارت (media<lg)، جایگزین ردیف جدول.
 * Figma: frame 5204:78695 («Prd / Card View») · کامپوننت کارت 5212:82352 («Product-Card»).
 * فقط دو حالت در طرح تعریف شده: Selected=false/true (نه Default/Hover همون‌طور که اول
 * تصور می‌شد) — border/bg پایین طبق همین state. hover-bg (نه border) از الگوی سطرِ جدول
 * دسکتاپ (ProductTable) قرض گرفته شده، چیزی در طرح براش نبود.
 *
 * RTL DOM order (اولین=راست‌ترین، از متادیتای پیکسلی Figma — نه خروجی کد که LTR است):
 * - Header: checkbox (راست‌ترین) → بج وضعیت (وسط) → دکمهٔ ellipsis (چپ‌ترین)
 * - ردیف محصول: ⚠️ برعکسِ جدول دسکتاپ — اینجا متن(عنوان+دسته‌بندی/SKU) راست‌ترین،
 *   عکس چپ‌ترین (تأیید با اندازه‌گیری مجزا؛ هیچ استنتاجی از جدول معتبر نبود، طبق
 *   CLAUDE.md «هر container جدا»)
 * - Bottom: قیمت/تخفیف (راست‌ترین) → موجودی/آخرین‌ویرایش (چپ‌ترین)
 */
export function MobileProductCard({ product: p, isSelected, onToggle }: MobileProductCardProps) {
  const inv = inventoryBadge(p)

  return (
    <Flex
      direction="column"
      bg="bg.panel"
      borderWidth="1px"
      borderColor={isSelected ? 'brand.focusRing' : 'border'}
      rounded="lg"
      overflow="hidden"
      transition="border-color 0.15s"
    >
      {/* ── Top ── */}
      <Flex direction="column" gap="2" p="4">
        {/* Header — checkbox راست‌ترین، بج وسط، ellipsis چپ‌ترین */}
        <Flex align="center" gap="2" w="full">
          <Flex flex="1" justify="start">
            <Checkbox.Root size="sm" colorPalette="brand" checked={isSelected} onCheckedChange={onToggle} aria-label={`انتخاب ${p.name}`}>
              <Checkbox.HiddenInput />
              <Checkbox.Control />
            </Checkbox.Root>
          </Flex>
          <Badge size="sm" colorPalette={STATUS_COLOR[p.status]} variant="subtle" flexShrink={0}>
            {p.status}
          </Badge>
          <Flex flex="1" justify="end">
            <RowActionsMenu size="sm" actions={CARD_ROW_ACTIONS} />
          </Flex>
        </Flex>

        {/* محصول — متن راست‌ترین (چسبیده به عکس)، عکس چپ‌ترین */}
        <Flex gap="4" align="start" justify="end" w="full">
          <Flex direction="column" gap="1" align="start" flex="1" minW="0">
            <Text fontSize="sm" fontWeight="semibold" textAlign="start" lineClamp={1} w="full">{p.name}</Text>
            <Flex gap="2" wrap="wrap" justify="start" w="full">
              <Badge size="xs" variant="subtle">{p.sku}</Badge>
              <Text fontSize="xs" color="fg.muted">{p.category}</Text>
            </Flex>
          </Flex>
          <Image src={p.image} alt={p.name} boxSize="12" rounded="md" objectFit="cover" flexShrink={0} />
        </Flex>
      </Flex>

      {/* ── Bottom — قیمت/تخفیف راست‌ترین، موجودی/تاریخ چپ‌ترین ── */}
      <Flex
        justify="end" align="start" gap="4" w="full" p="4"
        bg={isSelected ? 'brand.bg' : 'bg.subtle'}
        transition="background 0.15s"
      >
        <Flex direction="column" gap="2" align="start" flex="1" minW="0">
          <Text fontSize="sm" fontWeight="semibold">
            {p.priceMain}{p.currency === 'تومان' ? ' ت' : ''}
          </Text>
          {p.priceOriginal && (
            <Flex align="center" gap="2">
              <Text fontSize="xs" color="fg.subtle" textDecoration="line-through">
                {p.priceOriginal}{p.currency === 'تومان' ? ' ت' : ''}
              </Text>
              {p.discount && (
                <Badge size="xs" colorPalette="orange" variant="solid">{p.discount}</Badge>
              )}
            </Flex>
          )}
        </Flex>
        {/* RTL (تأیید کاربر روی screenshot preview): این بلوک باید end=چپ باشه، نه start */}
        <Flex direction="column" gap="2" align="end" flexShrink={0}>
          <Badge size="sm" variant="subtle" colorPalette={inv.colorPalette}>{inv.label}</Badge>
          <Text fontSize="xs" color="fg.muted">{p.lastEdit}</Text>
        </Flex>
      </Flex>
    </Flex>
  )
}
