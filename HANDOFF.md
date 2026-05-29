# Vitrina — Handoff
> آخرین آپدیت: 2026-05-29

## الان
Mobile responsive fixes برای تمام صفحات settings — media < sm:
- AddAddressDialog: layout column (thumbnail+info row) + responsive direction/order/w
- ShippingCalculatorDialog: stacked badge+price + labels زیر heading هر method
- ShippingCardCustom: route rows → column در < sm (درون/بین شهری wrap نمیشن)
- Badges: section header → link زیر عنوان + alignSelf fix
- ThemeSettings: selected theme card → [thumb|info] row + buttons below در < sm
- CategoryAccordion: ChevronDown/Up + isMobile state → Plus/Star icon buttons همیشه visible در < sm + 2-col subcategory grid
- GeneralInfo/SalesSettings/ShippingSettings: افزودن buttons → IconButton در < sm
- AddShippingMethod: breadcrumb کوتاه (حذف آخرین item)
- ButtonFooter back labels: «بازگشت به ...» → «بازگشت»
- GeneralInfo tabs: whiteSpace="nowrap" روی Tabs.Trigger

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
