# Vitrina — Handoff
> 2026-08-17

## الان
از آخرین commit (`e7ef285`، sync README) هیچ کد اپلیکیشنی عوض نشده. کارِ این session
فقط روی مستندات بود و **uncommitted** است — در دو repo:
- `CLAUDE.md` — بازساختاردهی: ۶۴۴→۶۰۷ خط (۵۲.۲→۴۵.۵KB). کاتالوگ ۲۳تایی باگ Chakra
  به ۴ قاعدهٔ همیشه-لازم + جدول ایندکس ۱۴ ردیفی تبدیل شد؛ تکرارهای `w="full"`،
  DOM-order، DatePicker، `bg.panel` حذف؛ Localization و dev-engine فشرده.
- `dev-stack/knowledge/design-systems/chakra-ui-v3/known-bugs.md` — canonical شد:
  ۹ باگ Vitrina-only منتقل شد، دو ورودیِ **غلط** اصلاح شد (`textAlign="right"` به‌عنوان
  راه‌حل RTL · `bg="white"` به‌عنوان جایگزین `bg.default`)، یک ارجاع مردهٔ Combobox پر شد.

→ تصمیم لایه‌بندی مستندات ثبت شد: CLAUDE.md Architectural Decisions.

## بعدی
commit هر دو repo (دو پیام جدا) — با skill `wf-commit`.
⚠️ `dev-stack` دو فایل uncommitted **از قبل** هم دارد (`HANDOFF.md`,
`scripts/check-refs.mjs`) که کار این session نیستند — قاطی نکن.

## باگ‌های open
- `CommentCard.tsx` — fix آخرِ Avatar alignment موبایل هنوز preview نشده (ship شده بدون تأیید بصری).
