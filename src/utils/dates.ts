/** Date → "۱۴۰۴/۱۱/۲۴" (تقویم جلالی، ارقام فارسی) — بدون نیاز به کتابخانهٔ جداگانه، Intl خودِ runtime تبدیل می‌کند. */
export function formatJalaliDate(date: Date): string {
  const parts = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? ''
  return `${get('year')}/${get('month')}/${get('day')}`
}
