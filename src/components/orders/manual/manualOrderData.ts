// ─── Manual order wizard — types + mock data ───────────────────────────────────
// Display strings are Persian (user-facing). Phone numbers stay Latin in data and
// are converted with toPersianDigits at render — so search can normalize either way.
import { createListCollection } from '@chakra-ui/react'
import { toLatinDigits, toPersianDigits } from '@/utils/numbers'
import prd1 from '@/assets/ManualProducts/Product-1.png'
import prd2 from '@/assets/ManualProducts/Product-2.png'
import prd3 from '@/assets/ManualProducts/Product-3.png'
import prd4 from '@/assets/ManualProducts/Product-4.png'
import prd5 from '@/assets/ManualProducts/Product-5.png'
import prd6 from '@/assets/ManualProducts/Product-6.png'
import prd7 from '@/assets/ManualProducts/Product-7.png'
import prd8 from '@/assets/ManualProducts/Product-8.png'
import prd9 from '@/assets/ManualProducts/Product-9.png'

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
  'ثبت و ایجاد لینک',
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

// ─── مرحله ۲ — انتخاب محصول ─────────────────────────────────────────────────────
// قیمت‌ها به‌صورت رشتهٔ فارسیِ آماده (بدون واحد) ذخیره می‌شن — هم‌الگو با
// src/components/products/list/data.ts (priceMain). حداقل یکی از priceToman/priceUsd هست؛
// وقتی هر دو باشن، priceToman قیمت اصلی و priceUsd به‌صورت بج خاکستری کنارش نمایش داده می‌شه.

/** یک گروهِ تنوع (مثل «رنگ» یا «حافظه داخلی») + مقادیرش — ترتیب آرایه = ترتیب راست‌به‌چپِ نمایش (اولین = راست‌ترین/پیش‌فرض) */
export interface VariantGroup {
  label: string
  options: string[]
}

export interface ManualProduct {
  id: string
  name: string
  sku: string
  image: string
  category: string
  /** فرمت‌شدهٔ فارسی، بدون « ت» — مثل '۴۵٬۰۰۰٬۰۰۰' */
  priceToman?: string
  /** فرمت‌شدهٔ فارسی، بدون «$» — مثل '۱۸۰' */
  priceUsd?: string
  hasVariety: boolean
  inventory: number
  /** فقط وقتی hasVariety=true — گروه‌های تنوع برای دیالوگ «انتخاب تنوع» (Figma node 2096:35636) */
  variantGroups?: VariantGroup[]
}

export const MANUAL_PRODUCTS: ManualProduct[] = [
  {
    id: 'mp1', name: 'گلکسی S24 اولترا', sku: 'SKU-20001', image: prd1.src, category: 'سامسونگ',
    priceToman: '۴۵٬۰۰۰٬۰۰۰', hasVariety: true, inventory: 15,
    variantGroups: [
      { label: 'رنگ', options: ['سفید', 'سیلور', 'مشکی'] },
      { label: 'حافظه داخلی', options: ['۲۵۶ گیگابایت', '۵۱۲ گیگابایت', '۱ ترابایت'] },
    ],
  },
  {
    id: 'mp2', name: 'آیفون ۱۵ پرو مکس', sku: 'SKU-20002', image: prd2.src, category: 'اپل',
    priceToman: '۴۲٬۳۰۰٬۰۰۰', priceUsd: '۱۸۰', hasVariety: true, inventory: 8,
    variantGroups: [
      { label: 'رنگ', options: ['تیتانیوم طبیعی', 'تیتانیوم مشکی', 'تیتانیوم آبی'] },
      { label: 'حافظه داخلی', options: ['۲۵۶ گیگابایت', '۵۱۲ گیگابایت', '۱ ترابایت'] },
    ],
  },
  { id: 'mp3', name: 'شیائومی ۱۴ پرو',     sku: 'SKU-20003', image: prd3.src, category: 'شیائومی',  priceToman: '۳۲٬۰۰۰٬۰۰۰',                  hasVariety: false, inventory: 12 },
  { id: 'mp4', name: 'ردمی نوت ۱۳ پرو',    sku: 'SKU-20004', image: prd4.src, category: 'ردمی',     priceToman: '۲۸٬۰۰۰٬۰۰۰',                  hasVariety: false, inventory: 10 },
  {
    id: 'mp5', name: 'هوآوی پیکس ۷۰ پرو', sku: 'SKU-20005', image: prd5.src, category: 'هوآوی',
    priceToman: '۳۶٬۵۰۰٬۰۰۰', priceUsd: '۱۲۰', hasVariety: true, inventory: 8,
    variantGroups: [
      { label: 'رنگ', options: ['سفید', 'مشکی'] },
      { label: 'حافظه داخلی', options: ['۲۵۶ گیگابایت', '۵۱۲ گیگابایت'] },
    ],
  },
  { id: 'mp6', name: 'آنر ۱۲۰ پرو',        sku: 'SKU-20006', image: prd6.src, category: 'آنر',     priceToman: '۳۱٬۷۰۰٬۰۰۰', priceUsd: '۱۳۵', hasVariety: false, inventory: 29 },
  { id: 'mp7', name: 'گلکسی A55',          sku: 'SKU-20007', image: prd7.src, category: 'سامسونگ', priceToman: '۸۹٬۰۰۰٬۰۰۰',                  hasVariety: false, inventory: 23 },
  {
    id: 'mp8', name: 'ویوو V29', sku: 'SKU-20008', image: prd8.src, category: 'ویوو',
    priceToman: '۳۸٬۰۰۰٬۰۰۰', hasVariety: true, inventory: 42,
    variantGroups: [
      { label: 'رنگ', options: ['طلایی', 'مشکی'] },
      { label: 'حافظه داخلی', options: ['۱۲۸ گیگابایت', '۲۵۶ گیگابایت'] },
    ],
  },
  { id: 'mp9', name: 'نوکیا ۳.۴',          sku: 'SKU-20009', image: prd9.src, category: 'نوکیا',   priceToman: '۱۸٬۸۰۰٬۰۰۰', priceUsd: '۸۰',  hasVariety: false, inventory: 2 },
]

