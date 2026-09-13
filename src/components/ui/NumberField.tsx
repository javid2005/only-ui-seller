import { useRef } from 'react'
import { Input, InputGroup, Box, IconButton } from '@chakra-ui/react'
import type { InputProps, InputGroupProps } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { toPersianDigits, toLatinDigits } from '@/utils/numbers'

// ─── NumberField — input عددی واحدِ پروژه ────────────────────────────────────────
// جداکنندهٔ سه‌رقمی + ارقام فارسی + فقط-رقم + اعشار اختیاری، روی <Input> ساده.
//
// چرا zag NumberInput نه؟ parserِ locale آن (@internationalized/number) ورودیِ
// ترکیبیِ لاتین/فارسی را partial-number نامعتبر می‌گیرد و کیستروک را reject می‌کند
// (باگ: با کیبورد فارسی بعد از چند رقم تایپ قفل می‌شد). اینجا نرمال‌سازی و فرمت را
// خودمان کنترل می‌کنیم تا با هر کیبورد (فارسی/عربی/لاتین) یکسان کار کند.
//
// قرارداد: مقدار همیشه **لاتینِ تمیز** ("1000" / "1.5") ذخیره/برگردانده می‌شود
// (برای API/محاسبه)؛ نمایش همیشه فارسیِ گروه‌بندی‌شده.

const isDigitChar = (ch: string) => /[0-9۰-۹٠-٩]/.test(ch)

/** هر رقم (فارسی U+06Fx، عربی U+066x، لاتین) + جداکننده‌ها → لاتینِ تمیز */
function normalizeToLatin(raw: string, allowDecimals: boolean): string {
  let s = toLatinDigits(raw) // ۰-۹ → 0-9
  s = s.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660)) // عربی-هندی → لاتین
  s = s.replace(/٫/g, '.') // جداکنندهٔ اعشار فارسی → نقطه (قبل از strip)
  if (allowDecimals) {
    s = s.replace(/[^\d.]/g, '')
    const i = s.indexOf('.')
    if (i >= 0) s = s.slice(0, i + 1) + s.slice(i + 1).replace(/\./g, '') // فقط یک نقطه
  } else {
    s = s.replace(/\D/g, '')
  }
  return s
}

/** لاتینِ تمیز → نمایش فارسیِ گروه‌بندی‌شده ("1234.5" → "۱٬۲۳۴٫۵") */
function formatDisplay(latin: string, allowDecimals: boolean): string {
  if (latin === '') return ''
  const dot = latin.indexOf('.')
  const intPart = dot >= 0 ? latin.slice(0, dot) : latin
  const decPart = dot >= 0 ? latin.slice(dot + 1) : ''
  const groupedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '٬')
  const out = allowDecimals && dot >= 0 ? `${groupedInt}٫${decPart}` : groupedInt
  return toPersianDigits(out)
}

function countDigits(str: string, upto: number): number {
  let n = 0
  for (let i = 0; i < upto; i++) if (isDigitChar(str[i])) n++
  return n
}

/** موقعیت caret بعد از n رقم در رشتهٔ فرمت‌شده (برای حفظ مکان‌نما بعد از گروه‌بندی) */
function caretAfterNDigits(formatted: string, n: number): number {
  if (n <= 0) return 0
  let count = 0
  for (let i = 0; i < formatted.length; i++) {
    if (isDigitChar(formatted[i])) {
      count++
      if (count === n) return i + 1
    }
  }
  return formatted.length
}

export interface NumberFieldProps
  extends Omit<InputProps, 'value' | 'onChange'> {
  /** مقدار لاتینِ تمیز (مثل "1234567" یا "") */
  value: string
  /** لاتینِ تمیز برمی‌گرداند */
  onChange: (value: string) => void
  /** اجازهٔ اعشار (مثل وزن ۲٫۵ کیلو). پیش‌فرض false */
  allowDecimals?: boolean
  /**
   * نمایش دکمه‌های +/− . پیش‌فرض false.
   *
   * ⚠️ قاعده (بازخورد مالک محصول، ۱۴۰۵/۰۶): این کلیدها فقط برای مقادیرِ **کوچک**
   * هستند — چیزی که کاربر واقعاً یکی‌یکی بالا/پایین می‌برد: درصد، وزن، ابعاد،
   * روزِ آماده‌سازی، تعداد.
   *
   * هرگز روی فیلدی که معمولاً از ~۱۰۰ بیشتر می‌شود نگذار — به‌ویژه **قیمت** و هر
   * مبلغ دیگری. و در کل بخش «تنوع‌ها» این کلیدها اصلاً نباید وجود داشته باشند.
   */
  showSteppers?: boolean
  /** گام +/− . پیش‌فرض 1 */
  step?: number
  /** کف مقدار برای +/− . پیش‌فرض 0 */
  min?: number
  /** سقف مقدار برای +/− */
  max?: number
  placeholder?: string
  /** addon ابتدای فیلد (سمت راست در RTL) — مثل Badge */
  startElement?: ReactNode
  /** addon انتهای فیلد (سمت چپ در RTL) — مثل واحد تومان/دلار */
  endElement?: ReactNode
  startElementProps?: InputGroupProps['startElementProps']
  endElementProps?: InputGroupProps['endElementProps']
  /** props روی خودِ input (مثل bg، pe، onKeyDown) */
  inputProps?: InputProps
}

