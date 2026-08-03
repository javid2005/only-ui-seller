// Single source of truth برای لیست کمپین‌ها — اگه جای دیگه استفاده شد، فقط همین‌جا عوض می‌شه.

export type CampaignStatus = 'فعال' | 'پایان یافته' | 'متوقف شده' | 'پیش نویس'
export type CampaignType = 'همکاری در فروش' | 'کمپین پروموشن'

export interface Campaign {
  id: string
  name: string
  type: CampaignType
  status: CampaignStatus
  startDate: string
  endDate: string
}

export const CAMPAIGN_STATUS_COLOR: Record<CampaignStatus, string> = {
  'فعال': 'green',
  'پایان یافته': 'gray',
  'متوقف شده': 'orange',
  'پیش نویس': 'blue',
}

export const CAMPAIGN_TYPE_COLOR: Record<CampaignType, string> = {
  'همکاری در فروش': 'green',
  'کمپین پروموشن': 'purple',
}

export const CAMPAIGNS: Campaign[] = [
  { id: 'c1', name: 'جشنواره عیدانه موبایل', type: 'همکاری در فروش', status: 'فعال', startDate: '۱۴۰۵/۰۲/۱۷', endDate: '۱۴۰۵/۰۳/۳۱' },
  { id: 'c2', name: 'پروموشن ویژه عید', type: 'کمپین پروموشن', status: 'پایان یافته', startDate: '۱۴۰۴/۰۲/۱۵', endDate: '۱۴۰۴/۰۸/۱۵' },
  { id: 'c3', name: 'همکاری در فروش کیف و کفش', type: 'همکاری در فروش', status: 'متوقف شده', startDate: '۱۴۰۴/۰۳/۱۰', endDate: '۱۴۰۴/۰۳/۳۰' },
  { id: 'c4', name: 'کمپین پاییزه', type: 'کمپین پروموشن', status: 'پیش نویس', startDate: '۱۴۰۴/۰۴/۰۵', endDate: '۱۴۰۴/۰۶/۱۰' },
]

// ─── محصولات (برای دیالوگ انتخاب محصول در ایجاد کمپین) ─────────────────────────

export interface CampaignProduct {
  id: string
  name: string
  price: number
  sku: string
  /** قیمت دلاری اختیاری — فقط روی بعضی محصولات نمایش داده می‌شود (مطابق طرح) */
  costUsd?: number
}

export const CAMPAIGN_PRODUCTS: CampaignProduct[] = [
  { id: 'p1', name: 'گلکسی S24 اولترا', price: 45_000_000, sku: 'SKU-10089' },
  { id: 'p2', name: 'آیفون ۱۵ پرو مکس', price: 45_000_000, sku: 'SKU-10090', costUsd: 180 },
  { id: 'p3', name: 'شیائومی ۱۴ پرو', price: 32_000_000, sku: 'SKU-10091' },
  { id: 'p4', name: 'ردمی نوت ۱۳ پرو', price: 28_000_000, sku: 'SKU-10092' },
  { id: 'p5', name: 'هواوی پیکس ۷۰ پرو', price: 45_000_000, sku: 'SKU-10093', costUsd: 120 },
  { id: 'p6', name: 'آنر ۱۲۰ پرو', price: 53_000_000, sku: 'SKU-10094', costUsd: 135 },
  { id: 'p7', name: 'گلکسی A55', price: 89_000_000, sku: 'SKU-10095' },
  { id: 'p8', name: 'ویوو V29', price: 38_000_000, sku: 'SKU-10096' },
  { id: 'p9', name: 'نوکیا ۳.۴', price: 22_000_000, sku: 'SKU-10097', costUsd: 80 },
]

export const CAMPAIGN_CATEGORY_OPTIONS = [
  { value: 'mobile', label: 'موبایل و تبلت' },
  { value: 'clothing', label: 'پوشاک' },
  { value: 'home', label: 'لوازم خانگی' },
  { value: 'beauty', label: 'آرایشی و بهداشتی' },
]
