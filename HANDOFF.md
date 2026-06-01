# Vitrina — Handoff
> آخرین آپدیت: 2026-06-01

## الان
این session — دو کار موازی:

**۱. projfix** ساخته شد (`~/GitHub/Tools/dev-agents/packages/projfix`):
- 8 check module: css-logical-props, icon-direction, persian-numerals, chakra-known-bugs, dom-order, debug-artifacts, token-replacer, build-git-check
- token-map.chakra-v3.json template (110+ hex → token mapping)
- اجرا: `projfix ./src` از root Vitrina

**۲. Vitrina TypeScript/bugs** از projfix build-check کشف و fix شد:
- `Box as="img"` → native `<img>` در Layout/Navbar/Settings/CategoryAccordion
- `Box/Flex as="button/a"` → `chakra.button/chakra.a` در UserMenu/Badges/ThemeCustomize/AddShippingMethod
- `noOfLines` → `lineClamp` در AddressCard/PhoneCard/SocialCard
- `Box as="input"` → `chakra.input` در UserInfo
- console.log‌ها حذف شدن (ShippingSettings/UserInfo)
- OTP Dialog fix: CloseTrigger → `insetEnd` (چپ در RTL) + بدون justifyContent در Header + PinInput.Control dir="ltr"

## بعدی
- تست OTP dialog در browser (دستی — preview نتونست trigger کنه)
- review-fix universal skill بساز
- dev-init-wizard integration برای projfix
- ds-component-usage module

## uncommitted
14 فایل Vitrina uncommitted — commit کن قبل از session جدید

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
