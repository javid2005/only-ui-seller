// ─── Signup Plans — types + mock data ──────────────────────────────────────
// پلن‌های اشتراک مرحلهٔ ۳ signup. امکانات/توضیحات مستقل از دورهٔ پرداختن — فقط قیمت بین
// ۶ماهه و ۱۲ماهه فرق داره (طبق Figma: صفحهٔ اشتراک ۶ماهه/۱۲ماهه).

import type { BillingPeriod } from '@/services/auth'

export interface SignupPlanFeature {
  text: string
  bold?: boolean
}

export interface SignupPlan {
  id: string
  title: string
  description: string
  isFree?: boolean
  /** بج بالا-چپ کارت — «پلن پرفروش» یا «۱۴ روزه» */
  badge?: { label: string; colorPalette: string }
  /** بج تخفیف کنار قیمت (فقط پلن حرفه‌ای) */
  discountLabel?: string
  price: Record<BillingPeriod, string>
  originalPrice?: Record<BillingPeriod, string>
  features: SignupPlanFeature[]
}

// ترتیب مطابق pixel-check طرح (نه ترتیب خام کد Figma): ردیف ۱ = رایگان(راست)/پایه(چپ) — ردیف ۲ = حرفه‌ای(راست)/پیشرفته(چپ)
export const SIGNUP_PLANS: SignupPlan[] = [
  {
    id: 'free',
    title: 'اشتراک رایگان',
    description: '۱۴ روز اشتراک رایگان برای استفاده از امکانات سایت بصورت محدود',
    isFree: true,
    badge: { label: '۱۴ روزه', colorPalette: 'orange' },
    price: { '6': 'رایگان', '12': 'رایگان' },
    features: [
      { text: 'ویترین ساز پایه' },
      { text: 'سرویس پرداخت آنلاین' },
      { text: 'مدیریت محصولات (۱۰ محصول)' },
      { text: 'مدیریت سفارشات محدود' },
    ],
  },
  {
    id: 'basic',
    title: 'اشتراک پایه',
    description: 'مناسب کسب‌وکارهای اینستاگرامی که فعالیت خود را به‌تازگی شروع کرده‌اند.',
    badge: { label: 'پلن پرفروش', colorPalette: 'brand' },
    price: { '6': '۵٬۹۸۰٬۰۰۰', '12': '۹٬۹۸۰٬۰۰۰' },
    features: [
      { text: 'ویترین ساز پیشرفته' },
      { text: 'سرویس پرداخت آنلاین' },
      { text: 'مدیریت محصولات (۲۰۰ محصول)' },
      { text: 'مدیریت سفارشات' },
      { text: 'باشگاه مشتریان' },
      { text: 'پشتیبانی پایه' },
      { text: 'بدون کارمزد فروش' },
    ],
  },
  {
    id: 'professional',
    title: 'اشتراک حرفه‌ای',
    description: 'مناسب کسب‌وکارهای اینستاگرامی با سایز متوسط که می‌خواهند کسب‌وکار خود را توسعه دهند.',
    discountLabel: '۱۸٪ تخفیف',
    // نکته: قیمت اصلی (originalPrice) در فایل Figma برای ۶ماهه و ۱۲ماهه یکسان (۱۴٬۹۸۰٬۰۰۰) ثبت شده — احتمالاً مقدار mock تنظیم‌نشده در طرح، عیناً کپی شده.
    originalPrice: { '6': '۱۴٬۹۸۰٬۰۰۰', '12': '۱۴٬۹۸۰٬۰۰۰' },
    price: { '6': '۸٬۹۸۰٬۰۰۰', '12': '۱۲٬۹۸۰٬۰۰۰' },
    features: [
      { text: 'امکانات اشتراک پایه', bold: true },
      { text: 'مدیریت محصولات (۵۰۰ محصول)' },
      { text: '۵ کمپین همکاری در فروش فعال همزمان' },
      { text: '۵ کمپین پروموشن فعال همزمان' },
      { text: 'دامنه دات ir رایگان' },
      { text: 'پشتیبانی حرفه‌ایی' },
    ],
  },
  {
    id: 'advanced',
    title: 'اشتراک پیشرفته',
    description: 'مناسب کسب‌وکارهای اینستاگرامی بزرگ که محصولات و مخاطبین زیادی دارند.',
    price: { '6': '۱۷٬۹۸۰٬۰۰۰', '12': '۲۶٬۹۸۰٬۰۰۰' },
    features: [
      { text: 'امکانات اشتراک حرفه ایی', bold: true },
      { text: 'مدیریت محصولات (نامحدود)' },
      { text: '۱۰ کمپین همکاری در فروش فعال همزمان' },
      { text: '۱۰ کمپین پروموشن فعال همزمان' },
      { text: 'پشتیبانی ۲۴/۷' },
    ],
  },
]

export const DEFAULT_SIGNUP_PLAN_ID = 'free'
