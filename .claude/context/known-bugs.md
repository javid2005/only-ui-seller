# Vitrina — Project-Specific Bugs
> آخرین آپدیت: 2026-08-15

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

### ستون action جدول به لبهٔ اشتباه می‌چسبد (`justify` گم/غلط روی Flex)
**Symptom:** `Table.Root` پیش‌فرض `table-layout: auto` دارد، پس هر وقت ستون آخر (action-button) از محتوای واقعی‌اش پهن‌تر بشه، `Flex` بی `justify` صریح به لبهٔ **راست سلول** می‌چسبد نه به لبهٔ چپ جدول (end در RTL) — دقیقاً برعکس آنچه دیده می‌شه. با چشم/کد سخته تشخیصش، فقط با `getBoundingClientRect` روی viewport واقعی معلوم می‌شه.
**Fix:** `<Flex gap="2" justify="end">` صریح روی wrapper ستون action. الگو: `OrderTable.tsx`, `RowActionButtons.tsx` (ProductTable), `CampaignTable.tsx`, `AbandonedCartTable.tsx`.
**Context:** هر جدولی که آخرین ستونش فقط دکمه/آیکون عملیاته. قبل از ساخت جدول جدید با action column، این pattern رو از اول رعایت کن، بعداً کشفش نکن.

### فاصلهٔ زیاد بین ارقام فارسی در Table/Badge (`fontVariantNumeric: tabular-nums`)
**Symptom:** Chakra v3 روی recipe پیش‌فرض `table`(slot `root`) و `badge` مقدار `fontVariantNumeric: "tabular-nums"` ست می‌کنه — بهینه برای ارقام لاتین هم‌عرض، ولی چون گلیف ارقام فارسی در Vazirmatn عرض طبیعی نامساوی دارن، تحمیل عرض یکسان باعث فاصلهٔ بصری زیاد بین رقم‌ها می‌شه (مثلاً `۴۵۰۰۰۰۰۰` در جدول کش میاد ولی همون عدد در `NumberField`/Input درست دیده می‌شه چون اون recipe رو نداره).
**Fix:** override مستقیم روی recipe (نه `globalCss`، چون لایهٔ `recipes` در Panda CSS `@layer` همیشه بعد از `base` میاد و globalCss نمی‌تونه ببردش): `theme.slotRecipes.table.base.root.fontVariantNumeric = 'normal'` + `theme.recipes.badge.base.fontVariantNumeric = 'normal'` در `src/theme/index.ts`.
**Context:** سراسری، همهٔ Table/Badge اپ رو خودکار می‌گیره — یه‌بار fix شده، تکرار لازم نیست.

---

## 🟡 نکات احتیاطی

*هنوز نکته‌ای ثبت نشده.*
