import { Badge, Box, Checkbox, Flex, Image, Text } from '@chakra-ui/react'
import { toPersianDigits } from '@/utils/numbers'
import { STATUS_COLOR, type Product } from './data'
import { RowActionsMenu } from './RowActionsMenu'

interface ProductCardProps {
  product: Product
  isSelected: boolean
  onToggle: (id: string) => void
}

/**
 * کارت محصول — معادل ردیف جدول در view کارت. سه حالت (Figma 1256-19331):
 *  default  → outer bg `bg.subtle`،  border `border`
 *  hover    → outer bg `bg.muted`   (_hover روی outer Box)
 *  selected → outer bg `brand.bg`، border `brand.solid`، checkbox فعال
 * image section همیشه bg (سفید). content از outer bg ارث می‌بره.
 * RTL: چک‌باکس insetInlineStart(راست) · badge وضعیت insetInlineEnd(چپ).
 */
export function ProductCard({ product: p, isSelected, onToggle }: ProductCardProps) {
  const tomanSuffix = p.currency === 'تومان' ? ' ت' : ''
  return (
    <Box
      borderWidth="1px"
      borderColor={isSelected ? 'brand.solid' : 'border'}
      rounded="lg"
      overflow="hidden"
      bg={isSelected ? 'brand.bg' : 'bg.subtle'}
      _hover={{ bg: isSelected ? 'brand.subtle' : 'bg.muted' }}
      transition="border-color 0.15s, background 0.15s"
    >
      {/* ── Image container — همیشه bg (سفید)، مستقل از state ── */}
      <Flex position="relative" h="140px" bg="bg" align="center" justify="center">
        {/* checkbox — start (راست) */}
        <Box position="absolute" top="4" insetInlineStart="4" zIndex="1">
          <Checkbox.Root
            size="md"
            colorPalette="brand"
            checked={isSelected}
            onCheckedChange={() => onToggle(p.id)}
            aria-label={`انتخاب ${p.name}`}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control
              bg="bg"
              _checked={{ bg: 'colorPalette.solid', borderColor: 'colorPalette.solid' }}
            />
          </Checkbox.Root>
        </Box>

        {/* status badge — end (چپ) */}
        <Badge
          position="absolute" top="4" insetInlineEnd="4"
          size="sm" colorPalette={STATUS_COLOR[p.status]} variant="subtle"
        >
          {p.status}
        </Badge>

        {/* inventory badge — bottom end (پایین چپ) */}
        <Badge
          position="absolute" bottom="4" insetInlineEnd="4"
          size="sm" colorPalette="gray" variant="subtle"
        >
          {toPersianDigits(p.inventory)} عدد
        </Badge>

        {/* image — centered via flex (direction-agnostic) */}
        <Image
          src={p.image} alt={p.name}
          boxSize="104px" objectFit="contain"
          pointerEvents="none"
        />
      </Flex>

      {/* ── Content — bg از outer Box ارث می‌بره ── */}
      <Flex
        direction="column" gap="2" p="4" align="stretch"
      >
        {/* title */}
        <Text fontSize="sm" fontWeight="semibold" color="fg" textAlign="right" lineClamp={1}>
          {p.name}
        </Text>

        {/* meta — features + category (RTL: feature راست، category چپ) */}
        <Flex gap="1.5" align="center" flexWrap="wrap" minH="5">
          {p.features.slice(0, 1).map((f) => (
            <Badge key={f} size="sm" colorPalette="purple" variant="subtle">{f}</Badge>
          ))}
          <Text fontSize="xs" color="fg.subtle">•</Text>
          <Text fontSize="sm" color="fg.muted">{p.category}</Text>
        </Flex>

        <Box h="2" />

        {/* footer — price (start/راست، flex) + menu (end/چپ) */}
        <Flex align="flex-end" gap="1">
          <Flex direction="column" align="stretch" gap="1" flex="1" minW="0">
            {p.priceOriginal && (
              <Flex gap="2" align="center" justifyContent="flex-start" flexWrap="wrap">
                {/* RTL: قیمت اصلی راست، badge تخفیف چپ */}
                <Text fontSize="sm" color="fg.subtle" textDecoration="line-through">
                  {p.priceOriginal}{tomanSuffix}
                </Text>
                {p.discount && (
                  <Badge size="sm" colorPalette="orange" variant="solid">{p.discount} تخفیف</Badge>
                )}
              </Flex>
            )}
            <Text fontSize="md" fontWeight="semibold" color="fg" textAlign="right" lineClamp={1}>
              {p.priceMain}{tomanSuffix}
            </Text>
          </Flex>
          <RowActionsMenu />
        </Flex>
      </Flex>
    </Box>
  )
}
