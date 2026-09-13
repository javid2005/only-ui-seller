import { useEffect, useState } from 'react'
import { Dialog, Portal, CloseButton, Text, Flex, Input, Button, Box } from '@chakra-ui/react'
import { toPersianDigits } from '@/utils/numbers'
import { MediaThumb } from './MediaThumb'
import { NotchedField, bareControl } from './NotchedField'
import type { GalleryImage } from './data'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface MediaSeoDialogProps {
  image: GalleryImage | null
  onClose: () => void
  onConfirm: (patch: { alt: string; caption: string }) => void
}

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * MediaSeoDialog — «سئوی تصویر»: متن جایگزین و کپشن یک رسانه.
 *
 * چرا لازم است: مرحلهٔ سئو «ALT تصاویر» را بررسی می‌کند، ولی تا وقتی جایی برای
 * نوشتنش نباشد آن هشدار قابل رفع نیست. این دیالوگ همان حلقه را می‌بندد —
 * هشدار سئو → پرش به گالری → نوشتن ALT → سبز شدن بررسی.
 *
 * RTL DOM order (first = rightmost): پیش‌نمایش تصویر ← فیلدها.
 */
export function MediaSeoDialog({ image, onClose, onConfirm }: MediaSeoDialogProps) {
  const [alt, setAlt] = useState('')
  const [caption, setCaption] = useState('')

  useEffect(() => {
    if (image) { setAlt(image.alt); setCaption(image.caption) }
  }, [image])

  return (
    <Dialog.Root open={Boolean(image)} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl" py="6">
          <Dialog.Content maxW="520px" w="full" mx="4">

            <Dialog.Header pb="3" pt="6" px="6" position="relative">
              <Dialog.Title fontSize="lg" fontWeight="semibold" textAlign="start" w="full">
                سئوی تصویر
              </Dialog.Title>
              <Text fontSize="xs" color="fg.muted" textAlign="start" mt="1">
                متن جایگزین برای موتورهای جست‌وجو و صفحه‌خوان‌ها استفاده می‌شود.
              </Text>
              <Dialog.CloseTrigger asChild position="absolute" top="3" insetEnd="3">
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body px="6" pt="1" pb="4">
              <Flex gap="4" align="start">
                {/* FIRST = rightmost: پیش‌نمایش */}
                <MediaThumb
                  src={image?.src}
                  alt={alt}
                  boxSize="88px"
                  flexShrink={0}
                  rounded="14px"
                  borderWidth="1px"
                  borderColor="border.muted"
                />
                <Flex direction="column" gap="3" flex="1" minW="0">
                  <NotchedField
                    label="متن جایگزین (ALT)"
                    required
                    hint={`${toPersianDigits(alt.trim().length)} کاراکتر — کوتاه و توصیفی`}
                  >
                    <Input
                      {...bareControl}
                      placeholder="مثال: نمای جلوی گوشی Nova X مشکی"
                      value={alt}
                      onChange={(e) => setAlt(e.target.value)}
                    />
                  </NotchedField>
                  <NotchedField label="کپشن" hint="زیر تصویر در صفحهٔ محصول دیده می‌شود">
                    <Input
                      {...bareControl}
                      placeholder="اختیاری"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                    />
                  </NotchedField>
                </Flex>
              </Flex>
              <Box mt="3">
                <Text fontSize="2xs" color="fg.muted" textAlign="start" dir="ltr">
                  {image?.fileName}
                </Text>
              </Box>
            </Dialog.Body>

            <Dialog.Footer px="6" pt="0" pb="5">
              <Flex justify="end" gap="3" w="full">
                <Button variant="outline" onClick={onClose}>انصراف</Button>
                <Button colorPalette="brand" onClick={() => { onConfirm({ alt, caption }); onClose() }}>
                  ذخیره
                </Button>
              </Flex>
            </Dialog.Footer>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
