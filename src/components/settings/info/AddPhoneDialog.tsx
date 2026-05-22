import { useState } from 'react'
import {
  Dialog, Button, Portal, CloseButton, Field, Input,
  SegmentGroup, Flex, Text,
} from '@chakra-ui/react'
import type { PhoneCardProps } from './PhoneCard'

// ─── Types ────────────────────────────────────────────────────────────────────

type PhoneType = 'work' | 'mobile' | 'home'

interface AddPhoneDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Omit<PhoneCardProps, 'id' | 'onEdit' | 'onDelete'>) => void
  /** اگه ویرایش هست، مقادیر اولیه */
  initial?: Omit<PhoneCardProps, 'id' | 'onEdit' | 'onDelete'>
}

// ─── Segment options ──────────────────────────────────────────────────────────

const PHONE_TYPES: { value: PhoneType; label: string }[] = [
  { value: 'work',   label: 'دفتر'    },
  { value: 'mobile', label: 'موبایل'  },
  { value: 'home',   label: 'خانه'    },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function AddPhoneDialog({ open, onClose, onSubmit, initial }: AddPhoneDialogProps) {
  const [type, setType]     = useState<PhoneType>(initial?.type ?? 'work')
  const [number, setNumber] = useState(initial?.number ?? '')
  const [label, setLabel]   = useState(initial?.label ?? '')

  const isEdit = !!initial

  function handleSubmit() {
    if (!number.trim()) return
    onSubmit({ type, number: number.trim(), label: label.trim() })
    onClose()
  }

  function handleClose() {
    setType('work')
    setNumber('')
    setLabel('')
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && handleClose()} placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl">
          <Dialog.Content maxW="432px" w="full" mx="4">

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
              <Dialog.CloseTrigger asChild position="absolute" top="4" left="4">
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            {/* Body */}
            <Dialog.Body px="6" py="5" display="flex" flexDirection="column" gap="5">

              {/* نوع شماره */}
              <Field.Root>
                <Field.Label fontSize="sm" color="fg.muted" mb="2">نوع شماره</Field.Label>
                <SegmentGroup.Root
                  value={type}
                  onValueChange={(e) => setType(e.value as PhoneType)}
                  w="full"
                >
                  <SegmentGroup.Indicator />
                  {PHONE_TYPES.map((t) => (
                    <SegmentGroup.Item key={t.value} value={t.value} flex="1">
                      <SegmentGroup.ItemText fontSize="sm">{t.label}</SegmentGroup.ItemText>
                      <SegmentGroup.ItemHiddenInput />
                    </SegmentGroup.Item>
                  ))}
                </SegmentGroup.Root>
              </Field.Root>

              {/* شماره تلفن */}
              <Field.Root>
                <Field.Label fontSize="sm" color="fg">
                  شماره تلفن
                  <Text as="span" color="fg.error" ms="1">*</Text>
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

              {/* برچسب */}
              <Field.Root>
                <Field.Label fontSize="sm" color="fg">برچسب / نام</Field.Label>
                <Input
                  placeholder="مثال: دفتر مرکزی"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </Field.Root>

            </Dialog.Body>

            {/* Footer */}
            <Dialog.Footer
              borderTopWidth="1px"
              borderColor="border"
              px="6"
              py="4"
            >
              {/* RTL: FIRST=rightmost — لغو | ذخیره */}
              <Flex gap="3">
                <Button
                  colorPalette="teal"
                  onClick={handleSubmit}
                  disabled={!number.trim()}
                >
                  {isEdit ? 'ذخیره تغییرات' : 'افزودن'}
                </Button>
                <Button variant="ghost" onClick={handleClose}>
                  لغو
                </Button>
              </Flex>
            </Dialog.Footer>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
