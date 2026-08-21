---
name: Vitrina
description: داشبورد مدیریت فروشگاه — فارسی، RTL-only، Chakra UI v3
omitted:
  - section: colors
    reason: "canonical در src/theme/tokens.ts + CLAUDE.md §Token Reference — اینجا duplicate نمی‌شود (سابقهٔ drift روی focusRing/border)"
  - section: typography
    reason: "استاندارد Chakra v3 + Vazirmatn — canonical در src/theme/tokens.ts"
  - section: spacing
    reason: "استاندارد Chakra v3 scale — canonical در src/theme/tokens.ts"
  - section: rounded
    reason: "استاندارد Chakra v3 scale — نقش هر level در §Shapes پایین توضیح داده شده"
---

# Vitrina — Design Reference

<!-- version: 1 | updated: 2026-08-21 | changelog: ساخته شد — از CLAUDE.md §Layout/§Compact/§Localization، .claude/context/project-context.md، و page-templates.md §Grid منتقل شد. بخش‌های نو: Interaction & States، Accessibility، Motion، Iconography، Do's & Don'ts. -->

> **این فایل چیست:** منبع حقیقت **تصمیم‌های بصری**. «محصول باید چه شکلی باشد».
> **این فایل چه نیست:** gate، پروتکل، قانون اجراشونده → آن‌ها در `CLAUDE.md` (always-on) هستند.
> **کِی خوانده می‌شود:** هر task که UI، styling، layout، responsive، a11y یا motion را عوض می‌کند.

---

## Source of Truth — کدام عدد کجاست

> ⛔ **قانون سخت این فایل: هیچ hex، هیچ عدد spacing، هیچ breakpoint اینجا inline نمی‌شود.** فقط ارجاع.
> سابقه: توکن‌ها یک‌بار بین دو فایل drift کردند (`focusRing`/`border`). تکرار نمی‌کنیم.

| چه چیزی | خانهٔ canonical |
|---|---|
| مقدار توکن brand/map/bg | `src/theme/tokens.ts` · جدول در `CLAUDE.md` §Token Reference |
| scale های Chakra (spacing, radius, shadow, font) | `src/theme/tokens.ts` · مرجع: `dev-stack/knowledge/design-systems/chakra-ui-v3/tokens.md` · runtime: Chakra MCP `get_theme` |
| breakpoints (360/480/1440/1920) | `CLAUDE.md` §Design Scale → Breakpoints |
| قوانین جهت/RTL (اجراشونده) | `CLAUDE.md` §RTL — مرجع واحد · enforce: `dev-engine` rule `one-align-idiom` + `.claude/hooks/rtl_gate.py` |
| ۷ قالب صفحه (نمونه‌های آماده) | `.claude/context/page-templates.md` |
| باگ‌های project-specific | `.claude/context/known-bugs.md` |
| نگاشت نام Figma → import | `.claude/context/figma-resolve.json` |

---

## Overview — جهت طراحی

Vitrina یک **داشبورد مدیریتی متراکم** است، نه یک صفحهٔ بازاریابی. حس هدف: **آرام، دقیق، قابل‌اسکن**.

این حس از این تصمیم‌های قابل‌مشاهده می‌آید:

- **سطح‌بندی با border و فاصله، نه با سایه** — `boxShadow="none"` ۱۴ بار در کد صریحاً نوشته شده؛ `shadow="md"` فقط ۳ بار (overlay). این یک تصمیم است، نه تصادف.
- **یک رنگ برند (`teal`)** فقط برای کنش اصلی و وضعیت انتخاب‌شده — نه برای سطح بزرگ.
- **تراکم بالا بدون خفگی:** panel `p="6"` (24px)، ستون‌ها `gap="10"` (40px).
- **تایپوگرافی بدون تیتر تزئینی** — عنوان بزرگ marketing داخل صفحهٔ محصول نداریم.
- **صفر gradient تزئینی، صفر glassmorphism.**

