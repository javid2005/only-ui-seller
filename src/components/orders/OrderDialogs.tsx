import { useState, useEffect } from 'react'
import {
  Dialog, Portal, CloseButton, Button, Field, Input, Textarea, Checkbox, Text,
  Select, createListCollection, RadioCard, Flex,
} from '@chakra-ui/react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { SenderCard, SENDER_ADDRESSES } from './SenderCard'
import type { ContactInfo } from './orderData'

// ─── Static data (mock) ─────────────────────────────────────────────────────────

const PROVINCES = [
  'تهران', 'اصفهان', 'فارس', 'خراسان رضوی', 'آذربایجان شرقی',
  'مازندران', 'گیلان', 'کرمان', 'خوزستان', 'البرز', 'سایر استان‌ها',
]
const CITIES = [
  'تهران', 'اصفهان', 'شیراز', 'مشهد', 'تبریز',
  'ساری', 'رشت', 'کرمان', 'اهواز', 'کرج', 'سایر شهرها',
]

const provinceCollection = createListCollection({ items: PROVINCES.map((p) => ({ value: p, label: p })) })
const cityCollection     = createListCollection({ items: CITIES.map((c) => ({ value: c, label: c })) })

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

            <Dialog.Header pb="4" pt="6" px="6" position="relative" pe="12">
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

            {/* RTL: انصراف FIRST=راست · brand LAST=چپ */}
            <Dialog.Footer px="6" pt="2" pb="6" gap="3">
              <Button variant="outline" colorPalette="gray" onClick={handleClose}>انصراف</Button>
              <Button
                bg="brand.solid"
                color="brand.contrast"
                _hover={{ bg: 'brand.emphasized', color: 'brand.fg' }}
                disabled={!noCode && !code.trim()}
                onClick={handleSubmit}
              >
                ارسال
              </Button>
            </Dialog.Footer>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

// ─── کد رهگیری (tracking code) ───────────────────────────────────────────────────

interface TrackingCodeDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (trackingCode: string) => void
  initial?: string
}

export function TrackingCodeDialog({ open, onClose, onSubmit, initial = '' }: TrackingCodeDialogProps) {
  const isCompact = useCompactMode()
  const [code, setCode] = useState(initial)

  useEffect(() => { if (open) setCode(initial) }, [open, initial])

  function handleSubmit() {
    if (!code.trim()) return
    onSubmit(code.trim())
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => { if (!e.open) onClose() }} placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl">
          <Dialog.Content maxW={isCompact ? '420px' : '480px'} w="full" mx="4">

            <Dialog.Header pb="4" pt="6" px="6" position="relative" pe="12">
              <Dialog.Title fontSize="lg" fontWeight="semibold" color="fg">کد رهگیری</Dialog.Title>
              <Dialog.CloseTrigger asChild position="absolute" top="4" insetEnd="4">
                <CloseButton size="sm" onClick={onClose} />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body px="6" pt="2" pb="4">
              <Field.Root>
                <Input
                  placeholder="کد رهگیری را وارد کنید."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  autoFocus
                />
              </Field.Root>
            </Dialog.Body>

            {/* RTL: انصراف FIRST=راست · brand LAST=چپ */}
            <Dialog.Footer px="6" pt="2" pb="6" gap="3">
              <Button variant="outline" colorPalette="gray" onClick={onClose}>انصراف</Button>
              <Button colorPalette="brand" disabled={!code.trim()} onClick={handleSubmit}>ذخیره</Button>
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

            <Dialog.Header pb="4" pt="6" px="6" position="relative" pe="12">
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

            {/* RTL: انصراف FIRST=راست · danger LAST=چپ */}
            <Dialog.Footer px="6" pt="2" pb="6" gap="3">
              <Button variant="outline" colorPalette="gray" onClick={onClose}>انصراف</Button>
              <Button colorPalette="red" onClick={() => { onConfirm(); onClose() }}>لغو کن</Button>
            </Dialog.Footer>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

// ─── ویرایش اطلاعات گیرنده (edit receiver) ───────────────────────────────────────

interface EditReceiverDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (info: ContactInfo) => void
  initial: ContactInfo
}

