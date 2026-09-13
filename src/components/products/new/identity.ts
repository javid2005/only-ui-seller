// ─── شناسهٔ مرجعِ محصول ──────────────────────────────────────────────────────────
/**
 * یک شناسهٔ عددیِ محصول، و همهٔ نام‌های لاتینِ مشتق از آن.
 *
 * مسئله‌ای که حل می‌کند: چند جای مستقل به «یک نام لاتینِ پایدار» نیاز دارند —
 * آدرس صفحه، شناسهٔ کالا، شناسهٔ هر مدل، نام فایل رسانه. اگر هر کدام نامش را از
 * دادهٔ فارسیِ کاربر بسازد، هم خروجی بی‌ربط می‌شود (درصد-انکد، ناخوانا) و هم با
 * اولین ویرایشِ نام محصول همه‌چیز عوض می‌شود — از جمله آدرس صفحه‌ای که گوگل
 * ایندکس کرده و نام فایلی که جای دیگری لینک شده.
 *
 * پس مرجع، **شناسهٔ عددی محصول** است و بقیه از آن ساخته می‌شوند:
 *
 *   شناسه محصول      2450
 *   آدرس صفحه        /product/prod-2450
 *   شناسهٔ کالا (SKU) p2450-sku
 *   شناسهٔ یک مدل     p2450-sku-var001
 *   نام یک رسانه      p2450-img-001
 *
 * ⚠️ شمارهٔ ترتیبی (`seq`) **موقع ساخت** به هر مدل/رسانه داده می‌شود و روی خودش
 * می‌ماند؛ از ایندکس آرایه ساخته نمی‌شود. وگرنه با هر جابه‌جایی یا حذف، نام همهٔ
 * فایل‌ها و شناسهٔ همهٔ مدل‌ها عوض می‌شد — دقیقاً همان چیزی که نباید بشود.
 */

/** شناسهٔ محصول — این پاس mock؛ در نسخهٔ واقعی از پاسخ ساختِ محصول می‌آید. */
export const MOCK_PRODUCT_ID = 2450

const pad = (n: number) => String(n).padStart(3, '0')

/** پیشوند مشترک همهٔ نام‌های این محصول — `p2450` */
export function productRef(id: number = MOCK_PRODUCT_ID): string {
  return `p${id}`
}

/** آدرس صفحهٔ محصول — `prod-2450` (بخش پس از `/product/`) */
export function productSlug(id: number = MOCK_PRODUCT_ID): string {
  return `prod-${id}`
}

/** شناسهٔ کالا — `p2450-sku` */
export function productSku(id: number = MOCK_PRODUCT_ID): string {
  return `${productRef(id)}-sku`
}

/** شناسهٔ یک مدل (ترکیب تنوع) — `p2450-sku-var001` */
export function variantSku(seq: number, id: number = MOCK_PRODUCT_ID): string {
  return `${productSku(id)}-var${pad(seq)}`
}

/** نام پایهٔ یک رسانه (بدون پسوند) — `p2450-img-001` */
export function mediaName(seq: number, id: number = MOCK_PRODUCT_ID): string {
  return `${productRef(id)}-img-${pad(seq)}`
}

// ─── پاک‌سازی نام فایل ──────────────────────────────────────────────────────────
/**
 * نام فایل را به شکلِ استانداردِ وب درمی‌آورد: حروف کوچک لاتین، رقم، و خط تیره.
 *
 * قواعد (به ترتیب اجرا):
 *   ۱. ارقام فارسی/عربی → لاتین (نام فایل هرگز رقم فارسی ندارد)
 *   ۲. حروف بزرگ → کوچک (سرورهای حساس به بزرگی/کوچکی، دو فایل متفاوت می‌بینند)
 *   ۳. فاصله، زیرخط و نقطه → خط تیره (زیرخط در URL زیر خطِ لینک گم می‌شود)
 *   ۴. هر چیز دیگرِ غیرمجاز (فارسی، علائم، اموجی) حذف می‌شود
 *   ۵. خط تیره‌های پشت‌سرهم یکی می‌شوند و از دو سر بریده می‌شوند
 *   ۶. حداکثر ۶۰ کاراکتر
 *
 * پسوند اینجا دخالتی ندارد: سیستم همهٔ تصاویر را به `webp` تبدیل می‌کند، پس فقط
 * نامِ بدون پسوند از کاربر گرفته می‌شود.
 */
export function sanitizeFileName(raw: string): string {
  const latinDigits = raw
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))

  return latinDigits
    .toLowerCase()
    .replace(/[\s._]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '')
}

/**
 * پسوندِ آشنا را از انتهای نام برمی‌دارد.
 *
 * کاربر عادت دارد نام کامل فایل را بنویسد («main.png»). چون پسوند دست او نیست،
 * نگه‌داشتنش نام را به `main-png` تبدیل می‌کرد — نه خطا می‌داد، نه درست بود.
 */
export function stripExtension(raw: string): string {
  return raw.replace(/\.(jpe?g|png|gif|webp|avif|bmp|svg|heic|mp4|mov|webm|mkv)$/i, '')
}

/** آیا نام واردشده بعد از پاک‌سازی چیزی باقی می‌گذارد؟ */
export function isValidFileName(raw: string): boolean {
  return sanitizeFileName(raw).length > 0
}

/** پسوند نهایی هر رسانه — تبدیل سمت سرور انجام می‌شود */
export const MEDIA_EXTENSION = 'webp'
