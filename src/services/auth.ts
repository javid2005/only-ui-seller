// ─── Mock Auth Service ────────────────────────────────────────────────────────
// تا وصل‌شدن به API واقعی: همهٔ توابع شبیه‌سازی‌شده‌اند (delay مصنوعی).

const MOCK_DELAY = 600

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY))
}

// مسیر signup تست‌پذیره: شمارهٔ با رقم آخر فرد = کاربر جدید (signup)، زوج = کاربر موجود (login)
export function checkPhoneExists(phone: string): Promise<boolean> {
  const lastDigit = Number(phone.slice(-1))
  return delay(Number.isFinite(lastDigit) ? lastDigit % 2 === 0 : true)
}

export function sendOtp(phone: string): Promise<{ success: true }> {
  void phone
  return delay({ success: true })
}

// مسیر تست‌پذیر برای «کد اشتباه»: کد ۰۰۰۰۰ همیشه رد می‌شود؛ هر کد ۵رقمی دیگر تایید می‌شود.
export function verifyOtp(phone: string, code: string): Promise<{ success: boolean }> {
  void phone
  return delay({ success: code.length === 5 && code !== '00000' })
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

// ─── Signup Progress (mock persistence) ────────────────────────────────────────
// هر مرحله با ذخیرهٔ progress در localStorage شبیه‌سازی می‌شه — تا وصل‌شدن به API واقعی.
// دفعهٔ بعد که همون شماره وارد فلوی signup بشه، به آخرین مرحلهٔ ذخیره‌شده هدایت می‌شه.

export type SignupStep = 'basic-info' | 'categories' | 'plan' | 'done'

export interface SignupBasicInfo {
  firstName: string
  lastName: string
  storeNameFa: string
  storeSlug: string
  inviteCode?: string
}

export type BillingPeriod = '6' | '12'

export interface SignupProgress {
  step: SignupStep
  basicInfo?: SignupBasicInfo
  categoryIds?: string[]
  planId?: string
  billingPeriod?: BillingPeriod
}

export const SIGNUP_STEP_ROUTE: Record<SignupStep, string> = {
  'basic-info': '/signup/basic-info',
  categories: '/signup/categories',
  plan: '/signup/plan',
  done: '/signup/done',
}

function signupProgressKey(phone: string): string {
  return `vitrina-signup-progress:${phone}`
}

export function getSignupProgress(phone: string): SignupProgress | null {
  if (typeof window === 'undefined' || !phone) return null
  const raw = window.localStorage.getItem(signupProgressKey(phone))
  if (!raw) return null
  try {
    return JSON.parse(raw) as SignupProgress
  } catch {
    return null
  }
}

export function saveSignupStep(phone: string, step: SignupStep, data?: Partial<SignupProgress>): void {
  if (typeof window === 'undefined' || !phone) return
  const current = getSignupProgress(phone) ?? {}
  const next: SignupProgress = { ...current, ...data, step }
  window.localStorage.setItem(signupProgressKey(phone), JSON.stringify(next))
}
