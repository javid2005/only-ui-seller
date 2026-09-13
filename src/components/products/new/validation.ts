import { pricingModeOf, type ProductForm, type StepId } from './data'

// ─── اعتبارسنجی فرم محصول ───────────────────────────────────────────────────────
/**
 * یک منبع واحد برای «چه چیزی هنوز ناقص است».
 *
 * هر ایراد می‌داند در کدام **مرحله** و کدام **فیلد** است، چون قرار است کاربر با یک
 * کلیک همان‌جا برود. بدون این دو، پیام خطا فقط یک جملهٔ ناامیدکننده است.
 *
 * `field` همان مقداری است که روی عنصر با `data-field` نشسته؛ نگاشتش در
 * `focusField.ts` انجام می‌شود.
 */

export interface FieldIssue {
  id: string
  /** نام فیلد، همان‌طور که کاربر در فرم می‌بیند */
  label: string
  /** چه چیزی لازم است */
  message: string
  step: StepId
  /** کلید `data-field` برای پرش و چشمک */
  field: string
}

export function validateProduct(form: ProductForm): FieldIssue[] {
  const issues: FieldIssue[] = []
  const isGold = pricingModeOf(form.category) === 'gold'

  if (!form.name.trim()) {
    issues.push({ id: 'name', label: 'نام محصول', message: 'نام محصول را بنویسید.', step: 'basic', field: 'name' })
  }
  if (!form.category) {
    issues.push({ id: 'category', label: 'دسته‌بندی', message: 'یک دسته‌بندی انتخاب کنید.', step: 'basic', field: 'category' })
  }

  const priceFilled = isGold ? form.goldWeight.trim() : form.price.trim()
  if (!form.phoneSale && !form.hasVariants && !priceFilled) {
    issues.push({
      id: 'price',
      label: isGold ? 'وزن طلا' : 'قیمت اصلی',
      message: isGold ? 'وزن طلا را وارد کنید تا قیمت محاسبه شود.' : 'قیمت اصلی را وارد کنید.',
      step: 'basic',
      field: isGold ? 'goldWeight' : 'price',
    })
  }

  const sale = Number(form.salePrice)
  const base = Number(form.price)
  if (form.salePrice.trim() && base > 0 && sale >= base) {
    issues.push({
      id: 'salePrice',
      label: 'قیمت با تخفیف',
      message: 'قیمت با تخفیف باید کمتر از قیمت اصلی باشد.',
      step: 'basic',
      field: 'salePrice',
    })
  }

  if (form.gallery.length === 0) {
    issues.push({ id: 'gallery', label: 'گالری', message: 'حداقل یک تصویر اضافه کنید.', step: 'gallery', field: 'gallery' })
  }

  if (!form.sku.trim()) {
    issues.push({ id: 'sku', label: 'شناسه / SKU', message: 'شناسهٔ کالا نمی‌تواند خالی باشد.', step: 'warehouse', field: 'sku' })
  }
  if (!form.unlimitedInventory && !form.hasVariants && !form.inventory.trim()) {
    issues.push({ id: 'inventory', label: 'موجودی اولیه', message: 'موجودی را وارد کنید یا «نامحدود» را روشن کنید.', step: 'warehouse', field: 'inventory' })
  }
  if (form.shippingProfile === 'fixed' && !form.shippingFixedCost.trim()) {
    issues.push({ id: 'shippingFixedCost', label: 'هزینهٔ ثابت ارسال', message: 'مبلغ هزینهٔ ثابت ارسال را وارد کنید.', step: 'warehouse', field: 'shippingFixedCost' })
  }

  if (!form.seoSlug.trim()) {
    issues.push({ id: 'seoSlug', label: 'آدرس صفحه محصول', message: 'آدرس صفحه نمی‌تواند خالی باشد.', step: 'seo', field: 'seoSlug' })
  }

  /**
   * مدل‌های فعالِ بی‌قیمت.
   *
   * سه استثنا، چون در هیچ‌کدام قیمتِ مدل معنا ندارد:
   *   • فروش تلفنیِ کلِ محصول روشن است → هیچ قیمتی نمایش داده نمی‌شود.
   *   • همان مدل فروش تلفنی دارد → استثنای تک‌مدلی، از تنظیمات همان ردیف.
   *   • خودِ محصول هم قیمت ندارد → ایرادِ اصلی «قیمت اصلی» است، نه مدل‌ها؛
   *     دوبار گفتنش فقط فهرست خطا را شلوغ می‌کند.
   */
  const pricelessModels = form.combinations.filter(
    (c) => c.active && !c.phoneSale && !c.price.trim(),
  )
  if (form.hasVariants && !form.phoneSale && form.price.trim() && pricelessModels.length > 0) {
    issues.push({
      id: 'modelPrices',
      label: 'قیمت مدل‌ها',
      message: `${pricelessModels.length} مدل فعال بدون قیمت است. برای هر کدام قیمت بگذارید یا از ⋮ همان ردیف «فروش تلفنی» را روشن کنید.`,
      step: 'models',
      field: 'modelsTable',
    })
  }

  return issues
}
