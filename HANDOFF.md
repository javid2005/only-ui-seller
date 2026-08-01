# Vitrina — Handoff
> آخرین آپدیت: 2026-08-02

## الان
مرحلهٔ ۵ ویزارد «ایجاد سفارش دستی» («ثبت و ایجاد لینک» — آخرین مرحله) این session از روی Figma پیاده و بعد با فیدبک مستقیم روی preview کامل اصلاح شد — uncommitted روی `main`:
- کامپوننت‌های جدید: `ManualReviewPrdCard` (کارت فقط-نمایشی محصول)، `OrderReviewPanel` (بررسی نهایی: مشتری/اقلام/روش ارسال)، `ManualOrderConfirmFooter` (فوتر مرحلهٔ آخر — fixed در موبایل مثل بقیهٔ مراحل، non-fixed در دسکتاپ).
- `ManualOrderNew.tsx`: فوتر مرحلهٔ ۵ به grid area مشترک «footer» منتقل شد (نه داخل ستون «form») تا زیر «جزئیات سفارش» بیفته — دقیقاً هم‌الگو با دو فریم Figma (موبایل تکستونه، دسکتاپ دوستونهٔ sticky).
- فیکس‌های RTL: `align="flex-end"` روی column flex در چند جا اشتباه به‌جای `flex-start` بود (باعث چپ‌چین‌شدن به‌جای راست‌چین می‌شد) — طبق قاعدهٔ مستندشدهٔ پروژه.
- `OrderDraftSummary`: عنوان «جزئیات سفارش» حذف شد (در همهٔ ۵ مرحله)، ردیف «نوع ارسال» اضافه شد (قبل از انتخاب روش: «تعیین نشده»/«براساس نوع ارسال» → بعدش: «پیش کرایه»/قیمت واقعی).
- `manualOrderData.ts`: دو محصول فقط-دلاری (آنر ۱۲۰ پرو، نوکیا ۳.۴) حالا `priceToman` هم دارن.
- `VariantSelectDialog`: با «افزودن تنوع» دیالوگ بسته می‌شه (قبلاً باز می‌موند).
- `ManualOrderStepper`: `size="sm"` + طول ثابت separator (۳۲px دسکتاپ/۲۴px موبایل، نه elastic).
- باگ کشف‌شده و مستندشده در `CLAUDE.md` (بخش Layout): پنل‌های sticky زیر Navbar باید `top="20"` بگیرن نه `top="4"` — وگرنه زیر Navbar (`zIndex` بالاتر) گم می‌شن. `ManualOrderNew.tsx` فیکس شد؛ `OrderDetails.tsx`/`GeneralInfo.tsx` هنوز `top="4"` دارن (بررسی نشده).
- verify شده: `npx tsc --noEmit` سبز، در preview (۳۲۰/۳۷۵/۴۸۰/۸۰۰/۱۲۸۰px) دستی تست شد.

## بعدی
commit کردن مرحلهٔ ۵ (این session).
