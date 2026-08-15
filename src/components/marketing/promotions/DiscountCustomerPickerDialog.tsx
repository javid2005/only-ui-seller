'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button, CloseButton, Dialog, Flex, Input, InputGroup, Portal, Text } from '@chakra-ui/react'
import { Search } from 'lucide-react'
import { toLatinDigits } from '@/utils/numbers'
import { MANUAL_CUSTOMERS, type ManualCustomer } from '@/components/orders/manual/manualOrderData'
import { DiscountCustomerPickerItem } from './DiscountCustomerPickerItem'

interface DiscountCustomerPickerDialogProps {
  open: boolean
  onClose: () => void
  selectedCustomerIds: string[]
  onConfirm: (customers: ManualCustomer[]) => void
}

/**
 * DiscountCustomerPickerDialog — «مشتری ها» چندانتخابی برای دامنهٔ «مشتری های منتخب»
 * (Figma: Dialog، node 2663:97516 — ۵۱۲px، تک‌ستونه، عیناً هم‌ساختار با بقیهٔ دیالوگ‌های
 * این خانواده). ساختار ردیف/فیلتر جستجو از CustomerSelectPanel.tsx (صفحهٔ ایجاد سفارش
 * دستی) گرفته شده — طبق دستور کاربر: «شبیه همون ساختار، با این تفاوت که رادیو بود اینجا
 * checkbox است چون چند مشتری قابل انتخابه». دادهٔ مشتریان از catalog مشترک
 * `MANUAL_CUSTOMERS` می‌آید — تکرار داده ممنوع.
 *
 * size="md" → maxW="lg"=512px (همون قرارداد بقیهٔ دیالوگ‌های این خانواده).
 * دکمهٔ «تایید» هیچ‌وقت disabled نمی‌شود — پاک‌کردن کل انتخاب هم یک تایید معتبر است
 * (عیناً DiscountProductPickerDialog).
 */
export function DiscountCustomerPickerDialog({ open, onClose, selectedCustomerIds, onConfirm }: DiscountCustomerPickerDialogProps) {
  const [search, setSearch] = useState('')
  const [pendingIds, setPendingIds] = useState<string[]>(selectedCustomerIds)

  useEffect(() => {
    if (open) setPendingIds(selectedCustomerIds)
  }, [open, selectedCustomerIds])

  const filtered = useMemo(() => {
    const q = toLatinDigits(search.trim()).toLowerCase()
    if (!q) return MANUAL_CUSTOMERS
    return MANUAL_CUSTOMERS.filter((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q))
  }, [search])

  const toggleCustomer = (id: string) => {
    setPendingIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const handleConfirm = () => {
    onConfirm(MANUAL_CUSTOMERS.filter((c) => pendingIds.includes(c.id)))
  }

  return (
    <Dialog.Root open={open} onOpenChange={({ open: o }) => !o && onClose()} placement="center" size="md">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl">
          <Dialog.Content w="full" mx="4">
            <Dialog.Header pt="6" pb="4" px="6">
              <Dialog.Title fontSize="lg" fontWeight="semibold" color="fg">مشتری ها</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body pt="2" pb="6" px="6">
              <Flex direction="column" gap="4" alignItems="start" w="full">
                <InputGroup w="full" startElement={<Search size={16} color="var(--chakra-colors-fg-subtle)" />}>
                  <Input
                    placeholder="جستجوی نام یا شماره تلفن..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </InputGroup>

                {filtered.length === 0 ? (
                  <Flex justify="center" w="full" py="10">
                    <Text fontSize="sm" color="fg.subtle">مشتری‌ای با این مشخصات پیدا نشد.</Text>
                  </Flex>
                ) : (
                  <Flex direction="column" gap="2" maxH="420px" overflowY="auto" w="full" pe="2">
                    {filtered.map((c) => (
                      <DiscountCustomerPickerItem
                        key={c.id}
                        customer={c}
                        selected={pendingIds.includes(c.id)}
                        onToggle={() => toggleCustomer(c.id)}
                      />
                    ))}
                  </Flex>
                )}
              </Flex>
            </Dialog.Body>

            {/* دو دکمه — انصراف FIRST (راست) · برند LAST (چپ)، طبق قرارداد پروژه */}
            <Dialog.Footer pt="2" pb="4" px="6">
              <Flex justify="end" gap="3" w="full">
                <Button variant="outline" colorPalette="gray" onClick={onClose}>انصراف</Button>
                <Button colorPalette="brand" onClick={handleConfirm}>تایید</Button>
              </Flex>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild position="absolute" top="3" insetEnd="3">
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
