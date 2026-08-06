// Single source of truth برای صفحه «سبدهای خرید رها شده» — Figma: Abandoned-Cart / List
// desktop: node 2735:62474 · mobile: node 3033:66293 · کارت لوکال: node 3126:80768
// drawer جزئیات: رها شده node 5114:79262 · تبدیل شده node 5114:79298
import { createListCollection } from '@chakra-ui/react'
import prd1 from '@/assets/ManualProducts/Product-1.png'
import prd2 from '@/assets/ManualProducts/Product-2.png'
import prd5 from '@/assets/ManualProducts/Product-5.png'
import prd6 from '@/assets/ManualProducts/Product-6.png'

export type AbandonedCartStatus = 'رها شده' | 'تبدیل شده'

export interface AbandonedCartItem {
  name: string
  qty: number
  priceToman: string
  priceUsd?: string
  image: string
}

export interface AbandonedCart {
  id: string
  status: AbandonedCartStatus
  totalAmount: string
  itemsCount: number
  /** ایجاد کننده — طبق لیبل ستون جدول دسکتاپ (قبلاً «مشتری») */
  customerName: string
  customerPhone: string
  /** تاریخ ایجاد — شمسی، آماده‌ی نمایش (node 5113:77893 در Figma) */
  createdDate: string
  /** تاریخ+زمان ایجاد — فقط برای drawer جزئیات (node 5114:79262 Row «تاریخ و زمان ایجاد») */
  createdDateTime: string
  /** تاریخ+زمان تبدیل — فقط سبدهای «تبدیل شده» (node 5114:79298 Row «تاریخ و زمان تبدیل») */
  convertedDateTime?: string
  /** اقلام سبد — برای drawer جزئیات. فقط شناسه C-۵۶۲۱/C-۵۶۸۹ مستقیماً از Figma بود؛ بقیه synth با همون کاتالوگ محصول پروژه (manualOrderData) و جمع دقیقاً برابر totalAmount */
  items: AbandonedCartItem[]
}

export const STATUS_COLOR: Record<AbandonedCartStatus, string> = {
  'رها شده': 'red',
  'تبدیل شده': 'green',
}

