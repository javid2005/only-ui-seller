# Vitrina — Handoff
> آخرین آپدیت: 2026-07-14

## الان
**صفحهٔ بینابینی «آماده‌سازی فروشگاه» ساخته شد — uncommitted روی `main`**:
- `/signup/preparing` — بین مرحله ۲ (دسته‌بندی) و مرحله ۳ (پلن): progress bar واقعی Chakra (`Progress.Root/Track/Range`) با تایمینگ گرفته‌شده از Figma motion data (۵s fill) + ۴ ردیف وضعیت که به‌ترتیب پررنگ می‌شن، بعد از ۲s صبر خودکار به `/signup/plan` می‌ره
- دکمهٔ «ادامه» در `SignupCategoriesView` حالا اول به این صفحه می‌ره (نه مستقیم `/signup/plan`)
- باگ Chakra کشف و مستند شد: `Progress striped` روی نسخهٔ نصب‌شده broken است (conditional custom-property resolve نمی‌شه) → workaround در CLAUDE.md و dev-knowledge ثبت شد

## بعدی
- commit تغییرات فعلی (uncommitted: `SignupCategoriesView.tsx`, `signup/preparing/`, `SignupPreparingView.tsx`, `README.md`, `CLAUDE.md`)
- ثبت‌نام مرحله ۳ («پلن انتخابی») — هنوز صفحه نداره؛ کاربر گفت طرح Figma‌ش رو بعداً می‌ده. تا اون‌موقع `/signup/plan` عمداً ۴۰۴ می‌ده (هم از preparing، هم برای کاربری که signup progress‌ش قبلاً تا اونجا رسیده و برمی‌گرده)

## نکته
- تست signup flow با شمارهٔ تکراری (رقم آخر فرد) که قبلاً تا مرحله ۲ رفته → روی OTP verify مستقیم می‌ره `/signup/plan` و ۴۰۴ می‌ده (resume feature درسته، فقط مقصد صفحه نداره). برای تست دوباره از اول: `localStorage` کلید `vitrina-signup-progress:<phone>` رو پاک کن یا شمارهٔ فرد جدید بزن.
