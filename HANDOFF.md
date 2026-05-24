# Vitrina — Handoff
> آخرین آپدیت: 2026-05-25

## الان
صفحه `/settings/shipping` پیاده‌سازی شد — ShippingCardCustom + ShippingCardSystem با سه/چهار state (default/hover/disabled/comingSoon)، toggle تبدیل visual state می‌کنه، آیکون‌ها teal، CommingSoon-Tag SVG با offset خارج از card.

## بعدی
ادامه صفحات shipping (Add dialog، calculator dialog) یا صفحه بعدی settings

## صفحات باقی‌مانده

| Route | صفحه | وضعیت |
|-------|------|--------|
| `/settings/store-info` | اطلاعات فروشگاه | ✅ |
| `/settings/categories` | دسته‌بندی‌ها | ✅ |
| `/settings/sales` | تنظیمات فروش | ✅ |
| `/settings/shipping` | روش‌های ارسال | ✅ (cards done، dialogs pending) |
| `/settings/badges` | نمادها و مجوزها | ⏳ |
| `/settings/themes` | پوسته‌ها | ⏳ |

## تصمیم‌های معماری (چیزایی که git نمیدونه)

- **Window scroll** نه div scroll → scrollbar لبه چپ مرورگر در RTL
- **bg="bg.panel"** روی همه panel wrapperهای صفحات settings
- **panel standard style:** `bg="bg.panel" borderWidth="1px" borderColor="border" rounded="2xl"`
- **isVisuallyDisabled = disabled || !enabled** — toggle visual state بدون disable کردن switch
- **CommingSoon-Tag SVG** با `insetInlineStart="-25px"` — 25px خارج از لبه راست card
- **isDefault → switch disabled** — کارت پیش‌فرض قابل خاموش کردن نیست
- → see CLAUDE.md for full architectural decisions