// دقیقاً مطابق داده‌ی نمونه‌ی فیگما — عدد «تبدیل شده به سفارش» (۱ در استت) با تعداد ردیف‌های
// «تبدیل شده» در جدول (۲) همخوانی نداره؛ این ناسازگاری در خودِ طرح فیگما بود، عیناً پیاده شد.
export const ABANDONED_CARTS: AbandonedCart[] = [
  {
    id: 'C-۵۶۲۱', status: 'رها شده', totalAmount: '۴۵٬۰۰۰٬۰۰۰ ت', itemsCount: 3,
    customerName: 'مهسا اکبری', customerPhone: '۰۹۱۲۳۴۵۶۷۸۹',
    createdDate: '۱۴۰۴/۰۲/۱۸', createdDateTime: '۱۴۰۴/۰۲/۱۸ — ۱۴:۳۲',
    items: [
      { name: 'آیفون ۱۵ پرو مکس', qty: 1, priceToman: '۱۲٬۰۰۰٬۰۰۰', priceUsd: '۱۸۰', image: prd2.src },
      { name: 'گلکسی S24 اولترا', qty: 1, priceToman: '۱۸٬۰۰۰٬۰۰۰', image: prd1.src },
      { name: 'هواوی P10', qty: 1, priceToman: '۱۵٬۰۰۰٬۰۰۰', image: prd5.src },
    ],
  },
  {
    id: 'C-۵۵۲۶', status: 'رها شده', totalAmount: '۱۹٬۳۲۰٬۰۰۰ ت', itemsCount: 5,
    customerName: 'محسن کیایی', customerPhone: '۰۹۱۴۵۲۲۳۶۴۰',
    createdDate: '۱۴۰۴/۰۲/۱۸', createdDateTime: '۱۴۰۴/۰۲/۱۸ — ۱۰:۱۵',
    items: [
      { name: 'گلکسی S24 اولترا', qty: 1, priceToman: '۴٬۳۲۰٬۰۰۰', image: prd1.src },
      { name: 'آیفون ۱۵ پرو مکس', qty: 1, priceToman: '۳٬۸۰۰٬۰۰۰', image: prd2.src },
      { name: 'هواوی P10', qty: 1, priceToman: '۳٬۷۰۰٬۰۰۰', image: prd5.src },
      { name: 'آنر ۱۲۰ پرو', qty: 1, priceToman: '۳٬۷۰۰٬۰۰۰', image: prd6.src },
      { name: 'هواوی P10', qty: 1, priceToman: '۳٬۸۰۰٬۰۰۰', image: prd5.src },
    ],
  },
  {
    id: 'C-۵۷۳۳', status: 'رها شده', totalAmount: '۳۲٬۰۰۰٬۰۰۰ ت', itemsCount: 1,
    customerName: 'سارا رضایی', customerPhone: '۰۹۳۵۶۷۸۹۰۱۲',
    createdDate: '۱۴۰۴/۰۲/۱۷', createdDateTime: '۱۴۰۴/۰۲/۱۷ — ۱۶:۰۵',
    items: [
      { name: 'آیفون ۱۵ پرو مکس', qty: 1, priceToman: '۳۲٬۰۰۰٬۰۰۰', priceUsd: '۴۸۰', image: prd2.src },
    ],
  },
  {
    id: 'C-۵۶۸۹', status: 'تبدیل شده', totalAmount: '۲۸٬۰۰۰٬۰۰۰ ت', itemsCount: 1,
    customerName: 'رضا نوروزی', customerPhone: '۰۹۱۲۱۱۳۳۴۴۵',
    createdDate: '۱۴۰۴/۰۲/۱۶', createdDateTime: '۱۴۰۴/۰۲/۱۶ — ۱۸:۴۵',
    convertedDateTime: '۱۴۰۴/۰۲/۲۹ — ۱۱:۳۶',
    items: [
      { name: 'گلکسی S24 اولترا', qty: 1, priceToman: '۲۸٬۰۰۰٬۰۰۰', image: prd1.src },
    ],
  },
  {
    id: 'C-۵۵۹۲', status: 'رها شده', totalAmount: '۱۷٬۵۰۰٬۰۰۰ ت', itemsCount: 2,
    customerName: 'لیلا حسینی', customerPhone: '۰۹۱۷۸۹۴۵۶۱۲',
    createdDate: '۱۴۰۴/۰۲/۱۶', createdDateTime: '۱۴۰۴/۰۲/۱۶ — ۰۹:۴۰',
    items: [
      { name: 'هواوی P10', qty: 1, priceToman: '۹٬۵۰۰٬۰۰۰', image: prd5.src },
      { name: 'آنر ۱۲۰ پرو', qty: 1, priceToman: '۸٬۰۰۰٬۰۰۰', image: prd6.src },
    ],
  },
  {
    id: 'C-۵۶۴۷', status: 'تبدیل شده', totalAmount: '۲۱٬۷۳۵٬۰۰۰ ت', itemsCount: 4,
    customerName: 'امیرحسین احمدی', customerPhone: '۰۹۳۸۶۵۴۷۲۱۰',
    createdDate: '۱۴۰۴/۰۲/۱۵', createdDateTime: '۱۴۰۴/۰۲/۱۵ — ۱۳:۲۰',
    convertedDateTime: '۱۴۰۴/۰۲/۱۹ — ۱۰:۰۲',
    items: [
      { name: 'گلکسی S24 اولترا', qty: 1, priceToman: '۶٬۷۳۵٬۰۰۰', image: prd1.src },
      { name: 'آیفون ۱۵ پرو مکس', qty: 1, priceToman: '۵٬۰۰۰٬۰۰۰', image: prd2.src },
      { name: 'هواوی P10', qty: 1, priceToman: '۵٬۰۰۰٬۰۰۰', image: prd5.src },
      { name: 'آنر ۱۲۰ پرو', qty: 1, priceToman: '۵٬۰۰۰٬۰۰۰', image: prd6.src },
    ],
  },
]

export interface AbandonedCartStat {
  label: string
  value: string
  valueColor?: string
  trend?: { value: string; colorPalette: string }
}

// RTL DOM order (اولین = راست‌ترین، طبق x نزولی از Figma): سبد رها شده → تبدیل شده به سفارش → ارزش سبدهای رها شده
export const ABANDONED_CART_STATS: AbandonedCartStat[] = [
  { label: 'سبد رها شده', value: '۴', valueColor: 'red.fg', trend: { value: '۱۰٪', colorPalette: 'red' } },
  { label: 'تبدیل شده به سفارش', value: '۱', valueColor: 'green.fg' },
  { label: 'ارزش سبدهای رها شده', value: '۵٬۵۹۰٬۰۰۰ تومان' },
]

interface FilterOption { label: string; value: string }

export const statusFilterCollection = createListCollection<FilterOption>({
  items: [
    { label: 'همه', value: 'all' },
    { label: 'رها شده', value: 'رها شده' },
    { label: 'تبدیل شده', value: 'تبدیل شده' },
  ],
})

export const dateRangeFilterCollection = createListCollection<FilterOption>({
  items: [
    { label: 'انتخاب کنید', value: 'none' },
    { label: '۷ روز', value: '7d' },
    { label: '۳۰ روز', value: '30d' },
    { label: '۳ ماه', value: '3m' },
    { label: 'بازه دلخواه', value: 'custom' },
  ],
})

// پیام Alert — رها شده (orange) / تبدیل شده (green) — عیناً از Figma
export const ABANDONED_ALERT_TEXT = 'در نسخه‌های آینده می‌توانید مستقیماً از اینجا برای این مشتری پیامک یا کد تخفیف ارسال کنید.'
export const CONVERTED_ALERT_TEXT = 'این سبد به سفارش تبدیل شده و از لیست رها شده‌ها خارج است.'