export const MANUAL_PRODUCT_CATEGORIES = createListCollection<{ label: string; value: string }>({
  items: [
    { label: 'همه دسته بندی ها', value: 'all' },
    ...Array.from(new Set(MANUAL_PRODUCTS.map((p) => p.category))).map((c) => ({ label: c, value: c })),
  ],
})

// ─── مرحله ۳ — روش ارسال ────────────────────────────────────────────────────────

export interface ShippingMethod {
  id: string
  title: string
  duration: string
  /** برچسبِ آبی (بین‌شهری/درون‌شهری) — بجِ «پیش کرایه» ثابت است و برای همهٔ روش‌ها نمایش داده می‌شود */
  distanceTag: string
  price: number
}

export const MANUAL_SHIPPING_METHODS: ShippingMethod[] = [
  { id: 'sm1', title: 'پست سفارشی', duration: 'تحویل ۳ تا ۵ روز کاری', distanceTag: 'بین شهری',  price: 90000 },
  { id: 'sm2', title: 'پست پیشتاز', duration: 'تحویل ۲ تا ۳ روز کاری', distanceTag: 'درون شهری', price: 160000 },
  { id: 'sm3', title: 'تیپاکس',     duration: 'تحویل ۱ تا ۲ روز کاری', distanceTag: 'بین شهری',  price: 220000 },
  { id: 'sm4', title: 'پیک موتوری', duration: 'تحویل همان روز',        distanceTag: 'درون شهری', price: 350000 },
]

// ─── مرحله ۴ — اعمال تخفیف ──────────────────────────────────────────────────────

export interface ManualDiscount {
  id: string
  title: string
  code: string
  /** خط دومِ اطلاعات — سقف تخفیف یا مبلغ ثابت، متنِ آماده مطابق Figma */
  detail: string
  badgeLabel: string
  /** مبلغِ تخفیف برای این سفارش — لاتین، برای جمع + نمایش با formatToman */
  amount: number
}

export const MANUAL_DISCOUNTS: ManualDiscount[] = [
  { id: 'd1', title: 'جشنواره عیدانه موبایل',      code: 'EID15TY', detail: 'سقف: ۱۵۰٬۰۰۰',  badgeLabel: '۱۵٪', amount: 19_740_000 },
  { id: 'd2', title: 'پروموشن ویژه عید',            code: 'PRM25',   detail: '۵۰٬۰۰۰ تومان',  badgeLabel: '۲۵٪', amount: 50_000 },
  { id: 'd3', title: 'همکاری در فروش کیف و کفش',    code: 'COOP20',  detail: 'سقف: ۱۰۰٬۰۰۰',  badgeLabel: '۲۰٪', amount: 13_455_000 },
]

export const MANUAL_PROVINCES = createListCollection<{ label: string; value: string }>({
  items: [
    'تهران', 'اصفهان', 'فارس', 'خراسان رضوی', 'آذربایجان شرقی',
    'مازندران', 'گیلان', 'کرمان', 'خوزستان', 'البرز',
  ].map((p) => ({ label: p, value: p })),
})

export const MANUAL_CITIES = createListCollection<{ label: string; value: string }>({
  items: [
    'تهران', 'مشهد', 'اصفهان', 'شیراز', 'تبریز',
    'کرج', 'اهواز', 'قم', 'کرمانشاه', 'ارومیه',
  ].map((c) => ({ label: c, value: c })),
})

/**
 * یک ردیفِ سبدِ محصولِ انتخاب‌شده در ویزارد (مرحله ۲).
 * برای محصولِ hasVariety، هر ترکیب تنوع (مثل «سفید + ۲۵۶ گیگابایت») ردیف جداگانه‌ای
 * است — به همین خاطر `id` مستقل از `productId` است (چند ردیف می‌توانند یک productId
 * مشترک با variantLabels متفاوت داشته باشند).
 */
export interface SelectedProductLine {
  id: string
  productId: string
  quantity: number
  /** یک برچسب به‌ازای هر گروه تنوعِ انتخاب‌شده — مثل ['سفید', '۲۵۶ گیگابایت'] */
  variantLabels?: string[]
}

/** id پایدار برای یک ترکیب تنوعِ خاص — برای merge کردن کلیک‌های تکراریِ «افزودن تنوع» با همان انتخاب */
export function variantLineId(productId: string, variantLabels?: string[]): string {
  return variantLabels && variantLabels.length > 0 ? `${productId}::${variantLabels.join('|')}` : productId
}

/** لاتینِ تمیز → فارسیِ گروه‌بندی‌شده با «٬» (بدون واحد) — هم‌الگو با NumberField */
export function formatToman(n: number): string {
  return toPersianDigits(Math.max(0, Math.round(n)).toLocaleString('en-US').replace(/,/g, '٬'))
}

/** فارسیِ گروه‌بندی‌شده → عدد لاتین، برای جمع‌زدن */
export function tomanToNumber(display: string): number {
  return Number(toLatinDigits(display).replace(/[^\d]/g, '')) || 0
}
