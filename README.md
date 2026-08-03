# Vitrina

داشبورد مدیریت فروشگاه — RTL / فارسی

## Stack

- React 19 + Next.js 16 (App Router) + TypeScript
- Chakra UI v3 + `@chakra-ui/charts`
- RTL / Vazirmatn font
- pnpm

## Quick Start

```bash
pnpm install
cp .env.example .env.local   # NEXT_PUBLIC_API_BASE_URL
pnpm dev                     # Next dev (port 5174)
```

```bash
pnpm build   # production build (+ type-check)
pnpm start   # serve production build
```

> **Routing:** file-based در `src/app/**/page.tsx` (هر page یه wrapper نازک که کامپوننت `src/views/*` رو render می‌کنه). جزئیات معماری Next در [CLAUDE.md](CLAUDE.md#nextjs--app-router-conventions-اجباری).

## صفحات پیاده‌سازی‌شده

| Route | صفحه |
|-------|------|
| `/` | داشبورد |
| `/login` | ورود با شماره موبایل + کد تایید |
| `/login/otp` | تایید کد OTP (ورود) |
| `/login/password` | ورود با رمز عبور |
| `/login/forgot` | فراموشی رمز عبور — وارد کردن شماره موبایل |
| `/login/forgot/otp` | تایید کد OTP (فراموشی رمز) |
| `/login/forgot/new-password` | تعیین رمز عبور جدید |
| `/login/forgot/done` | تایید تغییر رمز عبور |
| `/signup` | ریدایرکت به `/login` (entry point ثبت‌نام/ورود یکپارچه شده) |
| `/signup/basic-info` | ثبت‌نام مرحله ۱ — اطلاعات پایه (نام، نام فروشگاه، آدرس اختصاصی، کد دعوت) |
| `/signup/categories` | ثبت‌نام مرحله ۲ — انتخاب دسته‌بندی(های) فروشگاه (جستجو، آکاردئون زیردسته، حداقل ۱ اجباری) |
| `/signup/preparing` | صفحهٔ بینابینی «آماده‌سازی فروشگاه» — progress bar انیمیشنی (۵s) + ۴ ردیف وضعیت، بعد از ۲s خودکار به `/signup/plan` می‌ره |
| `/signup/plan` | ثبت‌نام مرحله ۳ — انتخاب اشتراک (۶/۱۲ماهه، ۴ پلن) |
| `/signup/done` | تکمیل ثبت‌نام — خلاصهٔ ۳ مرحله (استپر) + کارت پلن رایگان ۱۴روزه + ورود به حساب |
| `/products/list` | لیست محصولات (جدول + view کارت، فیلتر، pagination، انتخاب گروهی) |
| `/products/new` | افزودن محصول جدید (مرحله‌ای: اطلاعات / گالری / تنوع‌ها) |
| `/products/categories` | دسته‌بندی محصولات |
| `/products/reviews` | نظرات محصولات |
| `/orders/list` | لیست سفارش‌ها |
| `/orders/new` | ایجاد سفارش دستی — ویزارد ۵مرحله‌ای کامل (مشتری/محصول/ارسال/تخفیف/ثبت و ایجاد لینک) |
| `/orders/[orderId]` | جزئیات سفارش |
| `/orders/[orderId]/print-label` | پرینت برچسب (قالب 6-ستون مرکز، چاپ‌محور) |
| `/orders/[orderId]/print-invoice` | پرینت فاکتور (قالب 6-ستون مرکز، چاپ‌محور) |
| `/marketing/channels` | کانال‌های تبلیغاتی — مدیریت/فعال‌سازی کانال (ترب/ایمالز/کمپینو/دیوار)، سه‌سطحی ریسپانسیو (lg+/sm..lg/<sm) |
| `/marketing/campaigns` | لیست کمپین‌های بازاریابی (جدول + کارت، دیالوگ «کمپین جدید» برای انتخاب نوع) |
| `/marketing/campaigns/new?type=sales` | ایجاد کمپین «همکاری در فروش» — انتخاب محصول (دیالوگ)، کارمزد (مقداری/درصدی)، پیش‌نمایش مالی، بازه زمانی؛ ریسپانسیو <sm |
| `/marketing/campaigns/new?type=promotion` | ایجاد کمپین «پروموشن» — انتخاب محصول، مدل پرداخت (هر ثبت‌نام/هر ۱۰۰۰ بازدید) + بودجه کل، پیش‌نمایش مالی (نرخ تبدیل/برآورد ثبت‌نام/بازدید)، بازه زمانی؛ ریسپانسیو <sm |
| `/account/user-info` | حساب کاربری (اطلاعات / امنیت / احراز هویت / تاریخچه ورود) |
| `/settings` | تنظیمات (صفحهٔ فرود) |
| `/settings/store-info` | اطلاعات فروشگاه |
| `/settings/categories` | دسته‌بندی‌ها |
| `/settings/sales` | تنظیمات فروش |
| `/settings/shipping` | روش‌های ارسال |
| `/settings/shipping/add` | افزودن روش ارسال |
| `/settings/themes` | پوسته‌ها |
| `/settings/themes/customize` | سفارشی‌سازی پوسته |
| `/settings/badges` | نمادها و مجوزها |
| `/settings/domain` | دامنه اختصاصی فروشگاه (افزودن/تایید/تغییر دامنه) |

## ساختار

```
src/
  app/        — Next App Router (routing فایل‌محور؛ هر page یه wrapper نازک → views/*)
  components/ — layout/ · settings/ · ui/ (کامپوننت‌های قابل‌استفادهٔ مجدد)
  contexts/   — ColorMode (dark mode) · CompactMode (شبیه‌سازی 512px)
  views/      — کامپوننت صفحات (توسط app/**/page.tsx render می‌شن)
  services/   — api.ts
  theme/      — index.ts (createSystem) · tokens.ts (توکن‌های Vitrina)
  utils/      — numbers.ts (toPersianDigits / toLatinDigits) · dates.ts (formatJalaliDate)
  types/      — nav.ts
```

> درختِ تفصیلیِ فایل‌به‌فایل اینجا نگه‌داری نمی‌شه (سریع stale می‌شه) — ساختار واقعی رو از repo بخون.

## References

- [CLAUDE.md](CLAUDE.md) — قوانین کدنویسی، RTL، tokens، protocols
- [HANDOFF.md](HANDOFF.md) — وضعیت فعلی پروژه
- [dev-knowledge](../../../Tools/dev-knowledge/) — دانش مشترک DS/RTL/skills
