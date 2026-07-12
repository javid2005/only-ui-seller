# Vitrina — Handoff
> آخرین آپدیت: 2026-07-12

## الان
**فلوی auth (ورود/فراموشی رمز) پیاده‌سازی شد — uncommitted روی `main`**:
- صفحات: `/login`، `/login/otp`، `/login/password`، `/login/forgot`، `/login/forgot/otp`، `/login/forgot/new-password`، `/login/forgot/done` + `/signup` (placeholder)
- کامپوننت‌های مشترک: `PhoneInput`، `OtpForm`، `AuthLayout` در `src/components/auth/`
- `src/services/auth.ts` → کاملاً mock (→ see CLAUDE.md Architectural Decisions)
- این session سه باگ پیدا و فیکس شد: PinInput فارسی‌نویسی (reject می‌شد)، PinInput autoFocus race با hydration (فقط خانهٔ اول پر می‌شد)، AuthLayout centering (`flex=1` بدون `justify`) — جزئیات در CLAUDE.md § Chakra v3 Known Issues

## بعدی
- commit تغییرات فعلی (uncommitted: `login/`, `signup/`, `components/auth/`, `services/auth.ts`, `views/auth/`, `Layout.tsx`)
- ادامهٔ auth flow (کاربر مشخص نکرد کدوم بخش — احتمالاً تکمیل `/signup` که فعلاً فقط placeholder-است)

## نکته
- برای autoFocus روی PinInput همیشه سطح `Root` بذار، نه روی `Input` — جزئیات: CLAUDE.md
