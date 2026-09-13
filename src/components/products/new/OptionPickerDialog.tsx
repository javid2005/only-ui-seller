import { useEffect, useState } from 'react'
import { Dialog, Portal, CloseButton, Text, Flex, Grid, Button, Box, chakra } from '@chakra-ui/react'
import { Plus } from 'lucide-react'
import { toPersianDigits } from '@/utils/numbers'
import { optionsForCategory } from './categoryKnowledge'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface OptionPickerDialogProps {
  open: boolean
  onClose: () => void
  category: string
  /** عنوان‌هایی که همین حالا در فرم هستند — دوباره پیشنهاد نمی‌شوند */
  used: string[]
  onPick: (title: string) => void
}

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * OptionPickerDialog — فهرست کاملِ «انتخاب‌های مشتری» برای دستهٔ جاری.
 *
 * نوار پیشنهادِ بالای فرم فقط چند عنوانِ پرکاربرد را جا می‌دهد؛ بقیه اینجا هستند.
 * هر کارت می‌گوید چند مقدار آماده دارد، چون همان مقدارها بعداً در فیلد «مقادیر …»
 * پیشنهاد می‌شوند و کاربر باید بداند چه چیزی نصیبش می‌شود.
 *
 * ورودی دلخواه هم هست: اگر عنوان مورد نظر در فهرست نبود، پایینِ همین دیالوگ
 * نوشته و اضافه می‌شود — فهرست، قید نیست.
 */
export function OptionPickerDialog({ open, onClose, category, used, onPick }: OptionPickerDialogProps) {
  const [custom, setCustom] = useState('')
  useEffect(() => { if (open) setCustom('') }, [open])

  const all = optionsForCategory(category)

  const add = (title: string) => {
    const t = title.trim()
    if (!t) return
    onPick(t)
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl" py="6">
          <Dialog.Content maxW="680px" w="full" mx="4">

            <Dialog.Header pt="5" px="6" pb="2" position="relative">
              <Dialog.Title fontSize="md" fontWeight="semibold" textAlign="start" w="full">
                افزودن انتخاب مشتری
              </Dialog.Title>
              <Text fontSize="xs" color="fg.muted" textAlign="start" mt="1">
                فهرست کامل انتخاب‌های رایج این دسته‌بندی. هر کدام مقادیر آماده هم دارد.
              </Text>
              <Dialog.CloseTrigger asChild position="absolute" top="3" insetEnd="3">
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body px="6" pt="3" pb="4">
              <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }} gap="2">
                {all.map((o) => {
                  const taken = used.includes(o.title)
                  return (
                    <chakra.button
                      key={o.title}
                      type="button"
                      disabled={taken}
                      onClick={() => add(o.title)}
                      display="flex"
                      alignItems="center"
                      gap="2"
                      textAlign="start"
                      p="2.5"
                      rounded="lg"
                      cursor="pointer"
                      borderWidth="1px"
                      borderColor="border"
                      bg="bg.panel"
                      transition="border-color .15s, background .15s"
                      _hover={{ borderColor: 'brand.border', bg: 'brand.bg' }}
                      _disabled={{ opacity: 0.45, cursor: 'not-allowed', _hover: {} }}
                    >
                      {/* FIRST = rightmost: علامت + */}
                      <Box color="brand.fg" flexShrink={0} display="flex"><Plus size={14} /></Box>
                      <Box minW="0" flex="1">
                        <Text fontSize="xs" fontWeight="medium" color="fg" truncate>{o.title}</Text>
                        <Text fontSize="2xs" color="fg.muted" truncate>
                          {taken ? 'قبلاً اضافه شده' : `${toPersianDigits(o.values.length)} مقدار آماده`}
                        </Text>
                      </Box>
                    </chakra.button>
                  )
                })}
              </Grid>

              <Flex gap="2" mt="4" as="form" onSubmit={(e) => { e.preventDefault(); add(custom) }}>
                {/* FIRST = rightmost: ورودی دلخواه · LAST = leftmost: افزودن */}
                <chakra.input
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  placeholder="یا عنوان دلخواه بنویسید…"
                  flex="1"
                  minW="0"
                  h="10"
                  px="3"
                  fontSize="13px"
                  rounded="lg"
                  borderWidth="1px"
                  borderColor="border"
                  bg="bg.panel"
                  _focusVisible={{ borderColor: 'brand.solid', outline: 'none' }}
                />
                <Button type="submit" colorPalette="brand" disabled={!custom.trim()} flexShrink={0}>
                  افزودن
                </Button>
              </Flex>
            </Dialog.Body>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