---

## Colors — نقش و مرز

مقادیر → §Source of Truth. اینجا فقط **کجا استفاده شود و کجا نه**:

| نقش | توکن | استفاده | ⛔ استفاده نکن |
|---|---|---|---|
| کنش اصلی | `brand.solid` | دکمهٔ primary، item فعال sidebar، tab انتخاب‌شده | پس‌زمینهٔ بزرگ، متن بدنه، آیکون تزئینی |
| سطح panel | `bg.panel` | wrapper هر panel/کارت، `SegmentGroup.Indicator` | ستون‌های داخل panel (بدون bg) |
| سطح متناوب جدول | `bg.subtle` | سطر زوج جدول (اگر کاربر تأیید کرد) | جایگزین `.bg` برای کارت |
| خطا / تخریب | `red.*` | validation، حذف، هشدار | نمایش «کاهش» در نمودار — آن معنایی است نه خطا |
| موفقیت / هشدار | `green.*` / `orange.*` | وضعیت سفارش، alert | تأکید تزئینی |

**قانون:** رنگ به‌تنهایی حامل معنا نباشد — همیشه متن یا آیکون همراهش.

---

## Typography

- فونت: **Vazirmatn** (تنها فونت پروژه — فونت دوم اضافه نکن).
- scale = استاندارد Chakra v3.
- ⚠️ تلهٔ شناخته‌شده: `lineHeight` عددی در Chakra v3 شکسته است ← `CLAUDE.md` §«Chakra v3 — قواعد همیشه‌لازم».
- عنوان و زیرعنوان `TitleBar` **هرگز truncate نمی‌شوند** (`whiteSpace="nowrap"` ممنوع). روی 360px عنوان بلند wrap می‌شود — این عمدی است.

---

## Layout & Responsiveness

### Grid — مبنای همهٔ قالب‌ها (canonical)

قالب‌ها بر اساس **span ستون** از grid ۱۲ستونه تعریف می‌شوند — **نه** عرض px ثابت.
px فقط مقدار محاسبه‌شدهٔ span در یک canvas مشخص است. در Figma همان layout-guide است:
`Main → 12 columns · margin 16 · gutter 16 · type: Stretch`.

```
content   = Main − 2×margin             (margin = 16)
colWidth  = (content − 11×gutter) / 12  (gutter = 16)
span(N)   = N×colWidth + (N−1)×gutter
```

**canvas 1920 (Main = 1664px) → colWidth = 121.33px**

| span | px | کاربرد |
|---|---|---|
| 3 ستون | **396** | ستون باریک کناری (End — خلاصه/یادداشت) |
| 6 ستون | **808** | محتوای مرکز باریک (Print-Label) |
| 9 ستون | **1220** | ستون اصلی پهن (Middle — Order Details) |
| 9 + 3 | 1220 + 396 (+16) = 1632 | دوستونه نامتقارن |

`maxW` = `span(N)` در بزرگ‌ترین canvas؛ زیر آن fill می‌شود (Stretch).

→ ۷ قالب آمادهٔ ساخته‌شده روی این grid: `.claude/context/page-templates.md`

### ساختار لایه‌بندی

```
Page
├── Navbar                          ← fill container | محتوا max 1920px
└── Body  [horizontal]
    ├── Main  [vertical]  fill · padding 16 · gap 16
    │   ├── Page-Header
    │   └── Content  [horizontal]  padding 24 · gap 40
    │       ├── Start   ← راست (اول DOM)
    │       ├── Middle  ← مرکز
    │       └── End     ← چپ (آخر DOM)
    └── Sidebar                     ← 256px ثابت
```

### Spacing فریم‌ها

| فریم | padding | gap |
|---|---|---|
| Main | 16px (`p="4"`) | 16px (`gap="4"`) |
| Content | 24px (`p="6"`) | 40px (`gap="10"`) |

