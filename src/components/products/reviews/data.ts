import { createListCollection } from '@chakra-ui/react'

export type FilterOption = { label: string; value: string }

/** فیلتر امتیاز — گزینه‌ها از Figma (Select.Content) */
export const ratingCollection = createListCollection<FilterOption>({
  items: [
    { label: 'امتیاز', value: 'all' },
    { label: 'بدون ستاره', value: '0' },
    { label: 'کمتر از ۳ ستاره', value: 'lt3' },
    { label: '۳ ستاره', value: '3' },
    { label: '۴ ستاره', value: '4' },
    { label: '۵ ستاره', value: '5' },
  ],
})

/** ۴ وضعیت نظر — Figma «Comment» prop `type` (node 2547:52028) */
export type ReviewStatus = 'pending' | 'verified' | 'archived' | 'deleted'

/** ترتیب تب‌ها = ترتیب راست‌به‌چپ در screenshot صفحه (node 5288:78902 / 5291:81754) */
export const STATUS_ORDER: ReviewStatus[] = ['pending', 'verified', 'archived', 'deleted']

export const STATUS_LABEL: Record<ReviewStatus, string> = {
  pending: 'در انتظار تایید',
  verified: 'تایید شده',
  archived: 'آرشیو شده',
  deleted: 'حذف شده',
}

export const STATUS_COLOR: Record<ReviewStatus, string> = {
  pending: 'orange',
  verified: 'green',
  archived: 'blue',
  deleted: 'red',
}

export interface Review {
  id: string
  author: string
  /** تاریخ شمسی نمایشی */
  date: string
  /** زمان نسبی مثل «یک دقیقه پیش» */
  relativeTime?: string
  /** امتیاز ۰..۵ */
  rating: number
  /** خریدار تایید شده */
  verifiedBuyer?: boolean
  /** برچسب تنوع کالا (مثل «قرمز / XL») */
  variant?: string
  /** متن نظر */
  text: string
  /** تصاویر پیوست‌شده به نظر (تعداد thumbnail) */
  images?: number
  /** پاسخ فروشنده — وجودش = حالت «پاسخ داده شده» (فقط verified) */
  vendorReply?: string
  /** archived: محتوا به‌خاطر کلمات نامناسب فیلتر شده (فقط archived — طبق Comment component، pending/deleted این حالت رو ندارن) */
  filtered?: boolean
}

/** نظرات تایید شده (تب تایید شده) */
export const VERIFIED_REVIEWS: Review[] = [
  {
    id: 'v1',
    author: 'سارا احمدی',
    date: '۱۴۰۳/۰۷/۱۲',
    relativeTime: 'یک دقیقه پیش',
    rating: 5,
    verifiedBuyer: true,
    variant: 'قرمز / XL',
    text: 'کیفیت جنس واقعا خوبه، دوخت محکم و دقیقا مثل عکس. فقط سایزبندی به کم بزرگ‌تر از حد معمول بود، بهتره به سایر کوچک‌تر سفارش بدید. در کل راضی‌ام و پیشنهاد می‌کنم.',
    images: 3,
  },
  {
    id: 'v2',
    author: 'آرش نیکو',
    date: '۱۴۰۳/۰۷/۱۲',
    relativeTime: 'یک ساعت پیش',
    rating: 4,
    verifiedBuyer: true,
    variant: 'آبی / L',
    text: 'ارسال سریع بود ولی بسته‌بندی می‌تونست بهتر باشه. محصول خودش خوبه.',
  },
  {
    id: 'v3',
    author: 'نیلوفر رضایی',
    date: '۱۴۰۳/۰۷/۱۵',
    rating: 5,
    text: 'عالی بود. بهترین خریدی که تا حالا کردم. حتما دوباره سفارش می‌دم.',
    images: 1,
    vendorReply: 'ممنون از خرید و نظر سازنده‌تون. راهنمایی سایزبندی در صفحه محصول به‌زودی کامل‌تر می‌شه.',
  },
]

