import { useState } from 'react'
import { Alert, Badge, Box, Button, Dialog, Flex, IconButton, Input, InputGroup, Portal, Switch, Text } from '@chakra-ui/react'
import { TriangleAlert, X } from 'lucide-react'
import { toPersianDigits } from '@/utils/numbers'

interface EditVitrinaAddressDialogProps {
  open: boolean
  currentSlug: string
  lastChangedAt: string
  nextChangeAt: string
  onClose: () => void
  onSave: (newSlug: string) => Promise<void>
}

const RESERVED_SLUGS = ['admin', 'api', 'shop']

function normalizeSlug(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 20)
}

export function EditVitrinaAddressDialog({ open, currentSlug, lastChangedAt, nextChangeAt, onClose, onSave }: EditVitrinaAddressDialogProps) {
  const [view, setView] = useState<'edit' | 'warning'>('edit')
  const [orderPaused, setOrderPaused] = useState(false)
  const [slug, setSlug] = useState(currentSlug)
  const [slugError, setSlugError] = useState('')
  const [loading, setLoading] = useState(false)

  const resetAndClose = () => {
    setView('edit')
    setOrderPaused(false)
    setSlug(currentSlug)
    setSlugError('')
    setLoading(false)
    onClose()
  }

  const handleCancelAttempt = () => {
    if (orderPaused) {
      setView('warning')
    } else {
      resetAndClose()
    }
  }

  const handleSave = async () => {
    if (RESERVED_SLUGS.includes(slug) || slug.length < 1) {
      setSlugError('این آدرس مجاز نیست — کلمات رزرو (admin, api, shop…) قابل استفاده نیستند.')
      return
    }
    setLoading(true)
    await onSave(slug)
    setLoading(false)
    resetAndClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(d) => !d.open && handleCancelAttempt()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl" display="flex" alignItems="center" justifyContent="center">
          {/* maxW responsive: both edit/warning have a distinct ~448px mobile size vs their
              desktop widths (672/512) — confirmed via get_metadata on both frame sizes. */}
          <Dialog.Content maxW={{ base: '448px', sm: view === 'edit' ? '672px' : '512px' }} w="full" mx="4">
            <IconButton
              position="absolute"
              top="2"
              insetInlineEnd="2"
              variant="ghost"
              size="sm"
              aria-label="بستن"
              onClick={resetAndClose}
            >
              <X size={20} />
            </IconButton>

            {view === 'edit' ? (
              <>
                <Dialog.Header pt="6" pb="4" px="6">
                  <Dialog.Title fontSize="lg" fontWeight="semibold">ویرایش آدرس اختصاصی</Dialog.Title>
                </Dialog.Header>

                <Dialog.Body pt="2" pb="4" px="6">
                  <Flex direction="column" gap="6" alignItems="end" w="full">
                    <Alert.Root status="warning" variant="subtle" w="full">
                      <Alert.Indicator />
                      <Alert.Content>
                        <Alert.Title>محدودیت تغییر:</Alert.Title>
                        <Alert.Description>
                          {`آدرس اختصاصی هفته‌ای فقط یک‌بار قابل تغییر است (طبق تنظیمات ادمین). آخرین تغییر: ${toPersianDigits(lastChangedAt)} — تغییر بعدی از ${toPersianDigits(nextChangeAt)} ممکن است.`}
                        </Alert.Description>
                      </Alert.Content>
                    </Alert.Root>

                    <Flex direction="column" gap="2" alignItems="end" w="full">
                      <Text fontSize="sm" fontWeight="semibold" color="fg" w="full" textAlign="start">
                        چرا سفارش‌گیری باید موقتاً متوقف شود؟
                      </Text>
                      <Text fontSize="sm" color="fg.muted" w="full" textAlign="start">
                        هنگام تعویض آدرس، اگر سفارشی در حال ثبت باشد ممکن است دچار تداخل شود. برای همین باید سفارش‌گیری چند لحظه متوقف شود؛ پس از ذخیره، خودکار دوباره فعال می‌شود.
                      </Text>

                      <Flex direction="column" gap="3" alignItems="start" borderWidth="1px" borderColor="border" rounded="lg" p="4" w="full" bg={orderPaused ? 'bg.muted' : undefined}>
                        {/* Switch cluster FIRST = rightmost, Badge SECOND = leftmost
                            (evidence: Figma metadata x-coords — SwitchBase x is consistently
                            higher/further-right than Badge x across both dialog states) */}
                        <Flex gap="2" align="center">
                          <Switch.Root
                            checked={!orderPaused}
                            onCheckedChange={() => setOrderPaused((prev) => !prev)}
                            colorPalette="brand"
                            size="md"
                          >
                            <Switch.HiddenInput />
                            <Switch.Label fontSize="sm" color="fg">سفارش‌گیری فروشگاه</Switch.Label>
                            <Switch.Control>
                              <Switch.Thumb />
                            </Switch.Control>
                          </Switch.Root>
                          <Badge colorPalette={orderPaused ? 'orange' : 'brand'} variant="subtle" size="sm">
                            {orderPaused ? 'موقتا متوقف' : 'فعال'}
                          </Badge>
                        </Flex>

                        {orderPaused && (
                          <Flex bg="orange.50" borderWidth="1px" borderColor="orange.muted" rounded="md" p="4" w="full">
                            <Text flex="1" fontSize="sm" fontWeight="semibold" color="orange.fg" textAlign="start">
                              سفارش‌گیری موقتاً متوقف شد. اگر ذخیره نکنید، تا ۱۰ دقیقهٔ دیگر خودکار دوباره فعال می‌شود.
                            </Text>
                          </Flex>
                        )}
                      </Flex>
                    </Flex>

                    <Box opacity={orderPaused ? 1 : 0.5} w="full">
                      <Flex direction="column" gap="1.5" alignItems="start" w="full">
                        <Text fontSize="sm" fontWeight="semibold" color="fg">
                          <Text as="span" fontSize="2xs" color="red.fg">* </Text>
                          آدرس اختصاصی جدید
                        </Text>
                        <InputGroup dir="ltr" endElement={<Text fontSize="sm" color="fg.muted" whiteSpace="nowrap">.vitrinaa.shop</Text>}>
                          <Input
                            value={slug}
                            onChange={(e) => { setSlug(normalizeSlug(e.target.value)); if (slugError) setSlugError('') }}
                            disabled={!orderPaused}
                            dir="ltr"
                            pe="32"
                          />
                        </InputGroup>
                        {slugError ? (
                          <Text fontSize="xs" color="red.fg" w="full" textAlign="start">{slugError}</Text>
                        ) : (
                          <Text fontSize="xs" color="fg.muted" w="full" textAlign="start">
                            ۱ تا ۲۰ کاراکتر · فقط حروف کوچک انگلیسی، عدد و خط‌تیره · کلمات رزرو (admin, api, shop…) مجاز نیست.
                          </Text>
                        )}
                      </Flex>
                    </Box>
                  </Flex>
                </Dialog.Body>

                <Dialog.Footer pt="2" pb="4" px="6">
                  <Button variant="outline" size="sm" onClick={handleCancelAttempt}>
                    لغو
                  </Button>
                  <Button colorPalette="brand" size="sm" onClick={handleSave} loading={loading} disabled={!orderPaused}>
                    ذخیره و ازسرگیری سفارش گیری
                  </Button>
                </Dialog.Footer>
              </>
            ) : (
              <>
                <Dialog.Body py="10" px="6">
                  <Flex direction="column" gap="2" alignItems="start" maxW="640px" w="full">
                    <Box bg="orange.subtle" p="4" rounded="lg" display="flex" alignItems="center" justifyContent="center" w="fit-content">
                      <TriangleAlert size={32} color="var(--chakra-colors-orange-fg)" />
                    </Box>
                    <Text fontSize="xl" fontWeight="semibold" color="fg" w="full" textAlign="start">
                      سفارش‌گیری متوقف است
                    </Text>
                    <Text fontSize="sm" color="fg.muted" w="full" textAlign="start">
                      با بستن این پنجره، آدرس تغییر نمی‌کند و سفارش‌گیری فروشگاه دوباره فعال می‌شود.
                    </Text>
                  </Flex>
                </Dialog.Body>

                <Dialog.Footer pt="2" pb="4" px="6">
                  <Button variant="outline" size="sm" onClick={() => setView('edit')}>
                    بازگشت به ویرایش
                  </Button>
                  <Button colorPalette="brand" size="sm" onClick={resetAndClose}>
                    بستن و ازسرگیری
                  </Button>
                </Dialog.Footer>
              </>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
