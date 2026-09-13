import { useState } from 'react'
import { Box, Flex, Text, Badge, IconButton, chakra } from '@chakra-ui/react'
import { TriangleAlert, X, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'
import { toPersianDigits } from '@/utils/numbers'
import { pressable } from './motion'
import { STEPS } from './data'
import type { FieldIssue } from './validation'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface ValidationToastProps {
  issues: FieldIssue[]
  onClose: () => void
  /** رفتن به همان فیلد: تعویض مرحله + اسکرول + چشمک */
  onGoTo: (issue: FieldIssue) => void
}

const stepLabel = (id: string) => STEPS.find((s) => s.id === id)?.shortLabel ?? ''

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * ValidationToast — فهرست شناورِ «چه چیزی مانده».
 *
 * چرا toast عمومی پروژه استفاده نشد: آن یک عنوان و یک توضیح نشان می‌دهد و اینجا
 * لازم است **هر خطا خودش کلیک‌شدنی** باشد و کاربر را ببرد سر همان فیلد. آن
 * تعامل، محتوای toast را از «پیام» به «فهرست کنش» تبدیل می‌کند.
 *
 * جای تازه‌اش **بالای صفحه و وسط** است (بازخورد کاربر، مورد ۱۱): نسخهٔ قبلی
 * گوشهٔ پایین-چپ می‌نشست، دور از دکمهٔ «انتشار» که خودش بالای صفحه است — کاربر
 * دکمه را می‌زد و پیام جایی بیرون مسیرِ نگاهش ظاهر می‌شد. حالا همان‌جایی است که
 * چشم بعد از کلیک هست.
 *
 * جمع‌وجورتر هم شد: هر ردیف یک بجِ مرحله دارد تا فهرست در یک نگاه خوانده شود،
 * و کل فهرست تاشو است — «۳ مورد مانده» به‌تنهایی هم یک پیام کامل است.
 *
 * RTL DOM order هر ردیف (first = rightmost): بج مرحله ← عنوان و پیام ← پیکان (چپ).
 */
export function ValidationToast({ issues, onClose, onGoTo }: ValidationToastProps) {
  const [open, setOpen] = useState(true)
  if (issues.length === 0) return null

  return (
    <Box
      position="fixed"
      insetInline="0"
      /* درست زیر نوار بالایی (۶۴px، sticky) — نه رویش: پیام باید کنارِ نگاه
         کاربر باشد، نه اینکه هویتِ صفحه را بپوشاند. */
      top="calc(4rem + 0.75rem)"
      /* `banner` (۱۲۰۰) و نه `toast` (۱۷۰۰): این یک پیامِ سطحِ صفحه است، نه یک
         toast سیستمی — با لایهٔ toast روی دیالوگ‌های باز (۱۴۰۰) می‌نشست و نیمهٔ
         بالایی‌شان را می‌پوشاند. بالای نوارِ sticky (۱۱۰۰) می‌ماند. */
      zIndex="banner"
      px="4"
      pointerEvents="none"
    >
      <Box
        w="min(440px, 100%)"
        mx="auto"
        pointerEvents="auto"
        bg="bg.panel"
        borderWidth="1px"
        borderColor="red.muted"
        rounded="2xl"
        boxShadow="0 12px 32px rgba(30, 51, 60, 0.22)"
        overflow="hidden"
        role="alert"
        animationName="fade-in, slide-from-top"
        animationDuration="200ms"
        animationTimingFunction="ease-out"
        _motionReduce={{ animationName: 'none' }}
      >
        {/* سرتیتر — FIRST = rightmost: آیکن و عنوان · LAST = leftmost: تاکردن، بستن */}
        <Flex align="center" gap="2" px="3" py="2.5" bg="red.bg">
          <Box color="red.fg" flexShrink={0} display="flex"><TriangleAlert size={16} /></Box>
          <Text fontSize="xs" fontWeight="semibold" color="red.fg" flex="1" textAlign="start">
            {toPersianDigits(issues.length)} مورد برای انتشار لازم است
          </Text>
          <IconButton
            size="2xs"
            variant="ghost"
            colorPalette="red"
            aria-label={open ? 'جمع‌کردن فهرست' : 'باز کردن فهرست'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </IconButton>
          {/* دکمهٔ بستن عمداً پررنگ‌تر از یک آیکنِ ghost است: کاربر باید در یک نگاه
              ببیند که این پیام قابل بستن است (بازخورد کاربر، مورد ۱۱). */}
          <IconButton
            size="2xs"
            variant="subtle"
            colorPalette="red"
            rounded="md"
            aria-label="بستن"
            onClick={onClose}
          >
            <X size={14} />
          </IconButton>
        </Flex>

        {open && (
          <Flex direction="column" maxH="min(50dvh, 320px)" overflowY="auto" borderTopWidth="1px" borderColor="red.muted">
            {issues.map((issue) => (
              <chakra.button
                key={issue.id}
                type="button"
                onClick={() => onGoTo(issue)}
                display="flex"
                alignItems="start"
                gap="2"
                textAlign="start"
                px="3"
                py="2"
                bg="transparent"
                cursor="pointer"
                borderBottomWidth="1px"
                borderColor="border.muted"
                _last={{ borderBottomWidth: 0 }}
                _hover={{ bg: 'bg.subtle' }}
                {...pressable}
              >
                {/* FIRST = rightmost: بج مرحله — فهرست را بدون خواندن متن قابل مرور می‌کند */}
                <Badge size="xs" rounded="l2" colorPalette="gray" variant="subtle" flexShrink={0} mt="0.5">
                  {stepLabel(issue.step)}
                </Badge>
                <Box flex="1" minW="0">
                  <Text fontSize="xs" fontWeight="medium" color="fg" truncate>{issue.label}</Text>
                  <Text fontSize="2xs" color="fg.muted" lineHeight="1.7">{issue.message}</Text>
                </Box>
                {/* LAST = leftmost: پیکان «برو» — در RTL جلو رفتن به چپ است */}
                <Box color="fg.muted" flexShrink={0} display="flex" mt="0.5"><ArrowLeft size={15} /></Box>
              </chakra.button>
            ))}
          </Flex>
        )}
      </Box>
    </Box>
  )
}
