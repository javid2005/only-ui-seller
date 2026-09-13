import { Box, Icon } from '@chakra-ui/react'
import { ImageOff } from 'lucide-react'
import type { BoxProps } from '@chakra-ui/react'

// ─── MediaThumb ─────────────────────────────────────────────────────────────────
/**
 * نمایش استاندارد هر رسانهٔ محصول (گالری، تصویر مدل، تصویر اصلی، پیش‌نمایش).
 *
 * ⚠️ این رفتار در ۱۴۰۵/۰۶ **عوض شد**. نسخهٔ قبل تصویر را با `contain` و حاشیهٔ
 * سفیدِ ۱۲٪ داخل کادر می‌نشاند (خواستهٔ دور قبلیِ بازخورد). نتیجه‌اش در عمل این
 * شد که تصویرهای مستطیلی — یعنی تقریباً همه — نوارهای سفید پهنی کنارشان داشتند
 * و کارت‌ها پر از فضای پرت شدند. مالک محصول همان را دید و خواست تصویر
 * **بدون فریم** باشد.
 *
 * پس حالا:
 *   ۱. تصویر کل کادر را پر می‌کند (`cover`) — بدون نوار سفید.
 *   ۲. پس‌زمینهٔ سفیدِ دائمی برداشته شد؛ فقط وقتی تصویری نیست یک سطح ملایم
 *      می‌ماند تا کادر خالی دیده شود.
 *   ۳. حاشیه اختیاری است ولی وقتی هست باید **دیده شود** — رنگش از `border` است
 *      نه `border.muted` که عملاً نامرئی بود.
 *
 * اگر جایی واقعاً به نمایش کاملِ تصویر نیاز بود (نه بریده)، `fit="contain"`.
 */
export interface MediaThumbProps extends Omit<BoxProps, 'as'> {
  /** dataURL/URL تصویر — خالی یعنی placeholder */
  src?: string
  alt?: string
  /** پیش‌فرض `cover` (بدون فریم). `contain` فقط برای جایی که بریدگی مجاز نیست. */
  fit?: 'cover' | 'contain'
}

export function MediaThumb({ src, alt = '', fit = 'cover', ...rest }: MediaThumbProps) {
  return (
    <Box
      overflow="hidden"
      // فقط کادرِ خالی سطح می‌گیرد؛ پشتِ تصویر چیزی دیده نمی‌شود
      bg={src ? 'transparent' : 'bg.subtle'}
      display="grid"
      placeItems="center"
      position="relative"
      {...rest}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          style={{
            display: 'block',
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: fit,
            pointerEvents: 'none',
          }}
        />
      ) : (
        <Icon size="md" color="fg.subtle" aria-hidden>
          <ImageOff />
        </Icon>
      )}
    </Box>
  )
}
