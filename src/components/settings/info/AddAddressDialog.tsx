import { useState, useMemo } from 'react'
import {
  Dialog, Button, Portal, CloseButton, Field, Input, Textarea, Text,
  Select, createListCollection, Flex, Box, Grid, IconButton,
} from '@chakra-ui/react'
import { MapPin, Locate, Plus, Minus } from 'lucide-react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import type { AddressCardProps } from './AddressCard'

// ─── Types ────────────────────────────────────────────────────────────────────

type AddressFormData = Omit<AddressCardProps, 'id' | 'onToggleActive' | 'onEdit' | 'onDelete'>

export interface PhoneOption {
  id: string
  number: string
  label: string
}

interface AddAddressDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: AddressFormData) => void
  initial?: AddressFormData
  phones?: PhoneOption[]
}

// ─── Static data ──────────────────────────────────────────────────────────────

const PROVINCES = [
  'تهران', 'اصفهان', 'فارس', 'خراسان رضوی', 'آذربایجان شرقی',
  'مازندران', 'گیلان', 'کرمان', 'خوزستان', 'البرز',
  'سایر استان‌ها',
]

const provinceCollection = createListCollection({
  items: PROVINCES.map((p) => ({ value: p, label: p })),
})

// ─── Map placeholder ──────────────────────────────────────────────────────────

