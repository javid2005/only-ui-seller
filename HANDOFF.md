# Vitrina — Handoff
> آخرین آپدیت: 2026-05-27

## الان
`ShippingCalculatorDialog` پیاده‌سازی شد — modal محاسبه هزینه ارسال با weight input + unit SegmentGroup + نتایج responsive (3-col desktop / 2-col mobile) برای همه روش‌های ارسال. Dark-mode bug کارت‌های disabled/comingSoon هم fix شد (`bg.panel` به جای `white`).

## بعدی
نامشخص — کاربر dismiss کرد.

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
- **ShippingCalculatorDialog:** controlled (open/onClose props) — trigger در ShippingSettings InfoBox
- **WeightRangeChart:** `BarSegment` از `@chakra-ui/charts` — segment width = weight range width (kg)، رنگ `.emphasized` per-palette
- **BarSegmentData.name = r.id** (UUID) — جلوگیری از duplicate key وقتی چند بازه empty هستن
- **NativeSelect exception:** فقط داخل InputGroup به عنوان unit selector
- → see CLAUDE.md for full architectural decisions