عرض‌های محاسبه‌شده در canvas 1920: Body `1664` ← Main `1632` ← Content `1584`.

### اندازه‌ها در هر breakpoint

| متغیر | 480px | 1440px | 1920px |
|---|---|---|---|
| Navbar width | 512 | 1440 | 1920 |
| Main width | 512 | 1184 | 1664 |
| Sidebar width | 0 | 256 | 256 |
| Content start | 0 | 256 | 256 |

### قواعد پوستهٔ صفحه

- Navbar: full-width، بدون `maxW` روی container بیرونی. ترتیب DOM (RTL): Min/Max | Bell | Avatar با `gap="6"`.
- Body: `maxW="1920px" mx="auto"` · در compact: `maxW="512px"`.
- Sidebar: `w="256px"` باز، `w="16"` جمع‌شده.
- **panel های sticky داخل صفحه:** Navbar خودش `position="sticky" top="0"` با `h="16"` (64px) و `zIndex="sticky"` است. هر panel sticky دیگری زیر همان scroll container باید `top="20"` (80px = 64+16) بگیرد، **نه** `top="4"` — وگرنه هر دو روی `top=0` رقابت می‌کنند و چون zIndex نوار بالاتر است، panel زیر آن گم می‌شود. الگوی درست: `NewProduct.tsx` (ستون StepNav)، `ManualOrderNew.tsx` (خلاصه سفارش).
  ⚠️ `OrderDetails.tsx` و `GeneralInfo.tsx` هنوز `top="4"` دارند — احتمالاً همین باگ را دارند.

### Compact / Mobile

`isCompact = true` ⇒ نمای 512px، رفتار موبایل.

- sidebar `display="none"` · hamburger visible
- hamburger با لوگو گروه می‌شود؛ hamburger **اول DOM** → در RTL سمت راست لوگو
- Drawer: `placement="start"` = باز شدن از **راست** در RTL ✓ · `maxW="256px"`
- Drawer header: لوگو (اول = راست) + CloseButton (آخر = چپ) — بدون عنوان
- همیشه `dir="rtl"` روی `Drawer.Positioner`
- همهٔ grid ها → `'1fr'`
- panel: `pt`/`px` = `'4'` (16px) · **`pb` همیشه `'6'` (24px)**

**اجباری برای هر صفحهٔ نو:** media query به **viewport** نگاه می‌کند نه container، پس `maxW="512px"` کافی نیست. هر صفحه‌ای که grid یا padding responsive دارد باید `useCompactMode()` بگیرد — و هر sub-component داخلش (مثل تابع Tab) هم جداگانه.

**⚠️ `isCompact` = toggle، نه تشخیص viewport واقعی.** روی موبایل واقعی همیشه `false` است:

```tsx
// ❌ روی موبایل واقعی می‌شکند — isCompact=false → direction='row' در 360px
direction={isCompact ? 'column' : 'row'}

// ✅ موبایل واقعی از base می‌گیرد، compact مستقیم
direction={isCompact ? 'column' : { base: 'column', lg: 'row' }}
```

قانون: در `isCompact ? X : Y`، اگر `Y` یک string ساده و layout-affecting است (`direction`، `templateColumns`، `order`، `display`) باید به `{ base, breakpoint }` تبدیل شود.

### Breadcrumb

در فضای کم **wrap** می‌شود، هرگز overflow/scroll افقی نه. container = `flexWrap="wrap" w="full"` (نه `overflowX="auto"`، نه `flexShrink={0}`). هر crumb خودش `whiteSpace="nowrap"`؛ شکست فقط بین crumb ها. container-based است → موبایل واقعی و compact هر دو درست کار می‌کنند.

---

## Elevation & Depth

سیستم **مسطح و border-محور** است.

