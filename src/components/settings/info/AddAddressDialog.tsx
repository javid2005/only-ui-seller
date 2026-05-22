import { useState } from 'react'
import {
  Dialog, Button, Portal, CloseButton, Field, Input, Textarea,
  NativeSelect, Flex, Box, Text, Grid,
} from '@chakra-ui/react'
import { MapPin } from 'lucide-react'
import type { AddressCardProps } from './AddressCard'

// ─── Types ────────────────────────────────────────────────────────────────────

type AddressFormData = Omit<AddressCardProps, 'id' | 'onToggleActive' | 'onEdit' | 'onDelete'>

interface AddAddressDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: AddressFormData) => void
  initial?: AddressFormData
}

// ─── Static data ──────────────────────────────────────────────────────────────

const PROVINCES = [
  'تهران', 'اصفهان', 'فارس', 'خراسان رضوی', 'آذربایجان شرقی',
  'مازندران', 'گیلان', 'کرمان', 'خوزستان', 'البرز',
  'سایر استان‌ها',
]

// ─── Map Placeholder ──────────────────────────────────────────────────────────

function MapPlaceholder() {
  return (
    <Box
      h="200px"
      bg="bg.muted"
      rounded="md"
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        inset="0"
        opacity={0.25}
        backgroundImage="linear-gradient(to right, var(--chakra-colors-border-default) 1px, transparent 1px), linear-gradient(to bottom, var(--chakra-colors-border-default) 1px, transparent 1px)"
        backgroundSize="32px 32px"
      />
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        color="brand.solid"
      >
        <MapPin size={40} fill="currentColor" />
      </Box>
      <Box
        position="absolute"
        bottom="2"
        left="2"
        display="flex"
        flexDirection="column"
        gap="1"
      >
        {['+', '−'].map((sym) => (
          <Box
            key={sym}
            w="6"
            h="6"
            bg="bg"
            borderWidth="1px"
            borderColor="border"
            rounded="sm"
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            fontSize="lg"
            fontWeight="bold"
            color="fg.muted"
            _hover={{ bg: 'bg.muted' }}
          >
            {sym}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AddAddressDialog({ open, onClose, onSubmit, initial }: AddAddressDialogProps) {
  const [title,    setTitle]    = useState(initial?.title    ?? '')
  const [province, setProvince] = useState(initial?.province ?? '')
  const [city,     setCity]     = useState(initial?.city     ?? '')
  const [postal,   setPostal]   = useState(initial?.postal   ?? '')
  const [address,  setAddress]  = useState(initial?.address  ?? '')
  const [phone,    setPhone]    = useState(initial?.phone    ?? '')

  const isEdit = !!initial

  function handleSubmit() {
    if (!title.trim() || !address.trim()) return
    onSubmit({
      title:    title.trim(),
      province: province.trim(),
      city:     city.trim(),
      postal:   postal.trim(),
      address:  address.trim(),
      phone:    phone.trim(),
      active:   initial?.active ?? true,
    })
    onClose()
  }

  function handleClose() {
    if (!initial) {
      setTitle('')
      setProvince('')
      setCity('')
      setPostal('')
      setAddress('')
      setPhone('')
    }
    onClose()
  }

  const isValid = title.trim() && address.trim()

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && handleClose()} placement="center" scrollBehavior="inside">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl" py="6">
          <Dialog.Content maxW="448px" w="full" mx="4">

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
                {isEdit ? 'ویرایش آدرس' : 'افزودن آدرس'}
              </Dialog.Title>
              <Dialog.CloseTrigger asChild position="absolute" top="4" left="4">
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            {/* Body */}
            <Dialog.Body px="6" py="5" display="flex" flexDirection="column" gap="5">

              {/* نقشه */}
              <Field.Root>
                <Field.Label fontSize="sm" color="fg" mb="2">موقعیت روی نقشه</Field.Label>
                <MapPlaceholder />
                <Field.HelperText fontSize="xs">
                  در نسخه واقعی روی نقشه کلیک کنید تا موقعیت انتخاب شود
                </Field.HelperText>
              </Field.Root>

              {/* عنوان آدرس */}
              <Field.Root>
                <Field.Label fontSize="sm" color="fg">
                  عنوان آدرس
                  <Text as="span" color="fg.error" ms="1">*</Text>
                </Field.Label>
                <Input
                  placeholder="مثال: دفتر مرکزی"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Field.Root>

              {/* استان و شهر */}
              <Grid templateColumns="1fr 1fr" gap="3">
                <Field.Root>
                  <Field.Label fontSize="sm" color="fg">استان</Field.Label>
                  <NativeSelect.Root>
                    <NativeSelect.Field
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                    >
                      <option value="">انتخاب استان</option>
                      {PROVINCES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Field.Root>

                <Field.Root>
                  <Field.Label fontSize="sm" color="fg">شهر</Field.Label>
                  <Input
                    placeholder="نام شهر"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </Field.Root>
              </Grid>

              {/* آدرس کامل */}
              <Field.Root>
                <Field.Label fontSize="sm" color="fg">
                  آدرس کامل
                  <Text as="span" color="fg.error" ms="1">*</Text>
                </Field.Label>
                <Textarea
                  placeholder="خیابان، کوچه، پلاک..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                />
              </Field.Root>

              {/* کد پستی */}
              <Field.Root>
                <Field.Label fontSize="sm" color="fg">کد پستی</Field.Label>
                <Input
                  placeholder="مثال: ۱۲۳۴۵۶۷۸۹۰"
                  value={postal}
                  onChange={(e) => setPostal(e.target.value)}
                  dir="ltr"
                  textAlign="right"
                  type="tel"
                />
              </Field.Root>

              {/* تلفن */}
              <Field.Root>
                <Field.Label fontSize="sm" color="fg">تلفن (اختیاری)</Field.Label>
                <Input
                  placeholder="مثال: ۰۲۱۸۸۱۲۳۴۵۶"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  dir="ltr"
                  textAlign="right"
                  type="tel"
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
              <Flex gap="3">
                <Button
                  colorPalette="teal"
                  onClick={handleSubmit}
                  disabled={!isValid}
                >
                  {isEdit ? 'ذخیره تغییرات' : 'افزودن آدرس'}
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
