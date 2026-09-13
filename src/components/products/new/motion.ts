// ─── میکروانیمیشن‌های مشترک ─────────────────────────────────────────────────────
/**
 * چند preset کوچک برای حس بصریِ ملایم — نه بیشتر.
 *
 * قاعده‌ای که اینجا رعایت شده: انیمیشن نباید **انتظار** بسازد. پس هیچ‌کدام بیشتر
 * از ۲۴۰ms نیست، هیچ‌کدام چیدمان را جابه‌جا نمی‌کند (فقط رنگ، سایه، شفافیت و
 * جابه‌جایی چند پیکسلی)، و همه در `prefers-reduced-motion` خاموش می‌شوند.
 *
 * چرا توکن‌های animation چاکرا کافی نبودند: آن‌ها برای ورود/خروج‌اند؛ چیزی که
 * اینجا بیشتر لازم است حالت **فشرده‌شدن** هنگام کلیک و نرم‌شدن تعویض حالت است.
 */

/** فشرده‌شدن کوتاه هنگام کلیک — برای هر چیزی که «دکمه‌وار» است */
export const pressable = {
  transition: 'background 0.18s, color 0.18s, border-color 0.18s, box-shadow 0.18s, transform 0.12s',
  _active: { transform: 'scale(0.97)' },
  _motionReduce: { transition: 'none', _active: { transform: 'none' } },
} as const

/** ورود ملایمِ محتوای یک مرحله/تب */
export const enterPanel = {
  animationName: 'fade-in, slide-from-bottom',
  animationDuration: '220ms',
  animationTimingFunction: 'ease-out',
  _motionReduce: { animationName: 'none' },
} as const

/** ورود ملایمِ یک ردیف/کارتِ تازه‌افزوده‌شده */
export const enterItem = {
  animationName: 'fade-in, slide-from-top',
  animationDuration: '180ms',
  animationTimingFunction: 'ease-out',
  _motionReduce: { animationName: 'none' },
} as const
