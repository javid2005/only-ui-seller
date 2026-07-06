# Vitrina — Handoff
> آخرین آپدیت: 2026-07-06

## الان
**تب «تنوع‌ها» + «گالری» تکمیل شد (uncommitted روی branch `nextjs`)**:
- `VariantAccordion.tsx`: گروه تنوع — عنوان/مقدار با Chakra `Combobox` (پیشنهاد پیش‌فرض + متن آزاد)، جلوگیری از عنوان تکراری (خطای قرمز + حذف از پیشنهادها)، ریسپانسیو (`<sm`: فیلدها ستونی fill، دکمه‌ها زیر و چپ‌چین)
- `VariantCombinationCard.tsx`: کارت ماتریس ترکیب — فعال/فروش‌تلفنی/موجودی‌نامحدود/تخفیف با قفل فیلد مربوطه، ریسپانسیو (`<sm`: badgeها زیر SKU)
- `VariantsTab.tsx`: orchestration کامل — Accordionها + ماتریس + فیلتر ریسپانسیو (دسکتاپ: ردیف inline · موبایل/`isCompact`: دکمه فیلتر + `FiltersDialog` مودال با Apply/Cancel) + EmptyStateهای «هیچ تنوعی»/«هیچ ترکیبی»/«موردی یافت نشد»
- `GalleryTab.tsx` + `VariantSelectDialog.tsx` هم این session کامل شد

## بعدی
- commit تغییرات فعلی (نه هنوز commit شده)
- بعد از commit: merge `nextjs` → `main`

## نکته
- Chakra `Combobox` با `inputValue` کنترل‌شده + `allowCustomValue` گاهی رویداد تایپ متن دلخواه را گم می‌کند — راه‌حل: uncontrolled (`defaultInputValue`) + خواندن مقدار مستقیم از DOM (`ref`) در لحظهٔ ثبت، نه از React state. نگاه کن `VariantAccordion.tsx`
- `isCompact` واقعیتِ viewport را عوض نمی‌کند → برای display-swap (نه فقط layout prop) باید هم breakpoint هم `isCompact` را جدا چک کرد: `isCompact ? 'none' : { base:'none', md:'flex' }`
