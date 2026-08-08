import type { ReactNode } from 'react'
import { Alert, Avatar, Badge, Box, Button, Drawer, Flex, HStack, Image, Portal, Separator, Stack, Text } from '@chakra-ui/react'
import { X } from 'lucide-react'
import { toPersianDigits } from '@/utils/numbers'
import { ABANDONED_ALERT_TEXT, CONVERTED_ALERT_TEXT, STATUS_COLOR, type AbandonedCart } from './abandonedCartsData'

interface AbandonedCartDetailsDrawerProps {
  cart: AbandonedCart | null
  open: boolean
  onClose: () => void
}

/**
 * ردیف Card اطلاعات — RTL DOM order (با evidence از screenshot Figma، نه ترتیب خام JSX که
 * برای رندر LTR export مرتب شده بود): لیبل(راست‌ترین) FIRST ← مقدار(چپ‌ترین) LAST
 */
function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Flex justify="space-between" align="center" py="2" w="full">
      <Text fontSize="xs" fontWeight="medium" color="fg.muted">{label}</Text>
      {typeof value === 'string' ? (
        <Text fontSize="sm" fontWeight="semibold" color="fg">{value}</Text>
      ) : value}
    </Flex>
  )
}

/**
 * Drawer جزئیات سبد — از سمت چپ صفحه باز می‌شه (placement="end" = چپ در RTL).
 * Figma: رها شده node 5114:79262 · تبدیل شده node 5114:79298
 *
 * RTL DOM order (با evidence از screenshot — خروجی خام Figma برای رندر LTR مرتب بود، برعکسش کردیم):
 *  Customer row → Avatar(راست‌ترین) FIRST ← نام/شماره(چپ‌ترین) — طبق قرارداد پروژه (CustomerSelectPanel)
 *  Info Card rows → لیبل(راست) FIRST ← مقدار(چپ) LAST
 *  Product row → تصویر(راست‌ترین) FIRST ← نام+تعداد(وسط) ← قیمت(چپ‌ترین) LAST
 */
export function AbandonedCartDetailsDrawer({ cart, open, onClose }: AbandonedCartDetailsDrawerProps) {
  const isConverted = cart?.status === 'تبدیل شده'

  return (
    <Drawer.Root open={open} onOpenChange={(e) => !e.open && onClose()} placement="end">
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner dir="rtl">
          <Drawer.Content w="full" maxW="512px">
            {cart && (
              <>
                <Drawer.Header
                  h="17"
                  display="flex" alignItems="center" justifyContent="start"
                  px="6" pt="6" pb="4"
                >
                  <Text fontSize="lg" fontWeight="semibold" color="fg">جزئیات سبد {cart.id}</Text>
                </Drawer.Header>

                <Drawer.CloseTrigger
                  position="absolute" top="3.5" insetEnd="2"
                  display="inline-flex" alignItems="center" justifyContent="center"
                  boxSize="8" rounded="md" color="fg.muted"
                  _hover={{ bg: 'gray.subtle' }}
                  aria-label="بستن"
                >
                  <X size={16} />
                </Drawer.CloseTrigger>

                <Drawer.Body px="6" py="4" overflowY="auto">
                  <Flex direction="column" gap="10" align="start" w="full">

                    {/* مشتری + کارت اطلاعات */}
                    <Flex direction="column" gap="4" align="start" w="full">
                      <HStack w="full" gap="2" justify="start">
                        <Avatar.Root size="md" bg="brand.solid" color="brand.contrast" flexShrink={0}>
                          <Avatar.Fallback name={cart.customerName} />
                        </Avatar.Root>
                        <Stack gap="1" align="start">
                          <Text fontSize="sm" fontWeight="semibold" color="fg">{cart.customerName}</Text>
                          <Text fontSize="xs" color="fg.muted">{cart.customerPhone}</Text>
                        </Stack>
                      </HStack>

                      <Box bg="bg.subtle" borderWidth="1px" borderColor="border" rounded="lg" px="4" py="1" w="full">
                        <InfoRow label="تاریخ و زمان ایجاد" value={cart.createdDateTime} />
                        {isConverted && cart.convertedDateTime && (
                          <InfoRow label="تاریخ و زمان تبدیل" value={cart.convertedDateTime} />
                        )}
                        <InfoRow label="تعداد اقلام" value={toPersianDigits(cart.itemsCount)} />
                        <InfoRow label="جمع کل" value={toPersianDigits(cart.totalAmount)} />
                        <InfoRow
                          label="وضعیت"
                          value={
                            <Badge size="sm" colorPalette={STATUS_COLOR[cart.status]} variant="subtle">
                              {cart.status}
                            </Badge>
                          }
                        />
                      </Box>
                    </Flex>

                    {/* اقلام سفارش */}
                    <Flex direction="column" gap="4" align="start" w="full">
                      <Text fontSize="md" fontWeight="semibold" color="fg.subtle">اقلام سفارش</Text>
                      <Flex direction="column" gap="2" w="full">
                        {cart.items.map((item, i) => (
                          <Box key={i} w="full">
                            <HStack w="full" gap="4" justify="start">
                              <Box boxSize="8" bg="bg.muted" borderWidth="1px" borderColor="border.muted" rounded="sm" overflow="hidden" flexShrink={0}>
                                <Image src={item.image} alt={item.name} boxSize="full" objectFit="cover" />
                              </Box>
                              <Stack flex="1" gap="1" align="start" minW="0">
                                <Text fontSize="sm" fontWeight="semibold" color="fg" truncate>{item.name}</Text>
                                <Badge size="xs" colorPalette="gray" variant="subtle">{toPersianDigits(item.qty)} عدد</Badge>
                              </Stack>
                              {/* قیمت — بج $ (راست‌ترین این زیرگروه) FIRST ← قیمت تومان(چپ‌ترین) LAST */}
                              <HStack gap="2" flexShrink={0}>
                                {item.priceUsd && (
                                  <Badge size="xs" colorPalette="gray" variant="subtle">$ {toPersianDigits(item.priceUsd)}</Badge>
                                )}
                                <Text fontSize="sm" fontWeight="semibold" color="fg" whiteSpace="nowrap">{toPersianDigits(item.priceToman)} ت</Text>
                              </HStack>
                            </HStack>
                            {i < cart.items.length - 1 && <Separator mt="2" />}
                          </Box>
                        ))}
                      </Flex>
                    </Flex>

                    {/* Alert — رها شده(warning/orange) یا تبدیل شده(success/green) */}
                    <Alert.Root status={isConverted ? 'success' : 'warning'} variant="subtle" w="full">
                      <Alert.Indicator />
                      <Alert.Content>
                        <Text fontSize="xs">{isConverted ? CONVERTED_ALERT_TEXT : ABANDONED_ALERT_TEXT}</Text>
                      </Alert.Content>
                    </Alert.Root>

                  </Flex>
                </Drawer.Body>

                <Drawer.Footer px="6" pt="2" pb="4" borderTopWidth="1px" borderColor="border">
                  <Button variant="outline" colorPalette="gray" w="full" onClick={onClose}>
                    بستن
                  </Button>
                </Drawer.Footer>
              </>
            )}
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}
