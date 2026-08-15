'use client'

import { Badge, Checkbox, Flex, Text } from '@chakra-ui/react'
import { Package } from 'lucide-react'
import { toPersianDigits, formatThousands } from '@/utils/numbers'
import type { CampaignProduct } from '@/components/marketing/campaigns/data'

interface DiscountProductPickerItemProps {
  product: CampaignProduct
  selected: boolean
  onToggle: () => void
}

/**
 * DiscountProductPickerItem — ردیف دیالوگ چندانتخابیِ «محصولات» دامنهٔ «محصولات منتخب»
 * (Figma: Prd-Card-Item در node 5171:85832 — همان کامپوننت ProductPickerItem.tsx کمپین‌ها،
 * تنها فرق واقعی: Checkmark مربعی به‌جای RadioMark دایره‌ای، طبق get_design_context).
 * RTL DOM order (عیناً مثل ProductPickerItem.tsx، تأیید شده با screenshot طرح این نود):
 *   چک‌باکس(راست‌ترین) → تصویر → عنوان/SKU → قیمت(چپ‌ترین)
 * pointerEvents="none" روی چک‌باکس — کل ردیف کلیک‌پذیره (as="button")، چک‌باکس فقط نمایشیه
 * تا toggle دوبار (هم از چک‌باکس هم از ردیف) نشه — همون الگوی ردیف بسته‌ی DiscountDomainAccordion.
 */
export function DiscountProductPickerItem({ product, selected, onToggle }: DiscountProductPickerItemProps) {
  return (
    <Flex
      as="button"
      onClick={onToggle}
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
      {/* چک‌باکس — FIRST = راست‌ترین */}
      <Checkbox.Root
        checked={selected}
        colorPalette="brand"
        size="md"
        cursor="pointer"
        pointerEvents="none"
        flexShrink={0}
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control />
      </Checkbox.Root>

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
      <Flex direction="column" gap="2" flex="1" minW="0" alignItems="start">
        <Text fontSize="sm" fontWeight="semibold" color="fg" w="full" textAlign="start" lineClamp={1}>
          {product.name}
        </Text>
        <Text display={{ base: 'none', sm: 'block' }} fontSize="xs" color="fg.muted" textAlign="start">
          {product.sku}
        </Text>

        {/* زیر sm فقط: SKU زیر عنوان، بعد قیمت (چپ) + بج دلاری (راست) هم‌ردیف */}
        <Flex display={{ base: 'flex', sm: 'none' }} direction="column" gap="2" alignItems="start" w="full">
          <Text fontSize="xs" color="fg.muted" textAlign="start">{product.sku}</Text>
          <Flex align="center" justify="end" gap="4" w="full">
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
      <Flex display={{ base: 'none', sm: 'flex' }} direction="column" gap="2" alignItems="end" flexShrink={0}>
        <Text fontSize="md" fontWeight="medium" color="fg" textAlign="end" whiteSpace="nowrap">
          {toPersianDigits(formatThousands(product.price))} ت
        </Text>
        {product.costUsd != null && (
          <Badge size="xs" colorPalette="gray" variant="subtle">{`$ ${toPersianDigits(product.costUsd)}`}</Badge>
        )}
      </Flex>
    </Flex>
  )
}
