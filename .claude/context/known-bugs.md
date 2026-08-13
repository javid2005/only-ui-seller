# Vitrina — Project-Specific Bugs
> آخرین آپدیت: 2026-08-13

باگ‌هایی که در پروژه Vitrina کشف شدن و project-specific هستن.
برای باگ‌های DS-level → `dev-knowledge/design-systems/chakra-ui-v3/known-bugs.md`

---

## 🔴 باگ‌های تأییدشده

<!-- فرمت:
### عنوان کوتاه
**Symptom:** چه اتفاقی می‌افته
**Fix:** راه‌حل
**Context:** چه موقع رخ می‌ده (اگه project-specific است توضیح بده)
-->

### type-check سبز ≠ کد درست — شکاف `.svg` import
**Symptom:** import تصویر (`.svg`, `.png`) در Next یک **object** (`StaticImageData`) می‌ده نه string، ولی Next نوع `.svg` را `any` اعلام می‌کند → `tsc` **هیچ خطایی نمی‌دهد** و باگ فقط در runtime دیده می‌شود (تصویر لود نمی‌شود).
**Fix:** همیشه `.src` بگیر: `src={logo.src}`. الگو: `Navbar.tsx`, `data.ts`, `Categories.tsx`.
**Context:** هر جا asset import می‌شود.

<!-- منسوخ (1405/08/13): ورودی قبلی درباره‌ی «`tsc -b` نه `tsc --noEmit`» حذف شد.
     آن مربوط به دوران Vite بود (`tsconfig.app.json` + project references). پروژه به
     Next 16 مهاجرت کرده، `tsconfig.app.json` دیگر وجود ندارد و فقط `tsconfig.json` هست.
     type-check فعلی: `npx tsc --noEmit` یا `pnpm build` — هر دو معتبرند. -->

**نمونه‌های تایپی که همچنان معتبرند:**
- `<Box as="img" src={...}>` → TS2322 (`src` روی Box polymorphic نیست). راه‌حل: `<Image>` چاکرا.
- `onValueChange={(e) => setView(e.value)}` روی `SegmentGroup` → TS2345 چون `e.value` نوعش `string | null`ـه. راه‌حل: `e.value ?? 'default'`.

---

## 🟡 نکات احتیاطی

*هنوز نکته‌ای ثبت نشده.*
