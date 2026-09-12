import { createListCollection } from '@chakra-ui/react'
import { Images, LayoutGrid, ListChecks, Package, Pencil, Sparkles, type LucideIcon } from 'lucide-react'

// ─── Pricing mode — backend-driven trigger (per category config) ───────────────
// 'standard' → قیمت دستی · 'currency' → ارزی (نرخ زنده) · 'gold' → طلا (فرمول)
// در این پاس فقط 'standard' رندر می‌شود؛ بقیه حالت‌ها بعداً شرطی اضافه می‌شوند.
export type PricingMode = 'standard' | 'currency' | 'gold'

export interface ProductCategory {
  value: string
  label: string
  pricingMode: PricingMode
}

export const CATEGORIES: ProductCategory[] = [
  { value: 'digital',  label: 'کالای دیجیتال و لوازم الکترونیکی', pricingMode: 'standard' },
  { value: 'fashion',  label: 'مد و پوشاک',                        pricingMode: 'standard' },
  { value: 'home',     label: 'خانه و آشپزخانه',                   pricingMode: 'standard' },
  { value: 'beauty',   label: 'آرایشی و بهداشتی',                  pricingMode: 'standard' },
  { value: 'currency', label: 'کالای ارزی',                        pricingMode: 'currency' },
  { value: 'gold',     label: 'طلا و جواهرات',                     pricingMode: 'gold' },
]

export const categoryCollection = createListCollection({
  items: CATEGORIES.map((c) => ({ value: c.value, label: c.label })),
})

export function pricingModeOf(category: string): PricingMode {
  return CATEGORIES.find((c) => c.value === category)?.pricingMode ?? 'standard'
}

// ─── Currency unit (inline addon on price) ─────────────────────────────────────
export const CURRENCY_UNITS: { value: string; label: string }[] = [
  { value: 'toman', label: 'تومان' },
  { value: 'usd',   label: 'دلار'  },
]

export function currencyLabel(value: string): string {
  return CURRENCY_UNITS.find((c) => c.value === value)?.label ?? 'تومان'
}

// ─── نرخ زندهٔ دلار (mock — این پاس UI-only، بعداً از API) ────────────────────────
export const USD_RATE = 162500           // تومان به ازای هر دلار
export const USD_RATE_UPDATED = '۱۴:۳۰'  // آخرین بروزرسانی (mock)

// ─── نرخ روزِ هر گرم طلا (mock — بعداً از API) ───────────────────────────────────
export const GOLD_GRAM_PRICE = 20518000  // تومان به ازای هر گرم

// ─── Discount type (درصد / مبلغ) — inline addon on discount value ───────────────
export const DISCOUNT_TYPES: { value: string; label: string }[] = [
  { value: 'percent', label: 'درصد' },
  { value: 'amount',  label: 'مبلغ' },
]

// ─── نوع محصول (دروازهٔ ورود) ────────────────────────────────────────────────────
// انتخاب فقط ساختار قیمت/موجودی/گزینه‌های خرید را تعیین می‌کند و بعداً قابل تغییر است.
export type ProductTypeId = 'simple' | 'varied'

export interface ProductType {
  id: ProductTypeId
  label: string
  /** زیرعنوان کوتاه کنار عنوان در کارت انتخاب */
  tagline: string
  /** توضیح کامل داخل کارت */
  description: string
  /** برچسب سوییچ فشردهٔ بالای فرم */
  shortLabel: string
}

export const PRODUCT_TYPES: ProductType[] = [
  {
    id: 'simple',
    label: 'محصول ساده',
    tagline: 'بدون گزینه و تنوع',
    description:
      'برای محصولی که خریدار همان نسخه اصلی را بدون انتخاب رنگ، سایز یا مدل خریداری می‌کند.',
    shortLabel: 'ساده',
  },
  {
    id: 'varied',
    label: 'محصول متنوع',
    tagline: 'چند انتخاب برای خریدار',
    description:
      'برای محصولی که خریدار پیش از خرید بین گزینه‌هایی مثل رنگ، حافظه یا سایز انتخاب می‌کند.',
    shortLabel: 'متنوع',
  },
]

// ─── پروفایل هزینهٔ ارسال ────────────────────────────────────────────────────────
export const SHIPPING_PROFILES: { value: string; label: string }[] = [
  { value: 'store', label: 'طبق تنظیمات فروشگاه' },
  { value: 'free',  label: 'ارسال رایگان'        },
  { value: 'fixed', label: 'هزینهٔ ثابت'          },
]