function MapArea({ minH }: { minH?: string }) {
  return (
    <Box
      flex="1"
      minH={minH ?? '240px'}
      bg="bg.muted"
      rounded="xl"
      position="relative"
      overflow="hidden"
      borderWidth="1px"
      borderColor="border"
    >
      {/* Grid lines */}
      <Box
        position="absolute"
        inset="0"
        opacity={0.25}
        backgroundImage="linear-gradient(to right, var(--chakra-colors-border-default) 1px, transparent 1px), linear-gradient(to bottom, var(--chakra-colors-border-default) 1px, transparent 1px)"
        backgroundSize="32px 32px"
      />
      {/* Pin centered */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        color="red.solid"
      >
        <MapPin size={32} />
      </Box>
      {/*
        Map controls at physical-right of map.
        insetStart = insetInlineStart = right side in RTL ✓
      */}
      <Box position="absolute" bottom="2" insetStart="2">
        <Flex direction="column" gap="1">
          <IconButton
            size="xs"
            variant="solid"
            bg="gray.900"
            color="white"
            aria-label="موقعیت من"
            _hover={{ bg: 'gray.700' }}
          >
            <Locate size={14} />
          </IconButton>
          <IconButton
            size="xs"
            variant="solid"
            bg="gray.900"
            color="white"
            aria-label="بزرگ‌نمایی"
            _hover={{ bg: 'gray.700' }}
          >
            <Plus size={14} />
          </IconButton>
          <IconButton
            size="xs"
            variant="solid"
            bg="gray.900"
            color="white"
            aria-label="کوچک‌نمایی"
            _hover={{ bg: 'gray.700' }}
          >
            <Minus size={14} />
          </IconButton>
        </Flex>
      </Box>
    </Box>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * AddAddressDialog
 *
 * Desktop (2-col RTL row):
 *   FIRST in DOM (rightmost) = Form   SECOND in DOM (leftmost) = Map
 *
 * Compact (column):
 *   Uses CSS order to show Map on top, Form below
 */
export function AddAddressDialog({ open, onClose, onSubmit, initial, phones = [] }: AddAddressDialogProps) {
  const isCompact = useCompactMode()
  const isEdit    = !!initial

  const [title,            setTitle]            = useState(initial?.title    ?? '')
  const [postal,           setPostal]           = useState(initial?.postal   ?? '')
  const [province,         setProvince]         = useState(initial?.province ?? '')
  const [city,             setCity]             = useState(initial?.city     ?? '')
  const [address,          setAddress]          = useState(initial?.address  ?? '')
  const [selectedPhoneIds, setSelectedPhoneIds] = useState<string[]>([])

  const phoneCollection = useMemo(
    () => createListCollection({
      items: phones.map((p) => ({
        value: p.id,
        label: `${p.number}${p.label ? ` — ${p.label}` : ''}`,
      })),
    }),
    [phones],
  )

  function handleSubmit() {
    if (!title.trim() || !address.trim()) return
    const joined = selectedPhoneIds
      .map((id) => phones.find((p) => p.id === id)?.number ?? '')
      .filter(Boolean)
      .join('، ')
    onSubmit({
      title:    title.trim(),
      province: province.trim(),
      city:     city.trim(),
      postal:   postal.trim(),
      address:  address.trim(),
      phone:    joined || undefined,
      active:   initial?.active ?? true,
    })
    onClose()
  }

  function handleClose() {
    if (!initial) {
      setTitle('')
      setPostal('')
      setProvince('')
      setCity('')
      setAddress('')
      setSelectedPhoneIds([])
    }
    onClose()
  }

  const isValid = title.trim() && address.trim()

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => !e.open && handleClose()}
      placement="center"
      scrollBehavior="inside"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl" py="6">
          <Dialog.Content maxW={isCompact ? '480px' : '900px'} w="full" mx="4">

            {/* Header — no bottom border per Figma */}
            <Dialog.Header pb="3" pt="6" px="6" position="relative">
              <Dialog.Title fontSize="lg" fontWeight="semibold" color="fg">
                {isEdit ? 'ویرایش آدرس' : 'افزودن آدرس'}
              </Dialog.Title>
              <Dialog.CloseTrigger asChild position="absolute" top="4" insetEnd="4">
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            {/* Body */}
            <Dialog.Body px="6" py="4">
              <Flex
                direction={isCompact ? 'column' : 'row'}
                gap="4"
                align="stretch"
              >
                {/*
                  RTL row: FIRST child = rightmost (form, right side) ✓
                  Compact column: use `order` to push form below map
                */}

                {/* Form column */}
                <Flex
                  direction="column"
                  gap="4"
                  flex="1"
                  minW="0"
                  order={isCompact ? 1 : 0}
                >
                  {/* عنوان */}
                  <Field.Root required>
                    <Field.Label fontSize="sm" color="fg">
                      عنوان
                      <Field.RequiredIndicator />
                    </Field.Label>
                    <Input
                      placeholder="عنوان را وارد کنید"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Field.Root>

                  {/* کد پستی */}
                  <Field.Root>
                    <Field.Label fontSize="sm" color="fg">کد پستی</Field.Label>
                    <Input
                      placeholder="کد پستی را وارد کنید"
                      value={postal}
                      onChange={(e) => setPostal(e.target.value)}
                      dir="ltr"
                      textAlign="right"
                      type="tel"
                    />
                    <Field.HelperText fontSize="xs">
                      با وارد کردن کد پستی آدرس بصورت خودکار پر شده و قابل ویرایش می باشد.
                    </Field.HelperText>
                  </Field.Root>

                  {/* استان + شهر */}
                  <Grid templateColumns="1fr 1fr" gap="3">
                    <Field.Root>
                      <Field.Label fontSize="sm" color="fg">استان</Field.Label>
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
                      </Select.Root>
                    </Field.Root>

                    {/* شهر — Input (cities DB not available) */}
                    <Field.Root>
                      <Field.Label fontSize="sm" color="fg">شهر</Field.Label>
                      <Input
                        placeholder="شهر را وارد کنید"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </Field.Root>
                  </Grid>

                  {/* آدرس */}
                  <Field.Root required>
                    <Field.Label fontSize="sm" color="fg">
                      آدرس
                      <Field.RequiredIndicator />
                    </Field.Label>
                    <Textarea
                      placeholder="آدرس را وارد کنید"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                    />
                  </Field.Root>

                  {/* تلفن — Multiple Select از شماره‌های موجود */}
                  <Field.Root>
                    <Field.Label fontSize="sm" color="fg">تلفن</Field.Label>
                    <Select.Root
                      collection={phoneCollection}
                      value={selectedPhoneIds}
                      onValueChange={(e) => setSelectedPhoneIds(e.value)}
                      multiple
                      disabled={phones.length === 0}
                    >
                      <Select.HiddenSelect />
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText placeholder="حداقل یک شماره تماس انتخاب کنید" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Select.Positioner>
                        <Select.Content>
                          {phoneCollection.items.map((item) => (
                            <Select.Item key={item.value} item={item}>
                              <Select.ItemText>{item.label}</Select.ItemText>
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Select.Root>
                  </Field.Root>
                </Flex>

                {/* Map column — order 0 in compact (top), order 1 in desktop (left) */}
                <Flex
                  direction="column"
                  gap="1.5"
                  w={isCompact ? 'full' : '320px'}
                  flexShrink={0}
                  alignSelf={isCompact ? 'auto' : 'stretch'}
                  order={isCompact ? 0 : 1}
                >
                  <Text fontSize="sm" fontWeight="semibold" color="fg">انتخاب آدرس روی نقشه</Text>
                  <MapArea minH={isCompact ? '200px' : '300px'} />
                </Flex>
              </Flex>
            </Dialog.Body>

            {/* Footer */}
            <Dialog.Footer
              borderTopWidth="1px"
              borderColor="border"
              px="6"
              py="4"
            >
              {/* RTL: FIRST=rightmost=لغو, LAST=leftmost=ذخیره */}
              <Flex gap="3">
                <Button variant="outline" onClick={handleClose}>
                  لغو
                </Button>
                <Button
                  colorPalette="brand"
                  onClick={handleSubmit}
                  disabled={!isValid}
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
