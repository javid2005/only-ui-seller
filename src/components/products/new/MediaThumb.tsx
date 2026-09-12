import { Box, Icon } from '@chakra-ui/react'
import { ImageOff } from 'lucide-react'
import type { BoxProps } from '@chakra-ui/react'

// ─── MediaThumb ─────────────────────────────────────────────────────────────────
/**
 * نمایش استاندارد هر رسانهٔ محصول (گالری، تصویر ترکیب تنوع، پیش‌نمایش آپلود).
 *
 * چرا یک کامپوننت مشترک: بازخورد «عکس‌ها باید پس‌زمینهٔ سفید داشته باشند و حاشیهٔ
 * ۱۰ تا ۲۰ درصد» یک قاعدهٔ سراسری است، نه استایل یک کارت. هر جای دیگری که تصویر
 * محصول نشان داده شود باید از همین‌جا بیاید تا دوباره واگرا نشود.
 *
 * سه تصمیمِ این قاعده:
 *   ۱. پس‌زمینهٔ سفیدِ ذاتیِ کادر — نه یک لایهٔ تزئینی. تصویر محصول روی سفید دیده
 *      می‌شود، درست مثل لایت‌باکس عکاسی. این تنها جایی است که `white` عمدی است و
 *      در dark mode هم سفید می‌ماند (پس‌زمینهٔ عکس است، نه سطح theme-able).
 *   ۲. حاشیهٔ نسبی (`padRatio`، پیش‌فرض ۱۲٪ از عرض کادر) — درصدِ padding در CSS
 *      نسبت به عرض حساب می‌شود، پس با هر اندازهٔ کادر نسبت ثابت می‌ماند.
 *   ۳. `object-fit: contain` + بدون بزرگ‌نماییِ فراتر از ابعاد ذاتی — علت اصلی
 *      «کیفیت افتضاح» در پروتوتایپ، کشیده‌شدن تصاویر کوچک روی کادر بزرگ بود.
 */
export interface MediaThumbProps extends Omit<BoxProps, 'as'> {
  /** dataURL/URL تصویر — خالی یعنی placeholder */
  src?: string
  alt?: string
  /** نسبت حاشیهٔ سفید دور تصویر (۱۰–۲۰٪ طبق طرح تأییدشده). پیش‌فرض ۱۲٪ */
  padRatio?: number
}

export function MediaThumb({ src, alt = '', padRatio = 0.12, ...rest }: MediaThumbProps) {
  const pad = `${Math.round(padRatio * 100)}%`

  return (
    <Box
      overflow="hidden"
      // سفیدِ عمدی: بستر عکس محصول است، نه سطحِ theme-able (پس توکن semantic ندارد)
      bg="white"
      display="grid"
      placeItems="center"
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
            width: '100%',
            height: '100%',
            padding: pad,
            boxSizing: 'border-box',
            objectFit: 'contain',
            // تصویرِ کوچک‌تر از کادر بزرگ‌نمایی نمی‌شود → لبه‌ها تار نمی‌شوند
            maxWidth: '100%',
            maxHeight: '100%',
            pointerEvents: 'none',
          }}
        />
      ) : (
        // رنگ ثابت (نه توکن semantic): بستر همیشه سفید است، پس fg.muted در dark
        // mode روشن می‌شد و placeholder روی سفید محو می‌شد.
        <Icon size="md" color="gray.400" aria-hidden>
          <ImageOff />
        </Icon>
      )}
    </Box>
  )
}
