import { useState, useEffect } from 'react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import {
  Badge, Button, Dialog, Flex, PinInput, Portal, CloseButton, Text,
} from '@chakra-ui/react'
import { RotateCcw } from 'lucide-react'

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function toPersian(n: number): string {
  return n.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d])
}

// ─── CountdownBadge ───────────────────────────────────────────────────────────

function CountdownBadge({ startSeconds, onExpire }: { startSeconds: number; onExpire: () => void }) {
  const [remaining, setRemaining] = useState(startSeconds)

  useEffect(() => { setRemaining(startSeconds) }, [startSeconds])

  useEffect(() => {
    if (remaining <= 0) { onExpire(); return }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(t)
  }, [remaining, onExpire])

  return (
    <Badge colorPalette="gray" variant="subtle" px="2" py="0.5" fontSize="sm">
      {toPersian(remaining)} ثانیه
    </Badge>
  )
}

// ─── OtpDialog ────────────────────────────────────────────────────────────────

export interface OtpDialogProps {
  open: boolean
  /** عنوان dialog — مثلاً «تایید شماره موبایل» */
  title: string
  /** توضیح زیر عنوان — مثلاً «کد تایید برای شماره ۰۹۱۲۳... ارسال شد» */
  description: string
  /** label دکمه تایید — پیش‌فرض «تایید» */
  confirmLabel?: string
  onClose: () => void
  onConfirm: () => void
}

export function OtpDialog({ open, title, description, confirmLabel = 'تایید', onClose, onConfirm }: OtpDialogProps) {
  const isCompact = useCompactMode()
  const [pinValue, setPinValue] = useState<string[]>(['', '', '', '', ''])
  const [canResend, setCanResend] = useState(false)
  const [countdownKey, setCountdownKey] = useState(0)

  useEffect(() => {
    if (open) {
      setPinValue(['', '', '', '', ''])
      setCanResend(false)
      setCountdownKey((k) => k + 1)
    }
  }, [open])

  function handleResend() {
    setPinValue(['', '', '', '', ''])
    setCanResend(false)
    setCountdownKey((k) => k + 1)
  }

  return (
    <Dialog.Root open={open} onOpenChange={({ open: o }) => !o && onClose()} placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl">
          <Dialog.Content maxW={isCompact ? '480px' : 'sm'} w="full" mx="4">
            <Dialog.Header pt="6" pb="4" px="6">
              <Dialog.Title fontSize="lg" fontWeight="semibold" color="fg">{title}</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body pt="2" pb="4" px="6" display="flex" flexDirection="column" gap="6" alignItems="center">
              <Text fontSize="sm" color="fg.muted" textAlign="center" w="full">{description}</Text>

              {/* dir="ltr" on both Root and Control — Dialog.Positioner dir="rtl" cascades down */}
              <PinInput.Root value={pinValue} onValueChange={(e) => setPinValue(e.value)} otp dir="ltr">
                <PinInput.HiddenInput />
                <PinInput.Control dir="ltr" gap="2">
                  <PinInput.Input index={0} />
                  <PinInput.Input index={1} />
                  <PinInput.Input index={2} />
                  <PinInput.Input index={3} />
                  <PinInput.Input index={4} />
                </PinInput.Control>
              </PinInput.Root>

              <Flex justify="center" align="center" gap="2" w="full" minH="9">
                {canResend ? (
                  <Button variant="ghost" colorPalette="brand" size="sm" onClick={handleResend}>
                    <RotateCcw size={14} />
                    ارسال دوباره کد
                  </Button>
                ) : (
                  <>
                    {/* RTL DOM order: text FIRST=rightmost، badge LAST=leftmost */}
                    <Text fontSize="sm" color="fg.muted">ارسال دوباره کد بعد از</Text>
                    <CountdownBadge key={countdownKey} startSeconds={120} onExpire={() => setCanResend(true)} />
                  </>
                )}
              </Flex>
            </Dialog.Body>

            {/* Footer — RTL: انصراف FIRST=راست، تایید LAST=چپ (consistent با ButtonFooter) */}
            <Dialog.Footer pt="2" pb="4" px="6">
              <Flex gap="3">
                <Button variant="outline" onClick={onClose}>انصراف</Button>
                <Button colorPalette="brand" onClick={onConfirm}>{confirmLabel}</Button>
              </Flex>
            </Dialog.Footer>

            {/* CloseTrigger: آخرین child، absolute top-left در RTL (insetEnd=left) */}
            <Dialog.CloseTrigger asChild position="absolute" top="3" insetEnd="3">
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
