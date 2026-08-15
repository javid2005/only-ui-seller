// Single source of truth برای لیست سفارشات — هر جا لازم شد فقط همین‌جا عوض می‌شه.
// داده‌ها از Figma (Orders / List — node 1923:21910) استخراج شده — شماره/نوع/مشتری/تلفن/
// تاریخ/مبلغ/روش ارسال/وضعیت هر ۱۰ ردیف عیناً از screenshot طرح خونده شده.
import { createListCollection } from '@chakra-ui/react'

export type OrderStatus =
  | 'در انتظار پرداخت'
  | 'پرداخت شده'
  | 'درحال آماده سازی'
  | 'ارسال شده'
  | 'مرجوع شده'
  | 'لغو شده'

export type OrderType = 'دستی' | 'سیستمی'
export type ShippingMethod = 'پست پیشتاز' | 'پست سفارشی' | 'پیک موتوری'

/** رنگ Badge وضعیت — مستقیم از Figma (subtle variant، node 1923:21996). */
export const STATUS_COLOR: Record<OrderStatus, string> = {
  'در انتظار پرداخت': 'gray',
  'پرداخت شده': 'green',
  'درحال آماده سازی': 'orange',
  'ارسال شده': 'blue',
  'مرجوع شده': 'yellow',
  'لغو شده': 'red',
}

/** رنگ Badge نوع سفارش — دستی=green / سیستمی=purple (از Figma، node 1923:25345). */
export const TYPE_COLOR: Record<OrderType, string> = {
  'دستی': 'green',
  'سیستمی': 'purple',
}

export interface Order {
  id: string
  /** شماره سفارش — مثل ORD-۵۶۲۱ (brand.fg، لینک به جزئیات) */
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
  shipping: ShippingMethod
  status: OrderStatus
}

export const ORDERS: Order[] = [
  { id: 'o1',  orderNo: 'ORD-۵۶۲۱', type: 'دستی',   customer: 'مهسا اکبری',        phone: '۰۹۱۲۳۴۵۶۷۸۹', date: '۱۴۰۴/۰۱/۲۰', amount: '۴۵٬۰۰۰٬۰۰۰ ت',                       shipping: 'پست پیشتاز',  status: 'در انتظار پرداخت' },
  { id: 'o2',  orderNo: 'ORD-۵۵۲۶', type: 'سیستمی', customer: 'محسن کیابی',        phone: '۰۹۱۴۵۲۲۳۶۴۰', date: '۱۴۰۴/۰۲/۱۵', amount: '۱۹٬۳۲۰٬۰۰۰ ت', amountBadge: '$ ۱۸۰', shipping: 'پست سفارشی', status: 'پرداخت شده' },
  { id: 'o3',  orderNo: 'ORD-۵۷۳۳', type: 'دستی',   customer: 'سارا رضایی',        phone: '۰۹۳۵۶۷۸۹۰۱۲', date: '۱۴۰۴/۰۳/۱۰', amount: '۳۲٬۰۰۰٬۰۰۰ ت',                       shipping: 'پست پیشتاز',  status: 'درحال آماده سازی' },
  { id: 'o4',  orderNo: 'ORD-۵۶۸۹', type: 'سیستمی', customer: 'رضا نوروزی',        phone: '۰۹۱۲۱۱۳۳۴۴۵', date: '۱۴۰۴/۰۴/۰۵', amount: '۲۸٬۰۰۰٬۰۰۰ ت',                       shipping: 'پست پیشتاز',  status: 'ارسال شده' },
  { id: 'o5',  orderNo: 'ORD-۵۵۹۲', type: 'سیستمی', customer: 'لیلا حسینی',        phone: '۰۹۱۷۸۹۴۵۶۱۲', date: '۱۴۰۴/۰۵/۲۵', amount: '۱۷٬۵۰۰٬۰۰۰ ت', amountBadge: '$ ۱۲۰', shipping: 'پیک موتوری',  status: 'مرجوع شده' },
  { id: 'o6',  orderNo: 'ORD-۵۶۴۷', type: 'سیستمی', customer: 'امیرحسین احمدی',    phone: '۰۹۳۸۶۵۴۷۲۱۰', date: '۱۴۰۴/۰۶/۳۰', amount: '۲۱٬۷۳۵٬۰۰۰ ت', amountBadge: '$ ۱۳۵', shipping: 'پست پیشتاز',  status: 'لغو شده' },
  { id: 'o7',  orderNo: 'ORD-۵۷۰۵', type: 'دستی',   customer: 'نسرین محمدی',       phone: '۰۹۱۳۳۲۲۲۱۱۰', date: '۱۴۰۴/۰۷/۱۵', amount: '۸۹٬۰۰۰٬۰۰۰ ت',                       shipping: 'پیک موتوری',  status: 'ارسال شده' },
  { id: 'o8',  orderNo: 'ORD-۵۵۷۸', type: 'دستی',   customer: 'حسین شریفی',        phone: '۰۹۱۴۴۵۵۵۶۶۶', date: '۱۴۰۴/۰۸/۲۵', amount: '۳۸٬۰۰۰٬۰۰۰ ت',                       shipping: 'پست پیشتاز',  status: 'ارسال شده' },
  { id: 'o9',  orderNo: 'ORD-۵۶۱۱', type: 'سیستمی', customer: 'زهرا قاسمی',        phone: '۰۹۲۱۱۱۲۲۳۳۴', date: '۱۴۰۴/۰۹/۱۰', amount: '۱۲٬۸۸۰٬۰۰۰ ت', amountBadge: '$ ۸۰',  shipping: 'پیک موتوری',  status: 'ارسال شده' },
  { id: 'o10', orderNo: 'ORD-۵۷۴۴', type: 'سیستمی', customer: 'مهدی جعفری',        phone: '۰۹۱۵۵۶۷۸۹۰۱', date: '۱۴۰۴/۱۰/۲۰', amount: '۳۵٬۰۰۰٬۰۰۰ ت',                       shipping: 'پست سفارشی', status: 'ارسال شده' },
]

// ── Filter collections (single source — OrderFilterBar + OrderFilterModal از همین می‌خونن) ──
export type FilterOption = { label: string; value: string }

export const statusCollection = createListCollection<FilterOption>({
  items: [
    { label: 'همه وضعیت ها', value: 'all' },
    { label: 'در انتظار پرداخت', value: 'pending-payment' },
    { label: 'پرداخت شده', value: 'paid' },
    { label: 'درحال آماده سازی', value: 'preparing' },
    { label: 'ارسال شده', value: 'shipped' },
    { label: 'مرجوع شده', value: 'returned' },
    { label: 'لغو شده', value: 'cancelled' },
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
    { label: 'گرانترین', value: 'price-desc' },
    { label: 'ارزانترین', value: 'price-asc' },
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
