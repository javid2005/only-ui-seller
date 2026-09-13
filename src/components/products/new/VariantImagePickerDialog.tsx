import { useEffect, useState } from 'react'
import { Dialog, Portal, CloseButton, Text, Flex, Grid, Button, EmptyState, chakra } from '@chakra-ui/react'
import { ImageOff } from 'lucide-react'
import { toPersianDigits } from '@/utils/numbers'
import { MediaThumb } from './MediaThumb'
import type { GalleryImage } from './data'
import { dialogEnterSubmit } from './enterSubmit'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface VariantImagePickerDialogProps {
  open: boolean
  onClose: () => void
  /** تصاویر گالری محصول — منبع انتخاب */
  images: GalleryImage[]
  /** تصویر فعلیِ ترکیب ('' = انتخاب‌نشده) */
  selected: string
  onConfirm: (src: string) => void
}

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * VariantImagePickerDialog — انتخاب تصویر یک ترکیب تنوع از گالری محصول.
 *
 * تصویر جدا آپلود نمی‌شود؛ منبع همان گالری است تا یک رسانه در محصول یک‌بار
 * آپلود شود و در ترکیب‌ها فقط ارجاع داده شود (همان مدل «افزودن به محصول» طرح).
 *
 * DOM order فوتر (rightmost-first): «حذف تصویر» → [انصراف, تایید] (تایید چپ‌ترین).
 */
export function VariantImagePickerDialog({
  open, onClose, images, selected, onConfirm,
}: VariantImagePickerDialogProps) {
  const [pick, setPick] = useState(selected)

  useEffect(() => {
    if (open) setPick(selected)
  }, [open, selected])

  const confirm = () => {
    onConfirm(pick)
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl" py="6">
          <Dialog.Content maxW="480px" w="full" mx="4" {...dialogEnterSubmit(confirm)}>
            <Dialog.Header pb="4" pt="6" px="6" position="relative">
              <Dialog.Title fontSize="lg" fontWeight="semibold" textAlign="start" w="full">
                انتخاب تصویر ترکیب
              </Dialog.Title>
              <Dialog.CloseTrigger asChild position="absolute" top="3" insetEnd="3">
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body px="6" pt="0" pb="4">
              {images.length === 0 ? (
                <EmptyState.Root size="sm">
                  <EmptyState.Content>
                    <EmptyState.Indicator><ImageOff /></EmptyState.Indicator>
                    <EmptyState.Title>گالری خالی است</EmptyState.Title>
                    <EmptyState.Description>
                      ابتدا از تب «گالری» تصویر اضافه کنید.
                    </EmptyState.Description>
                  </EmptyState.Content>
                </EmptyState.Root>
              ) : (
                <Flex direction="column" gap="4">
                  <Text fontSize="sm" color="fg.muted">
                    تصویر مربوط به این ترکیب را از گالری محصول انتخاب کنید.
                  </Text>
                  <Grid templateColumns="repeat(auto-fill, minmax(88px, 1fr))" gap="3">
                    {images.map((img, i) => {
                      const isPicked = pick === img.src
                      return (
                        <chakra.button
                          type="button"
                          key={img.id}
                          aria-label={`تصویر ${toPersianDigits(i + 1)}`}
                          aria-pressed={isPicked}
                          onClick={() => setPick(isPicked ? '' : img.src)}
                          rounded="lg"
                          overflow="hidden"
                          borderWidth="2px"
                          borderColor={isPicked ? 'brand.solid' : 'border'}
                          transition="border-color 0.15s"
                          _hover={{ borderColor: isPicked ? 'brand.solid' : 'brand.border' }}
                        >
                          {/* کادر مربع با گوشهٔ گرد — همان قاعدهٔ نمایش رسانه */}
                          <MediaThumb src={img.src} alt={img.fileName} aspectRatio="1" w="full" />
                        </chakra.button>
                      )
                    })}
                  </Grid>
                </Flex>
              )}
            </Dialog.Body>

            <Dialog.Footer px="6" pt="2" pb="4">
              <Flex justify="space-between" align="center" w="full">
                {/* FIRST = rightmost */}
                <Button variant="plain" color="red.fg" px="0" onClick={() => setPick('')} disabled={!pick}>
                  حذف تصویر
                </Button>
                {/* LAST = leftmost: انصراف (راست‌تر) → تایید (چپ‌ترین) */}
                <Flex gap="3">
                  <Button variant="outline" onClick={onClose}>انصراف</Button>
                  <Button colorPalette="brand" onClick={confirm}>تایید</Button>
                </Flex>
              </Flex>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
