# Vitrina — Handoff
> آخرین آپدیت: 2026-06-15

## الان
**OrderDetails responsive + Figma-match** — صفحه سفارش با طرح هماهنگ و موبایل‌سازی شد:
- خلاصه سفارش: رنگ کارت به `brand.bg` (کل کارت teal روشن + عنوان مشکی، نه header رنگی)
- ۴ باکس روش ارسال: هم‌ارتفاع (`minH` ثابت)، `bg.muted`
- `OrderSummaryAccordion` (جدید): موبایل/compact، sticky پایین، collapsed ۳-آماری / expanded کامل
- OrderSteps: همیشه افقی، در overflow اسکرول افقی، title‌ها nowrap
- Header (عمومی): `< sm` → CTA فقط آیکون کنار title (label مخفی، بدون wrap)
- OrderItemsPanel: نام/مشخصات `truncate` تا روی قیمت سرریز نکنند

### قبلی
**مهاجرت Vite → Next.js 16 (App Router)** انجام شد — روی branch `migrate/nextjs` (هنوز merge نشده).
- routing فایل‌محور: `src/app/**/page.tsx` (۱۶ wrapper نازک 'use client') → کامپوننت‌ها از `src/views/*` (پوشه `pages/` به `views/` rename شد تا با Pages Router تداخل نکنه)
- providerها در `src/app/providers.tsx`، root layout + فونت + `dir="rtl"` در `src/app/layout.tsx`
- react-router کاملاً حذف → `next/link` + `next/navigation`. انتقال state پوسته‌ها از router-state به query params
- env: `import.meta.env` → `process.env.NEXT_PUBLIC_*` (`.env.local`)
- **همه‌ی** importهای asset (`.svg` + `.png/.jpg`) در Next → `StaticImageData` object؛ هر `src={import}` باید `.src` بگیره (svg هم! Next نوعش رو `any` می‌ده پس build خطا نمی‌ده). همه fix شد (logo، social، shipping، category، product، store).
- **Emotion SSR registry** در `providers.tsx` (`useServerInsertedHTML` + `CacheProvider`) — حل hydration mismatch / FOUC چاکرا. dep جدید: `@emotion/cache`.
- حذف: `vite.config.ts`، `index.html`، `App.tsx`، `main.tsx`، `tsconfig.app/node.json`
- **verify کامل:** `pnpm build` سبز (۱۷ route) · dev server ۵۱۷۴ صفر console/server error · **visual ۷ صفحه/تعامل** (داشبورد، products/list، settings، themes→customize، dark mode، sidebar active، موبایل+drawer) همه ✅ — RTL/فونت/تصاویر/dark/drawer سالم

- merge branch `migrate/nextjs` → `master`
- اختیاری: enable strict mode (`strictNullChecks` الان true از Next default)، مهاجرت فونت به `next/font/google`

### fix شده حین verify
- **کامنت‌های `// dev-engine-ignore` که به‌صورت متن render می‌شدن** (در `ProductCard`/`ProductTable`/`SelectionActionBar`): مواردِ داخل JSX children → `{/* dev-engine-ignore */}` (JSX comment، نمایش داده نمی‌شه)؛ مواردِ داخل `{cond && (...)}` همان `// dev-engine-ignore` ماندند (JS comment معتبر، نمایش داده نمی‌شه). نکته: `<X/> {/* */}` داخل یک expression تکی syntax error می‌دهد — فقط در JSX-children mجازست.

## صفحات

| Route | صفحه | وضعیت |
|-------|------|--------|
| `/products/list` | لیست محصولات | ✅ |
| `/products/categories` | دسته‌بندی محصولات | ✅ |
| `/account/user-info` | حساب کاربری | ✅ |
| `/settings/store-info` | اطلاعات فروشگاه | ✅ |
| `/settings/categories` | دسته‌بندی‌ها | ✅ |
| `/settings/sales` | تنظیمات فروش | ✅ |
| `/settings/shipping` | روش‌های ارسال | ✅ |
| `/settings/shipping/add` | افزودن روش ارسال | ✅ |
| `/settings/themes` | پوسته‌ها | ✅ |
| `/settings/themes/customize` | سفارشی‌سازی پوسته | ✅ |
| `/settings/badges` | نمادها و مجوزها | ✅ |
| `/orders/list` | لیست سفارشات | ✅ |
| `/orders/[orderId]` | جزئیات سفارش | ✅ |

→ قوانین معماری + isCompact pattern: CLAUDE.md
