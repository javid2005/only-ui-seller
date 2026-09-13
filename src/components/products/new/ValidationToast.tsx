import { Box, Flex, Text, IconButton, chakra } from '@chakra-ui/react'
import { TriangleAlert, X, ArrowLeft } from 'lucide-react'
import { toPersianDigits } from '@/utils/numbers'
import { pressable } from './motion'
import type { FieldIssue } from './validation'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface ValidationToastProps {
  issues: FieldIssue[]
  onClose: () => void
  /** رفتن به همان فیلد: تعویض مرحله + اسکرول + چشمک */
  onGoTo: (issue: FieldIssue) => void
}

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * ValidationToast — فهرست شناورِ «چه چیزی مانده».
 *
 * چرا toast عمومی پروژه استفاده نشد: آن یک عنوان و یک توضیح نشان می‌دهد و اینجا
 * لازم است **هر خطا خودش کلیک‌شدنی** باشد و کاربر را ببرد سر همان فیلد. آن
 * تعامل، محتوای toast را از «پیام» به «فهرست کنش» تبدیل می‌کند.
 *
 * جایش پایین-**راست** است تا روی دکمهٔ اصلیِ فوتر (پایین-چپ) ننشیند، و در موبایل
 * بالاتر می‌آید تا نوار پیش‌نمایشِ چسبیده به پایین را نپوشاند.
 *
 * RTL DOM order هر ردیف (first = rightmost): عنوان فیلد و پیام ← پیکان (چپ).
 */
export function ValidationToast({ issues, onClose, onGoTo }: ValidationToastProps) {
  if (issues.length === 0) return null

  return (
    <Box
      position="fixed"
      insetInlineStart="4"
      bottom={{ base: '20', lg: '4' }}
      zIndex="toast"
      w="min(360px, calc(100vw - 2rem))"
      bg="bg.panel"
      borderWidth="1px"
      borderColor="red.muted"
      rounded="2xl"
      boxShadow="0 12px 32px rgba(30, 51, 60, 0.18)"
      overflow="hidden"
      role="alert"
      animationName="fade-in, slide-from-bottom"
      animationDuration="200ms"
      animationTimingFunction="ease-out"
      _motionReduce={{ animationName: 'none' }}
    >
      {/* سرتیتر — FIRST = rightmost: آیکن و عنوان · LAST = leftmost: بستن */}
      <Flex align="center" gap="2" px="3" py="2.5" bg="red.bg" borderBottomWidth="1px" borderColor="red.muted">
        <Box color="red.fg" flexShrink={0} display="flex"><TriangleAlert size={16} /></Box>
        <Text fontSize="xs" fontWeight="semibold" color="red.fg" flex="1" textAlign="start">
          {toPersianDigits(issues.length)} مورد برای انتشار لازم است
        </Text>
        <IconButton size="2xs" variant="ghost" colorPalette="red" aria-label="بستن" onClick={onClose}>
          <X size={14} />
        </IconButton>
      </Flex>

      <Flex direction="column" maxH="260px" overflowY="auto">
        {issues.map((issue) => (
          <chakra.button
            key={issue.id}
            type="button"
            onClick={() => onGoTo(issue)}
            display="flex"
            alignItems="center"
            gap="2"
            textAlign="start"
            px="3"
            py="2.5"
            bg="transparent"
            cursor="pointer"
            borderBottomWidth="1px"
            borderColor="border.muted"
            _last={{ borderBottomWidth: 0 }}
            _hover={{ bg: 'bg.subtle' }}
            {...pressable}
          >
            <Box flex="1" minW="0">
              <Text fontSize="xs" fontWeight="medium" color="fg" truncate>{issue.label}</Text>
              <Text fontSize="2xs" color="fg.muted" lineHeight="1.8">{issue.message}</Text>
            </Box>
            {/* LAST = leftmost: پیکان «برو» — در RTL جلو رفتن به چپ است */}
            <Box color="fg.muted" flexShrink={0} display="flex"><ArrowLeft size={15} /></Box>
          </chakra.button>
        ))}
      </Flex>
    </Box>
  )
}