| لایه | ابزار |
|---|---|
| panel / کارت | `borderWidth="1px"` + `borderColor="border"` — **بدون shadow** |
| overlay (menu, popover, dialog, drawer) | `shadow="md"` |
| تأکید درجا | `boxShadow="inset 0 0 0 1px {token}"` |

⛔ سایه برای عمق تزئینی روی محتوای درون‌صفحه‌ای ممنوع.

---

## Shapes

نقش هر level (استخراج‌شده از کد فعلی):

| level | کاربرد | بسامد |
|---|---|---|
| `2xl` | wrapper سطح-panel | 52 |
| `lg` | کارت، Alert، ScrollArea جدول، RadioCard | 88 |
| `md` | عنصر داخلی، تصویر | 50 |
| `sm` | عنصر ریز، badge | 15 |
| `full` | avatar، نشانگر دایره‌ای | 7 |

**قانون panel:** `bg="bg.panel"` + `borderWidth="1px"` + `borderColor="border"` + `rounded="2xl"` + `p="6"` فقط روی **wrapper خود panel**. ستون‌های داخل (Start/Middle/End) هیچ‌کدام `bg` یا `padding` ندارند. محتوای درون هر ستون می‌تواند padding خودش را داشته باشد.

---

## Components

> قاعده: هر چه کامپوننت پرتکرارتر، مستندسازی دقیق‌تر. فقط چیزی را بنویس که agent احتمالاً **غلط حدس می‌زند**.

### Panel
→ §Shapes بالا. کارت داخل کارت ممنوع.

### Button
- در هر گروه کنش فقط **یک** primary.
- کنش تخریبی همیشه تأیید می‌خواهد.
- label با فعل شروع شود و کار را توصیف کند — «حذف انبار»، نه «تأیید».

### Select · NumberField · Sidebar-active
قوانین always-on‌اند → `CLAUDE.md` §Conventions (بندهای ۱، ۵، ۳). اینجا تکرار نمی‌شوند.

### Table
- ستون action آخر: `<Flex gap="2" justify="end">` **صریح** — وگرنه به لبهٔ اشتباه می‌چسبد (باگ ثبت‌شده در `known-bugs.md`).
- سطر متناوب: قبل از ساخت از کاربر بپرس؛ پیش‌فرض `bg.subtle`.
- عدد → راست‌چین نه، **`start`** (در RTL یعنی راست).
- حالت خالی و در-حال-بارگذاری اجباری است.

### EmptyState
`EmptyState.Root` چاکرا (۹۸ استفاده در کد). هر لیست/جدول/tab که می‌تواند خالی باشد باید داشته باشد. متن باید بگوید **قدم بعدی چیست**، نه فقط «موردی نیست».

---

## Interaction & States

هر کامپوننت تعاملی باید این حالت‌ها را **صریح** داشته باشد:

| حالت | وضعیت فعلی در کد | الزام |
|---|---|---|
| default | ✅ | — |
| hover | ✅ `_hover` ۸۲ بار | — |
| active/pressed | ⚠️ `_active` فقط ۱ بار | برای هر کنترل کلیک‌شونده لازم است |
| disabled | ⚠️ prop `disabled` ۱۹۱ بار ولی `_disabled` صفر | استایل صریح لازم است — نه اتکا به پیش‌فرض |
| loading | ⚠️ `loading` ۵۸ بار، بدون Skeleton/Spinner استاندارد | الگوی واحد لازم است |
| focus-visible | ❌ `_focusVisible` صفر | **شکاف a11y — پایین** |
| empty | ✅ `EmptyState` ۹۸ بار | — |
| error | ✅ Alert + validation | پیام باید راه‌حل بدهد |

> 📌 **TODO — تصمیم گرفته نشده:** الگوی واحد `loading` (Skeleton یا Spinner یا `loading` prop دکمه؟) و استایل `_disabled`. تا وقتی تصمیم نگرفته‌ایم، از الگوی پیش‌فرض Chakra تخطی نکن و اینجا ثبتش کن.

