# Vitrina — Handoff
> آخرین آپدیت: 2026-07-25

## الان
آخرین commit (`54e89b3`): store switcher default-star، order-taking switch، simplify categories search.
از اون‌موقع (uncommitted روی `main`):
- استپر ثبت‌نام یه مرحلهٔ جدید «شماره موبایل» در ابتدا گرفت (همیشه complete + نمایش شماره) — `SignupStepper.tsx` + `SignupLayout.tsx` + هر ۴ view مرحله (`currentStep` یک واحد شیفت شد)
- `LoginHistorySection.tsx`: ستون «خروج» که در جدول دسکتاپ اصلاً وجود نداشت (فقط کارت موبایل داشت) اضافه شد

## بعدی
- commit تغییرات فعلی (لیست بالا)

## نکته
- برخلاف HANDOFF قبلی: `/signup/plan` (مرحلهٔ ۳، انتخاب اشتراک) دیگه ۴۰۴ نمی‌ده — کامل پیاده‌سازی شده و در `SignupPlanView.tsx` کار می‌کنه