/** نظرات آرشیو شده (تب آرشیو شده) */
export const ARCHIVED_REVIEWS: Review[] = [
  {
    id: 'a1',
    author: 'کامران آریا',
    date: '۱۴۰۳/۰۶/۲۳',
    rating: 0,
    text: '',
    filtered: true,
  },
  {
    id: 'a2',
    author: 'نیما سهراب',
    date: '۱۴۰۳/۰۶/۲۸',
    rating: 0,
    text: '',
    filtered: true,
    images: 1,
  },
  {
    id: 'a3',
    author: 'فراز کیوان',
    date: '۱۴۰۳/۰۶/۱۵',
    relativeTime: 'یک هفته پیش',
    rating: 4,
    verifiedBuyer: true,
    text: '',
    filtered: true,
  },
  {
    id: 'a4',
    author: 'آرش نیکو',
    date: '۱۴۰۳/۰۶/۱۲',
    rating: 0,
    text: '',
    filtered: true,
  },
]

/** نظرات در انتظار تایید (تب در انتظار تایید) — Figma node 5288:78902 */
export const PENDING_REVIEWS: Review[] = [
  {
    id: 'p1',
    author: 'سارا احمدی',
    date: '۱۴۰۳/۰۲/۱۲',
    rating: 4,
    verifiedBuyer: true,
    variant: 'مشکی / L',
    text: 'کیفیت جنس واقعاً خوبه، دوخت محکم و رنگ دقیقاً مثل عکس. فقط سایزبندی یه کم بزرگ‌تر از حد معمول بود، بهتره یه سایز کوچیک‌تر سفارش بدید. در کل راضی‌ام و پیشنهاد می‌کنم.',
    images: 3,
  },
  {
    id: 'p2',
    author: 'آرش نیکو',
    date: '۱۴۰۳/۰۱/۲۸',
    rating: 1,
    verifiedBuyer: true,
    variant: 'سفید / M',
    text: 'ارسال سریع بود ولی بسته‌بندی می‌تونست بهتر باشه. محصول خودش خوبه.',
  },
  {
    id: 'p3',
    author: 'نیلوفر رضایی',
    date: '۱۴۰۳/۰۳/۰۵',
    rating: 4,
    text: 'عالی بود. بهترین خریدی که تا حالا کردم. حتماً دوباره سفارش می‌دم.',
    images: 1,
  },
]

/** نظرات حذف شده (تب حذف شده) — Figma node 5291:81754 */
export const DELETED_REVIEWS: Review[] = [
  {
    id: 'd1',
    author: 'کامران آریا',
    date: '۱۴۰۳/۰۲/۱۲',
    rating: 0,
    text: 'محصول با عکس فرق داشت، خیلی راضی نبودم.',
  },
  {
    id: 'd2',
    author: 'نیما سهراب',
    date: '۱۴۰۳/۰۱/۲۸',
    rating: 0,
    text: 'ارسال دیر شد و بسته‌بندی آسیب دیده بود.',
    images: 1,
  },
  {
    id: 'd3',
    author: 'فرزاد کیوان',
    date: '۱۴۰۳/۰۳/۰۵',
    rating: 4,
    verifiedBuyer: true,
    variant: 'سفید / M',
    text: 'کیفیت خوب بود، پیشنهاد می‌کنم بخرید.',
  },
  {
    id: 'd4',
    author: 'آرش نیکو',
    date: '۱۴۰۳/۱۱/۰۶',
    rating: 1,
    text: 'اصلاً راضی نبودم، سایزبندی درست نبود.',
  },
]

export const REVIEWS_BY_STATUS: Record<ReviewStatus, Review[]> = {
  pending: PENDING_REVIEWS,
  verified: VERIFIED_REVIEWS,
  archived: ARCHIVED_REVIEWS,
  deleted: DELETED_REVIEWS,
}
