# Vitrina — Handoff
> 2026-08-13

## الان
دیالوگ‌های کپی/حذف محصول و ریسپانسیو FilterBar (از قبل) commit شده‌اند
(`e879e65`). جدا از این، این session روی **بهینه‌سازی pipeline Figma→code** کار شد
(uncommitted):

- **CLAUDE.md + `.claude/context/*.md`** — مرجع شکستهٔ `page-templates.md` فیکس شد
  (اشاره به مسیری در dev-knowledge که وجود نداشت)، `known-bugs.md`/`project-context.md`
  از دوران Vite به Next 16 sync شدند (`tsc -b`، `DashboardLayout.tsx` و مسیرهای دیگری
  که دیگر وجود نداشتند)، و تکرار داخل CLAUDE.md (تاریخچهٔ incident در دو جا) به یک
  جا ادغام شد.
- **دو فایل uncommitted جدا** هست که این session دست نزده:
  [FilterResultBadges.tsx](src/components/products/list/FilterResultBadges.tsx)
  (بازنویسی با `Tag` چاکرا) و
  [RowActionsMenu.tsx](src/components/products/list/RowActionsMenu.tsx) — منشأشان
  روشن نیست، قبل از commit باید بررسی شوند.

## بعدی
- سه repo (Vitrina + dev-agents + dev-knowledge) با هم commit شوند — به هم وابسته‌اند.
  جزئیات کار مشترک → `~/Documents/GitHub/Tools/dev-agents/HANDOFF.md`.
- فاز ۳ pipeline بهینه‌سازی: `vision-diff` (crop + pixel-diff بدون مدل خارجی).
- تکلیف دو فایل uncommitted بالا روشن شود.

## باگ‌های open
(چیزی گزارش نشده)
