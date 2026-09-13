import { useEffect, useState } from 'react'
import { Dialog, Portal, CloseButton, Text, Flex, Button, Box, Input, Code } from '@chakra-ui/react'
import { MediaThumb } from './MediaThumb'
import { sanitizeFileName, isValidFileName, stripExtension, mediaName, MEDIA_EXTENSION } from './identity'
import type { GalleryImage } from './data'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface MediaRenameDialogProps {
  image: GalleryImage | null
  onClose: () => void
  onConfirm: (fileName: string) => void
}

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * MediaRenameDialog — تغییر نام یک رسانه، با قواعد نام‌گذاری وب.
 *
 * نام فایل در آدرس تصویر می‌آید، پس نمی‌تواند هر چیزی باشد: فارسی درصد-انکد
 * می‌شود و ناخوانا، فاصله به `%20` تبدیل می‌شود، حروف بزرگ روی سرورهای حساس دو
 * فایل متفاوت می‌سازد، و زیرخط زیر خطِ لینک گم می‌شود.
 *
 * پس به‌جای «خطا دادن»، ورودی **همان لحظه پاک‌سازی می‌شود** و کاربر نتیجهٔ نهایی
 * را زیر فیلد می‌بیند؛ یاد می‌گیرد، نه اینکه سرزنش شود.
 *
 * پسوند دست کاربر نیست: همهٔ تصاویر سمت سرور به `webp` تبدیل می‌شوند، پس فقط نامِ
 * بدون پسوند گرفته می‌شود.
 */
export function MediaRenameDialog({ image, onClose, onConfirm }: MediaRenameDialogProps) {
  const [raw, setRaw] = useState('')

  useEffect(() => {
    if (image) setRaw(stripExtension(image.fileName))
  }, [image])

  const clean = sanitizeFileName(stripExtension(raw.trim()))
  const auto = image ? mediaName(image.seq) : ''
  const final = clean || auto
  const changed = raw.trim() !== clean && clean !== ''

  return (
    <Dialog.Root open={Boolean(image)} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl" py="6">
          <Dialog.Content maxW="520px" w="full" mx="4">

            <Dialog.Header pt="5" px="6" pb="2" position="relative">
              <Dialog.Title fontSize="md" fontWeight="semibold" textAlign="start" w="full">
                نام فایل
              </Dialog.Title>
              <Text fontSize="xs" color="fg.muted" textAlign="start" mt="1" lineHeight="1.9">
                این نام در آدرس تصویر دیده می‌شود؛ پس فقط حروف کوچک لاتین، رقم و خط تیره.
              </Text>
              <Dialog.CloseTrigger asChild position="absolute" top="3" insetEnd="3">
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body px="6" pt="3" pb="4">
              <Flex gap="4" align="start">
                {/* FIRST = rightmost: پیش‌نمایش */}
                <MediaThumb
                  src={image?.src}
                  alt={image?.alt ?? ''}
                  boxSize="72px"
                  flexShrink={0}
                  rounded="14px"
                  borderWidth="1px"
                  borderColor="border.muted"
                />
                <Box flex="1" minW="0">
                  <Input
                    dir="ltr"
                    value={raw}
                    onChange={(e) => setRaw(e.target.value)}
                    placeholder={auto}
                    fontSize="13px"
                    fontFamily="mono"
                  />
                  <Flex align="center" gap="1.5" mt="2" wrap="wrap">
                    <Text fontSize="2xs" color="fg.muted">نتیجه:</Text>
                    <Code size="sm" dir="ltr" colorPalette="brand">
                      {final}.{MEDIA_EXTENSION}
                    </Code>
                  </Flex>
                  {!isValidFileName(stripExtension(raw)) && raw.trim() !== '' && (
                    <Text fontSize="2xs" color="orange.fg" textAlign="start" mt="1.5" lineHeight="1.9">
                      از این نام چیز قابل استفاده‌ای باقی نمی‌ماند؛ نام خودکار به‌کار می‌رود.
                    </Text>
                  )}
                  {changed && (
                    <Text fontSize="2xs" color="fg.muted" textAlign="start" mt="1.5" lineHeight="1.9">
                      فاصله و کاراکترهای غیرمجاز به خط تیره تبدیل یا حذف شدند.
                    </Text>
                  )}
                </Box>
              </Flex>

              <Text fontSize="2xs" color="fg.muted" textAlign="start" mt="3" lineHeight="1.9">
                پسوند قابل تغییر نیست — همهٔ تصاویر هنگام آپلود به <Code size="sm">webp</Code> تبدیل می‌شوند.
              </Text>
            </Dialog.Body>

            <Dialog.Footer px="6" pt="0" pb="5">
              {/* FIRST = rightmost: بازگرداندن نام خودکار · LAST = leftmost: ذخیره */}
              <Flex align="center" justify="space-between" w="full" gap="3">
                <Button variant="ghost" size="sm" onClick={() => setRaw(auto)}>
                  نام خودکار
                </Button>
                <Flex gap="3">
                  <Button variant="outline" onClick={onClose}>انصراف</Button>
                  <Button
                    colorPalette="brand"
                    onClick={() => { onConfirm(`${final}.${MEDIA_EXTENSION}`); onClose() }}
                  >
                    ذخیره
                  </Button>
                </Flex>
              </Flex>
            </Dialog.Footer>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
