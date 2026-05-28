# Vitrina — Handoff
> آخرین آپدیت: 2026-05-28

## الان
Brand token normalization کامل شد — Option A (mirrors teal.* standard pattern):
- `tokens.ts`: brand.* values normalized، brand.bg اضافه، bg.teal حذف
- همه `teal.*` brand usages در src → `brand.*` (25 فایل)
- همه `colorPalette="teal"` → `colorPalette="brand"` (14 فایل)
- CLAUDE.md + dev-knowledge sync شد

## بعدی
نامشخص — کاربر تعیین نکرد.

## صفحات باقی‌مانده

| Route | صفحه | وضعیت |
|-------|------|--------|
| `/settings/store-info` | اطلاعات فروشگاه | ✅ |
| `/settings/categories` | دسته‌بندی‌ها | ✅ |
| `/settings/sales` | تنظیمات فروش | ✅ |
| `/settings/shipping` | روش‌های ارسال | ✅ |
| `/settings/shipping/add` | افزودن روش ارسال | ✅ |
| `/settings/themes` | پوسته‌ها | ✅ |
| `/settings/themes/customize` | سفارشی‌سازی پوسته | ✅ |
| `/settings/badges` | نمادها و مجوزها | ✅ |

→ see CLAUDE.md for architectural decisions
