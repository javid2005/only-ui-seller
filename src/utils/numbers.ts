const FA = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹']
const EN = ['0','1','2','3','4','5','6','7','8','9']

export function toPersianDigits(n: number | string): string {
  return String(n).replace(/[0-9]/g, d => FA[+d])
}

export function toLatinDigits(s: string): string {
  return s.replace(/[۰-۹]/g, d => String(EN[FA.indexOf(d)]))
}

// ─── جداکنندهٔ هزارگان ───────────────────────────────────────────────────────────
/** "1234567" → "1,234,567" (فقط رقم‌ها؛ ارقام فارسی هم نرمالایز می‌شوند) */
export function formatThousands(n: number | string): string {
  const s = toLatinDigits(String(n)).replace(/[^\d]/g, '')
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// ─── عدد به حروف فارسی ───────────────────────────────────────────────────────────
const W_ONES = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه']
const W_TEENS = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده']
const W_TENS = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود']
const W_HUNDREDS = ['', 'یکصد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد']
const W_SCALE = ['', ' هزار', ' میلیون', ' میلیارد', ' بیلیون']

function threeDigitsToWords(n: number): string {
  const parts: string[] = []
  const h = Math.floor(n / 100)
  const rem = n % 100
  if (h) parts.push(W_HUNDREDS[h])
  if (rem) {
    if (rem < 10) parts.push(W_ONES[rem])
    else if (rem < 20) parts.push(W_TEENS[rem - 10])
    else {
      parts.push(W_TENS[Math.floor(rem / 10)])
      if (rem % 10) parts.push(W_ONES[rem % 10])
    }
  }
  return parts.join(' و ')
}

/** 162500000 → "یکصد و شصت و دو میلیون و پانصد هزار" */
export function toPersianWords(num: number | string): string {
  let n = Math.floor(Math.abs(Number(toLatinDigits(String(num)).replace(/[^\d]/g, '')) || 0))
  if (n === 0) return 'صفر'
  const groups: number[] = []
  while (n > 0) { groups.push(n % 1000); n = Math.floor(n / 1000) }
  const parts: string[] = []
  for (let i = groups.length - 1; i >= 0; i--) {
    if (groups[i] === 0) continue
    parts.push(threeDigitsToWords(groups[i]) + W_SCALE[i])
  }
  return parts.join(' و ')
}
