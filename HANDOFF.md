# Vitrina — Handoff
> آخرین آپدیت: 2026-08-04

## الان
صفحه‌ی «ایجاد کمپین پروموشن» اضافه شد و چند فیکس روی فلوی کمپین‌ها انجام شد — هنوز commit نشده:

- `CampaignNewPromotion.tsx` (view جدید) — همون ساختار `CampaignNewSales.tsx` (اطلاعات پایه، مدل پرداخت و بودجه، پیش‌نمایش مالی سه‌کارتی، بازه زمانی، ButtonFooter). فرمول‌های پیش‌نمایش (برآورد ثبت‌نام/بازدید/نرخ تبدیل) در برابر عدد نمونهٔ Figma تست و تأیید شد.
- `/marketing/campaigns/new` حالا بر اساس `?type=sales|promotion` بین دو view سوییچ می‌کنه (`page.tsx` با `Suspense`)؛ `Campaigns.tsx` دیگه برای «پروموشن» toast جایگزین نمی‌ده، مستقیم روت می‌کنه.
- `DateField` از `CampaignNewSales.tsx` جدا شد → `src/components/marketing/campaigns/DateField.tsx` (بین دو صفحه مشترکه).
- **`DatePicker` جدید** (`src/components/ui/DatePicker.tsx`) — تقویم جلالی سفارشی جایگزین overlay شفافِ `<input type="date">` قبلی شد؛ صفر کتابخانهٔ خارجی (با `Intl` ساخته شده) + دکمهٔ «امروز» ثابت در پایین هر پاپاور. جزئیات معماری در CLAUDE.md (Architectural Decisions + Persian Calendar).
- `ProductPickerDialog`/`ProductPickerItem` ریسپانسیو `<sm` فیکس شد: select دسته‌بندی زیر جستجو با عرض کامل؛ هر آیتم محصول به‌جای فشرده‌شدن، ستونی می‌شه (عنوان → SKU → قیمت+بج دلاری راست‌چین با gap ۱۶px).

## بعدی
تصمیم کاربر: **کامیت همین تغییرات** (با `wf-commit` ادامه بده).
بعدش: طرح‌های ریسپانسیو/موبایل هنوز رسماً از Figma برای هیچ‌کدوم از دو صفحهٔ کمپین نیومده — فیکس‌های ریسپانسیوِ فعلی بر اساس فیدبک مستقیم کاربر روی پیش‌نمایش زنده بوده، نه مقایسه‌ی pixel-perfect با فریم موبایل Figma.
