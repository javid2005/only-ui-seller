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
  inventory: string
  unlimitedInventory: boolean
  /** آیا محصول تنوع دارد؟ (از تب «تنوع‌ها» — با وجود تنوع، موجودی/قیمت سطح محصول read-only می‌شود) */
  hasVariants: boolean
  attributes: Attribute[]
  description: string
  tags: string[]
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
  inventory: '',
  unlimitedInventory: false,
  hasVariants: false,
  attributes: [],
  description: '',
  tags: [],
}
