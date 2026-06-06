# Vitrina — Project-Specific Bugs
> آخرین آپدیت: 2026-06-06

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

### type-check واقعی = `tsc -b` نه `tsc --noEmit`
**Symptom:** `pnpm tsc --noEmit` سبز می‌ده ولی `pnpm build` (که `tsc -b && vite build` هست) fail می‌شه. علت: `tsc --noEmit` از tsconfig root (loose) می‌خونه؛ build از project references (`tsconfig.app.json`) که سخت‌گیرتره.
**نمونه‌ها که فقط `tsc -b` می‌گیره:**
- `<Box as="img" src={...}>` → TS2322 (`src` روی Box polymorphic وجود نداره). راه‌حل: کامپوننت `<Image>` چاکرا.
- `onValueChange={(e) => setView(e.value)}` روی `SegmentGroup` → TS2345 چون `e.value` نوعش `string | null`ـه. راه‌حل: `e.value ?? 'default'`.
**Fix:** برای gate «type-check سبز» همیشه `pnpm exec tsc -b` (یا `pnpm build`) — نه `tsc --noEmit`. dev-engine هم همین `tsc -b` رو می‌زنه.
**Context:** هر DoD / verify در این پروژه.

---

## 🟡 نکات احتیاطی

*هنوز نکته‌ای ثبت نشده.*
