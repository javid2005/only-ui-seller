import { useState } from 'react'
import {
  Dialog, Button, Portal, CloseButton, Field, Input,
  SegmentGroup, Flex,
} from '@chakra-ui/react'
import type { PhoneCardProps } from './PhoneCard'

// ─── Types ────────────────────────────────────────────────────────────────────

type PhoneType = 'landline' | 'mobile'

interface AddPhoneDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Omit<PhoneCardProps, 'id' | 'onEdit' | 'onDelete'>) => void
  /** اگه ویرایش هست، مقادیر اولیه */
  initial?: Omit<PhoneCardProps, 'id' | 'onEdit' | 'onDelete'>
}

// ─── Segment options ──────────────────────────────────────────────────────────

const PHONE_TYPES: { value: PhoneType; label: string }[] = [
  { value: 'landline', label: 'تلفن ثابت' },
  { value: 'mobile',   label: 'موبایل'    },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function AddPhoneDialog({ open, onClose, onSubmit, initial }: AddPhoneDialogProps) {
  const [type, setType]     = useState<PhoneType>(initial?.type ?? 'landline')
  const [label, setLabel]   = useState(initial?.label ?? '')
  const [number, setNumber] = useState(initial?.number ?? '')

  const isEdit = !!initial

  function handleSubmit() {
    if (!number.trim()) return
    onSubmit({ type, label: label.trim(), number: number.trim() })
    onClose()
  }

  function handleClose() {
    setType('landline')
    setLabel('')
    setNumber('')
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && handleClose()} placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl">
          <Dialog.Content maxW="512px" w="full" mx="4">

            {/* Header */}
            <Dialog.Header
              borderBottomWidth="1px"
              borderColor="border"
              pb="4"
              pt="6"
              px="6"
              position="relative"
            >
              <Dialog.Title fontSize="lg" fontWeight="semibold" color="fg">
                {isEdit ? 'ویرایش شماره تماس' : 'افزودن شماره تماس'}
              </Dialog.Title>
              <Dialog.CloseTrigger asChild position="absolute" top="4" insetEnd="4">
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            {/* Body */}
            <Dialog.Body px="6" py="4" display="flex" flexDirection="column" gap="4">

              {/* نوع */}
              <Field.Root>
                <Field.Label fontSize="sm" fontWeight="semibold" color="fg" mb="1.5">نوع</Field.Label>
                <SegmentGroup.Root
                  value={type}
                  onValueChange={(e) => setType(e.value as PhoneType)}
                  w="full"
                >
                  <SegmentGroup.Indicator bg="white" />
                  {PHONE_TYPES.map((t) => (
                    <SegmentGroup.Item key={t.value} value={t.value} flex="1">
                      <SegmentGroup.ItemText fontSize="sm">{t.label}</SegmentGroup.ItemText>
                      <SegmentGroup.ItemHiddenInput />
                    </SegmentGroup.Item>
                  ))}
                </SegmentGroup.Root>
              </Field.Root>

              {/* عنوان */}
              <Field.Root>
                <Field.Label fontSize="sm" fontWeight="semibold" color="fg">عنوان</Field.Label>
                <Input
                  placeholder="عنوان را وارد کنید"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </Field.Root>

              {/* شماره */}
              <Field.Root required>
                <Field.Label fontSize="sm" fontWeight="semibold" color="fg">
                  شماره
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  placeholder="مثال: ۰۲۱۸۸۱۲۳۴۵۶"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  dir="ltr"
                  textAlign="right"
                  type="tel"
                />
              </Field.Root>

            </Dialog.Body>

            {/* Footer — RTL: FIRST=rightmost=لغو, LAST=leftmost=ذخیره */}
            <Dialog.Footer
              borderTopWidth="1px"
              borderColor="border"
              px="6"
              py="4"
            >
              <Flex gap="3">
                <Button variant="outline" onClick={handleClose}>
                  لغو
                </Button>
                <Button
                  colorPalette="teal"
                  onClick={handleSubmit}
                  disabled={!number.trim()}
                >
                  {isEdit ? 'ذخیره تغییرات' : 'ذخیره'}
                </Button>
              </Flex>
            </Dialog.Footer>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
