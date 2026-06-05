import { useState } from 'react'
import {
  Dialog, Portal, CloseButton, Button, Field, Input, FileUpload, Flex, Icon, Text,
} from '@chakra-ui/react'
import { Upload } from 'lucide-react'

export interface AddSubCategoryDialogProps {
  open: boolean
  /** نام دسته‌ی والد — برای نمایش در عنوان (اختیاری) */
  parentName?: string
  onClose: () => void
  onSubmit: (name: string) => void
}

/**
 * AddSubCategoryDialog — دیالوگ «افزودن زیردسته».
 * الگوی Dialog پروژه (Portal/Positioner dir=rtl/Content/Header/Body/Footer).
 */
export function AddSubCategoryDialog({ open, parentName, onClose, onSubmit }: AddSubCategoryDialogProps) {
  const [name, setName] = useState('')

  const handleClose = () => {
    setName('')
    onClose()
  }

  const handleSave = () => {
    const v = name.trim()
    if (!v) return
    onSubmit(v)
    handleClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && handleClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl" py="6">
          <Dialog.Content maxW="512px" w="full" mx="4">

            {/* ─── Header ─────────────────────────────────────────────── */}
            <Dialog.Header pb="4" pt="6" px="6" position="relative">
              <Dialog.Title fontSize="lg" fontWeight="semibold" textAlign="right" w="full">
                افزودن زیردسته{parentName ? ` به «${parentName}»` : ''}
              </Dialog.Title>
              {/* close — insetEnd = چپ در RTL (مطابق Figma x در سمت چپ) */}
              <Dialog.CloseTrigger asChild position="absolute" top="3" insetEnd="3">
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            {/* ─── Body ───────────────────────────────────────────────── */}
            <Dialog.Body px="6" pt="2" pb="4">
              <Flex direction="column" gap="4" align="stretch">

                <Field.Root required>
                  <Field.Label>عنوان زیردسته</Field.Label>
                  <Input
                    placeholder="عنوان را وارد کنید"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    autoFocus
                  />
                </Field.Root>

                {/* FileUpload — الگوی موجود پروژه */}
                <FileUpload.Root accept={['image/png', 'image/jpeg', 'image/webp']} maxFiles={1} w="full">
                  <FileUpload.HiddenInput />
                  <FileUpload.Dropzone w="full" minH="128px" cursor="pointer">
                    <Icon color="fg.muted"><Upload size={20} /></Icon>
                    <FileUpload.DropzoneContent>
                      <Text fontSize="sm" fontWeight="semibold" textAlign="center">
                        برای بارگذاری، اینجا بکشید و رها کنید یا کلیک کنید
                      </Text>
                      <Text fontSize="sm" color="fg.muted" textAlign="center">
                        حجم فایل: حداکثر ۲ مگابایت
                      </Text>
                      <Text fontSize="sm" color="fg.muted" textAlign="center">
                        فرمت تصویر مجاز: png, jpg, jpeg, webp, heic
                      </Text>
                    </FileUpload.DropzoneContent>
                  </FileUpload.Dropzone>
                </FileUpload.Root>

              </Flex>
            </Dialog.Body>

            {/* ─── Footer ─────────────────────────────────────────────── */}
            {/* RTL: flex-end = سمت چپ. DOM: لغو(راست) → ذخیره(چپ) */}
            <Dialog.Footer px="6" pt="2" pb="4" justifyContent="flex-end" gap="3">
              <Button variant="outline" onClick={handleClose}>
                لغو
              </Button>
              <Button colorPalette="brand" onClick={handleSave}>
                ذخیره
              </Button>
            </Dialog.Footer>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
