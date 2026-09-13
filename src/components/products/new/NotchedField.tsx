import type { ReactNode } from 'react'
import { Box, Text, chakra } from '@chakra-ui/react'
import { focusInputWithin } from './focusField'

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
  /**
   * لیبل **بالای** کادر، نه روی خط آن.
   *
   * طرح تأییدشده این حالت را فقط داخل گروه‌های تودرتو به کار می‌برد (گروه
   * انبارداری): وقتی چند فیلد داخل یک پنلِ کادردار می‌نشینند، لیبلِ روی‌خط با مرز
   * پنل تداخل بصری پیدا می‌کند. اندازه‌ها از خود طرح: ۱۰px/۷۰۰، فاصلهٔ ۸px تا کادر.
   */
  stacked?: boolean
  /** کلید پرش و چشمک از فهرست خطاها (`focusField`) */
  dataField?: string
  children: ReactNode
}

export function NotchedField({
  label, required, hint, error, endElement, disabled, tinted, stacked, dataField, children,
}: NotchedFieldProps) {
  // همان پس‌زمینه‌ای که خودِ کادر دارد — legend باید رویش بنشیند، نه کنارش (پایین‌تر)
  const surface = disabled ? 'bg.subtle' : stacked || !tinted ? 'bg.panel' : 'bg.subtle'

  return (
    <Box w="full" minW="0" data-field={dataField}>
      {stacked && (
        <Text
          as="label"
          onClick={(e) => {
            const box = (e.currentTarget.parentElement as HTMLElement | null)
            const input = box?.querySelector<HTMLElement>('input:not([type="hidden"]):not([disabled]), textarea')
            input?.focus()
          }}
          display="block"
          fontSize="10px"
          fontWeight="bold"
          lineHeight="16px"
          color={error ? 'red.fg' : 'fg.muted'}
          mb="2"
          px="0.5"
          textAlign="start"
        >
          {label}
          {required && <chakra.span color="red.fg" ms="1" aria-hidden>*</chakra.span>}
        </Text>
      )}
      <chakra.fieldset
        // کلیک روی هر جای کادر (لیبل، واحد، فضای خالی) → مکان‌نما داخل ورودی
        onClick={focusInputWithin}
        cursor="text"
        display="flex"
        alignItems="center"
        gap="2"
        m="0"
        px="3"
        pb="0"
        pt="0"
        minH={stacked ? '9' : '11'}
        w="full"
        minW="0"
        borderWidth="1px"
        borderColor={error ? 'red.solid' : 'border'}
        rounded="lg"
        bg={surface}
        transition="border-color 0.15s, box-shadow 0.15s"
        _focusWithin={
          error
            ? undefined
            : { borderColor: 'brand.solid', boxShadow: '0 0 0 1px var(--chakra-colors-brand-solid)' }
        }
      >
        {/* در حالت stacked لیبل بالای کادر است، پس legend خالی می‌ماند و بریدگی نمی‌خورد */}
        {!stacked && (
          /*
            پس‌زمینهٔ legend عمدی است: مرورگر بریدگی را از **حاشیه** می‌زند ولی
            حلقهٔ focus (box-shadow) دور کل کادر کشیده می‌شود و از پشت متنِ لیبل
            رد می‌شد — همان «خط نازک اضافه زیر عنوان فیلد». با هم‌رنگ‌کردن legend
            با سطحِ کادر، آن خط پوشانده می‌شود بدون هیچ offset دستی.
          */
          <chakra.legend
            px="1"
            mx="1"
            bg={surface}
            fontSize="11px"
            fontWeight="semibold"
            color={error ? 'red.fg' : 'fg.muted'}
            lineHeight="16px"
          >
            {label}
            {required && <chakra.span color="red.fg" ms="1" aria-hidden>*</chakra.span>}
          </chakra.legend>
        )}

        {/* کنترل — کشیده تا کل عرض کادر */}
        <Box flex="1" minW="0">{children}</Box>

        {/* LAST = leftmost: واحد یا کنترل جانبی */}
        {endElement && <Box flexShrink={0}>{endElement}</Box>}
      </chakra.fieldset>

      {(error || hint) && (
        <Text
          fontSize={stacked ? '10px' : 'xs'}
          color={error ? 'red.fg' : 'fg.muted'}
          textAlign="start"
          mt={stacked ? '1' : '1.5'}
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

/**
 * همان `bareControl` با ارتفاع کمتر — برای حالت `stacked`.
 *
 * طرح تأییدشده داخل گروه‌های تودرتو کادر کوتاه‌تری می‌گذارد (۳۶px به‌جای ۴۴px)،
 * چون لیبل دیگر روی خط کادر نیست و ارتفاع را اشغال نمی‌کند.
 */
export const bareControlSm = { ...bareControl, h: '9' } as const
