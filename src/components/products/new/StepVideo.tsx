import { useState } from 'react'
import { Dialog, Portal, CloseButton, Text, Flex, Box, AspectRatio, Button, chakra } from '@chakra-ui/react'
import { CirclePlay, Play } from 'lucide-react'
import { Tooltip } from '@/components/ui/Tooltip'
import type { StepId } from './data'

// ─── منبع ویدئوها ───────────────────────────────────────────────────────────────
/**
 * آدرس ویدئوی آموزشی هر مرحله.
 *
 * فعلاً یک ویدئوی آزمایشی است تا جریان کار قابل تست باشد؛ جایگزینی‌اش یعنی عوض
 * کردن همین رشته‌ها و نه دست‌زدن به هیچ کامپوننتی. اگر آدرس خالی بماند یا ویدئو
 * بارگذاری نشود، همان کادرِ پلیر با پیام «به‌زودی» دیده می‌شود — صفحه خراب نمی‌شود.
 */
export const STEP_VIDEOS: Record<StepId, string> = {
  basic:     'https://cdn.jsdelivr.net/npm/big-buck-bunny-1080p@1.0.0/bbb.mp4',
  gallery:   'https://cdn.jsdelivr.net/npm/big-buck-bunny-1080p@1.0.0/bbb.mp4',
  warehouse: 'https://cdn.jsdelivr.net/npm/big-buck-bunny-1080p@1.0.0/bbb.mp4',
  specs:     'https://cdn.jsdelivr.net/npm/big-buck-bunny-1080p@1.0.0/bbb.mp4',
  models:    'https://cdn.jsdelivr.net/npm/big-buck-bunny-1080p@1.0.0/bbb.mp4',
  seo:       'https://cdn.jsdelivr.net/npm/big-buck-bunny-1080p@1.0.0/bbb.mp4',
}

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * StepVideoButton — آیکن ویدئوی قرمز کنار عنوان هر مرحله.
 *
 * در طرح تأییدشده هر مرحله یک آیکن ویدئوی قرمز روبه‌روی عنوانش دارد که آموزش
 * همان مرحله را باز می‌کند. قرمز عمدی است و تنها رنگ قرمزِ غیرخطا در این صفحه
 * است — چون «ویدئو» باید در یک نگاه از بقیهٔ کنش‌ها جدا باشد.
 */
export function StepVideoButton({ step, title }: { step: StepId; title: string }) {
  const [open, setOpen] = useState(false)
  const src = STEP_VIDEOS[step]
  const [failed, setFailed] = useState(false)

  return (
    <>
      {/* اندازه عمداً بزرگ‌تر از یک IconButton معمولی است (کاربر، بازخورد نهایی):
          آیکنِ کوچکِ ghost اصلاً دیده نمی‌شد. حالا یک چیپِ برچسب‌دار است — ته‌رنگ
          قرمز + متن «آموزش» — تا در یک نگاه از بقیهٔ کنش‌های سرتیتر جدا شود.
          FIRST = rightmost: آیکن (leading) ← سپس متن. */}
      <Tooltip content={`ویدئوی آموزش «${title}»`}>
        <Button
          size="sm"
          h="9"
          px="3"
          variant="subtle"
          colorPalette="red"
          rounded="full"
          fontWeight="semibold"
          aria-label={`ویدئوی آموزش ${title}`}
          onClick={() => setOpen(true)}
        >
          <CirclePlay size={20} />
          <chakra.span display={{ base: 'none', sm: 'inline' }}>آموزش</chakra.span>
        </Button>
      </Tooltip>

      <Dialog.Root open={open} onOpenChange={(e) => !e.open && setOpen(false)} size="lg">
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner dir="rtl" py="6">
            <Dialog.Content maxW="820px" w="full" mx="4">

              <Dialog.Header pt="5" px="6" pb="3" position="relative" pe="12">
                <Dialog.Title fontSize="md" fontWeight="semibold" textAlign="start" w="full">
                  ویدئوی آموزش «{title}»
                </Dialog.Title>
                <Dialog.CloseTrigger asChild position="absolute" top="3" insetEnd="3">
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Header>

              <Dialog.Body px="6" pt="0" pb="5">
                <Box rounded="xl" overflow="hidden" borderWidth="1px" borderColor="border" bg="black">
                  <AspectRatio ratio={16 / 9}>
                    {src && !failed ? (
                      <chakra.video
                        src={src}
                        controls
                        playsInline
                        preload="metadata"
                        onError={() => setFailed(true)}
                        w="full"
                        h="full"
                      />
                    ) : (
                      <Flex
                        direction="column"
                        align="center"
                        justify="center"
                        gap="3"
                        bgGradient="to-b"
                        gradientFrom="gray.700"
                        gradientTo="gray.900"
                      >
                        <Flex
                          boxSize="14" rounded="full" align="center" justify="center"
                          borderWidth="1px" borderColor="whiteAlpha.400" bg="whiteAlpha.200" color="white"
                        >
                          <Play size={22} />
                        </Flex>
                        <Text fontSize="xs" color="whiteAlpha.800">
                          ویدئوی این مرحله به‌زودی اضافه می‌شود
                        </Text>
                      </Flex>
                    )}
                  </AspectRatio>
                </Box>
                <Text fontSize="2xs" color="fg.muted" textAlign="start" mt="2">
                  ویدئوی نمونه است؛ نسخهٔ نهایی جایگزین می‌شود.
                </Text>
              </Dialog.Body>

            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  )
}
