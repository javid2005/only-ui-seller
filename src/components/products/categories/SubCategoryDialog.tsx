import { useEffect, useState } from 'react'
import {
  Dialog, Portal, CloseButton, Button, Field, Input, FileUpload, Flex, Icon, Text,
} from '@chakra-ui/react'
import { Upload } from 'lucide-react'

export interface SubCategoryDialogProps {
  open: boolean
  /** add = افزودن، edit = ویرایش (با مقدار اولیه) */
  mode?: 'add' | 'edit'
  /** نام دسته‌ی والد — برای عنوان حالت add */
  parentName?: string
  /** مقدار اولیه‌ی نام — حالت edit */
  initialName?: string
  onClose: () => void
  onSubmit: (name: string) => void
}

/**
 * SubCategoryDialog — دیالوگ افزودن/ویرایش زیردسته.
 * یک دیالوگ، دو حالت (add | edit). الگوی Dialog پروژه.
 */
export function SubCategoryDialog({
  open,
  mode = 'add',
  parentName,
  initialName = '',
  onClose,
  onSubmit,
}: SubCategoryDialogProps) {
  const [name, setName] = useState(initialName)

  // sync مقدار اولیه هر بار که دیالوگ باز می‌شه
  useEffect(() => {
    if (open) setName(initialName)
  }, [open, initialName])

  const isEdit = mode === 'edit'
  const title = isEdit
    ? 'ویرایش زیردسته'
    : `افزودن زیردسته${parentName ? ` به «${parentName}»` : ''}`

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
            <Dialog.Header pb="4" pt="6" px="6" position="relative" pe="12">
              <Dialog.Title fontSize="lg" fontWeight="semibold" textAlign="start" w="full">
                {title}
              </Dialog.Title>
              {/* close — insetEnd = چپ در RTL */}
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
            <Dialog.Footer px="6" pt="2" pb="4" justifyContent="end" gap="3">
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
