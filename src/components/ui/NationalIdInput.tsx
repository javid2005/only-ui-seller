import { Input, Field } from '@chakra-ui/react'
import type { InputProps } from '@chakra-ui/react'
import { toPersianDigits, toLatinDigits } from '@/utils/numbers'

// ─── NationalIdInput — فیلد کد ملی (هم‌راستا با PhoneInput: dir="rtl" + نمایش فارسی) ──
// نرمال‌سازی رقم (فارسی/عربی/لاتین) داخل خودش انجام می‌شود؛ مقدار برگشتی همیشه لاتینِ تمیز است.
// اعتبارسنجی چک‌سام با isValidNationalId (src/utils/validation.ts) — این کامپوننت فقط نمایش/ورودی است.

export interface NationalIdInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  label?: string
  value: string
  onChange: (value: string) => void
  error?: string
}

function normalize(raw: string): string {
  return toLatinDigits(raw).replace(/\D/g, '').slice(0, 10)
}

export function NationalIdInput({ label, value, onChange, error, disabled, ...rest }: NationalIdInputProps) {
  return (
    <Field.Root invalid={!!error} w="full">
      {label && <Field.Label fontSize="sm" fontWeight="semibold" color="fg">{label}</Field.Label>}
      <Input
        value={toPersianDigits(value)}
        onChange={(e) => onChange(normalize(e.target.value))}
        inputMode="numeric"
        dir="rtl"
        disabled={disabled}
        {...rest}
      />
      {error && <Field.ErrorText display="block" fontSize="xs" textAlign="right" w="full">{error}</Field.ErrorText>}
    </Field.Root>
  )
}
