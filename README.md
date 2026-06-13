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
| `/products/list` | لیست محصولات (جدول + view کارت، فیلتر، pagination، انتخاب گروهی) |
| `/products/categories` | دسته‌بندی محصولات |
| `/account/user-info` | حساب کاربری (اطلاعات / امنیت / احراز هویت / تاریخچه ورود) |
| `/settings/store-info` | اطلاعات فروشگاه |
| `/settings/categories` | دسته‌بندی‌ها |
| `/settings/sales` | تنظیمات فروش |
| `/settings/shipping` | روش‌های ارسال |
| `/settings/shipping/add` | افزودن روش ارسال |
| `/settings/themes` | پوسته‌ها |
| `/settings/themes/customize` | سفارشی‌سازی پوسته |
| `/settings/badges` | نمادها و مجوزها |

## References

- [CLAUDE.md](CLAUDE.md) — قوانین کدنویسی، RTL، tokens، protocols
- [HANDOFF.md](HANDOFF.md) — وضعیت فعلی پروژه
- [dev-knowledge](../../../Tools/dev-knowledge/) — دانش مشترک DS/RTL/skills
