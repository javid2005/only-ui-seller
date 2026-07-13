# Vitrina — Handoff
> آخرین آپدیت: 2026-07-13

## الان
**ثبت‌نام مرحله ۲ (دسته‌بندی فروشگاه) پیاده‌سازی شد — uncommitted روی `main`**:
- صفحه: `/signup/categories` — جستجو + لیست ۱۸ دسته‌بندی (آیکون واقعی از Figma) با آکاردئون زیردسته (mock)، انتخاب چندتایی، حداقل ۱ اجباری برای «ادامه»، اولین انتخاب‌شده = پیش‌فرض
- کامپوننت‌های جدید: `SignupCategoryAccordion`، دادهٔ `signupCategoriesData.ts`
- `SignupLayout` دو پراپ جدید گرفت: `footerGap` (override فاصلهٔ محتوا↔فوتر) و `basicInfoSummary` (نمایش اطلاعات مرحلهٔ ۱ در description مرحلهٔ ۱ استپر عمودی، وقتی کاربر جلوتر رفته)
- مرحله ۱ (`basic-info`): دکمهٔ «بازگشت» حذف شد (کاربر خواست)
- `src/services/auth.ts` → `SignupProgress.categoryIds?: string[]` اضافه شد

## بعدی
- کاربر ترجیحی برای قدم بعد مشخص نکرد — دو گزینهٔ روی میز:
  1. commit تغییرات فعلی (uncommitted: `SignupLayout.tsx`, `SignupStepper.tsx`, `auth.ts`, `SignupBasicInfoView.tsx`, `signup/categories/`, `assets/signup/`, `SignupCategoryAccordion.tsx`, `signupCategoriesData.ts`, `SignupCategoriesView.tsx`)
  2. ثبت‌نام مرحله ۳ («پلن انتخابی» / صفحهٔ آماده‌سازی فروشگاه با progress bar) — کاربر گفت طرح Figma‌ش رو بعداً می‌ده؛ دکمهٔ «ادامه» در مرحله ۲ فعلاً به `/signup/plan` می‌ره که هنوز صفحه نداره (404 عمدی تا اون موقع)

## نکته
- دادهٔ دسته‌بندی‌های signup (`signupCategoriesData.ts`) با دادهٔ دسته‌بندی محصولات (`products/categories/data.ts`) فرق داره — یکی taxonomy سطح‌فروشگاه، یکی زیردستهٔ محصولات خودِ فروشگاه. زیردسته‌های signup mock کوتاه‌ان، بعداً از API واقعی میان.