// ─── Steps (نویگیشن مرحله‌ای) ───────────────────────────────────────────────────
export type StepId = 'basic' | 'gallery' | 'warehouse' | 'specs' | 'models' | 'seo'

export interface ProductStep {
  id: StepId
  /** عنوان کامل — rail عمودی و متن تولتیپ */
  label: string
  /** عنوان کوتاه — زیر آیکن در حالت افقی/فشرده (حذف نمی‌شود، فقط کوتاه می‌شود) */
  shortLabel: string
  /** آیکن مرحله — معادل lucide آیکن همین مرحله در طرح تأییدشده */
  icon: LucideIcon
}

// شش مرحله، با همان عنوان‌ها و ترتیب طرح تأییدشده. شماره جزو عنوان است چون
// خودِ ترتیب اطلاعات است، نه تزئین — کاربر با «مرحلهٔ ۳» به آن ارجاع می‌دهد.
export const STEPS: ProductStep[] = [
  { id: 'basic',     label: '۱. مشخصات اولیه',      shortLabel: 'شروع',    icon: Pencil     },
  { id: 'gallery',   label: '۲. گالری',             shortLabel: 'گالری',   icon: Images     },
  { id: 'warehouse', label: '۳. انبارداری و ارسال', shortLabel: 'انبار',   icon: Package    },
  { id: 'specs',     label: '۴. مشخصات محصول',      shortLabel: 'مشخصات',  icon: ListChecks },
  { id: 'models',    label: '۵. مدل‌ها و تنوع',      shortLabel: 'تنوع',    icon: LayoutGrid },
  { id: 'seo',       label: '۶. سئو و انتشار',      shortLabel: 'انتشار',  icon: Sparkles   },
]

// ─── Product attribute (ویژگی داینامیک) ────────────────────────────────────────
export interface Attribute {
  id: string
  name: string
  value: string
}

// ─── Gallery (تب گالری) ─────────────────────────────────────────────────────────
// محدودیت‌های نمایش‌داده‌شده در ردیف Badgeهای راهنما + اعمال در آپلود.
export const GALLERY_MAX_IMAGES = 10
export const GALLERY_MAX_IMAGE_SIZE = 2 * 1024 * 1024 // ۲ مگابایت

export interface GalleryImage {
  id: string
  /** dataURL پیش‌نمایش (این پاس UI-only؛ بعداً URL بعد از آپلود به سرور) */
  src: string
  /** نام فایل اصلی (برای API/alt) — لیبل نمایشی «تصویر N» از ایندکس ساخته می‌شود */
  fileName: string
  /** تصویر شاخص (اصلی) محصول — فقط یکی می‌تواند true باشد */
  featured: boolean
  /** تنوع‌های تخصیص‌یافته به این تصویر (label از VARIANT_GROUPS) */
  variantTags: string[]
  /** پوشهٔ کتابخانه که این رسانه در آن دیده می‌شود */
  folder: MediaFolderId
}

// ─── پوشه‌های کتابخانهٔ رسانه ────────────────────────────────────────────────────
// پوشه‌ها فقط برای نظم کتابخانه‌اند؛ فایل را جابه‌جا نمی‌کنند و همان رسانه می‌تواند
// در محصولات دیگر هم استفاده شود (همان قرارداد طرح تأییدشده).
export type MediaFolderId = 'products' | 'uncategorized' | 'library'

export interface MediaFolder {
  id: MediaFolderId
  label: string
}

export const MEDIA_FOLDERS: MediaFolder[] = [
  { id: 'products',      label: 'رسانه‌های این محصول' },
  { id: 'uncategorized', label: 'بدون پوشه'           },
  { id: 'library',       label: 'کتابخانه فروشگاه'    },
]

// ─── Variant groups (دیالوگ «انتخاب تنوع» در گالری) ──────────────────────────────
// mock — به تب «تنوع‌ها» وابسته است؛ وقتی آن تب ساخته شد این گروه‌ها از آنجا می‌آیند.
export interface VariantOption {
  value: string
  label: string
}

export interface VariantGroup {
  id: string
  label: string
  options: VariantOption[]
}

export const VARIANT_GROUPS: VariantGroup[] = [
  {
    id: 'color',
    label: 'رنگ',
    options: [
      { value: 'white', label: 'سفید' },
      { value: 'silver', label: 'سیلور' },
    ],
  },
  {
    id: 'storage',
    label: 'رم',
    options: [
      { value: '32', label: '۳۲ Mb' },
      { value: '64', label: '۶۴ Mb' },
      { value: '128', label: '۱۲۸ Mb' },
    ],
  },
]

