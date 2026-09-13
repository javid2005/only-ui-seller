import { currencyLabel, pricingModeOf, type ProductForm } from './data'
import { productSlug, MOCK_PRODUCT_ID } from './identity'

// ─── اسکیمای محصول (schema.org / JSON-LD) ───────────────────────────────────────
/**
 * ساختِ نشانه‌گذاریِ ساختاریافتهٔ صفحهٔ محصول.
 *
 * چرا: نتیجهٔ گوگل برای یک صفحهٔ محصول بدون اسکیما فقط عنوان و توضیح است؛ با
 * اسکیما قیمت، موجودی، امتیاز و تعداد نظر هم در همان نتیجه دیده می‌شود. این
 * تفاوت مستقیم روی نرخ کلیک اثر دارد و کاری است که سمت فروشنده لازم ندارد
 * انجام شود — از همین داده‌های فرم ساخته می‌شود.
 *
 * قواعدی که رعایت شده‌اند (وگرنه گوگل کل بلاک را نادیده می‌گیرد):
 *  • `offers.price` باید عددِ خام لاتین باشد، نه متنِ فرمت‌شدهٔ فارسی.
 *  • `priceCurrency` کد ISO است: تومان → IRR، دلار → USD.
 *  • `availability` یکی از URLهای schema.org است، نه متن آزاد.
 *  • فیلد خالی **حذف** می‌شود، نه اینکه با رشتهٔ تهی بیاید.
 *  • محصول متنوع `ProductGroup` می‌شود با `hasVariant` — نه چند Product جدا.
 *
 * خروجی یک آبجکت ساده است تا هم در `<script type="application/ld+json">` صفحهٔ
 * محصول برود و هم در همین فرم پیش‌نمایش داده شود.
 */

const SITE = 'https://vitrina.ir'

/** واحد فرم → کد ارز ISO 4217 */
function currencyCode(unit: string): string {
  return unit === 'usd' ? 'USD' : 'IRR'
}

function availability(form: ProductForm): string {
  if (form.phoneSale) return 'https://schema.org/InStoreOnly'
  if (form.unlimitedInventory) return 'https://schema.org/InStock'
  const stock = form.hasVariants
    ? form.combinations.reduce((sum, c) => sum + (Number(c.inventory) || 0), 0)
    : Number(form.inventory) || 0
  return stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
}

/** متن HTML توضیحات → متن ساده (اسکیما تگ نمی‌خواهد) */
function plainText(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

/** مشخصه‌های محصول → PropertyValue، همان چیزی که گوگل برای مقایسه می‌خواند */
function propertyValues(form: ProductForm) {
  return form.attributes
    .filter((a) => a.name.trim() && a.value.trim())
    .map((a) => ({ '@type': 'PropertyValue', name: a.name.trim(), value: a.value.trim() }))
}

function offerFor(price: string, salePrice: string, form: ProductForm, url: string) {
  const effective = salePrice.trim() || price.trim()
  if (!effective) return undefined
  return {
    '@type': 'Offer',
    url,
    priceCurrency: currencyCode(form.currency),
    price: effective,
    availability: availability(form),
    ...(form.salePriceUntil ? { priceValidUntil: form.salePriceUntil } : {}),
  }
}

export function buildProductSchema(form: ProductForm, productId = MOCK_PRODUCT_ID): Record<string, unknown> {
  const slug = form.seoSlug.trim() || productSlug(productId)
  const url = `${SITE}/product/${slug}`
  const name = form.seoTitle.trim() || form.name.trim() || 'نام محصول'
  const description = form.seoDescription.trim() || plainText(form.description) || form.shortDescription.trim()

  const images = form.gallery.map((img) => `${SITE}/media/${img.fileName}`)
  const brand = form.attributes.find((a) => a.name.trim() === 'برند')?.value.trim()
  const props = propertyValues(form)

  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': form.hasVariants ? 'ProductGroup' : 'Product',
    name,
    url,
    ...(description ? { description } : {}),
    ...(images.length > 0 ? { image: images } : {}),
    ...(brand ? { brand: { '@type': 'Brand', name: brand } } : {}),
    ...(form.sku.trim() ? { sku: form.sku.trim() } : {}),
    ...(form.category ? { category: form.category } : {}),
    ...(props.length > 0 ? { additionalProperty: props } : {}),
  }

  if (form.hasVariants) {
    // ProductGroup: محورهای تنوع + هر مدل به‌عنوان یک Product زیرمجموعه
    const axes = form.variants.filter((v) => v.values.length > 0).map((v) => v.title.trim()).filter(Boolean)
    base.productGroupID = form.sku.trim() || productSlug(productId)
    if (axes.length > 0) base.variesBy = axes
    base.hasVariant = form.combinations
      .filter((c) => c.active)
      .map((c) => ({
        '@type': 'Product',
        name: `${name} — ${c.values.join(' / ')}`,
        sku: c.sku,
        ...(c.image ? { image: `${SITE}/media/${c.image}` } : {}),
        ...(offerFor(c.price, c.salePrice, form, url) ? { offers: offerFor(c.price, c.salePrice, form, url) } : {}),
      }))
  } else {
    const offer = offerFor(form.price, form.salePrice, form, url)
    if (offer) base.offers = offer
  }

  // امتیاز و نظرات از سمت فروشگاه می‌آید، نه از این فرم — جای ثابتش اینجاست تا
  // موقع اتصال به بک‌اند معلوم باشد کجا تزریق می‌شود.
  // base.aggregateRating = { '@type': 'AggregateRating', ratingValue, reviewCount }

  if (pricingModeOf(form.category) === 'gold' && form.goldWeight.trim()) {
    base.weight = { '@type': 'QuantitativeValue', value: form.goldWeight.trim(), unitCode: 'GRM' }
  } else if (form.weight.trim()) {
    base.weight = { '@type': 'QuantitativeValue', value: form.weight.trim(), unitCode: 'GRM' }
  }

  return base
}

/** خروجی آمادهٔ چسباندن در `<script type="application/ld+json">` */
export function productSchemaJson(form: ProductForm): string {
  return JSON.stringify(buildProductSchema(form), null, 2)
}

/** چند نکتهٔ خوانا برای نمایش در فرم — «چه چیزی در گوگل فعال می‌شود» */
export function schemaHighlights(form: ProductForm): { label: string; ok: boolean; hint: string }[] {
  const schema = buildProductSchema(form)
  const unit = currencyLabel(form.currency)
  return [
    { label: 'قیمت در نتیجهٔ جست‌وجو', ok: Boolean(schema.offers || schema.hasVariant), hint: `با واحد ${unit}` },
    { label: 'وضعیت موجودی', ok: Boolean(schema.offers || schema.hasVariant), hint: 'موجود / ناموجود' },
    { label: 'تصویر محصول', ok: Array.isArray(schema.image) && schema.image.length > 0, hint: 'حداقل یک تصویر' },
    { label: 'برند', ok: Boolean(schema.brand), hint: 'از مشخصهٔ «برند»' },
    { label: 'مشخصات قابل مقایسه', ok: Array.isArray(schema.additionalProperty), hint: 'از مشخصات محصول' },
    { label: 'مدل‌های محصول', ok: Boolean(schema.hasVariant), hint: 'برای محصول متنوع' },
  ]
}
