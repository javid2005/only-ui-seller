import { useState } from 'react'
import { Box, Button, Dialog, IconButton, Input, Portal, Text } from '@chakra-ui/react'
import { Globe, X } from 'lucide-react'
import { validateDomainFormat } from '@/services/domain'

interface AddDomainDialogProps {
  open: boolean
  onClose: () => void
  onCheck: (domain: string) => Promise<void>
}

export function AddDomainDialog({ open, onClose, onCheck }: AddDomainDialogProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleClose = () => {
    setValue('')
    setError('')
    setLoading(false)
    onClose()
  }

  const handleCheck = async () => {
    if (!validateDomainFormat(value)) {
      setError('فرمت دامنه نامعتبر است — فقط دامنهٔ ریشه (مثل example.com) مجاز است.')
      return
    }
    setError('')
    setLoading(true)
    await onCheck(value.trim().toLowerCase())
    setLoading(false)
    setValue('')
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
              <Dialog.Title fontSize="lg" fontWeight="semibold">افزودن دامنه جدید</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body py="10" px="6">
              <Box display="flex" flexDirection="column" gap="8" alignItems="center" w="full">
                <Box display="flex" flexDirection="column" gap="10" alignItems="center" maxW="640px" w="full">
                  <Box bg="brand.subtle" p="4" rounded="lg" display="flex" alignItems="center" justifyContent="center">
                    <Globe size={32} color="var(--chakra-colors-brand-fg)" />
                  </Box>
                  <Box display="flex" flexDirection="column" gap="2" alignItems="center" w="full">
                    <Text fontSize="xl" fontWeight="semibold" color="fg" textAlign="center">
                      دامنه اختصاصی خود را متصل کنید
                    </Text>
                    <Text fontSize="sm" color="fg.muted" textAlign="center" maxW="512px">
                      دامنه شخصی خود را به فروشگاه متصل کنید تا مشتریان با آدرس اختصاصی شما وارد شوند.
                    </Text>
                  </Box>
                </Box>

                <Box display="flex" flexDirection="column" gap="1.5" alignItems="flex-end" w="full">
                  <Input
                    dir="ltr"
                    placeholder="example.com"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                    size="lg"
                  />
                  <Text fontSize="xs" color={error ? 'red.fg' : 'fg.muted'} textAlign="right" w="full">
                    {error || 'فقط دامنه ریشه قابل اتصال است (بدون www یا ساب‌دامنه)'}
                  </Text>
                </Box>
              </Box>
            </Dialog.Body>

            <Dialog.Footer pt="2" pb="4" px="6">
              <Button variant="outline" size="sm" onClick={handleClose}>
                انصراف
              </Button>
              <Button colorPalette="brand" size="sm" onClick={handleCheck} loading={loading}>
                بررسی دامنه
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
