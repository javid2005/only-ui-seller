import { useState } from 'react'
import { Button, Dialog, IconButton, Portal, Text } from '@chakra-ui/react'
import { X } from 'lucide-react'

export type ConfirmDomainVariant = 'cancel-request' | 'delete' | 'activate'

interface VariantConfig {
  title: string
  confirmLabel: string
  colorPalette: 'red' | 'brand'
  messageBefore: string
  messageAfter: string
}

// متن‌ها و رنگ دکمه‌ها عیناً از Figma (node 4862:76284 / 4862:76304 / 4862:76330)
const VARIANT_CONFIG: Record<ConfirmDomainVariant, VariantConfig> = {
  'cancel-request': {
    title: 'لغو درخواست',
    confirmLabel: 'لغو درخواست اتصال',
    colorPalette: 'red',
    messageBefore: 'آیا میخواهید درخواست اتصال ',
    messageAfter: ' را لغو کنید؟',
  },
  delete: {
    title: 'حذف',
    confirmLabel: 'حذف',
    colorPalette: 'red',
    messageBefore: 'آیا میخواهید اتصال دامنه ',
    messageAfter: ' را حذف کنید؟',
  },
  activate: {
    title: 'فعال کردن دامنه',
    confirmLabel: 'فعال کن',
    colorPalette: 'brand',
    messageBefore: 'با فعال کردن اتصال دامنه ',
    messageAfter: ' اتصال دامنه های دیگر غیرفعال می‌شود. آیا میخواهید ادامه دهید؟',
  },
}

interface ConfirmDomainDialogProps {
  open: boolean
  variant: ConfirmDomainVariant | null
  domainName: string
  onConfirm: () => Promise<void>
  onCancel: () => void
}

export function ConfirmDomainDialog({ open, variant, domainName, onConfirm, onCancel }: ConfirmDomainDialogProps) {
  const [loading, setLoading] = useState(false)
  const config = variant ? VARIANT_CONFIG[variant] : null

  const handleConfirm = async () => {
    setLoading(true)
    await onConfirm()
    setLoading(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={(d) => !d.open && !loading && onCancel()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl" display="flex" alignItems="center" justifyContent="center">
          <Dialog.Content maxW="384px" w="full" mx="4">
            <Dialog.CloseTrigger position="absolute" top="2" insetInlineEnd="2" asChild>
              <IconButton variant="ghost" size="sm" aria-label="بستن" disabled={loading}>
                <X size={20} />
              </IconButton>
            </Dialog.CloseTrigger>

            <Dialog.Header pt="6" pb="4" px="6">
              <Dialog.Title fontSize="lg" fontWeight="semibold">{config?.title}</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body pt="2" pb="4" px="6">
              <Text fontSize="sm" color="fg.muted" textAlign="start" w="full">
                {config?.messageBefore}
                <Text as="span" fontWeight="bold" color="fg">{domainName}</Text>
                {config?.messageAfter}
              </Text>
            </Dialog.Body>

            <Dialog.Footer pt="2" pb="4" px="6">
              <Button variant="outline" size="sm" onClick={onCancel} disabled={loading}>
                انصراف
              </Button>
              <Button colorPalette={config?.colorPalette} size="sm" onClick={handleConfirm} loading={loading}>
                {config?.confirmLabel}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
