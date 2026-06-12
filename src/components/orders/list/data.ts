// Single source of truth برای لیست سفارشات — هر جا لازم شد فقط همین‌جا عوض می‌شه.
// داده‌ها از Figma (Order List section) استخراج شده. نام مشتری/تلفن = seed (Figma placeholder بود).
import { createListCollection } from '@chakra-ui/react'

export type OrderStatus =
  | 'در انتظار پرداخت'
  | 'پرداخت شده'
  | 'درحال آماده سازی'
  | 'ارسال شده'
  | 'مرجوعی'
  | 'لغو شده'

export type OrderType = 'دستی' | 'سیستمی'
export type ShippingMethod = 'پست پیشتاز' | 'پست سفارشی' | 'پیک موتوری'

/** رنگ Badge وضعیت — مستقیم از Figma (subtle variant). */
export const STATUS_COLOR: Record<OrderStatus, string> = {
  'در انتظار پرداخت': 'green',
  'پرداخت شده': 'blue',
  'درحال آماده سازی': 'orange',
  'ارسال شده': 'purple',
  'مرجوعی': 'yellow',
  'لغو شده': 'red',
}

/** رنگ Badge نوع سفارش — دستی=green / سیستمی=purple (از Figma). */
export const TYPE_COLOR: Record<OrderType, string> = {
  'دستی': 'green',
  'سیستمی': 'purple',
}

export interface Order {
  id: string
  /** شماره سفارش — مثل ORD-۵۶۲۱ (teal، لینک به جزئیات) */
  orderNo: string
  type: OrderType
  customer: string
  /** شماره تماس مشتری */
  phone: string
  /** تاریخ شمسی (رشته‌ی آماده) */
  date: string
  /** مبلغ کل تومان — رشته‌ی فارسی آماده (مثل «۴۵٬۰۰۰٬۰۰۰ ت») */
  amount: string
  /** badge مبلغ دلاری کنار قیمت (مثل «$ ۱۸۰») — اختیاری، gray.subtle */
  amountBadge?: string
  /** خط تخفیف سبز solid (مثل «تخفیف: ۷٬۰۰۰٬۰۰۰») — اختیاری */
  discount?: string
  /** badge درصد تخفیف کنار خط تخفیف (مثل «٪ ۱۰») — اختیاری، orange.solid */
  discountBadge?: string
  shipping: ShippingMethod
  status: OrderStatus
}

export const ORDERS: Order[] = [
  { id: 'o1',  orderNo: 'ORD-۵۶۲۱', type: 'دستی',   customer: 'مهسا اکبری',   phone: '۰۹۱۲۳۴۵۶۷۸۹', date: '۱۴۰۴/۰۱/۲۰', amount: '۴۵٬۰۰۰٬۰۰۰ ت',     discount: 'تخفیف: ۷٬۰۰۰٬۰۰۰',    discountBadge: '٪ ۱۰', shipping: 'پست پیشتاز',  status: 'درحال آماده سازی' },
  { id: 'o2',  orderNo: 'ORD-۵۵۲۶', type: 'سیستمی', customer: 'رضا محمدی',    phone: '۰۹۱۳۱۲۳۴۵۶۷', date: '۱۴۰۴/۰۲/۱۵', amount: '۱۹٬۳۲۰٬۰۰۰ ت',     amountBadge: '$ ۱۸۰',                                shipping: 'پست سفارشی', status: 'پرداخت شده' },
  { id: 'o3',  orderNo: 'ORD-۵۷۳۳', type: 'دستی',   customer: 'سارا حسینی',   phone: '۰۹۹۰۸۷۶۵۴۳۲', date: '۱۴۰۴/۰۳/۱۰', amount: '۳۲٬۰۰۰٬۰۰۰ ت',     discount: 'تخفیف: ۲٬۵۰۰٬۰۰۰ ت', discountBadge: '٪ ۱۵', shipping: 'پست پیشتاز',  status: 'در انتظار پرداخت' },
  { id: 'o4',  orderNo: 'ORD-۵۶۸۹', type: 'سیستمی', customer: 'علی کریمی',    phone: '۰۹۱۲۱۱۱۲۲۳۳', date: '۱۴۰۴/۰۴/۰۵', amount: '۲۸٬۰۰۰٬۰۰۰ ت',                                                          shipping: 'پست پیشتاز',  status: 'ارسال شده' },
  { id: 'o5',  orderNo: 'ORD-۵۵۹۲', type: 'سیستمی', customer: 'نگار رضایی',   phone: '۰۹۳۵۵۵۵۴۴۳۳', date: '۱۴۰۴/۰۵/۲۵', amount: 'از ۱۷٬۵۰۰٬۰۰۰ ت',  amountBadge: '$ ۱۲۰',                                shipping: 'پیک موتوری',  status: 'مرجوعی' },
  { id: 'o6',  orderNo: 'ORD-۵۶۴۷', type: 'سیستمی', customer: 'امیر تهرانی',  phone: '۰۹۱۸۷۷۷۶۶۵۵', date: '۱۴۰۴/۰۶/۳۰', amount: '۲۱٬۷۳۵٬۰۰۰ ت',     amountBadge: '$ ۱۳۵', discount: 'تخفیف: $ ۵', discountBadge: '٪ ۳', shipping: 'پست پیشتاز',  status: 'در انتظار پرداخت' },
  { id: 'o7',  orderNo: 'ORD-۵۷۰۵', type: 'دستی',   customer: 'الهام نوری',   phone: '۰۹۱۰۱۲۳۴۵۶۷', date: '۱۴۰۴/۰۷/۱۵', amount: '۸۹٬۰۰۰٬۰۰۰ ت',     discount: 'تخفیف: ۲۶٬۰۰۰٬۰۰۰ ت', discountBadge: '٪ ۲۰', shipping: 'پیک موتوری',  status: 'لغو شده' },
  { id: 'o8',  orderNo: 'ORD-۵۵۷۸', type: 'دستی',   customer: 'حسین مرادی',   phone: '۰۹۲۲۳۳۳۴۴۵۵', date: '۱۴۰۴/۰۸/۲۵', amount: '۳۸٬۰۰۰٬۰۰۰ ت',                                                          shipping: 'پست پیشتاز',  status: 'در انتظار پرداخت' },
  { id: 'o9',  orderNo: 'ORD-۵۶۱۱', type: 'سیستمی', customer: 'مریم صادقی',   phone: '۰۹۱۵۹۸۷۶۵۴۳', date: '۱۴۰۴/۰۹/۱۰', amount: '۱۲٬۸۸۰٬۰۰۰ ت',     amountBadge: '$ ۸۰', discount: 'تخفیف: $ ۱۵', discountBadge: '٪ ۱۸', shipping: 'پیک موتوری',  status: 'ارسال شده' },
  { id: 'o10', orderNo: 'ORD-۵۷۴۴', type: 'سیستمی', customer: 'پویا اسدی',    phone: '۰۹۳۹۱۲۳۴۵۶۷', date: '۱۴۰۴/۱۰/۲۰', amount: '۳۵٬۰۰۰٬۰۰۰ ت',                                                          shipping: 'پست سفارشی', status: 'مرجوعی' },
]

