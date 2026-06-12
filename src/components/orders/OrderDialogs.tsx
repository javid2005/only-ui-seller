import { useState } from 'react'
import {
  Dialog, Portal, CloseButton, Button, Field, Input, Checkbox, Text,
} from '@chakra-ui/react'
import { useCompactMode } from '@/contexts/CompactModeContext'

// ─── ثبت ارسال (ship) ───────────────────────────────────────────────────────────

interface ShipDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (trackingCode: string | null) => void
}

export function ShipDialog({ open, onClose, onSubmit }: ShipDialogProps) {
  const isCompact = useCompactMode()
  const [code, setCode] = useState('')
  const [noCode, setNoCode] = useState(false)

  function handleClose() {
    setCode('')
    setNoCode(false)
    onClose()
  }

  function handleSubmit() {
    onSubmit(noCode ? null : code.trim() || null)
    handleClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => { if (!e.open) handleClose() }} placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl">
          <Dialog.Content maxW={isCompact ? '420px' : '480px'} w="full" mx="4">

            <Dialog.Header pb="4" pt="6" px="6" position="relative">
              <Dialog.Title fontSize="lg" fontWeight="semibold" color="fg">ثبت ارسال</Dialog.Title>
              <Dialog.CloseTrigger asChild position="absolute" top="4" insetEnd="4">
                <CloseButton size="sm" onClick={handleClose} />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body px="6" pt="2" pb="4" display="flex" flexDirection="column" gap="4">
              <Text fontSize="sm" color="fg.muted">
                برای ثبت ارسال، کد رهگیری سفارش را وارد کنید یا بدون کد پیگیری ادامه دهید.
              </Text>

              <Field.Root>
                <Field.Label fontSize="sm" fontWeight="semibold">کد رهگیری</Field.Label>
                <Input
                  placeholder="کد رهگیری را وارد کنید."
                  value={code}
                  disabled={noCode}
                  onChange={(e) => setCode(e.target.value)}
                />
              </Field.Root>

              <Checkbox.Root
                size="sm"
                colorPalette="brand"
                checked={noCode}
                onCheckedChange={(e) => setNoCode(!!e.checked)}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label fontSize="sm" color="fg">کد پیگیری ندارم — بعداً وارد می‌کنم</Checkbox.Label>
              </Checkbox.Root>
            </Dialog.Body>

            <Dialog.Footer px="6" pt="2" pb="6" gap="3">
              <Button
                bg="brand.solid"
                color="brand.contrast"
                _hover={{ bg: 'brand.emphasized', color: 'brand.fg' }}
                disabled={!noCode && !code.trim()}
                onClick={handleSubmit}
              >
                ارسال
              </Button>
              <Button variant="outline" colorPalette="gray" onClick={handleClose}>انصراف</Button>
            </Dialog.Footer>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

// ─── لغو سفارش (cancel) ──────────────────────────────────────────────────────────

interface CancelOrderDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function CancelOrderDialog({ open, onClose, onConfirm }: CancelOrderDialogProps) {
  const isCompact = useCompactMode()

  return (
    <Dialog.Root open={open} onOpenChange={(e) => { if (!e.open) onClose() }} placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl">
          <Dialog.Content maxW={isCompact ? '420px' : '480px'} w="full" mx="4">

            <Dialog.Header pb="4" pt="6" px="6" position="relative">
              <Dialog.Title fontSize="lg" fontWeight="semibold" color="fg">لغو سفارش</Dialog.Title>
              <Dialog.CloseTrigger asChild position="absolute" top="4" insetEnd="4">
                <CloseButton size="sm" onClick={onClose} />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body px="6" pt="2" pb="4">
              <Text fontSize="sm" color="fg.muted" lineHeight="1.7">
                با لغو این سفارش، موجودی کالاها آزاد می‌شود و مبلغ پرداختی به کیف پول مشتری بازمی‌گردد.
              </Text>
            </Dialog.Body>

            <Dialog.Footer px="6" pt="2" pb="6" gap="3">
              <Button
                colorPalette="red"
                onClick={() => { onConfirm(); onClose() }}
              >
                لغو کن
              </Button>
              <Button variant="outline" colorPalette="gray" onClick={onClose}>انصراف</Button>
            </Dialog.Footer>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
