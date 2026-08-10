'use client'

import { useEffect, useState } from 'react'
import { Box, Button, CloseButton, Dialog, Flex, Portal } from '@chakra-ui/react'
import { LocationTreeView } from './LocationTreeView'
import { locationsCollection } from './locations'

interface DiscountLocationPickerDialogProps {
  open: boolean
  onClose: () => void
  checkedValue: string[]
  onConfirm: (checkedValue: string[]) => void
}

/**
 * DiscountLocationPickerDialog — «انتخاب موقعیت جغرافیایی» چندانتخابی برای دامنهٔ «موقعیت
 * جغرافیایی» (Figma: Dialog، node 2660:92036 — ۵۱۲px، تک‌ستونه، عیناً هم‌ساختار با دیالوگ
 * دسته‌بندی: فیلتر جستجو + یک ستون treeview + فوتر). طبق دستور کاربر: «از نظر ساختار مانند
 * دیالوگ دسته‌بندی‌هاست، فقط استان/شهر به‌جای دسته/زیردسته».
 *
 * از LocationTreeView.tsx و locationsCollection موجود (همون treeview صفحهٔ ارسال رایگان)
 * استفاده می‌کند — کامپوننت/دیتای جدید ساخته نشد (Local first).
 *
 * size="md" → maxW="lg"=512px (همون قرارداد DiscountCategoryPickerDialog).
 * pending state داخلی تا انصراف تغییرات چک‌باکس‌ها را دور بریزد.
 */
export function DiscountLocationPickerDialog({ open, onClose, checkedValue, onConfirm }: DiscountLocationPickerDialogProps) {
  const [pending, setPending] = useState<string[]>(checkedValue)

  useEffect(() => {
    if (open) setPending(checkedValue)
  }, [open, checkedValue])

  return (
    <Dialog.Root open={open} onOpenChange={({ open: o }) => !o && onClose()} placement="center" size="md">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl">
          <Dialog.Content w="full" mx="4">
            <Dialog.Header pt="6" pb="4" px="6">
              <Dialog.Title fontSize="lg" fontWeight="semibold" color="fg">انتخاب موقعیت جغرافیایی</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body pt="2" pb="6" px="6">
              <Box h="480px">
                <LocationTreeView collection={locationsCollection} checkedValue={pending} onCheckedChange={setPending} />
              </Box>
            </Dialog.Body>

            {/* دو دکمه — انصراف FIRST (راست) · برند LAST (چپ)، طبق قرارداد پروژه */}
            <Dialog.Footer pt="2" pb="4" px="6">
              <Flex justify="end" gap="3" w="full">
                <Button variant="outline" colorPalette="gray" onClick={onClose}>انصراف</Button>
                <Button colorPalette="brand" onClick={() => onConfirm(pending)}>تایید</Button>
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