export function EditReceiverDialog({ open, onClose, onSubmit, initial }: EditReceiverDialogProps) {
  const isCompact = useCompactMode()
  const [name, setName]   = useState(initial.name)
  const [phone, setPhone] = useState(initial.phone)

  useEffect(() => {
    if (open) { setName(initial.name); setPhone(initial.phone) }
  }, [open, initial])

  const isValid = name.trim() && phone.trim()

  function handleSubmit() {
    if (!isValid) return
    onSubmit({ name: name.trim(), phone: phone.trim() })
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => { if (!e.open) onClose() }} placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl">
          <Dialog.Content maxW={isCompact ? '420px' : '480px'} w="full" mx="4">

            <Dialog.Header pb="4" pt="6" px="6" position="relative" pe="12">
              <Dialog.Title fontSize="lg" fontWeight="semibold" color="fg">ویرایش اطلاعات گیرنده</Dialog.Title>
              <Dialog.CloseTrigger asChild position="absolute" top="4" insetEnd="4">
                <CloseButton size="sm" onClick={onClose} />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body px="6" pt="2" pb="6" display="flex" flexDirection="column" gap="4">
              <Field.Root required>
                <Field.Label fontSize="sm" fontWeight="semibold" color="fg">
                  نام
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  placeholder="نام را وارد کنید."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label fontSize="sm" fontWeight="semibold" color="fg">
                  شماره تماس
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  placeholder="شماره تماس را وارد کنید."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  dir="ltr"
                  textAlign="start"
                  type="tel"
                />
              </Field.Root>
            </Dialog.Body>

            {/* RTL: انصراف FIRST=راست · brand LAST=چپ */}
            <Dialog.Footer px="6" pt="2" pb="4" gap="3">
              <Button variant="outline" colorPalette="gray" onClick={onClose}>انصراف</Button>
              <Button colorPalette="brand" disabled={!isValid} onClick={handleSubmit}>ذخیره</Button>
            </Dialog.Footer>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

// ─── ویرایش آدرس (edit address) ──────────────────────────────────────────────────

export interface AddressData {
  province: string
  city: string
  postal: string
  address: string
}

interface EditAddressDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: AddressData) => void
  initial: AddressData
}

