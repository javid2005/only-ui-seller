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
  likes: number
  dislikes: number
  /** پاسخ فروشنده — وجودش = حالت «پاسخ داده شده» */
  vendorReply?: string
  /** archived: محتوا به‌خاطر کلمات نامناسب فیلتر شده */
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
    likes: 18,
    dislikes: 7,
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
    likes: 13,
    dislikes: 5,
  },
  {
    id: 'v3',
    author: 'نیلوفر رضایی',
    date: '۱۴۰۳/۰۷/۱۵',
    rating: 5,
    text: 'عالی بود. بهترین خریدی که تا حالا کردم. حتما دوباره سفارش می‌دم.',
    images: 1,
    likes: 10,
    dislikes: 0,
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
    likes: 13,
    dislikes: 6,
  },
  {
    id: 'a2',
    author: 'نیما سهراب',
    date: '۱۴۰۳/۰۶/۲۸',
    rating: 0,
    text: '',
    filtered: true,
    images: 1,
    likes: 13,
    dislikes: 6,
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
    likes: 13,
    dislikes: 6,
  },
  {
    id: 'a4',
    author: 'آرش نیکو',
    date: '۱۴۰۳/۰۶/۱۲',
    rating: 0,
    text: '',
    filtered: true,
    likes: 13,
    dislikes: 6,
  },
]
