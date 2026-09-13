import { useEffect, useState } from 'react'
import {
  Dialog, Portal, CloseButton, Text, Flex, Box, Button, FileUpload, Icon, IconButton,
} from '@chakra-ui/react'
import { Upload, X, FileImage } from 'lucide-react'
import { toPersianDigits } from '@/utils/numbers'
import { GALLERY_MAX_IMAGE_SIZE } from './data'
import { dialogEnterSubmit } from './enterSubmit'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface MediaUploadDialogProps {
  open: boolean
  onClose: () => void
  /** سقف تعداد فایلی که هنوز جا دارد */
  remaining: number
  /** نام پوشه‌ای که فایل‌ها در آن می‌نشینند */
  folderLabel: string
  onConfirm: (files: File[]) => void
}

const sizeLabel = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${toPersianDigits((bytes / 1024 / 1024).toFixed(1))} مگابایت`
    : `${toPersianDigits(Math.round(bytes / 1024))} کیلوبایت`

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * MediaUploadDialog — آپلودگر چندگانهٔ تصویر/ویدئو.
 *
 * فقط **یک** دکمهٔ افزودن داریم و هم تصویر هم ویدئو را می‌گیرد — بند ۶ دور
 * «چاکرا اصلاح»: دکمهٔ جدا برای ویدئو حذف شد چون هر دو کنار هم آپلود می‌شوند.
 *
 * فایل‌ها قبل از تأیید در فهرست دیده می‌شوند و تک‌تک قابل حذف‌اند، تا انتخاب
 * اشتباه بدون بستن دیالوگ اصلاح شود.
 */
export function MediaUploadDialog({
  open, onClose, remaining, folderLabel, onConfirm,
}: MediaUploadDialogProps) {
  const [picked, setPicked] = useState<File[]>([])

  useEffect(() => {
    if (!open) setPicked([])
  }, [open])

  const total = picked.reduce((sum, f) => sum + f.size, 0)
  const tooMany = picked.length > remaining

  const confirm = () => {
    onConfirm(picked.slice(0, remaining))
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl" py="6">
          <Dialog.Content maxW="560px" w="full" mx="4" {...dialogEnterSubmit(confirm, picked.length > 0)}>

            <Dialog.Header pb="3" pt="6" px="6" position="relative">
              <Dialog.Title fontSize="lg" fontWeight="semibold" textAlign="start" w="full">
                افزودن تصویر/ویدئو
              </Dialog.Title>
              <Text fontSize="xs" color="fg.muted" textAlign="start" mt="1">
                فایل‌ها در پوشهٔ «{folderLabel}» قرار می‌گیرند و بعداً قابل جابه‌جایی‌اند.
              </Text>
              <Dialog.CloseTrigger asChild position="absolute" top="3" insetEnd="3">
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body px="6" pt="1" pb="4">
              <FileUpload.Root
                accept="image/*,video/*"
                maxFiles={Math.max(1, remaining)}
                maxFileSize={GALLERY_MAX_IMAGE_SIZE}
                w="full"
                onFileAccept={(d) => setPicked((prev) => [...prev, ...d.files])}
              >
                <FileUpload.HiddenInput />
                <FileUpload.Dropzone
                  minH="132px"
                  w="full"
                  borderStyle="dashed"
                  borderColor="brand.border"
                  bg="brand.bg"
                >
                  <Icon size="md" color="brand.fg"><Upload /></Icon>
                  <FileUpload.DropzoneContent>
                    <Box fontWeight="semibold" fontSize="sm" color="fg" textAlign="center">
                      فایل‌ها را اینجا بکشید و رها کنید یا کلیک کنید
                    </Box>
                    <Text color="fg.muted" fontSize="xs" textAlign="center">
                      تصویر و ویدئو با هم — هر تصویر تا ۲ مگابایت
                    </Text>
                  </FileUpload.DropzoneContent>
                </FileUpload.Dropzone>
              </FileUpload.Root>

              {picked.length > 0 && (
                <Flex direction="column" gap="2" mt="4">
                  {picked.map((file, i) => (
                    <Flex
                      key={`${file.name}-${i}`}
                      align="center"
                      gap="3"
                      p="2"
                      borderWidth="1px"
                      borderColor="border.muted"
                      rounded="lg"
                    >
                      {/* FIRST = rightmost: آیکن نوع فایل */}
                      <Flex
                        boxSize="9" rounded="md" flexShrink={0}
                        align="center" justify="center" bg="bg.subtle" color="fg.muted"
                      >
                        <FileImage size={16} />
                      </Flex>
                      <Box flex="1" minW="0">
                        <Text fontSize="xs" color="fg" truncate textAlign="start">{file.name}</Text>
                        <Text fontSize="2xs" color="fg.muted" textAlign="start">{sizeLabel(file.size)}</Text>
                      </Box>
                      {/* LAST = leftmost: حذف از فهرست */}
                      <IconButton
                        size="xs"
                        variant="ghost"
                        aria-label={`حذف ${file.name}`}
                        onClick={() => setPicked((prev) => prev.filter((_, j) => j !== i))}
                      >
                        <X size={14} />
                      </IconButton>
                    </Flex>
                  ))}

                  <Flex align="center" justify="space-between" gap="2" pt="1">
                    <Text fontSize="xs" color="fg.muted">
                      {toPersianDigits(picked.length)} فایل — {sizeLabel(total)}
                    </Text>
                    {tooMany && (
                      <Text fontSize="xs" color="red.fg">
                        فقط {toPersianDigits(remaining)} فایل دیگر جا دارد
                      </Text>
                    )}
                  </Flex>
                </Flex>
              )}
            </Dialog.Body>

            <Dialog.Footer px="6" pt="0" pb="5">
              <Flex justify="end" gap="3" w="full">
                {/* FIRST = rightmost: انصراف · LAST = leftmost: افزودن */}
                <Button variant="outline" onClick={onClose}>انصراف</Button>
                <Button colorPalette="brand" onClick={confirm} disabled={picked.length === 0}>
                  افزودن به گالری
                </Button>
              </Flex>
            </Dialog.Footer>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