---

## Accessibility

> **وضعیت فعلی:** `aria-label` ۱۱۶ بار، `aria-hidden` ۶ بار، `aria-expanded` ۱ بار، `_focusVisible` **صفر**، `prefers-reduced-motion` **صفر**. این بخش بیشتر «مقصد» است تا «موجود».

- **کنتراست:** حداقل WCAG AA (۴.۵:۱ متن، ۳:۱ عنصر کنشی و border). ترکیب رنگ سفارشی خارج از توکن‌ها ساخته نشود.
- **کیبورد:** هر کنترل باید با Tab قابل‌رسیدن و با Enter/Space فعال‌شدنی باشد. `onClick` روی `Box`/`div` بدون `role` و `tabIndex` ممنوع.
- **focus قابل‌دیدن:** حلقهٔ focus هرگز حذف نشود. `brand.focusRing` توکنش موجود است — استفاده شود.
- **معنا فقط با رنگ نه:** وضعیت (موفق/خطا/هشدار) همیشه متن یا آیکون همراه داشته باشد.
- **پیام خطا به فیلدش وصل باشد** (`aria-describedby`)، نه فقط متن شناور.
- **آیکون بدون label:** اگر آیکون تنها محتوای دکمه است، `aria-label` فارسی اجباری. آیکون تزئینی → `aria-hidden`.
- **زبان و جهت:** `dir="rtl"` + `lang="fa"` روی `<html>` (در `src/app/layout.tsx`).

---

## Motion

مقادیر استخراج‌شده از کد فعلی — اینها استاندارد شوند:

| نوع | duration | easing | نمونه |
|---|---|---|---|
| تغییر رنگ (bg، border، color) | **150ms** | پیش‌فرض | `transition="background 0.15s"` (۱۶ استفاده) |
| بازخورد فوری | 100ms | پیش‌فرض | `transition="background 0.1s"` |
| محو/ظهور | 200ms | پیش‌فرض | `transition="opacity 0.2s"` |
| تغییر چیدمان (accordion، جمع‌شدن sidebar) | **280ms** | `ease-in-out` | `grid-template-rows 0.28s ease-in-out` |

- سقف: هیچ transition ای بالای **300ms** نرود.
- motion فقط برای **توضیح تغییر وضعیت** — نه تزئین. انیمیشن ورود برای تک‌تک عناصر صفحه ممنوع.
- ⛔ **شکاف باز:** `prefers-reduced-motion` هیچ‌جا رعایت نشده. هر motion نو باید آن را احترام بگذارد (حرکت → صرفاً opacity).

---

## Iconography

- کتابخانه: **`lucide-react`** (^1.14.0) — **تنها** کتابخانهٔ آیکون. آیکون از منبع دیگر یا SVG دستی اضافه نکن.
- `strokeWidth` هیچ‌جا override نشده → پیش‌فرض lucide (`2`) استاندارد است. تغییرش نده.
- اندازه‌های استاندارد (بر اساس بسامد واقعی):

| اندازه | کاربرد | بسامد |
|---|---|---|
| **16** | پیش‌فرض — داخل دکمه، جدول، فهرست | 148 |
| 14 | کنترل فشرده، badge | 70 |
| 20 | آیکون sidebar، عنوان | 55 |
| 24 | هدر، EmptyState | 25 |

- عدد دلخواه نساز — از این چهار انتخاب کن.
- filled و outline در یک ناحیهٔ ناوبری قاطی نشوند.
- آیکون بدون متن برای کنش ناآشنا ممنوع (بدون tooltip/label).
- **جهت:** آیکون‌های جهت‌دار (فلش، chevron) در RTL باید flip شوند — `dev-engine` rule `icon-direction` خودکار چک می‌کند.

---

## Product Content — لحن فارسی

```
user می‌بیند؟ → فارسی        code می‌خواند؟ → انگلیسی
```

