import { useState } from 'react'
import { Alert, Box, Button, Checkbox, Dialog, Flex, IconButton, Portal, Text } from '@chakra-ui/react'
import { Check, Copy, X } from 'lucide-react'
import { toaster } from '@/components/ui/toaster'

interface DomainCheckResultDialogProps {
  open: boolean
  ns: { ns1: string; ns2: string } | null
  onConfirm: () => Promise<void>
  onCancel: () => void
}

function NsRow({ label, value }: { label: string; value: string }) {
  return (
    <Flex
      flex="1"
      align="center"
      justify="space-between"
      gap="2"
      bg="bg.muted"
      borderWidth="1px"
      borderColor="border"
      rounded="lg"
      px="4"
      py="2"
    >
      <IconButton
        size="xs"
        variant="ghost"
        colorPalette="brand"
        aria-label="کپی"
        onClick={() => {
          navigator.clipboard?.writeText(value)
          toaster.create({ id: 'copy-link-toast', title: 'کپی شد', type: 'success', duration: 2000 })
        }}
      >
        <Copy size={16} />
      </IconButton>
      <Text flex="1" fontSize="md" color="fg" textAlign="center" dir="ltr" minW="0">{value}</Text>
      <Text flexShrink={0} fontSize="md" fontWeight="medium" color="fg.subtle">{label}</Text>
    </Flex>
  )
}

export function DomainCheckResultDialog({ open, ns, onConfirm, onCancel }: DomainCheckResultDialogProps) {
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleClose = () => {
    setConfirmed(false)
    setLoading(false)
    onCancel()
  }

  const handleConfirm = async () => {
    setLoading(true)
    await onConfirm()
    setLoading(false)
    setConfirmed(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={(d) => !d.open && handleClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl" display="flex" alignItems="center" justifyContent="center">
          {/* maxW responsive: Figma has a distinct narrower dialog at ~448px (mobile/512px-compact
              frame) vs 672px on desktop — confirmed via get_metadata on both frame sizes. */}
          <Dialog.Content maxW={{ base: '448px', sm: '672px' }} w="full" mx="4">
            <Dialog.CloseTrigger position="absolute" top="2" insetInlineEnd="2" asChild>
              <IconButton variant="ghost" size="sm" aria-label="بستن">
                <X size={20} />
              </IconButton>
            </Dialog.CloseTrigger>

            <Dialog.Header pt="6" pb="4" px="6">
              <Dialog.Title fontSize="lg" fontWeight="semibold">نتیجه بررسی دامنه</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body py="10" px="6">
              <Flex direction="column" gap="6" alignItems="flex-start" w="full">
                <Flex direction="column" gap="10" alignItems="center" w="full">
                  <Box bg="brand.subtle" p="4" rounded="lg" display="flex" alignItems="center" justifyContent="center">
                    <Check size={32} color="var(--chakra-colors-brand-fg)" />
                  </Box>
                  <Text fontSize="xl" fontWeight="semibold" color="fg" textAlign="center">
                    دامنه قابل اتصال است
                  </Text>
                </Flex>

                <Flex direction="column" gap="4" alignItems="flex-end" bg="bg.subtle" borderWidth="1px" borderColor="border.muted" rounded="lg" p="6" w="full">
                  <Flex direction="column" gap="1" alignItems="flex-start" w="full">
                    <Text fontSize="md" fontWeight="semibold" color="fg">جهت اتصال نیم‌سرورها را در رجیسترر ثبت کنید</Text>
                    <Text fontSize="sm" color="fg.muted">وارد پنل ثبت‌کننده دامنه شوید و نیم‌سرورهای فعلی را با موارد زیر جایگزین کنید.</Text>
                  </Flex>
                  {/* NS1 first in DOM = rightmost in row layout, top in stacked layout —
                      evidence: reference screenshot shows NS2 box on the left / NS1 on the right
                      in row layout, opposite of the previous verbatim-Figma-order markup. */}
                  <Flex gap={{ base: '2', sm: '4' }} align={{ base: 'stretch', sm: 'start' }} direction={{ base: 'column', sm: 'row' }} w="full">
                    <Box flex="1">
                      <NsRow label="NS1" value={ns?.ns1 ?? ''} />
                    </Box>
                    <Box flex="1">
                      <NsRow label="NS2" value={ns?.ns2 ?? ''} />
                    </Box>
                  </Flex>
                </Flex>

                <Alert.Root status="info" variant="subtle" size="sm" w="full">
                  <Alert.Indicator />
                  <Alert.Title fontSize="xs">اعمال تغییرات ممکن است تا ۴۸ ساعت طول بکشد.</Alert.Title>
                </Alert.Root>

                <Checkbox.Root
                  checked={confirmed}
                  onCheckedChange={(d) => setConfirmed(!!d.checked)}
                  colorPalette="brand"
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label fontSize="sm" fontWeight="semibold" color="fg">
                    نیم سرورها را در رجیسترر ثبت کردم
                  </Checkbox.Label>
                </Checkbox.Root>
              </Flex>
            </Dialog.Body>

            <Dialog.Footer pt="2" pb="4" px="6">
              <Button variant="outline" size="sm" onClick={handleClose}>
                انصراف
              </Button>
              <Button colorPalette="brand" size="sm" onClick={handleConfirm} disabled={!confirmed} loading={loading}>
                تایید و درخواست بررسی
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
