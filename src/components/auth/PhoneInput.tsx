import { Input, InputGroup, Box, Field } from '@chakra-ui/react'
import type { InputProps } from '@chakra-ui/react'
import { Smartphone } from 'lucide-react'
import { toPersianDigits, toLatinDigits } from '@/utils/numbers'

// ─── PhoneInput — فیلد شمارهٔ موبایل (بدون جداکنندهٔ هزارگان، برخلاف NumberField) ──
// آیکون smartphone سمت راست (startElement) — هماهنگ با آیکون KeyRound در PasswordInput.
// خطا با الگوی رسمی Field.Root/Field.ErrorText (مطابق SecuritySection.tsx)

export interface PhoneInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  value: string
  onChange: (value: string) => void
  error?: string
}

function normalize(raw: string): string {
  return toLatinDigits(raw).replace(/\D/g, '').slice(0, 11)
}

export function PhoneInput({ value, onChange, error, disabled, ...rest }: PhoneInputProps) {
  return (
    <Field.Root invalid={!!error} w="full">
      <InputGroup
        w="full"
        startElement={
          <Box display="flex" alignItems="center" color="fg.subtle" opacity={0.7} pointerEvents="none">
            <Smartphone size={16} />
          </Box>
        }
      >
        <Input
          value={toPersianDigits(value)}
          onChange={(e) => onChange(normalize(e.target.value))}
          placeholder="شماره موبایل"
          inputMode="numeric"
          dir="rtl"
          disabled={disabled}
          {...rest}
        />
      </InputGroup>
      {error && <Field.ErrorText display="block" fontSize="xs" textAlign="right" w="full">{error}</Field.ErrorText>}
    </Field.Root>
  )
}
