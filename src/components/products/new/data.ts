import { createListCollection } from '@chakra-ui/react'
import { optionsForCategory } from './categoryKnowledge'
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
  { value: 'sports',   label: 'ورزش و سفر',                        pricingMode: 'standard' },
  { value: 'toys',     label: 'اسباب‌بازی و کودک',                  pricingMode: 'standard' },
  { value: 'books',    label: 'کتاب و لوازم‌التحریر',               pricingMode: 'standard' },
  { value: 'food',     label: 'خوراک و نوشیدنی',                    pricingMode: 'standard' },
  { value: 'auto',     label: 'خودرو و ابزار',                      pricingMode: 'standard' },
  { value: 'pets',     label: 'حیوانات خانگی',                      pricingMode: 'standard' },
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
  /** متن جایگزین تصویر — هم برای دسترس‌پذیری، هم مبنای بررسی سئوی تصاویر */
  alt: string
  /** کپشن نمایشی زیر تصویر در صفحهٔ محصول */
  caption: string
}

// ─── پوشه‌های کتابخانهٔ رسانه ────────────────────────────────────────────────────
// پوشه‌ها فقط برای نظم کتابخانه‌اند؛ فایل را جابه‌جا نمی‌کنند و همان رسانه می‌تواند
// در محصولات دیگر هم استفاده شود (همان قرارداد طرح تأییدشده).
// شناسهٔ پوشه رشته است چون کاربر می‌تواند پوشهٔ تازه بسازد؛ سه‌تای اول پیش‌فرض‌اند.
export type MediaFolderId = string

export interface MediaFolder {
  id: MediaFolderId
  label: string
}

