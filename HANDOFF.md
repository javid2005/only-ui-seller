# Vitrina — Handoff
> آخرین آپدیت: 2026-05-26

## الان
صفحه `/settings/shipping/add` پیاده‌سازی شد — فرم افزودن روش ارسال با دو section Collapsible (درون‌شهری/بین‌شهری)، جدول بازه‌های وزنی dynamic، و WeightRangeChart با `BarSegment` از `@chakra-ui/charts`.

## بعدی
صفحات باقی‌مانده settings (badges، themes) یا calculator dialog برای shipping

## صفحات باقی‌مانده

| Route | صفحه | وضعیت |
|-------|------|--------|
| `/settings/store-info` | اطلاعات فروشگاه | ✅ |
| `/settings/categories` | دسته‌بندی‌ها | ✅ |
| `/settings/sales` | تنظیمات فروش | ✅ |
| `/settings/shipping` | روش‌های ارسال | ✅ |
| `/settings/shipping/add` | افزودن روش ارسال | ✅ (API ذخیره pending) |
| `/settings/badges` | نمادها و مجوزها | ⏳ |
| `/settings/themes` | پوسته‌ها | ⏳ |

## تصمیم‌های معماری

- **WeightRangeChart:** `BarSegment` از `@chakra-ui/charts` — segment width = weight range width (kg)، رنگ `.emphasized` per-palette
- **BarSegmentData.name = r.id** (UUID) — جلوگیری از duplicate key وقتی چند بازه empty هستن
- **NativeSelect exception:** تنها داخل InputGroup به عنوان endElement (unit selectors) — مستند در memory
- → see CLAUDE.md for full architectural decisions