export function NumberField({
  value,
  onChange,
  allowDecimals = false,
  showSteppers = false,
  step = 1,
  min = 0,
  max,
  placeholder,
  startElement,
  endElement,
  startElementProps,
  endElementProps,
  inputProps,
  disabled,
  ...rest
}: NumberFieldProps) {
  const ref = useRef<HTMLInputElement>(null)
  const display = formatDisplay(value, allowDecimals)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = e.target
    const sel = el.selectionStart ?? el.value.length
    const digitsBefore = countDigits(el.value, sel)
    const latin = normalizeToLatin(el.value, allowDecimals)
    const formatted = formatDisplay(latin, allowDecimals)
    // DOM را همگام با نتیجهٔ تمیز کن (کاراکترهای نامعتبر را همان‌جا پس می‌زند)
    el.value = formatted
    const pos = caretAfterNDigits(formatted, digitsBefore)
    el.setSelectionRange(pos, pos)
    if (latin !== value) onChange(latin)
  }

  const bump = (dir: 1 | -1) => {
    const cur = Number(value || '0') || 0
    let next = cur + dir * step
    if (next < min) next = min
    if (max != null && next > max) next = max
    onChange(String(next))
  }

  // در طرح تأییدشده این کلیدها تا وقتی ماوس روی فیلد نیست دیده نمی‌شوند و فیلد را
  // شلوغ نمی‌کنند. روی دستگاه لمسی (بدون hover) همیشه دیده می‌شوند، وگرنه
  // دسترس‌ناپذیر می‌شدند.
  const steppers = showSteppers && !disabled ? (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      w="24px"
      h="32px"
      flexShrink={0}
      rounded="5px"
      borderWidth="1px"
      borderColor="brand.muted"
      bg="brand.bg"
      color="brand.fg"
      overflow="hidden"
      transition="opacity 0.15s"
      css={{
        // روی دستگاه لمسی همیشه دیده می‌شوند (hover ندارد)؛ روی دسکتاپ فقط با
        // هاور یا فوکوس. سلکتور عمداً چند لنگر دارد: خودِ گروه، `fieldset` کادرِ
        // NotchedField، و هر بلوکِ `data-field` — چون در برخی فیلدها نشانگر روی
        // کادر است نه روی خودِ input-group و با یک لنگر هیچ‌وقت ظاهر نمی‌شد.
        '@media (hover: hover)': {
          opacity: 0,
          [[
            '.chakra-input-group:hover &',
            '.chakra-input-group:focus-within &',
            'fieldset:hover &',
            'fieldset:focus-within &',
            '[data-field]:hover &',
            '[data-numeric-field]:hover &',
          ].join(', ')]: { opacity: 1 },
        },
      }}
    >
      <IconButton
        aria-label="افزایش"
        variant="ghost"
        size="2xs"
        h="15px"
        w="22px"
        minW="0"
        minH="0"
        rounded="0"
        color="inherit"
        _hover={{ bg: 'brand.subtle' }}
        onClick={() => bump(1)}
      >
        <ChevronUp size={13} />
      </IconButton>
      <IconButton
        aria-label="کاهش"
        variant="ghost"
        size="2xs"
        h="15px"
        w="22px"
        minW="0"
        minH="0"
        rounded="0"
        color="inherit"
        _hover={{ bg: 'brand.subtle' }}
        onClick={() => bump(-1)}
      >
        <ChevronDown size={13} />
      </IconButton>
    </Box>
  ) : null

  /**
   * واحد و کلیدهای +/− با هم — نه یکی به‌جای دیگری.
   *
   * قبلاً `endElement ?? steppers` بود و هر فیلدی که واحد داشت (مثل «روز» در زمان
   * آماده‌سازی) کلیدهایش بی‌صدا حذف می‌شد. در طرح تأییدشده هر دو هستند و کلیدها
   * سمت **راستِ** واحد می‌نشینند → پس در DOM اول کلیدها، بعد واحد.
   */
  const resolvedEnd = steppers && endElement ? (
    <Box display="flex" alignItems="center" gap="1.5">
      {steppers}
      {endElement}
    </Box>
  ) : (endElement ?? steppers)

  const input = (
    <Input
      ref={ref}
      value={display}
      onChange={handleChange}
      placeholder={placeholder}
      inputMode={allowDecimals ? 'decimal' : 'numeric'}
      dir="rtl"
      disabled={disabled}
      width="full"
      {...rest}
      {...inputProps}
    />
  )

  return startElement || resolvedEnd ? (
    <InputGroup
      startElement={startElement}
      endElement={resolvedEnd}
      startElementProps={startElementProps}
      endElementProps={steppers ? { px: '0', pe: '1', ...endElementProps } : endElementProps}
    >
      {input}
    </InputGroup>
  ) : (
    input
  )
}
