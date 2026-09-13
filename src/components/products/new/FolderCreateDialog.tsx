import { useEffect, useState } from 'react'
import { Dialog, Portal, CloseButton, Text, Flex, Button, Box, Input, chakra } from '@chakra-ui/react'
import { Folder, Images, Video, Boxes, Layers } from 'lucide-react'
import { FOLDER_SOURCES, type MediaFolderSource } from './data'
import { dialogEnterSubmit } from './enterSubmit'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface FolderCreateDialogProps {
  open: boolean
  onClose: () => void
  onCreate: (label: string, source: MediaFolderSource) => void
}

const SOURCE_ICON: Record<MediaFolderSource, typeof Folder> = {
  product: Folder,
  manual: Folder,
  'my-images': Images,
  'my-videos': Video,
  'other-products': Boxes,
  'same-category': Layers,
}

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * FolderCreateDialog — ساخت پوشهٔ تازه در کتابخانهٔ رسانه.
 *
 * پوشه دو جور است و همین دیالوگ هر دو را می‌سازد:
 *   • خالی — کاربر خودش رسانه داخلش می‌گذارد و ترتیبش را می‌چیند.
 *   • هوشمند — یک نمای ذخیره‌شده روی کتابخانه؛ خودش پر می‌شود و ترتیب دستی ندارد.
 *
 * چرا این به‌جای یک فیلتر: فیلتر هر بار باید از نو ساخته شود، پوشه یک بار ساخته
 * می‌شود و دفعهٔ بعد سر جایش است — با نامی که خودِ کاربر گذاشته.
 *
 * RTL DOM order هر گزینه (first = rightmost): آیکن ← عنوان و توضیح.
 */
export function FolderCreateDialog({ open, onClose, onCreate }: FolderCreateDialogProps) {
  const [label, setLabel] = useState('')
  const [source, setSource] = useState<MediaFolderSource>('manual')

  useEffect(() => {
    if (open) { setLabel(''); setSource('manual') }
  }, [open])

  const suggested = FOLDER_SOURCES.find((s) => s.value === source)?.label ?? 'پوشهٔ تازه'
  const finalLabel = label.trim() || suggested

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl" py="6">
          <Dialog.Content maxW="560px" w="full" mx="4" {...dialogEnterSubmit(() => { onCreate(finalLabel, source); onClose() })}>

            <Dialog.Header pt="5" px="6" pb="2" position="relative">
              <Dialog.Title fontSize="md" fontWeight="semibold" textAlign="start" w="full">
                پوشهٔ تازه
              </Dialog.Title>
              <Text fontSize="xs" color="fg.muted" textAlign="start" mt="1" lineHeight="1.9">
                یا خودتان پرش کنید، یا بگویید چه چیزی را نشان بدهد تا خودکار پر شود.
              </Text>
              <Dialog.CloseTrigger asChild position="absolute" top="3" insetEnd="3">
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body px="6" pt="3" pb="4">
              <Flex direction="column" gap="1.5">
                {FOLDER_SOURCES.map((s) => {
                  const SourceIcon = SOURCE_ICON[s.value]
                  const on = source === s.value
                  return (
                    <chakra.button
                      key={s.value}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setSource(s.value)}
                      display="flex"
                      alignItems="center"
                      gap="2.5"
                      textAlign="start"
                      p="2.5"
                      rounded="lg"
                      cursor="pointer"
                      borderWidth="1px"
                      borderColor={on ? 'brand.solid' : 'border'}
                      bg={on ? 'brand.bg' : 'bg.panel'}
                      transition="border-color .15s, background .15s"
                      _hover={{ borderColor: on ? 'brand.solid' : 'brand.border' }}
                    >
                      {/* FIRST = rightmost: آیکن منبع */}
                      <Flex
                        boxSize="9"
                        flexShrink={0}
                        rounded="lg"
                        align="center"
                        justify="center"
                        bg={on ? 'brand.solid' : 'bg.subtle'}
                        color={on ? 'brand.contrast' : 'fg.muted'}
                      >
                        <SourceIcon size={17} />
                      </Flex>
                      <Box minW="0" flex="1">
                        <Text fontSize="xs" fontWeight="medium" color="fg">{s.label}</Text>
                        <Text fontSize="2xs" color="fg.muted">{s.hint}</Text>
                      </Box>
                    </chakra.button>
                  )
                })}
              </Flex>

              <Box mt="4">
                <Text fontSize="xs" color="fg.muted" textAlign="start" mb="1.5">نام پوشه</Text>
                <Input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder={suggested}
                  fontSize="13px"
                />
              </Box>
            </Dialog.Body>

            <Dialog.Footer px="6" pt="0" pb="5">
              {/* LAST = leftmost: اقدام اصلی */}
              <Flex justify="end" w="full" gap="3">
                <Button variant="outline" onClick={onClose}>انصراف</Button>
                <Button
                  colorPalette="brand"
                  onClick={() => { onCreate(finalLabel, source); onClose() }}
                >
                  ساخت پوشه
                </Button>
              </Flex>
            </Dialog.Footer>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
