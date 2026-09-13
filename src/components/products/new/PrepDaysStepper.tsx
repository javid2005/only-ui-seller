import { Flex, Text, chakra } from '@chakra-ui/react'
import { NumberField } from '@/components/ui/NumberField'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface PrepDaysStepperProps {
  value: string
  onChange: (v: string) => void
  max?: number
}

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * PrepDaysStepper — کنترل «زمان آماده‌سازی».
 *
 * چرا یک کنترل جدا و نه `NumberField` با `showSteppers`: در طرح تأییدشده این تنها
 * فیلدی است که کلیدهایش **همیشه** دیده می‌شوند و بزرگ‌اند — چون مقدارش را کاربر
 * واقعاً یکی‌یکی بالا/پایین می‌برد. کلیدهای معمولیِ `NumberField` کوچک‌اند و فقط
 * روی hover ظاهر می‌شوند؛ اینجا هر دو خلافِ طرح است.
 *
 * اندازه‌ها از خود طرح اندازه‌گیری شده‌اند: کادر ۴۰px، دکمه‌ها ۴۴×۳۸، عدد وسط‌چین
 * ۱۴px، چیپ واحد ۹px.
 *
 * RTL DOM order (first = rightmost): `+` ← عدد ← واحد ← `−`.
 * (در طرح «افزودن» سمت راست و «کم کردن» سمت چپ است.)
 */
export function PrepDaysStepper({ value, onChange, max }: PrepDaysStepperProps) {
  const bump = (dir: 1 | -1) => {
    const next = (Number(value || '0') || 0) + dir
    if (next < 0) return
    if (max != null && next > max) return
    onChange(String(next))
  }

  const btn = {
    w: '44px',
    alignSelf: 'stretch',
    bg: 'brand.bg',
    color: 'brand.fg',
    fontSize: '23px',
    lineHeight: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background 0.15s',
    _hover: { bg: 'brand.subtle' },
    _active: { bg: 'brand.muted' },
  } as const

  return (
    <Flex
      role="group"
      aria-label="تعداد روزهای آماده‌سازی"
      h="10"
      w="full"
      minW="0"
      align="stretch"
      borderWidth="1px"
      borderColor="border"
      rounded="lg"
      bg="bg.panel"
      overflow="hidden"
      _focusWithin={{
        borderColor: 'brand.solid',
        boxShadow: '0 0 0 1px var(--chakra-colors-brand-solid)',
      }}
    >
      {/* FIRST = rightmost: افزودن */}
      <chakra.button type="button" aria-label="اضافه کردن یک روز" onClick={() => bump(1)} {...btn}>
        +
      </chakra.button>

      <chakra.div flex="1" minW="0" display="flex" alignItems="center">
        <NumberField
          value={value}
          onChange={onChange}
          max={max}
          aria-label="تعداد روزهای آماده‌سازی"
          inputProps={{
            border: 'none',
            outline: 'none',
            bg: 'transparent',
            textAlign: 'center',
            fontSize: '14px',
            h: 'full',
            px: '1',
            _focusVisible: { boxShadow: 'none', outline: 'none' },
          }}
        />
      </chakra.div>

      {/* واحد — در طرح کنارِ دکمهٔ «کم کردن» می‌نشیند، نه لبهٔ فیلد */}
      <Flex align="center" flexShrink={0} pe="1.5">
        <Text fontSize="9px" color="fg.muted" bg="bg.subtle" rounded="5px" px="1.5" py="1">
          روز
        </Text>
      </Flex>

      {/* LAST = leftmost: کم کردن */}
      <chakra.button type="button" aria-label="کم کردن یک روز" onClick={() => bump(-1)} {...btn}>
        −
      </chakra.button>
    </Flex>
  )
}