- **عدد فارسی اجباری** برای هر عدد قابل‌مشاهده: قیمت، تعداد، موجودی، pagination، آمار، جدول. از `src/utils/numbers.ts` رد کن (`toPersianDigits`). enforce: `dev-engine` rule `persian-numerals`.
- **لاتین بمان، هرگز convert نکن:** مقدار `<input>` · request/response API · محاسبات · ID و کد (`SKU-123`) · URL.
- **تاریخ نمایشی = جلالی** — locale `fa-IR-u-ca-persian` (نه فقط `fa-IR`). فیلد تاریخ = `src/components/ui/DatePicker.tsx` را import کن، دوباره نساز. ورودی/خروجی همچنان ISO میلادی `YYYY-MM-DD`.
- **واحد پول پیش‌فرض:** «تومان».
- label دکمه با **فعل** شروع شود. «بله/خیر/تأیید/ارسال» وقتی گزینهٔ گویاتری هست ممنوع.
- پیام خطا بگوید **چه شد** و **کاربر چه کند**.

---

## Do's & Don'ts

**Do**
- از کامپوننت موجود در `src/components` استفاده کن؛ اول جست‌وجو، بعد ساخت.
- عرض را با span ستون بگیر، نه px دلخواه.
- سطح را با border بساز.
- هر حالت (خالی، بارگذاری، خطا) را همان اول در نظر بگیر.

**Don't**
- ⛔ رنگ/spacing/radius خارج از توکن — `dev-engine` error می‌دهد.
- ⛔ gradient تزئینی، glassmorphism، backdrop-blur (مگر صریحاً خواسته شود).
- ⛔ تیتر بزرگ marketing داخل صفحهٔ محصول.
- ⛔ emoji به‌عنوان آیکون محصول.
- ⛔ کارت داخل کارت.
- ⛔ همه‌چیز را برجسته کردن — در هر نما یک کنش اصلی.
- ⛔ ساخت کامپوننت نو وقتی معادلش هست.
- ⛔ نوشتن دو نسخهٔ per-direction — یک DOM بنویس، `dir` خودش flip می‌کند.

---

## Figma Variables — حالت پیش‌فرض طرح

> این‌ها **وضعیت فایل Figma** را توصیف می‌کنند (کدام حالت در mockupها روشن است)، نه قانون کد.
> موقع خواندن یک frame، اگر چیزی در طرح دیده نشد، اول اینجا را چک کن.

| Variable | Default |
|---|---|
| `Theme/Light` | `true` |
| `Theme/Dark` | `false` |
| `Theme/isChecked` | `false` |
| `Products/Show Discount` | `false` |
| `Products/Show Selected-Prd CTA` | `true` |
| `Products/Currency/Show Currency-Alert` | `false` |
| `Badge` | `true` |
| `btnScreen/Show Maximize` | `false` |
| `btnScreen/Show Minimize` | `true` |
| `Products/Currency/Currency` | `تومان` |

---

## Maintenance & Validation

- **کِی آپدیت شود:** الگوی reusable نو تأیید شد · نقش رنگ عوض شد · قاعدهٔ layout/responsive عوض شد · تصمیم motion/icon/a11y گرفته شد. (skill `wf-update` این را چک می‌کند.)
- **کِی آپدیت نشود:** مقدار توکن عوض شد → `tokens.ts` و `CLAUDE.md` §Token Reference. باگ پیدا شد → `known-bugs.md`. قالب صفحهٔ نو → `page-templates.md`.
- **سقف:** ~۳۵۰ خط. اگر بلندتر شد، یعنی چیزی اینجاست که خانهٔ دیگری دارد.
- **اعتبارسنجی ساختاری:**
  ```
  npx @google/design.md lint DESIGN.md
  ```
- **تعارض دیدی؟** کد برنده است. این فایل را اصلاح کن، نه برعکس — و تعارض را گزارش بده.
