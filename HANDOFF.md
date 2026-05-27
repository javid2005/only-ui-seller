# Vitrina — Handoff
> آخرین آپدیت: 2026-05-27

## الان
ShippingCalculatorDialog کامل شد + RTL switch order در AddShippingMethod fix شد (Switch FIRST=right, Text LAST=left در PriceCard، WeightTable، ShippingSection) + WeightRangeChart حالا بلافاصله بعد از اولین بازه نمایش میده. فایل‌های Themes (ThemeSettings + ThemeCustomize) uncommitted وجود دارن.

## بعدی
Commit تغییرات shipping + themes.

## صفحات باقی‌مانده

| Route | صفحه | وضعیت |
|-------|------|--------|
| `/settings/store-info` | اطلاعات فروشگاه | ✅ |
| `/settings/categories` | دسته‌بندی‌ها | ✅ |
| `/settings/sales` | تنظیمات فروش | ✅ |
| `/settings/shipping` | روش‌های ارسال | ✅ |
| `/settings/shipping/add` | افزودن روش ارسال | ✅ (API ذخیره pending) |
| `/settings/themes` | پوسته‌ها | ⏳ (فایل‌ها موجود، uncommitted) |
| `/settings/badges` | نمادها و مجوزها | ⏳ |

## تصمیم‌های معماری
- **Switch RTL rule:** Switch FIRST در DOM = راست، Text LAST = چپ — در همه‌جا اجباری
- **WeightRangeChart:** نمایش از اولین بازه (ranges.length > 0) بدون نیاز به toWeight پر شده
- → see CLAUDE.md for full architectural decisions
