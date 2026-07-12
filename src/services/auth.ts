// ─── Mock Auth Service ────────────────────────────────────────────────────────
// تا وصل‌شدن به API واقعی: همهٔ توابع شبیه‌سازی‌شده‌اند (delay مصنوعی).
// طبق تصمیم پروژه: هر شماره موبایلی «موجود» فرض می‌شود (مسیر signup فعلاً تست نمی‌شود).

const MOCK_DELAY = 600

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY))
}

export function checkPhoneExists(phone: string): Promise<boolean> {
  void phone
  return delay(true)
}

export function sendOtp(phone: string): Promise<{ success: true }> {
  void phone
  return delay({ success: true })
}

export function verifyOtp(phone: string, code: string): Promise<{ success: boolean }> {
  void phone
  return delay({ success: code.length === 5 })
}

export function loginWithPassword(phone: string, password: string): Promise<{ success: boolean }> {
  void phone
  return delay({ success: password.length > 0 })
}

export function resetPassword(phone: string, newPassword: string): Promise<{ success: true }> {
  void phone
  void newPassword
  return delay({ success: true })
}
