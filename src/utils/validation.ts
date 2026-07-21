import { toLatinDigits } from './numbers'

// ─── کد ملی ───────────────────────────────────────────────────────────────────
// الگوریتم رسمی ثبت‌احوال: ۹ رقم سمت چپ با ضرایب ۱۰..۲ جمع می‌شوند، باقیماندهٔ
// تقسیم بر ۱۱ با رقم کنترلی (رقم دهم) مقایسه می‌شود. جزئیات کامل: docs/national-id-validation.md
export function isValidNationalId(raw: string): boolean {
  const digits = toLatinDigits(raw).replace(/\D/g, '')
  if (digits.length < 8 || digits.length > 10) return false

  const id = digits.padStart(10, '0')
  if (/^(\d)\1{9}$/.test(id)) return false // همهٔ ارقام یکسان → نامعتبر

  let sum = 0
  for (let i = 0; i < 9; i++) sum += Number(id[i]) * (10 - i)

  const remainder = sum % 11
  const control = remainder < 2 ? remainder : 11 - remainder
  return control === Number(id[9])
}
