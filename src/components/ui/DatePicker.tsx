'use client'

import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Flex, Grid, IconButton, Popover, Portal, Separator, Text } from '@chakra-ui/react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { toPersianDigits } from '@/utils/numbers'
import { formatJalaliDate } from '@/utils/dates'

// ─── تقویم جلالی — بدون کتابخانهٔ جداگانه؛ محاسبات از طریق Intl (ca-persian) روی
// حساب روزهای میلادی انجام می‌شه (هر دو تقویم شمسی‌اند، پس جابه‌جایی روز‌به‌روز صحیحه
// و طول ماه/کبیسه رو خودِ Intl/ICU حساب می‌کنه — نیازی به پیاده‌سازی دستی الگوریتم نیست).

function jalaliParts(date: Date) {
  const parts = new Intl.DateTimeFormat('fa-IR-u-ca-persian-nu-latn', {
    year: 'numeric', month: 'numeric', day: 'numeric',
  }).formatToParts(date)
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0)
  return { jy: get('year'), jm: get('month'), jd: get('day') }
}

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian-nu-latn', { year: 'numeric', month: 'long' }).format(date)
}

function weekdayNarrow(date: Date) {
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian-nu-latn', { weekday: 'narrow' }).format(date)
}

function firstDayOfMonth(anchor: Date): Date {
  const { jd } = jalaliParts(anchor)
  const d = new Date(anchor)
  d.setDate(d.getDate() - (jd - 1))
  return d
}

function monthLength(day1: Date): number {
  const { jm } = jalaliParts(day1)
  let len = 0
  const cur = new Date(day1)
  while (jalaliParts(cur).jm === jm) {
    len++
    cur.setDate(cur.getDate() + 1)
  }
  return len
}

/** یکشنبه=۰..شنبه=۶ (JS Date.getDay) → شنبه=۰..جمعه=۶ (هفتهٔ فارسی) */
function persianWeekday(date: Date): number {
  return (date.getDay() + 1) % 7
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export interface DatePickerProps {
  /** مقدار ISO میلادی "YYYY-MM-DD" یا "" — همون قرارداد input نیتیو قبلی */
  value: string
  onChange: (v: string) => void
  placeholder?: string
  disabled?: boolean
}

/**
 * DatePicker — تقویم جلالی سفارشی (بدون کتابخانهٔ خارجی، بر پایهٔ Intl).
 * جایگزین overlay شفافِ <input type="date"> که قبلاً در DateField بود.
 * RTL: هدر ماه → قبلی(راست) عنوان(وسط) بعدی(چپ) — شبکهٔ روز → شنبه(راست) .. جمعه(چپ).
 */
export function DatePicker({ value, onChange, placeholder, disabled }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const selected = value ? new Date(value) : null
  const [viewDate, setViewDate] = useState(() => selected ?? new Date())

  useEffect(() => {
    if (open) setViewDate(selected ?? new Date())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const day1 = useMemo(() => firstDayOfMonth(viewDate), [viewDate])
  const len = useMemo(() => monthLength(day1), [day1])
  const leadingBlanks = persianWeekday(day1)

  const days = useMemo(() => {
    const arr: Date[] = []
    for (let i = 0; i < len; i++) {
      const d = new Date(day1)
      d.setDate(d.getDate() + i)
      arr.push(d)
    }
    return arr
  }, [day1, len])

  const weekdayHeaders = useMemo(() => {
    const satAnchor = new Date(day1)
    satAnchor.setDate(satAnchor.getDate() - leadingBlanks)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(satAnchor)
      d.setDate(d.getDate() + i)
      return weekdayNarrow(d)
    })
  }, [day1, leadingBlanks])

  const goPrevMonth = () => {
    const prevDay = new Date(day1)
    prevDay.setDate(prevDay.getDate() - 1)
    setViewDate(prevDay)
  }
  const goNextMonth = () => {
    const nextDay = new Date(day1)
    nextDay.setDate(nextDay.getDate() + len)
    setViewDate(nextDay)
  }
  const goToday = () => {
    const today = new Date()
    onChange(toIsoDate(today))
    setViewDate(today)
    setOpen(false)
  }

  return (
    <Popover.Root open={open} onOpenChange={(e) => setOpen(e.open)} positioning={{ placement: 'bottom-start' }}>
      <Popover.Trigger
        disabled={disabled}
        w="full"
        h="10"
        borderWidth="1px"
        borderColor="border"
        rounded="sm"
        bg="bg.panel"
        display="flex"
        alignItems="center"
        gap="2"
        px="3"
        cursor={disabled ? 'not-allowed' : 'pointer'}
        opacity={disabled ? 0.6 : 1}
      >
        <Text flex="1" fontSize="sm" color={value ? 'fg' : 'fg.subtle'} textAlign="start">
          {value ? formatJalaliDate(new Date(value)) : placeholder}
        </Text>
        <Calendar size={16} color="var(--chakra-colors-fg-muted)" style={{ flexShrink: 0 }} />
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner dir="rtl">
          <Popover.Content w="272px" p="3">
            <Popover.Body p="0">
              <Flex direction="column" gap="3" alignItems="stretch">
                {/* هدر ماه — قبلی(راست) → برچسب ماه/سال(وسط) → بعدی(چپ) */}
                <Flex align="center" justify="space-between" w="full">
                  <IconButton aria-label="ماه قبل" variant="ghost" size="xs" onClick={goPrevMonth}>
                    <ChevronRight size={16} />
                  </IconButton>
                  <Text fontSize="sm" fontWeight="semibold" color="fg">{monthLabel(day1)}</Text>
                  <IconButton aria-label="ماه بعد" variant="ghost" size="xs" onClick={goNextMonth}>
                    <ChevronLeft size={16} />
                  </IconButton>
                </Flex>

                {/* هدر هفته — شنبه(راست) .. جمعه(چپ) */}
                <Grid templateColumns="repeat(7, 1fr)" gap="1">
                  {weekdayHeaders.map((w, i) => (
                    <Text key={i} fontSize="xs" color="fg.muted" textAlign="center">{w}</Text>
                  ))}
                </Grid>

                {/* شبکهٔ روزها */}
                <Grid templateColumns="repeat(7, 1fr)" gap="1">
                  {Array.from({ length: leadingBlanks }).map((_, i) => (
                    <Box key={`b-${i}`} />
                  ))}
                  {days.map((d) => {
                    const isSelected = selected != null && isSameDay(d, selected)
                    const isToday = isSameDay(d, new Date())
                    return (
                      <Button
                        key={toIsoDate(d)}
                        size="xs"
                        variant={isSelected ? 'solid' : 'ghost'}
                        colorPalette="brand"
                        rounded="full"
                        minW="0"
                        borderWidth={isToday && !isSelected ? '1px' : undefined}
                        borderColor={isToday && !isSelected ? 'brand.focusRing' : undefined}
                        onClick={() => {
                          onChange(toIsoDate(d))
                          setOpen(false)
                        }}
                      >
                        {toPersianDigits(jalaliParts(d).jd)}
                      </Button>
                    )
                  })}
                </Grid>

                {/* دکمهٔ «امروز» — همیشه ثابت، مستقل از ماه/سالِ در حال نمایش */}
                <Separator />
                <Button size="xs" variant="ghost" colorPalette="brand" w="full" onClick={goToday}>
                  امروز
                </Button>
              </Flex>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}
