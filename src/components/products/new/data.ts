import { createListCollection } from '@chakra-ui/react'

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

// ─── Steps (نویگیشن مرحله‌ای) ───────────────────────────────────────────────────
export type StepId = 'info' | 'gallery' | 'variants'

export interface ProductStep {
  id: StepId
  label: string
}

export const STEPS: ProductStep[] = [
  { id: 'info',     label: 'اطلاعات محصول' },
  { id: 'gallery',  label: 'گالری'         },
  { id: 'variants', label: 'تنوع ها'       },
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
}

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
  hasVariants: false,
  attributes: [],
  description: '',
  tags: [],
  gallery: [],
  variants: [],
  combinations: [],
}
