# Vitrina — Handoff
> 2026-08-09

## الان
تب «انتخاب دامنه اعمال» صفحهٔ `/promotions/codes/new` ساخته شد (۵ آکاردئون: محصول/دسته‌بندی/مشتری/موقعیت/سبد خرید). چند دور باگ چیدمانی RTL کشف و فیکس شد که هیچ‌کدام را `dev-engine`/`tsc` نگرفته بودند — فقط مقایسهٔ screenshot با طرح فیگما گرفتشان. در همین مسیر **کل سیستم snapshot متنی حذف شد** (`layout-diff`/`layout-sync`/`layout-derive`/`verify-render`/`figma-layout.json`/anchorهای `data-layout`) و با یک پروتکل ساده جایگزین شد: هر Tier 2 → screenshot طرح + screenshot preview + اندازه‌گیری `getBoundingClientRect`، بدون پرسیدن. جزئیات در CLAUDE.md بخش «تطابق با طرح فیگما». همه‌چیز uncommitted.

## بعدی
commit همین تغییرات (Vitrina).

## باگ‌های open
(هیچ‌کدام باز نمانده — همهٔ موارد کشف‌شده در این session فیکس و با preview تأیید شدند.)
