export type DiscountType = 'percentage' | 'fixed'
export type DiscountStatus = 'active' | 'expired' | 'inactive'

export const DISCOUNT_TYPE_LABEL: Record<DiscountType, string> = {
  percentage: 'درصدی',
  fixed: 'مقداری',
}

export const DISCOUNT_TYPE_COLOR: Record<DiscountType, string> = {
  percentage: 'green',
  fixed: 'purple',
}

export const DISCOUNT_STATUS_LABEL: Record<DiscountStatus, string> = {
  active: 'فعال',
  expired: 'منقضی شده',
  inactive: 'غیرفعال',
}

export const DISCOUNT_STATUS_COLOR: Record<DiscountStatus, string> = {
  active: 'green',
  expired: 'red',
  inactive: 'gray',
}

/** رنگ نوار پیشرفت «استفاده شده» — قرمز فقط برای کد منقضی‌شده (طبق Figma: ردیف با وضعیت
 *  «منقضی شده» تنها ردیفی بود که Progress رنگ پیش‌فرض/قرمز داشت، بقیه colorPalette="brand" صریح داشتند). */
export function usageProgressColor(status: DiscountStatus): 'brand' | 'red' {
  return status === 'expired' ? 'red' : 'brand'
}

export interface DiscountCodeUsage {
  used: number
  /** null یعنی سقف استفاده تعیین نشده — فقط تعداد دفعات استفاده نمایش داده می‌شود (بدون نوار پیشرفت) */
  limit: number | null
}

export interface DiscountCodeItem {
  id: string
  title: string
  type: DiscountType
  code: string
  /** درصد تخفیف (type=percentage، مثل «۱۵٪») یا مبلغ ثابت به تومان (type=fixed، مثل «۵۰٬۰۰۰ تومان») */
  amountValue: string
  /** سقف مبلغ تخفیف — فقط type=percentage دارد */
  amountCap?: string
  usage: DiscountCodeUsage
  startDate: string | null
  endDate: string | null
  status: DiscountStatus
}

/** Figma «Discount / List» Table (node 2659:81942) + Discount-Card (instance 3122:71946) */
export const DISCOUNT_CODES: DiscountCodeItem[] = [
  {
    id: 'discount-1',
    title: 'جشنواره عیدانه موبایل',
    type: 'percentage',
    code: 'NOWROOZ15',
    amountValue: '۱۵٪',
    amountCap: 'سقف: ۱۵۰٬۰۰۰',
    usage: { used: 47, limit: 100 },
    startDate: '۱۴۰۵/۰۳/۰۱',
    endDate: '۱۴۰۵/۰۳/۳۱',
    status: 'active',
  },
  {
    id: 'discount-2',
    title: 'پروموشن ویژه عید',
    type: 'fixed',
    code: 'NOWROOZS',
    amountValue: '۵۰٬۰۰۰ تومان',
    usage: { used: 1, limit: null },
    startDate: null,
    endDate: null,
    status: 'active',
  },
  {
    id: 'discount-3',
    title: 'همکاری در فروش کیف و کفش',
    type: 'percentage',
    code: 'SHOEBAG20',
    amountValue: '۲۰٪',
    amountCap: 'سقف: ۱۰۰٬۰۰۰',
    usage: { used: 53, limit: 100 },
    startDate: '۱۴۰۴/۰۲/۱۷',
    endDate: '۱۴۰۴/۰۳/۳۰',
    status: 'expired',
  },
  {
    id: 'discount-4',
    title: 'کمپین پاییزه',
    type: 'fixed',
    code: 'AUTUMN100',
    amountValue: '۱۰۰٬۰۰۰ تومان',
    usage: { used: 8, limit: 50 },
    startDate: '۱۴۰۴/۰۴/۰۱',
    endDate: '۱۴۰۴/۰۶/۱۰',
    status: 'inactive',
  },
]
