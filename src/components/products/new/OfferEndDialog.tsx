import { useEffect, useState } from 'react'
import { Dialog, Portal, CloseButton, Text, Flex, Button, Box } from '@chakra-ui/react'
import { DatePicker } from '@/components/ui/DatePicker'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface OfferEndDialogProps {
  open: boolean
  onClose: () => void
  title: string
  /** توضیح یک‌خطی: دقیقاً در این تاریخ چه اتفاقی می‌افتد */
  effect: string
  /** ISO میلادی «YYYY-MM-DD» یا خالی */
  value: string
  onConfirm: (v: string) => void
}

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * OfferEndDialog — تعیین تاریخ پایان برای یک وضعیت زمان‌دار.
 *
 * یک دیالوگِ مشترک برای دو کاربرد متفاوت (پایان پیشنهاد ویژه، پایان تخفیف)، چون
 * تنها تفاوتشان **متن** است نه رفتار. `effect` اجباری است تا هیچ‌وقت دیالوگی باز
 * نشود که نگوید سرِ آن تاریخ چه چیزی عوض می‌شود.
 *
 * تاریخ نمایشی جلالی است و مقدار ذخیره‌شده ISO میلادی (قرارداد DatePicker پروژه).
 */
export function OfferEndDialog({ open, onClose, title, effect, value, onConfirm }: OfferEndDialogProps) {
  const [date, setDate] = useState(value)
  useEffect(() => { if (open) setDate(value) }, [open, value])

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl" py="6">
          <Dialog.Content maxW="440px" w="full" mx="4">

            <Dialog.Header pt="5" px="6" pb="2" position="relative">
              <Dialog.Title fontSize="md" fontWeight="semibold" textAlign="start" w="full">
                {title}
              </Dialog.Title>
              <Text fontSize="xs" color="fg.muted" textAlign="start" mt="1" lineHeight="1.9">
                {effect}
              </Text>
              <Dialog.CloseTrigger asChild position="absolute" top="3" insetEnd="3">
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body px="6" pt="3" pb="4">
              <Box>
                <Text fontSize="xs" color="fg.muted" textAlign="start" mb="1.5">تاریخ پایان</Text>
                <DatePicker value={date} onChange={setDate} placeholder="انتخاب تاریخ" />
              </Box>
              <Text fontSize="2xs" color="fg.muted" textAlign="start" mt="2" lineHeight="1.9">
                بدون تاریخ، این وضعیت تا وقتی خودتان خاموشش کنید ادامه دارد.
              </Text>
            </Dialog.Body>

            <Dialog.Footer px="6" pt="0" pb="5">
              {/* FIRST = rightmost: حذف تاریخ · LAST = leftmost: ذخیره */}
              <Flex align="center" justify="space-between" w="full" gap="3">
                <Button
                  variant="ghost"
                  size="sm"
                  colorPalette="red"
                  disabled={!value}
                  onClick={() => { onConfirm(''); onClose() }}
                >
                  حذف تاریخ
                </Button>
                <Flex gap="3">
                  <Button variant="outline" onClick={onClose}>انصراف</Button>
                  <Button colorPalette="brand" onClick={() => { onConfirm(date); onClose() }}>
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
