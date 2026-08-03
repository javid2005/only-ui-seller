'use client'

import { Badge, Flex, Text } from '@chakra-ui/react'
import { Package } from 'lucide-react'
import { toPersianDigits } from '@/utils/numbers'
import { formatThousands } from '@/utils/numbers'
import type { CampaignProduct } from './data'

interface ProductPickerItemProps {
  product: CampaignProduct
  selected: boolean
  onSelect: () => void
}

/**
 * ProductPickerItem — یک ردیف در دیالوگ «انتخاب محصول» (Figma local component Prd-Card-Item,
 * node 2645:78833 — states Default/Hover/Selected).
 * RTL DOM order (بر اساس x-metadata طرح، نه ترتیب خام Figma که LTR است):
 *   RadioMark (راست‌ترین) → تصویر → عنوان/SKU → قیمت (چپ‌ترین)
 */
export function ProductPickerItem({ product, selected, onSelect }: ProductPickerItemProps) {
  return (
    <Flex
      as="button"
      onClick={onSelect}
      align="center"
      gap="4"
      w="full"
      p="4"
      bg={selected ? 'brand.bg' : 'bg.panel'}
      borderWidth="1px"
      borderColor={selected ? 'brand.solid' : 'border.muted'}
      rounded="lg"
      cursor="pointer"
      flexShrink={0}
      _hover={!selected ? { borderColor: 'brand.focusRing' } : undefined}
    >
      {/* RadioMark — FIRST = راست‌ترین */}
      <Flex
        boxSize="5"
        flexShrink={0}
        rounded="full"
        borderWidth={selected ? '6px' : '1px'}
        borderColor={selected ? 'brand.solid' : 'border'}
        bg={selected ? 'brand.contrast' : 'transparent'}
      />

      {/* تصویر */}
      <Flex
        boxSize="12"
        flexShrink={0}
        bg="bg.muted"
        borderWidth="1px"
        borderColor="border.muted"
        rounded="md"
        align="center"
        justify="center"
      >
        <Package size={20} color="var(--chakra-colors-fg-subtle)" />
      </Flex>

      {/* عنوان + SKU — زیر sm: عنوان اینجا، SKU و قیمت به بلوک موبایل زیر منتقل می‌شن */}
      <Flex direction="column" gap="2" flex="1" minW="0" alignItems="flex-start">
        <Text fontSize="sm" fontWeight="semibold" color="fg" w="full" textAlign="right" lineClamp={1}>
          {product.name}
        </Text>
        <Text display={{ base: 'none', sm: 'block' }} fontSize="xs" color="fg.muted" textAlign="right">
          {product.sku}
        </Text>

        {/* زیر sm فقط: SKU زیر عنوان، بعد قیمت (چپ) + بج دلاری (راست) هم‌ردیف */}
        <Flex display={{ base: 'flex', sm: 'none' }} direction="column" gap="2" alignItems="flex-start" w="full">
          <Text fontSize="xs" color="fg.muted" textAlign="right">{product.sku}</Text>
          <Flex align="center" justify="flex-end" gap="4" w="full">
            {/* بج دلاری — FIRST = راست‌ترین */}
            {product.costUsd != null && (
              <Badge size="xs" colorPalette="gray" variant="subtle">{`$ ${toPersianDigits(product.costUsd)}`}</Badge>
            )}
            <Text fontSize="md" fontWeight="medium" color="fg" whiteSpace="nowrap">
              {toPersianDigits(formatThousands(product.price))} ت
            </Text>
          </Flex>
        </Flex>
      </Flex>

      {/* قیمت — sm به بالا فقط — LAST = چپ‌ترین */}
      <Flex display={{ base: 'none', sm: 'flex' }} direction="column" gap="2" alignItems="flex-end" flexShrink={0}>
        <Text fontSize="md" fontWeight="medium" color="fg" textAlign="left" whiteSpace="nowrap">
          {toPersianDigits(formatThousands(product.price))} ت
        </Text>
        {product.costUsd != null && (
          <Badge size="xs" colorPalette="gray" variant="subtle">{`$ ${toPersianDigits(product.costUsd)}`}</Badge>
        )}
      </Flex>
    </Flex>
  )
}
