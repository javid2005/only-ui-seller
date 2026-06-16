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
| `/products/list` | لیست محصولات (جدول + view کارت، فیلتر، pagination، انتخاب گروهی) |
| `/products/categories` | دسته‌بندی محصولات |
| `/products/reviews` | نظرات محصولات |
| `/orders/list` | لیست سفارش‌ها |
| `/orders/[orderId]` | جزئیات سفارش |
| `/orders/[orderId]/print-label` | پرینت برچسب (قالب 6-ستون مرکز، چاپ‌محور) |
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

## ساختار

```
src/
  app/        — Next App Router (routing فایل‌محور؛ هر page یه wrapper نازک → views/*)
  components/ — layout/ · settings/ · ui/ (کامپوننت‌های قابل‌استفادهٔ مجدد)
  contexts/   — ColorMode (dark mode) · CompactMode (شبیه‌سازی 512px)
  views/      — کامپوننت صفحات (توسط app/**/page.tsx render می‌شن)
  services/   — api.ts
  theme/      — index.ts (createSystem) · tokens.ts (توکن‌های Vitrina)
  utils/      — numbers.ts (toPersianDigits / toLatinDigits)
  types/      — nav.ts
```

> درختِ تفصیلیِ فایل‌به‌فایل اینجا نگه‌داری نمی‌شه (سریع stale می‌شه) — ساختار واقعی رو از repo بخون.

## References

- [CLAUDE.md](CLAUDE.md) — قوانین کدنویسی، RTL، tokens، protocols
- [HANDOFF.md](HANDOFF.md) — وضعیت فعلی پروژه
- [dev-knowledge](../../../Tools/dev-knowledge/) — دانش مشترک DS/RTL/skills
