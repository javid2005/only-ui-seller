import { useState } from 'react'
import { Button, CloseButton, Dialog, Field, Input, Portal } from '@chakra-ui/react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { toLatinDigits, toPersianDigits } from '@/utils/numbers'
import type { ManualCustomer } from './manualOrderData'

// همان قرارداد اعتبارسنجی شمارهٔ موبایل در جریان auth (LoginMobileView/ForgotMobileView/PhoneInput):
// فقط رقم (فارسی→لاتین نرمالایز، غیررقم حذف، سقف ۱۱ رقم) + الگوی 09xxxxxxxxx
const PHONE_RE = /^09\d{9}$/
function normalizePhone(raw: string): string {
  return toLatinDigits(raw).replace(/\D/g, '').slice(0, 11)
}

interface AddCustomerDialogProps {
  open: boolean
  onClose: () => void
  /** مشتری با id تازه‌ساخته‌شده — والد آن را به لیست اضافه و انتخاب می‌کند */
  onSubmit: (customer: ManualCustomer) => void
}

/**
 * AddCustomerDialog — دیالوگ «مشتری جدید» ویزارد سفارش دستی (Figma node 2096:27044).
 * الگو از EditReceiverDialog گرفته شده (Dialog.Root/Header/Body/Footer + Field.Root required).
 *
 * RTL: انصراف FIRST=راست · «ثبت و انتخاب» LAST=چپ (قرارداد Dialog Footer پروژه).
 */
export function AddCustomerDialog({ open, onClose, onSubmit }: AddCustomerDialogProps) {
  const isCompact = useCompactMode()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')

  const isValid = name.trim() && PHONE_RE.test(phone)

  function reset() {
    setName('')
    setPhone('')
    setPhoneError('')
  }

  function handleClose() {
    reset()
    onClose()
  }

  function handleSubmit() {
    if (!phone) { setPhoneError('شماره موبایل را وارد نمایید'); return }
    if (!PHONE_RE.test(phone)) { setPhoneError('شماره موبایل وارد شده معتبر نیست'); return }
    if (!name.trim()) return
    onSubmit({
      id: `c-new-${Date.now()}`,
      name: name.trim(),
      phone,
    })
    reset()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => { if (!e.open) handleClose() }} placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl">
          <Dialog.Content maxW={isCompact ? '420px' : '480px'} w="full" mx="4">

            <Dialog.Header pb="4" pt="6" px="6" position="relative">
              <Dialog.Title fontSize="lg" fontWeight="semibold" color="fg">مشتری جدید</Dialog.Title>
              <Dialog.CloseTrigger asChild position="absolute" top="4" insetEnd="4">
                <CloseButton size="sm" onClick={handleClose} />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body px="6" pt="2" pb="6" display="flex" flexDirection="column" gap="4">
              <Field.Root required>
                <Field.Label fontSize="sm" fontWeight="semibold" color="fg">
                  نام و نام خانوادگی
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  placeholder="نام و نام خانوادگی را وارد کنید."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field.Root>

              <Field.Root required invalid={!!phoneError}>
                <Field.Label fontSize="sm" fontWeight="semibold" color="fg">
                  شماره موبایل
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  placeholder="شماره موبایل را وارد کنید."
                  value={toPersianDigits(phone)}
                  onChange={(e) => { setPhone(normalizePhone(e.target.value)); if (phoneError) setPhoneError('') }}
                  dir="ltr"
                  textAlign="right"
                  inputMode="numeric"
                  type="tel"
                />
                {phoneError && <Field.ErrorText fontSize="xs">{phoneError}</Field.ErrorText>}
              </Field.Root>
            </Dialog.Body>

            <Dialog.Footer px="6" pt="2" pb="4" gap="3">
              <Button variant="outline" colorPalette="gray" onClick={handleClose}>انصراف</Button>
              <Button colorPalette="brand" disabled={!isValid} onClick={handleSubmit}>ثبت و انتخاب</Button>
            </Dialog.Footer>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
