import { useEffect, useState } from 'react'
import NextLink from 'next/link'
import { Badge, Button, Field, Flex, Link, PinInput, Text } from '@chakra-ui/react'
import { Pencil, RotateCw } from 'lucide-react'
import { toPersianDigits, toLatinDigits } from '@/utils/numbers'
import { focusVisibleOnly } from '@/components/auth/AuthLayout'

// ─── CountdownBadge — الگو از OtpDialog.tsx (Dialog نسخه) ─────────────────────

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
      {toPersianDigits(remaining)} ثانیه
    </Badge>
  )
}

export interface OtpFormProps {
  phone: string
  submitLabel: string
  /** مقصد لینک «ویرایش» — بازگشت به صفحهٔ ورود شماره */
  editHref: string
  onSubmit: (code: string) => void | Promise<void>
  onResend?: () => void | Promise<void>
  loading?: boolean
}

export function OtpForm({ phone, submitLabel, editHref, onSubmit, onResend, loading }: OtpFormProps) {
  const [pinValue, setPinValue] = useState<string[]>(['', '', '', '', ''])
  const [canResend, setCanResend] = useState(false)
  const [countdownKey, setCountdownKey] = useState(0)
  const [error, setError] = useState('')

  const code = pinValue.join('')

  async function handleResend(e: React.MouseEvent) {
    e.preventDefault()
    setPinValue(['', '', '', '', ''])
    setError('')
    setCanResend(false)
    setCountdownKey((k) => k + 1)
    await onResend?.()
  }

  function handleSubmit() {
    if (code.length < 5) {
      setError('کد تایید را وارد نمایید')
      return
    }
    setError('')
    onSubmit(code)
  }

  return (
    <Flex direction="column" gap="4" w="full" align="flex-end">
      {/* راست‌ترین FIRST: متن توضیح (x=78) → دکمهٔ ویرایش LAST (x=0) */}
      <Flex gap="2" align="center" justify="flex-end" w="full" wrap="wrap">
        <Text fontSize="sm" color="fg.muted" textAlign="right" flex="1">
          {'کد ارسال شده به شماره '}
          <Text as="span" fontWeight="bold">{toPersianDigits(phone)}</Text>
          {' را وارد نمایید.'}
        </Text>
        {/* آیکون FIRST در DOM = راست (قرارداد پروژه) */}
        <Link asChild variant="plain" colorPalette="brand" fontSize="xs" fontWeight="medium" display="flex" alignItems="center" gap="1" {...focusVisibleOnly}>
          <NextLink href={editHref}>
            <Pencil size={14} />
            ویرایش
          </NextLink>
        </Link>
      </Flex>

      <Field.Root invalid={!!error} w="full">
        <PinInput.Root
          value={pinValue}
          onValueChange={(e) => { setPinValue(e.value.map(toLatinDigits)); if (error) setError('') }}
          otp
          dir="ltr"
          pattern="^[0-9۰-۹]+$"
          w="full"
          autoFocus
        >
          <PinInput.HiddenInput />
          <PinInput.Control dir="ltr" gap="2" justifyContent="center" w="full">
            <PinInput.Input index={0} />
            <PinInput.Input index={1} />
            <PinInput.Input index={2} />
            <PinInput.Input index={3} />
            <PinInput.Input index={4} />
          </PinInput.Control>
        </PinInput.Root>
        {error && (
          <Field.ErrorText display="block" textAlign="center" w="full">{error}</Field.ErrorText>
        )}
      </Field.Root>

      <Button
        w="full"
        colorPalette="brand"
        loading={loading}
        onClick={handleSubmit}
      >
        {submitLabel}
      </Button>

      <Flex justify="center" align="center" gap="2" w="full" minH="6">
        {canResend ? (
          <Link href="#" variant="plain" colorPalette="brand" fontSize="xs" fontWeight="medium" display="flex" alignItems="center" gap="1" onClick={handleResend} {...focusVisibleOnly}>
            <RotateCw size={14} />
            ارسال مجدد کد تایید
          </Link>
        ) : (
          <>
            {/* راست‌ترین FIRST: متن (x=176) → Badge LAST (x=106) */}
            <Text fontSize="sm" color="fg.muted">ارسال دوباره کد بعد از</Text>
            <CountdownBadge key={countdownKey} startSeconds={120} onExpire={() => setCanResend(true)} />
          </>
        )}
      </Flex>
    </Flex>
  )
}
