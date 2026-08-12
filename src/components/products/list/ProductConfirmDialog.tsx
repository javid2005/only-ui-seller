import { useState } from 'react'
import { Button, Dialog, IconButton, Portal, Text } from '@chakra-ui/react'
import { X } from 'lucide-react'

export type ProductConfirmVariant = 'copy' | 'delete'

interface VariantConfig {
  title: string
  message: string
  confirmLabel: string
  colorPalette: 'red' | 'brand'
}

// متن‌ها و رنگ دکمه‌ها عیناً از Figma (node 5198:89891 کپی محصول / 5198:89897 حذف محصول)
// برای count>1 (حذف گروهی از ActionBar) عنوان/متن جمع می‌شن — چیزی در Figma برای این
// حالت نبود، پس فقط زمانی از تک‌شمار پیش‌فرض جدا می‌شه که واقعاً بیش از یک آیتم انتخاب شده.
// متن جمع طبق درخواست کاربر ثابته («محصولات انتخاب شده»)، نه شمارشی.
const VARIANT_CONFIG: Record<ProductConfirmVariant, (count: number) => VariantConfig> = {
  copy: () => ({
    title: 'کپی محصول',
    message: 'آیا میخواهید از محصول یک نسخه کپی ایجاد کنید؟',
    confirmLabel: 'کپی کن',
    colorPalette: 'brand',
  }),
  delete: (count) => ({
    title: count > 1 ? 'حذف محصولات' : 'حذف محصول',
    message: count > 1
      ? 'آیا میخواهید محصولات انتخاب شده را حذف کنید؟'
      : 'آیا میخواهید محصول را حذف کنید؟',
    confirmLabel: 'حذف',
    colorPalette: 'red',
  }),
}

interface ProductConfirmDialogProps {
  open: boolean
  variant: ProductConfirmVariant | null
  /** تعداد آیتم هدف — پیش‌فرض ۱ (تک ردیف)؛ >۱ فقط از دکمهٔ حذف گروهی در SelectionActionBar */
  count?: number
  onConfirm: () => Promise<void> | void
  onCancel: () => void
}

/**
 * دیالوگ تایید کپی/حذف محصول — Figma node 5198:89891 (کپی) / 5198:89897 (حذف).
 * ساختار عیناً از الگوی محلی `ConfirmDomainDialog` گرفته شده (همون Dialog دو-دکمه‌ای).
 * هم از دکمه‌های ردیف جدول/کارت (تک محصول) هم از دکمهٔ حذف گروهیِ SelectionActionBar
 * (چند محصول) صدا زده می‌شه — caller با `count` مشخص می‌کنه.
 * RTL DOM order (تأیید با get_screenshot جداگانهٔ هر دو نود، نه ترتیب خام کد Figma که
 * دکمهٔ اصلی را اول می‌داد): فوتر → «انصراف» FIRST=راست‌ترین، دکمهٔ اصلی
 * (کپی‌کن/حذف) LAST=چپ‌ترین. دکمهٔ بستن (X) → insetInlineEnd="0" top="0" (چپ‌بالا در RTL).
 */
export function ProductConfirmDialog({ open, variant, count = 1, onConfirm, onCancel }: ProductConfirmDialogProps) {
  const [loading, setLoading] = useState(false)
  const config = variant ? VARIANT_CONFIG[variant](count) : null

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
            <Dialog.CloseTrigger position="absolute" top="0" insetInlineEnd="0" asChild>
              <IconButton variant="ghost" size="md" aria-label="بستن" disabled={loading}>
                <X size={20} />
              </IconButton>
            </Dialog.CloseTrigger>

            <Dialog.Header pt="6" pb="4" px="6">
              <Dialog.Title fontSize="lg" fontWeight="semibold">{config?.title}</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body pt="2" pb={variant === 'delete' ? '6' : '4'} px="6">
              <Text fontSize="sm" color="fg.muted" textAlign="start" w="full">
                {config?.message}
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
