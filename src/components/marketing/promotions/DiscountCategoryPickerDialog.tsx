'use client'

import { useEffect, useState } from 'react'
import { Box, Button, CloseButton, Dialog, Flex, Portal } from '@chakra-ui/react'
import { CategoryTreeView } from './CategoryTreeView'
import { categoriesCollection } from './categories'

interface DiscountCategoryPickerDialogProps {
  open: boolean
  onClose: () => void
  checkedValue: string[]
  onConfirm: (checkedValue: string[]) => void
}

/**
 * DiscountCategoryPickerDialog — «انتخاب دسته بندی» چندانتخابی برای دامنهٔ «دسته‌بندی»
 * (Figma: Dialog، node 2660:91406 — تک‌ستونه، ۵۱۲px، فقط یک ستون treeview؛ برخلاف نسخهٔ
 * اولیه که به‌اشتباه دو ستون FreeShippingGeoSection رو کپی کرده بود، طبق تصحیح کاربر).
 * منطق/چک‌باکس/indent همان CategoryTreeView واقعیِ Chakra است (نه موکاپ فلتِ بدون‌indent
 * خودِ فریم فیگما) — طبق قرارداد قبلی کاربر برای LocationTreeView: «کامپوننت treeview رو
 * نداشتم از خودم ساختم ولی تو از chakra treeview استفاده کن».
 *
 * size="md" (توکن رسمی Chakra Dialog، نه maxW دستی) → maxW="lg"=512px — دقیقاً هم‌مقیاس با
 * فریم فیگما و با DiscountProductPickerDialog.
 *
 * pending state داخلی (مثل دیالوگ محصول) تا انصراف تغییرات چک‌باکس‌ها را دور بریزد و فقط
 * تایید آن‌ها را به صفحهٔ والد commit کند.
 */
export function DiscountCategoryPickerDialog({ open, onClose, checkedValue, onConfirm }: DiscountCategoryPickerDialogProps) {
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
              <Dialog.Title fontSize="lg" fontWeight="semibold" color="fg">انتخاب دسته بندی</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body pt="2" pb="6" px="6">
              <Box h="480px">
                <CategoryTreeView collection={categoriesCollection} checkedValue={pending} onCheckedChange={setPending} />
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
