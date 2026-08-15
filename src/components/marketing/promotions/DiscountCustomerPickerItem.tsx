'use client'

import { Avatar, Checkbox, Flex, Text } from '@chakra-ui/react'
import { toPersianDigits } from '@/utils/numbers'
import type { ManualCustomer } from '@/components/orders/manual/manualOrderData'

interface DiscountCustomerPickerItemProps {
  customer: ManualCustomer
  selected: boolean
  onToggle: () => void
}

/**
 * DiscountCustomerPickerItem — ردیف دیالوگ چندانتخابیِ «مشتری ها»
 * (Figma: Manual-Customer-Card در node 2663:97516 — عیناً همون کارتِ CustomerSelectPanel.tsx
 * صفحهٔ ایجاد سفارش دستی، فقط چک‌باکس به‌جای RadioCard.ItemIndicator، چون اونجا تک‌انتخابی
 * بود و اینجا چندانتخابی — طبق دستور مستقیم کاربر).
 * RTL DOM order (عیناً CustomerCard در CustomerSelectPanel.tsx): آواتار(راست‌ترین) →
 * نام/شماره(وسط) → چک‌باکس(چپ‌ترین).
 */
export function DiscountCustomerPickerItem({ customer, selected, onToggle }: DiscountCustomerPickerItemProps) {
  return (
    <Flex
      as="button"
      onClick={onToggle}
      align="center"
      justify="space-between"
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
      {/* گروه آواتار+نام — FIRST = راست‌ترین */}
      <Flex align="center" gap="4" minW="0">
        <Avatar.Root size="md" bg="brand.solid" color="brand.contrast" flexShrink={0}>
          <Avatar.Fallback name={customer.name} />
        </Avatar.Root>

        <Flex direction="column" gap="1" alignItems="start" minW="0">
          <Text fontSize="sm" fontWeight="semibold" color="fg">{customer.name}</Text>
          <Text fontSize="xs" color="fg.muted" textAlign="start">{toPersianDigits(customer.phone)}</Text>
        </Flex>
      </Flex>

      {/* چک‌باکس — LAST = چپ‌ترین */}
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
    </Flex>
  )
}
