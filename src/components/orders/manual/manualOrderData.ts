// ─── Manual order wizard — types + mock data ───────────────────────────────────
// Display strings are Persian (user-facing). Phone numbers stay Latin in data and
// are converted with toPersianDigits at render — so search can normalize either way.

export interface ManualCustomer {
  id: string
  name: string
  /** Latin digits — نمایش با toPersianDigits */
  phone: string
}

export const MANUAL_ORDER_STEPS = [
  'انتخاب مشتری',
  'انتخاب محصول',
  'روش ارسال',
  'اعمال تخفیف',
  'تایید و لینک',
]

export const MANUAL_CUSTOMERS: ManualCustomer[] = [
  { id: 'c1',  name: 'آرش نیکو',      phone: '09123456789' },
  { id: 'c2',  name: 'سارا حسینی',    phone: '09134567890' },
  { id: 'c3',  name: 'کامران امینی',  phone: '09145678901' },
  { id: 'c4',  name: 'مینا رضایی',    phone: '09156789012' },
  { id: 'c5',  name: 'علی اکبری',     phone: '09167890123' },
  { id: 'c6',  name: 'ندا سلیمی',     phone: '09178901234' },
  { id: 'c7',  name: 'فرهاد قاسمی',   phone: '09189012345' },
  { id: 'c8',  name: 'لیلا شریفی',    phone: '09190123456' },
  { id: 'c9',  name: 'حمیدرضا نوروزی', phone: '09201234567' },
  { id: 'c10', name: 'زهرا بهرامی',   phone: '09212345678' },
  { id: 'c11', name: 'محسن فتاحی',    phone: '09223456789' },
  { id: 'c12', name: 'شهرزاد جواهری', phone: '09234567890' },
  { id: 'c13', name: 'بهرام کاظمی',   phone: '09245678901' },
]
