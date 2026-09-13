import { useEffect, useRef, useState } from 'react'
import { Flex, Text, Box, Spinner } from '@chakra-ui/react'
import { Check } from 'lucide-react'

// ─── SaveStatus ─────────────────────────────────────────────────────────────────
/**
 * نشانگر ذخیرهٔ خودکار، زیر ریل — همان «در حال ذخیره…» طرح تأییدشده.
 *
 * چرا مهم است: فرم ویرایش محصول طولانی است و کاربر باید بداند کارش از دست نمی‌رود.
 * بدون این نشانگر، تنها بازخوردِ ذخیره دکمهٔ انتهای صفحه است که همیشه دیده نمی‌شود.
 *
 * این پاس UI-only است: با هر تغییر فرم «در حال ذخیره…» می‌آید و بعد از یک مکث
 * کوتاه «ذخیره شد» می‌شود. با اتصال به API، همین دو حالت به وضعیت واقعیِ mutation
 * وصل می‌شوند.
 */
export function SaveStatus({ watch }: { watch: unknown }) {
  const [state, setState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const first = useRef(true)

  useEffect(() => {
    if (first.current) { first.current = false; return }
    setState('saving')
    const t = setTimeout(() => setState('saved'), 700)
    return () => clearTimeout(t)
  }, [watch])

  if (state === 'idle') return null

  return (
    <Flex align="center" gap="2" px="1" aria-live="polite">
      {/* FIRST = rightmost: نشانه */}
      {state === 'saving' ? (
        <Spinner size="xs" color="fg.muted" />
      ) : (
        <Box color="green.fg" display="flex"><Check size={13} /></Box>
      )}
      <Text fontSize="2xs" color="fg.muted">
        {state === 'saving' ? 'در حال ذخیره…' : 'ذخیره شد'}
      </Text>
    </Flex>
  )
}
