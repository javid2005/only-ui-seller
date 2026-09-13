import type { ReactNode } from 'react'
import { Box, Text, chakra } from '@chakra-ui/react'

// ─── NotchedField ───────────────────────────────────────────────────────────────
/**
 * فیلد با لیبلِ نشسته روی خط کادر — امضای بصری طرح تأییدشده.
 *
 * چرا `fieldset`/`legend` و نه یک `Text` با موقعیت مطلق: مرورگر خودش جای legend
 * را از خط بالای کادر می‌بُرد. پس بریدگی همیشه دقیقاً اندازهٔ متن است، با هر طول
 * لیبل و هر فونت‌سایزی، و در RTL هم خودکار از سمت راست شروع می‌شود — بدون هیچ
 * offset دستی.
 *
 * کنترل داخلی (Input / NumberField / Select) باید بدون حاشیه باشد؛ کادر از همین‌جا
 * می‌آید. حالت focus و خطا روی خودِ fieldset می‌نشیند تا یک کادر واحد دیده شود.
 */
export interface NotchedFieldProps {
  label: string
  required?: boolean
  /** متن کمکی زیر کادر */
  hint?: string
  /** پیام خطا — جای hint را می‌گیرد و کادر را قرمز می‌کند */
  error?: string
  /** افزونهٔ انتهای کادر (سمت چپ در RTL) — مثل واحد «تومان» یا سوییچ */
  endElement?: ReactNode
  disabled?: boolean
  /** ته‌رنگ ملایم روی خود کادر — در طرح برای فیلدهای ابعاد استفاده شده تا مرزشان دیده شود */
  tinted?: boolean
  children: ReactNode
}

export function NotchedField({
  label, required, hint, error, endElement, disabled, tinted, children,
}: NotchedFieldProps) {
  return (
    <Box w="full" minW="0">
      <chakra.fieldset
        display="flex"
        alignItems="center"
        gap="2"
        m="0"
        px="3"
        pb="0"
        pt="0"
        minH="11"
        w="full"
        minW="0"
        borderWidth="1px"
        borderColor={error ? 'red.solid' : 'border'}
        rounded="lg"
        bg={disabled || tinted ? 'bg.subtle' : 'bg.panel'}
        transition="border-color 0.15s, box-shadow 0.15s"
        _focusWithin={
          error
            ? undefined
            : { borderColor: 'brand.solid', boxShadow: '0 0 0 1px var(--chakra-colors-brand-solid)' }
        }
      >
        <chakra.legend
          px="1"
          mx="1"
          fontSize="11px"
          fontWeight="semibold"
          color={error ? 'red.fg' : 'fg.muted'}
          lineHeight="16px"
        >
          {label}
          {required && <chakra.span color="red.fg" ms="1" aria-hidden>*</chakra.span>}
        </chakra.legend>

        {/* کنترل — کشیده تا کل عرض کادر */}
        <Box flex="1" minW="0">{children}</Box>

        {/* LAST = leftmost: واحد یا کنترل جانبی */}
        {endElement && <Box flexShrink={0}>{endElement}</Box>}
      </chakra.fieldset>

      {(error || hint) && (
        <Text
          fontSize="xs"
          color={error ? 'red.fg' : 'fg.muted'}
          textAlign="start"
          mt="1.5"
          lineHeight="1.8"
        >
          {error ?? hint}
        </Text>
      )}
    </Box>
  )
}

// ─── سبکِ «بدون کادر» برای کنترل داخل NotchedField ───────────────────────────────
/**
 * روی Input/NumberField داخل NotchedField بگذار تا کادر دوم نسازد.
 *
 * `fontSize` عمداً از پیش‌فرض چاکرا کوچک‌تر است: طرح تأییدشده فیلدها را متراکم‌تر
 * می‌چیند (۱۲px) و با اندازهٔ پیش‌فرض، فرمِ شش‌مرحله‌ای بی‌دلیل بلند و پراکنده
 * می‌شود. ۱۳px نقطهٔ تعادلِ تراکمِ طرح و خوانایی فارسی است.
 */
export const bareControl = {
  border: 'none',
  outline: 'none',
  bg: 'transparent',
  px: '0',
  h: '10',
  fontSize: '13px',
  _focusVisible: { boxShadow: 'none', outline: 'none' },
} as const