// ─── Variants (تب تنوع‌ها) ────────────────────────────────────────────────────────
export const MAX_VARIANTS = 2

export interface VariantValueItem {
  id: string
  label: string
}

export interface ProductVariant {
  id: string
  title: string
  values: VariantValueItem[]
  /** باز/بسته بودن آکاردیون — با «ایجاد ترکیب تنوع‌ها» با انیمیشن بسته می‌شود */
  open: boolean
}

let _variantId = 0
export const newVariant = (): ProductVariant => ({
  id: `variant_${++_variantId}`,
  title: '',
  values: [],
  open: true,
})

let _valueId = 0
export const newVariantValue = (label: string): VariantValueItem => ({
  id: `value_${++_valueId}`,
  label,
})

// ─── Variant combinations (ماتریس ترکیب‌ها) ──────────────────────────────────────
export interface VariantCombination {
  id: string
  /** مقدار هر تنوع، به ترتیب form.variants — برای نمایش badge و فیلتر */
  values: string[]
  /** تصویر این ترکیب — از گالری محصول انتخاب می‌شود ('' = انتخاب‌نشده) */
  image: string
  sku: string
  active: boolean
  phoneSale: boolean
  unlimitedInventory: boolean
  hasDiscount: boolean
  discountType: string
  discountValue: string
  priceAfterDiscount: string
  price: string
  inventory: string
}

/** ماتریس تنوع۱ × تنوع۲ (یا فقط تنوع۱ اگر تنوع دوم مقدار ندارد) */
export function buildCombinations(variants: ProductVariant[], skuBase: string): VariantCombination[] {
  const dims = variants.map((v) => v.values).filter((values) => values.length > 0)
  if (dims.length === 0) return []
  let rows: VariantValueItem[][] = [[]]
  for (const values of dims) {
    const next: VariantValueItem[][] = []
    for (const row of rows) {
      for (const val of values) next.push([...row, val])
    }
    rows = next
  }
  return rows.map((row) => ({
    id: `combo_${row.map((v) => v.id).join('_')}`,
    values: row.map((v) => v.label),
    image: '',
    sku: `${skuBase || 'SKU'}-${row.map((v) => v.label.replace(/\s+/g, '')).join('-')}`,
    active: true,
    phoneSale: false,
    unlimitedInventory: false,
    hasDiscount: false,
    discountType: 'percent',
    discountValue: '',
    priceAfterDiscount: '',
    price: '',
    inventory: '',
  }))
}

// ─── Form state (UI + local state only این پاس) ─────────────────────────────────
export interface ProductForm {
  /** نوع محصول — با دیالوگ ورودی انتخاب می‌شود؛ 'varied' مرحلهٔ تنوع‌ها را باز می‌کند */
  productType: ProductTypeId
  name: string
  category: string
  sku: string
  weight: string
  price: string
  currency: string
  hasDiscount: boolean
  discountType: string
  discountValue: string
  phoneSale: boolean
  // ── طلا (فقط دستهٔ pricingMode='gold') ──
  goldWeight: string
  goldWage: string
  goldProfit: string
  goldTax: string
  inventory: string
  unlimitedInventory: boolean
  // ── ابعاد بسته (سانتی‌متر) ──
  packLength: string
  packWidth: string
  packHeight: string
  // ── تنظیمات ارسال ──
  prepDays: string
  shippingProfile: string
  shippingNote: string
  /** آیا محصول تنوع دارد؟ (از تب «تنوع‌ها» — با وجود تنوع، موجودی/قیمت سطح محصول read-only می‌شود) */
  hasVariants: boolean
  attributes: Attribute[]
  description: string
  tags: string[]
  // ── گالری ──
  gallery: GalleryImage[]
  // ── تنوع‌ها ──
  variants: ProductVariant[]
  combinations: VariantCombination[]
}

export const EMPTY_FORM: ProductForm = {
  productType: 'simple',
  name: '',
  category: '',
  sku: '',
  weight: '',
  price: '',
  currency: 'toman',
  hasDiscount: false,
  discountType: 'percent',
  discountValue: '',
  phoneSale: false,
  goldWeight: '',
  goldWage: '',
  goldProfit: '',
  goldTax: '10',
  inventory: '',
  unlimitedInventory: false,
  packLength: '',
  packWidth: '',
  packHeight: '',
  prepDays: '1',
  shippingProfile: 'store',
  shippingNote: '',
  hasVariants: false,
  attributes: [],
  description: '',
  tags: [],
  gallery: [],
  variants: [],
  combinations: [],
}