export function EditAddressDialog({ open, onClose, onSubmit, initial }: EditAddressDialogProps) {
  const isCompact = useCompactMode()
  const [province, setProvince] = useState(initial.province)
  const [city, setCity]         = useState(initial.city)
  const [postal, setPostal]     = useState(initial.postal)
  const [address, setAddress]   = useState(initial.address)

  useEffect(() => {
    if (open) {
      setProvince(initial.province); setCity(initial.city)
      setPostal(initial.postal);     setAddress(initial.address)
    }
  }, [open, initial])

  const isValid = address.trim()

  function handleSubmit() {
    if (!isValid) return
    onSubmit({ province: province.trim(), city: city.trim(), postal: postal.trim(), address: address.trim() })
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => { if (!e.open) onClose() }} placement="center" scrollBehavior="inside">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl" py="6">
          <Dialog.Content maxW={isCompact ? '420px' : '480px'} w="full" mx="4">

            <Dialog.Header pb="4" pt="6" px="6" position="relative" pe="12">
              <Dialog.Title fontSize="lg" fontWeight="semibold" color="fg">ویرایش آدرس</Dialog.Title>
              <Dialog.CloseTrigger asChild position="absolute" top="4" insetEnd="4">
                <CloseButton size="sm" onClick={onClose} />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body px="6" pt="2" pb="6" display="flex" flexDirection="column" gap="4">
              <Field.Root>
                <Field.Label fontSize="sm" fontWeight="semibold" color="fg">استان</Field.Label>
                <Select.Root
                  collection={provinceCollection}
                  value={province ? [province] : []}
                  onValueChange={(e) => setProvince(e.value[0] ?? '')}
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="استان را انتخاب کنید" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {provinceCollection.items.map((item) => (
                          <Select.Item key={item.value} item={item}>
                            <Select.ItemText>{item.label}</Select.ItemText>
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </Field.Root>

              <Field.Root>
                <Field.Label fontSize="sm" fontWeight="semibold" color="fg">شهر</Field.Label>
                <Select.Root
                  collection={cityCollection}
                  value={city ? [city] : []}
                  onValueChange={(e) => setCity(e.value[0] ?? '')}
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="شهر را انتخاب کنید" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {cityCollection.items.map((item) => (
                          <Select.Item key={item.value} item={item}>
                            <Select.ItemText>{item.label}</Select.ItemText>
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </Field.Root>

              <Field.Root>
                <Field.Label fontSize="sm" fontWeight="semibold" color="fg">کد پستی</Field.Label>
                <Input
                  placeholder="کد پستی را وارد کنید"
                  value={postal}
                  onChange={(e) => setPostal(e.target.value)}
                  dir="ltr"
                  textAlign="start"
                  type="tel"
                />
                <Field.HelperText fontSize="xs">
                  با وارد کردن کد پستی آدرس بصورت خودکار پر شده و قابل ویرایش می باشد.
                </Field.HelperText>
              </Field.Root>

              <Field.Root required>
                <Field.Label fontSize="sm" fontWeight="semibold" color="fg">آدرس</Field.Label>
                <Textarea
                  placeholder="آدرس را وارد کنید"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                />
              </Field.Root>
            </Dialog.Body>

            {/* RTL: انصراف FIRST=راست · brand LAST=چپ */}
            <Dialog.Footer px="6" pt="2" pb="4" gap="3">
              <Button variant="outline" colorPalette="gray" onClick={onClose}>انصراف</Button>
              <Button colorPalette="brand" disabled={!isValid} onClick={handleSubmit}>ذخیره</Button>
            </Dialog.Footer>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

// ─── انتخاب آدرس فرستنده (select sender address) ─────────────────────────────────

interface SelectSenderAddressDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (senderId: string, asDefault: boolean) => void
  initialId?: string
}

export function SelectSenderAddressDialog({ open, onClose, onSubmit, initialId }: SelectSenderAddressDialogProps) {
  const isCompact = useCompactMode()
  const defaultId = initialId ?? SENDER_ADDRESSES.find((s) => s.isDefault)?.id ?? SENDER_ADDRESSES[0]?.id ?? ''
  const [selected, setSelected] = useState(defaultId)
  const [asDefault, setAsDefault] = useState(false)

  useEffect(() => {
    if (open) { setSelected(defaultId); setAsDefault(false) }
  }, [open, defaultId])

  function handleSubmit() {
    if (!selected) return
    onSubmit(selected, asDefault)
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => { if (!e.open) onClose() }} placement="center" scrollBehavior="inside">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl" py="6">
          <Dialog.Content maxW={isCompact ? '420px' : '480px'} w="full" mx="4">

            <Dialog.Header pb="4" pt="6" px="6" position="relative" pe="12">
              <Dialog.Title fontSize="lg" fontWeight="semibold" color="fg">انتخاب آدرس فرستنده</Dialog.Title>
              <Dialog.CloseTrigger asChild position="absolute" top="4" insetEnd="4">
                <CloseButton size="sm" onClick={onClose} />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body px="6" pt="2" pb="6" display="flex" flexDirection="column" gap="4">
              <RadioCard.Root
                colorPalette="brand"
                value={selected}
                onValueChange={(e) => setSelected(e.value ?? '')}
                w="full"
              >
                <Flex direction="column" gap="2" w="full">
                  {SENDER_ADDRESSES.map((s) => (
                    <SenderCard key={s.id} value={s.id} title={s.title} address={s.address} isDefault={s.isDefault} />
                  ))}
                </Flex>
              </RadioCard.Root>

              <Checkbox.Root
                size="sm"
                colorPalette="brand"
                alignItems="start"
                checked={asDefault}
                onCheckedChange={(e) => setAsDefault(!!e.checked)}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control mt="0.5" />
                <Flex direction="column" gap="1">
                  <Checkbox.Label fontSize="xs" fontWeight="medium" color="fg">آدرس پیش فرض</Checkbox.Label>
                  <Text fontSize="xs" color="fg.muted">
                    گزینه انتخاب شده را به عنوان آدرس پیش فرض برای ارسال کننده برای درج در فاکتور و پرینت آدرس در نظر بگیر
                  </Text>
                </Flex>
              </Checkbox.Root>
            </Dialog.Body>

            {/* RTL: انصراف FIRST=راست · brand LAST=چپ */}
            <Dialog.Footer px="6" pt="2" pb="4" gap="3">
              <Button variant="outline" colorPalette="gray" onClick={onClose}>انصراف</Button>
              <Button colorPalette="brand" disabled={!selected} onClick={handleSubmit}>انتخاب و ادامه</Button>
            </Dialog.Footer>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
