# Vitrina — Handoff
> 2026-08-08

## الان
صفحهٔ `/promotions/codes` ساخته شد (جدول + کارت موبایل + منوی ردیف)، و بعد از کشف باگ
چیدمان RTL در آن، کل کلاس باگ از ریشه بسته شد — **همه uncommitted**.

**دو repo تغییر کرده‌اند و باید جدا commit شوند:**
- `Vitrina` — ۱۳۱ فایل
- `~/Documents/GitHub/Tools/dev-agents` — ۷ فایل (۵۵۹ خط)، `dev-engine` گلوبال است پس روی همهٔ پروژه‌ها اثر دارد

## بعدی
commit دو repo (اول dev-agents، بعد Vitrina).

## آنچه این session عوض شد
- **codemod:** `flex-start`/`flex-end` → `start`/`end` در ۹۶ فایل (۳۳۳ مورد) + `textAlign` فیزیکی → semantic (۱۶۷ مورد). رندر یکسان، یک idiom.
- **dev-engine نو:** rule `one-align-idiom` · `containers` + anchor `data-layout="Comp.name"` · subcommand `layout-derive` (سمت را از `x+width` حساب می‌کند) · `verify-render` anchor-aware · `--set` با `null` حذف می‌کند.
- **hook `rtl_gate`** روی `Stop` — با error چیدمانی turn بسته نمی‌شود.
- **۸ snapshot مردهٔ `childOrder` حذف شد** (اسم خیالی یا نام‌های یکسان = صفر قدرت تشخیص).
- `AdChannelCard` snapshot `textAlign: end` → `start` (artifact باگ جهت‌کورِ قدیمی).

## باگ‌های open
- `PromotionCard` و `AdChannelCard`: `layoutMode=HORIZONTAL` بدون facts محور → warning. نیاز به `nodeId` + `layout-derive`.
- `DiscountCodesTable.actionsCell`: `justify=end` تنها مقدار دستی‌ماندهٔ snapshot — از هندسهٔ فیگما استخراج‌شدنی نیست (سلول طرح دقیقاً اندازهٔ دو دکمه است). دلیل در `_note` ثبت شده.