// ── آمار بالای صفحه (راست→چپ: کل سفارشات راست‌ترین، جمع فروش چپ‌ترین) ──
export interface OrderStat {
  label: string
  /** مقدار آماده‌ی نمایش (رشته فارسی — می‌تواند عدد یا مبلغ باشد) */
  value: string
}

export const ORDER_STATS: OrderStat[] = [
  { label: 'کل سفارشات',  value: '۱۰' },
  { label: 'در انتظار',   value: '۲' },
  { label: 'درحال پردازش', value: '۲' },
  { label: 'ارسال شده',   value: '۲' },
  { label: 'جمع فروش',    value: '۱۷٬۵۹۰٬۰۰۰ ت' },
]

// ── Filter collections (single source — OrderList + OrderFilterModal از همین می‌خونن) ──
export type FilterOption = { label: string; value: string }

export const statusCollection = createListCollection<FilterOption>({
  items: [
    { label: 'همه وضعیت ها', value: 'all' },
    { label: 'در انتظار پرداخت', value: 'pending-payment' },
    { label: 'پرداخت شده', value: 'paid' },
    { label: 'درحال آماده سازی', value: 'preparing' },
    { label: 'ارسال شده', value: 'shipped' },
    { label: 'مرجوعی', value: 'returned' },
    { label: 'لغو شده', value: 'cancelled' },
  ],
})

export const dateCollection = createListCollection<FilterOption>({
  items: [
    { label: 'همه تاریخ ها', value: 'all' },
    { label: 'امروز', value: 'today' },
    { label: '۷ روز اخیر', value: '7days' },
    { label: 'ماه اخیر', value: 'month' },
    { label: 'انتخاب بازه زمانی', value: 'custom' },
  ],
})

export const shippingCollection = createListCollection<FilterOption>({
  items: [
    { label: 'همه روش های ارسال', value: 'all' },
    { label: 'پست پیشتاز', value: 'pishtaz' },
    { label: 'پست سفارشی', value: 'sefareshi' },
    { label: 'پیک موتوری', value: 'peyk' },
  ],
})

export const sortCollection = createListCollection<FilterOption>({
  items: [
    { label: 'جدیدترین', value: 'newest' },
    { label: 'قدیمی ترین', value: 'oldest' },
    { label: 'بیشترین قیمت', value: 'price-desc' },
    { label: 'کمترین قیمت', value: 'price-asc' },
  ],
})

// ── منوی عملیات هر ردیف (ellipsis ⋮) — از Figma «Orders / CTmenu / More» ──
export interface RowAction {
  value: string
  label: string
  danger?: boolean
}

export const ROW_ACTIONS: RowAction[] = [
  { value: 'details', label: 'مشاهده جزئیات' },
  { value: 'copy-link', label: 'کپی لینک' },
]
