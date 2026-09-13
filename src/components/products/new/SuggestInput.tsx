import { useId, useRef, useState } from 'react'
import { Box, Flex, Input, Text, chakra } from '@chakra-ui/react'
import type { InputProps } from '@chakra-ui/react'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface SuggestInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  value: string
  onChange: (v: string) => void
  /** فهرست پیشنهادها — با تایپ کاربر فیلتر می‌شود */
  suggestions: string[]
  /** انتخاب یک پیشنهاد (پیش‌فرض: همان onChange) */
  onPick?: (v: string) => void
  /** حداکثر پیشنهادِ نمایش‌داده‌شده */
  limit?: number
}

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * SuggestInput — ورودی متنی با فهرست پیشنهادِ بازشونده.
 *
 * چرا `Combobox` چاکرا نه: آن کامپوننت مقدار را به فهرست **مقید** می‌کند و در
 * حالت `allowCustomValue` هم ورودی دلخواه با `inputValue` کنترل‌شده گم می‌شود
 * (باگ ثبت‌شدهٔ Chakra v3). اینجا مقدار همیشه آزاد است و فهرست فقط کمک‌کار است —
 * پس یک input ساده + پنل پیشنهاد، بدون قید.
 *
 * چرا `<datalist>` نه: ظاهرش دست مرورگر است و در RTL و فونت فارسی با بقیهٔ فرم
 * یکدست نمی‌شود.
 *
 * RTL: پنل پیشنهاد تمام‌عرض زیر فیلد باز می‌شود، پس مسئلهٔ سمت ندارد.
 */
export function SuggestInput({
  value, onChange, suggestions, onPick, limit = 8, ...rest
}: SuggestInputProps) {
  const [open, setOpen] = useState(false)
  const listId = useId()
  const blurTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const q = value.trim()
  const matches = suggestions
    .filter((s) => s !== q && (q === '' || s.includes(q)))
    .slice(0, limit)

  const pick = (s: string) => {
    (onPick ?? onChange)(s)
    setOpen(false)
  }

  return (
    <Box position="relative" w="full" minW="0">
      <Input
        {...rest}
        value={value}
        role="combobox"
        aria-expanded={open && matches.length > 0}
        aria-controls={listId}
        autoComplete="off"
        onChange={(e) => { onChange(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        // blur با تأخیر: کلیک روی پیشنهاد اول blur می‌زند و بدون تأخیر پنل قبل از
        // رسیدن کلیک بسته می‌شد
        onBlur={() => { blurTimer.current = setTimeout(() => setOpen(false), 120) }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false)
          rest.onKeyDown?.(e)
        }}
      />

      {open && matches.length > 0 && (
        <Flex
          id={listId}
          role="listbox"
          direction="column"
          position="absolute"
          insetInline="0"
          top="calc(100% + 4px)"
          zIndex="dropdown"
          maxH="216px"
          overflowY="auto"
          py="1"
          bg="bg.panel"
          borderWidth="1px"
          borderColor="border"
          rounded="lg"
          boxShadow="md"
          onMouseDown={() => clearTimeout(blurTimer.current)}
        >
          <Text fontSize="2xs" color="fg.muted" px="2.5" py="1" textAlign="start">
            پیشنهاد بر اساس دسته‌بندی
          </Text>
          {matches.map((s) => (
            <chakra.button
              key={s}
              type="button"
              role="option"
              aria-selected={false}
              onClick={() => pick(s)}
              textAlign="start"
              px="2.5"
              py="1.5"
              fontSize="xs"
              cursor="pointer"
              color="fg"
              bg="transparent"
              _hover={{ bg: 'brand.bg', color: 'brand.fg' }}
            >
              {s}
            </chakra.button>
          ))}
        </Flex>
      )}
    </Box>
  )
}