export const DEFAULT_MEDIA_FOLDERS: MediaFolder[] = [
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

// ─── پیشنهادهای تنوع بر اساس دسته‌بندی ──────────────────────────────────────────
// خواستهٔ بند ۱۱ دور «چاکرا طراح»: این فهرست باید از بک‌اند بیاید. فعلاً آرایهٔ
// داخلی است تا با تعویض منبع (یک fetch) بدون تغییر UI جایگزین شود.
/**
 * پیشنهاد تنوع — حالا از درخت دانشِ دسته‌بندی می‌آید، نه از یک لیست جدا.
 *
 * `suggestionsFor` فقط عنوان‌های **پرکاربرد** (`primary`) را می‌دهد چون نوار
 * پیشنهاد جا ندارد؛ لیست کامل پشت «انتخاب سفارشی» باز می‌شود.
 */
export function suggestionsFor(category: string): string[] {
  return optionsForCategory(category).filter((o) => o.primary).map((o) => o.title)
}

/** همهٔ عنوان‌های تنوعِ همین دسته — برای دیالوگ «انتخاب سفارشی» */
export function allSuggestionsFor(category: string): string[] {
  return optionsForCategory(category).map((o) => o.title)
}

// ─── Variants (تب تنوع‌ها) ────────────────────────────────────────────────────────
export const MAX_VARIANTS = 2

export interface VariantValueItem {
  id: string
  label: string
  /** رنگ سواچ — فقط برای تنوع‌های رنگی. مبنای ته‌رنگ ردیف‌های جدول مدل‌ها هم هست. */
  color?: string
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
export const newVariantValue = (label: string, color?: string): VariantValueItem => ({
  id: `value_${++_valueId}`,
  label,
  color,
})

// ─── رنگ‌های شناخته‌شده ──────────────────────────────────────────────────────────
// وقتی عنوان تنوع «رنگ» باشد، مقدارِ تازه خودش سواچ می‌گیرد. اسم ناشناخته → خنثی،
// و کاربر می‌تواند دستی عوضش کند.
const COLOR_BY_NAME: Record<string, string> = {
  'مشکی': '#20262b', 'سیاه': '#20262b', 'سفید': '#e6e9eb', 'آبی': '#447bab',
  'قرمز': '#c0392b', 'سبز': '#2f9e6f', 'زرد': '#e2b93b', 'نارنجی': '#e07b39',
  'بنفش': '#7d5ba6', 'صورتی': '#d977a5', 'خاکستری': '#8a949b', 'نقره‌ای': '#c7ced3',
  'طلایی': '#c9a227', 'قهوه‌ای': '#7a5138', 'سرمه‌ای': '#2b3a55',
}

export const isColorOption = (title: string) => title.includes('رنگ')

export function colorForValue(label: string): string {
  return COLOR_BY_NAME[label.trim()] ?? '#9aa6ad'
}

/**
 * ته‌رنگ ردیف جدول مدل‌ها از رنگِ مقدارِ **تنوع اول** ساخته می‌شود، و داخل هر گروه
 * بین دو شفافیت متناوب می‌شود. نتیجه: ردیف‌های یک رنگ یک نوار پیوسته می‌سازند و
 * چشم گروه‌ها را بدون خط‌کشی اضافه تشخیص می‌دهد — همان رفتار نسخهٔ تأییدشده.
 */
export function rowTint(hex: string | undefined, indexInGroup: number): string {
  const h = (hex ?? '#9aa6ad').replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${indexInGroup % 2 === 0 ? 0.075 : 0.115})`
}

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
  /** قیمت پس از تخفیف — در جدول مدل‌ها ستون مستقل «تخفیف» است */
  salePrice: string
  inventory: string
}

/** ماتریس تنوع۱ × تنوع۲ (یا فقط تنوع۱ اگر تنوع دوم مقدار ندارد) */
export function buildCombinations(
  variants: ProductVariant[],
  skuBase: string,
  /** قیمت پایهٔ محصول — مدل تازه آن را به ارث می‌برد (مثل طرح تأییدشده) */
  basePrice = '',
  baseSalePrice = '',
): VariantCombination[] {
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
  // SKU باید لاتین بماند (قرارداد پروژه: کد و شناسه هرگز فارسی نمی‌شود). پس به‌جای
  // چسباندن برچسب‌های فارسی، شمارهٔ ترتیبیِ صفرپرشده می‌گیرد — همان الگوی نسخهٔ
  // تأییدشده: <base>-001، <base>-002، …
  return rows.map((row, i) => ({
    id: `combo_${row.map((v) => v.id).join('_')}`,
    values: row.map((v) => v.label),
    image: '',
    sku: `${skuBase || 'SKU'}-${String(i + 1).padStart(3, '0')}`,
    active: true,
    phoneSale: false,
    unlimitedInventory: false,
    hasDiscount: false,
    discountType: 'percent',
    discountValue: '',
    priceAfterDiscount: '',
    price: basePrice,
    salePrice: baseSalePrice,
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
  /** «قیمت با تخفیف» — در طرح تأییدشده مستقیم وارد می‌شود، نه با درصد/مبلغ تخفیف */
  salePrice: string
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
  /** هزینهٔ ثابت ارسال (تومان) — فقط وقتی shippingProfile === 'fixed' */
  shippingFixedCost: string
  shippingNote: string
  /** آیا محصول تنوع دارد؟ (از تب «تنوع‌ها» — با وجود تنوع، موجودی/قیمت سطح محصول read-only می‌شود) */
  hasVariants: boolean
  attributes: Attribute[]
  /** توضیح کوتاه — زیر نام محصول در صفحهٔ محصول و مبنای اولیهٔ توضیح متا */
  shortDescription: string
  description: string
  // ── وضعیت نمایش و فروش ──
  showInStorefront: boolean
  specialOffer: boolean
  tags: string[]
  // ── سئو ──
  seoSlug: string
  seoTitle: string
  seoDescription: string
  // ── گالری ──
  folders: MediaFolder[]
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
  salePrice: '',
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
  shippingFixedCost: '',
  shippingNote: '',
  hasVariants: false,
  attributes: [],
  shortDescription: '',
  description: '',
  showInStorefront: true,
  specialOffer: false,
  tags: [],
  seoSlug: '',
  seoTitle: '',
  seoDescription: '',
  folders: DEFAULT_MEDIA_FOLDERS,
  gallery: [],
  variants: [],
  combinations: [],
}

// ─── بررسی‌های سئو ───────────────────────────────────────────────────────────────
// هر بررسی روی **دادهٔ واقعی همین فرم** انجام می‌شود، نه یک امتیاز ساختگی. هر مورد
// مرحله‌ای را می‌شناسد که باید برای رفعش رفت — بند ۹ دور «چاکرا اصلاح»: کلیک روی
// هشدار باید کاربر را مستقیم به بخش مرتبط ببرد.
export interface SeoCheck {
  id: string
  label: string
  /** چه چیزی لازم است — زیر عنوان مورد نمایش داده می‌شود */
  hint: string
  /** مرحله‌ای که این مورد آنجا رفع می‌شود */
  step: StepId
  /** آیا با دادهٔ فعلی فرم تأمین شده است؟ */
  ok: (f: ProductForm) => boolean
}

export const SEO_CHECKS: SeoCheck[] = [
  {
    id: 'slug', label: 'آدرس صفحه محصول', hint: 'یک آدرس لاتین کوتاه و خوانا',
    step: 'seo', ok: (f) => f.seoSlug.trim().length > 0,
  },
  {
    id: 'title', label: 'عنوان سئو', hint: 'بین ۱۰ تا ۶۰ کاراکتر',
    step: 'seo', ok: (f) => { const n = f.seoTitle.trim().length; return n >= 10 && n <= 60 },
  },
  {
    id: 'meta', label: 'توضیح متا', hint: 'بین ۵۰ تا ۱۶۵ کاراکتر',
    step: 'seo', ok: (f) => { const n = f.seoDescription.trim().length; return n >= 50 && n <= 165 },
  },
  {
    id: 'images', label: 'تصاویر محصول', hint: 'حداقل یک تصویر در گالری',
    step: 'gallery', ok: (f) => f.gallery.length > 0,
  },
  {
    id: 'alt', label: 'ALT تصاویر', hint: 'متن جایگزین برای همهٔ تصاویر',
    step: 'gallery',
    // فقط وقتی معنا دارد که تصویری هست؛ گالریِ خالی را بررسی «تصاویر محصول» می‌گیرد
    ok: (f) => f.gallery.length > 0 && f.gallery.every((img) => img.alt.trim().length > 0),
  },
  {
    id: 'category', label: 'دسته‌بندی', hint: 'برای دیده‌شدن در جست‌وجوی دسته لازم است',
    step: 'basic', ok: (f) => Boolean(f.category),
  },
  {
    id: 'tags', label: 'برچسب‌ها', hint: 'حداقل یک برچسب مرتبط',
    step: 'specs', ok: (f) => f.tags.length > 0,
  },
]

/** امتیاز ۰ تا ۱۰۰ بر اساس بررسی‌های تأمین‌شده */
export function seoScore(form: ProductForm): number {
  const passed = SEO_CHECKS.filter((c) => c.ok(form)).length
  return Math.round((passed / SEO_CHECKS.length) * 100)
}

/**
 * slug لاتینِ تمیز از نام محصول — فقط پیشنهاد، همیشه قابل ویرایش.
 *
 * عمداً فقط بخش‌های لاتین/عددیِ نام را برمی‌دارد: نام محصول معمولاً فارسی است و
 * نگه‌داشتن فارسی در URL، آدرسِ percent-encoded و ناخوانا می‌سازد — دقیقاً همان
 * چیزی که راهنمای زیر فیلد از آن پرهیز می‌دهد. اگر نام هیچ بخش لاتینی نداشت،
 * خالی برمی‌گردد تا کاربر خودش بنویسد.
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
