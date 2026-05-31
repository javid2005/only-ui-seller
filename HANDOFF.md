# Vitrina — Handoff
> آخرین آپدیت: 2026-05-31

## الان
این session — صفحه حساب کاربری پیاده‌سازی شد:
- **`src/pages/account/UserInfo.tsx`** (جدید) — صفحه کامل با:
  - Two Columns Right Center layout
  - Vertical tabs (Chakra `Tabs.Root orientation="vertical" variant="subtle"`) در `>= lg`
  - Horizontal tabs (Chakra `Tabs.Root variant="subtle"`) در `< lg`
  - BadgeInput custom (input FIRST=راست، badge LAST=چپ) برای موبایل/ایمیل
  - Chakra native `DatePicker` با `locale="fa-IR-u-ca-persian"` (تقویم جلالی)
  - OTP Dialog برای موبایل (countdown 120s) و ایمیل (resend همیشه)
  - responsive: موبایل+ایمیل کنار هم در `>= xl`، زیر هم در `< xl`
  - دکمه ارسال کد تایید زیر input در `< sm`
- **`src/App.tsx`** — route `/account/user-info` اضافه شد
- **`src/components/layout/UserMenu.tsx`** — "حساب کاربری" به `/account/user-info` navigate می‌کنه
- **`CLAUDE.md`** — pattern جدید: `Tabs.Trigger orientation="vertical"` → `justifyContent="flex-start"` در RTL

## بعدی
نامشخص — کاربر تعیین نکرد.

## صفحات

| Route | صفحه | وضعیت |
|-------|------|--------|
| `/account/user-info` | حساب کاربری | ✅ |
| `/settings/store-info` | اطلاعات فروشگاه | ✅ |
| `/settings/categories` | دسته‌بندی‌ها | ✅ |
| `/settings/sales` | تنظیمات فروش | ✅ |
| `/settings/shipping` | روش‌های ارسال | ✅ |
| `/settings/shipping/add` | افزودن روش ارسال | ✅ |
| `/settings/themes` | پوسته‌ها | ✅ |
| `/settings/themes/customize` | سفارشی‌سازی پوسته | ✅ |
| `/settings/badges` | نمادها و مجوزها | ✅ |

→ see CLAUDE.md for architectural decisions
