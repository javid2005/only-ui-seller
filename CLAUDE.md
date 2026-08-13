# Vitrina — Claude Reference

## Knowledge References

→ repo خارجیِ مشترک — **بیرون پروژه است، auto-load نمی‌شود؛ موقع نیاز با Read باز کن.**
ریشه: `~/Documents/GitHub/Tools/dev-knowledge/` — مسیرهای جدول زیر نسبت به همین ریشه‌اند.

| موضوع | فایل (نسبت به ریشهٔ بالا) |
|-------|------|
| RTL concepts | `dev-knowledge/universal/language.md` |
| Chakra v3 bugs | `dev-knowledge/design-systems/chakra-ui-v3/known-bugs.md` |
| Chakra v3 tokens | `dev-knowledge/design-systems/chakra-ui-v3/tokens.md` |
| RTL در Chakra | `dev-knowledge/design-systems/chakra-ui-v3/chakra-ui-v3.md` |
| Figma→Code workflow | `dev-knowledge/universal/figma-to-code.md` |
| Chakra v3 components | `dev-knowledge/design-systems/chakra-ui-v3/components.md` |

→ **محتوای مخصوص همین پروژه — داخل repo، نه dev-knowledge:**

| موضوع | فایل |
|-------|------|
| Page Templates | `.claude/context/page-templates.md` |
| باگ‌های project-specific | `.claude/context/known-bugs.md` |
| Context طراحی (grid، Figma variables، layout) | `.claude/context/project-context.md` |

---

## Protocols

### Figma Access Gate (اجباری — بالاتر از همه)

**اگه Figma tool خطا داد یا data برنگشت → STOP. هیچ کدی نزن.**

```
Figma tool fail شد؟
  → اول مشکل دسترسی رو حل کن (tool دیگه امتحان کن، از کاربر بخواه node-id/link دوباره بده)
  → هرگز با حدس/ذهن خودت ادامه نده
  → هرگز محتوا (text، label، color، layout) از خودت نساز
  → اگه بعد از تلاش باز هم نشد → به کاربر بگو و منتظر بمون

مجاز نیست:
  ✗ ادامه دادن بدون Figma data
  ✗ حدس زدن TitleBar text / button label / component variant
  ✗ ساختن layout از پیش‌فرض‌های ذهنی
  ✗ گفتن «data نگرفتم ولی ادامه می‌دم»
```

---

### Root Cause Protocol (اجباری)

وقتی inconsistency یا نقص پیدا شد — فقط instance جاری رو fix نکن:

```
1. ریشه کجاست؟
   - doc ناقص/غلط  → fix the doc first
   - implementation منحرف شده از doc  → fix implementation + verify doc
2. source رو fix کن
   - pattern پروژه‌ای  → CLAUDE.md یا `.claude/context/` همین پروژه
     (page-templates, known-bugs پروژه‌ای, project-context)
   - pattern shared  → dev-knowledge/ (language, tokens, DS known-bugs, ...)
3. همه instance‌های affected رو fix کن (نه فقط فایل جاری)
```

> مثال: panel border در Categories نبود → ریشه = page-templates.md ناقص بود
> → اول page-templates آپدیت → بعد همه صفحات fix

---

### Scope Triage (اجباری — اول هر تغییر، قبل از Figma→Code)

هر task → اول tier رو تعیین کن. tier تعیین می‌کنه چقدر pipeline لازمه:

| Tier | چیه | کار | screenshot؟ |
|------|-----|-----|------------|
| **0 — trivial** | متن/label، rename، comment، config | فقط Edit | ❌ |
| **1 — code/style** | prop، token swap، spacing، bugfix، refactor، ریسپانسیو روی component موجود — **بدون surface نو از Figma** | Edit + `npx tsc --noEmit` | فقط اگر چیدمان عوض شد |
| **2 — Figma→code نو** | frame/page/component نو از Figma، یا تغییری که باید pixel با Figma spec بخوره | کل Protocol پایین | ✅ اجباری |

- **screenshot در Tier 2 اجباری است، نه opt-in، و بدون پرسیدن انجام می‌شود** (تغییر روش،
  کاربر، 1404/05/09 — قاعدهٔ قبلی «همیشه اول بپرس» حذف شد چون همان یک پرسش که «نه» جواب
  گرفت، باعث ship شدن ۷ نقص شد). فقط اگر کاربر صریح گفت لازم نیست، رد شو.
- **MCP Figma fetch فقط Tier 2.** Tier 0/1 از local cache، صفر MCP call.
- **شک بین دو tier؟ → پایین‌تر رو بگیر**، لازم شد escalate کن. سرعت اول.

مرجع عمیق: `dev-knowledge/universal/scope-triage.md`

---

### Figma → Code Protocol (اجباری — فقط Tier 2)

هر task که از Figma به کد تبدیل میشه — حتی «اصلاح کن» / «مقایسه کن» / «ریسپانسیو کن» — این gate رو رد نکن.

**گام ۰ — جدول ترجمه (اجباری، قبل از هر خط کد):**

بعد از `get_screenshot` و **قبل از** Component Resolution، برای هر المان جهت‌دارِ
آن node یک ردیف بنویس. تا جدول پر نشده، کد نزن.

| # | المان | در طرح دیده می‌شود | ترجمه | مقدار در کد |
|---|-------|---------------------|-------|-------------|
| ۱ | عنوان کارت | راست‌چین | راست در RTL = `start` | `textAlign="start"` |
| ۲ | Badge وضعیت | گوشهٔ **چپ**-بالا | چپ در RTL = `end` | `insetInlineEnd` + `top` |
| ۳ | دکمه با آیکون ✓ | آیکون سمت **راستِ** متن | راست‌ترین = اولین فرزند | `<Check/>` اول ← بعد متن |

> الگوی واقعی این جدول در کد: `src/components/settings/themes/ThemeCard.tsx`
> (هر سه ردیف بالا از همان کامپوننت‌اند و هر سه کامنت توضیحی کنارشان دارند).

```
❌ ممنوع: ستون «در طرح دیده می‌شود» را از خروجی get_design_context بنویسی
          → آن کد با فرض LTR تولید شده؛ ترجمهٔ غلط است نه داده. از screenshot بخوان.
❌ ممنوع: ستون «ترجمه» را حذف کنی چون «بدیهی» است
          → همین ستون است که فلیپ را از فرض ضمنی به تصمیم نوشته‌شده تبدیل می‌کند.
❌ ممنوع: در یک تصحیح، هم‌زمان ترتیب DOM و مقدار logical را عوض کنی
          → یا خنثی می‌شوند یا دوباره برعکس. هر بار فقط یک متغیر.
✅ اجباری: حداقل یک برچسب/دکمهٔ کوتاه در جدول باشد — المان w="full" باگ جهت را پنهان می‌کند.
```

چرا لازم است (مکانیزم دابل-فلیپ، قانون ترجمه، استثناها):
`dev-knowledge/universal/language.md` § «دابل-فلیپ» — منبع canonical، تکرارش نکن.

**Component Resolution (به ترتیب، اجباری):**
```
1. Local first → src/components/ رو grep کن. موجوده؟ import کن (نساز).
2. DS second   → از Chakra UI MCP بگیر. هیچ‌وقت کامپوننت DS رو از HTML/div خام rebuild نکن.
3. Build last  → فقط اگه هیچ‌کدوم نبود، با primitives (Box/Flex/Text). صفر hardcode.
```

**DS second — نحوه صحیح استفاده (اجباری):**
```
step 1: dev-knowledge/design-systems/chakra-ui-v3/components.md رو چک کن (بدون tool call)
         → اسم component اونجاست؟ بله → step 2. نه → step 3 (Build last)
step 2: mcp__chakra-ui__get_component_example → snippet بگیر
step 3: snippet رو عیناً src/components/ui/[name].tsx کپی کن
step 4: فقط Vitrina-specific adaptation اضافه کن (RTL، icon، token)

❌ ممنوع: بدون چک کردن components.md شروع به ساختن کردن
❌ ممنوع: snippet گرفتن ولی دور انداختن و از scratch نوشتن
❌ ممنوع: «RTL نیاز به تغییر داره» → rewrite کل component
✅ مجاز: snippet + اضافه کردن startElement/endElement برای RTL icons
✅ مجاز: snippet + swap کردن startElement/endElement برای RTL direction
```

**⚠️ Figma DOM order ≠ RTL DOM order** → قاعده، جدول الگوها و استثنای namespace componentها
یک‌جا در «RTL — مرجع واحد» (پایین‌تر). تکرارش نکن؛ همان یک مرجع را بخوان.
نکتهٔ مخصوصِ این مرحله: `get_design_context` فرزندها را چپ→راست لیست می‌کند، پس
**هرگز** ترتیب خروجی‌اش را برای یک container افقی verbatim کپی نکن — از screenshot بخوان.

**Component descriptions = implementation checklist (اجباری):**
```
get_design_context output بخش "Component descriptions" داشت؟
  → آن لیست = تمام DS componentهای استفاده‌شده در آن node
  → قبل از نوشتن هر sub-element، اسمش رو در آن لیست چک کن
  → هر component لیست‌شده باید از DS import بشه — rebuild ممنوع

مثال: Figma گفت Badge استفاده شده → <Badge> از Chakra، نه <Text bg="purple.50">
مثال: Figma گفت Alert استفاده شده → <Alert.Root>، نه <Flex bg="blue.50">
```

**Token mapping — semantic، نه palette خام (اجباری):**
```
get_variable_defs اسمِ semantic متغیر Figma رو می‌ده (مثل bg/teal، teal/muted)، نه فقط hex.
→ همون اسم semantic رو به توکن semantic پروژه map کن — نه به palette خام با hex-match.

❌ ممنوع: bg/teal (#f0fdfa) → teal.50   (palette خام — در dark mode adapt نمی‌کنه = باگ)
✅ درست:  bg/teal → brand.bg · teal/muted → brand.muted   (light همون hex، dark خودکار)

قانون: برای surfaceهای theme-able (bg/border/fg) هرگز palette خام (teal.50، gray.200…) نذار
وقتی توکن semantic معادل وجود داره. hex در light یکیه ولی raw در dark می‌شکنه.
⚠️ این رو gate hardcode نمی‌گیره (teal.50 یک token هست) و dev-engine هم پاسش می‌ده —
   پس دستی چک کن: هر رنگِ کارت/پنل/سطح = توکن semantic، نه palette.

سابقه: 1404 — Print-Label کارت گیرنده با teal.50/teal.200 (خام) ship شد → dark mode روشن موند.
```

**MCP servers این پروژه:**
- Chakra UI MCP — `mcp__chakra-ui__list_components` / `get_component_example` / `get_component_props` / `get_theme`
- Figma MCP — `get_design_context` / `get_screenshot` / `get_variable_defs`

---

### Definition of Done (اجباری — آخر هر task)

point-by-point گزارش بده. چک skip‌شده = ⚠️ نه ✅.

- [ ] **جدول ترجمه قبل از کد نوشته شد** (Tier 2) — چند ردیف؟ کدام‌ها `end` شدند و چرا؟
- [ ] Component Resolution رعایت شد (Local→DS MCP→Build) — کدوم مسیر؟
- [ ] صفر hardcode (رنگ/spacing/font) — همه token
- [ ] type-check سبز (`npx tsc --noEmit` یا `pnpm build` — اسکریپت `type-check` وجود نداره)
- [ ] **مقایسهٔ preview با طرح** (اجباری برای Tier 2 — روش اصلیِ تشخیص چیدمان، پایین ↓)
- [ ] `dev-engine .` بدون error — مرجع: «RTL — مرجع واحد»

مرجع عمیق: `dev-knowledge/universal/figma-to-code.md`

---

### dev-engine CLI — اجرای صحیح (اجباری)

`dev-engine` حالا **گلوبال لینک شده** (`npm link` از پکیج) و مستقیم در PATH هست:
```bash
dev-engine --version      # باید 0.1.0 بده
```
اگه یه روز `command -v dev-engine` چیزی برنگردوند (مثلاً بعد از پاک‌شدن node_modules)،
**متوقف نشو و چک رو skip نکن** — یکی از این دو:
```bash
cd ~/Documents/GitHub/Tools/dev-agents/packages/dev-engine && npm run build && npm link
# یا مستقیم:
node ~/Documents/GitHub/Tools/dev-agents/packages/dev-engine/dist/cli.js <args>
```
> سابقه: 1404 — اسکیل‌ها `command -v dev-engine || "به کاربر بگو نصب کنه و stop"` داشتن؛
> چون لینک نبود، یه session کامل بدون هیچ چکی کد زد و بعداً معلوم شد pipeline اجرا نشده.
> **قانون: step اجرا نشد → یا درستش کن، یا به کاربر بگو. هیچ‌وقت بی‌صدا رد نشو.**

**⚠️ gotcha:** آرگومان `path` هم‌زمان هم root اسکن فایل‌هاست هم root حل‌کردن config
(`.dev-engine.json`, `.claude/context/figma-resolve.json`). اگه یه subdirectory بدی نه repo
root، configها silently پیدا نمی‌شن. **همیشه از repo root با `path="."` اجرا کن.**

**چه چیزی را همچنان می‌گیرد:** `one-align-idiom` (مقدار فیزیکی چیدمان) · `dom-order` (آیکن
بعد از متن) · `icon-direction` · `persian-numerals` · hardcode رنگ/spacing.
**چه چیزی را نمی‌گیرد:** اینکه `start` درست است یا `end`، و اینکه ساختار با طرح می‌خواند
یا نه → آن دو فقط با مقایسهٔ preview (بخش «تطابق با طرح فیگما»).

---

### تطابق با طرح فیگما — از روی preview (اجباری برای Tier 2)

**تنها روش معتبر مقایسهٔ چیدمان: screenshot طرح کنار screenshot preview + اندازه‌گیری DOM.**
هیچ استنتاج ذهنی، هیچ محاسبهٔ x دستی، هیچ snapshot متنی.

```bash
# ۱. طرح را بگیر و لازم بود crop کن (تصویر خام معمولاً بلندتر از آن است که خوانا باشد)
#    get_screenshot(nodeId, fileKey, maxDimension=2683) → curl → python3 -c "PIL … .crop(box)"
# ۲. preview را بالا بیاور: preview_start({name:"vitrina-dev"}) → پورت 5174
#    ⚠️ navigate گاهی path را می‌خورد؛ مطمئن‌ترین راه:
#       javascript_tool: window.location.assign('http://localhost:5174/<path>')
# ۳. screenshot preview بگیر (عرض ≤1024 بده وگرنه خروجی به 800px اسکیل و ناخوانا می‌شود)
# ۴. عدد بگیر، به چشم اکتفا نکن ↓
```

**اندازه‌گیری DOM — گام ۴، حیاتی:** چشم روی «۵۷۰ یا ۵۸؟» گول می‌خورد، عدد نه. با
`javascript_tool` مرزهای عناصر کلیدی و مرز پنل والد را بگیر و مقایسه کن:

```js
const box = (n) => `l=${Math.round(n.getBoundingClientRect().left)} r=${Math.round(n.getBoundingClientRect().right)}`
// راست‌چین درست = r عنصر == r پنل  ·  چپ‌چین = l عنصر == l پنل
```

> ⚠️ عنصری که `w="full"` دارد جابه‌جا نمی‌شود؛ فقط عناصر کوتاه (برچسب، دکمه، فیلد با maxW)
> باگ جهت را نشان می‌دهند. این و بقیهٔ تله‌ها + تاریخچهٔ incidentها ←
> § «⛔ قانون طلایی» پایین‌تر (**تنها** جای درس‌ها؛ اینجا تکرار نمی‌شود).

**چرا این بخش وجود دارد:** `dev-engine` و type-check می‌سنجند «کد با آنچه *من گفتم*
درست است می‌خواند؟» — وقتی خودِ فهم من معکوس باشد، همه سبز می‌مانند. فقط مقایسه با
**خود طرح** آن را می‌گیرد.

> به همین دلیل زیرسیستم snapshot متنی (`layout-diff` / `verify-render` / `layout-sync` /
> `figma-layout.json` / anchorهای `data-layout`) در 1405/05 **ریشه‌ای حذف شد** — از engine،
> از هر دو skill، و از این پروژه. snapshot و کد هر دو از یک خواندنِ screenshot می‌آمدند،
> پس سبزشدنش یک تأیید خودارجاع بود. تنها بازمانده `dev-engine layout-derive` است که سمت
> را از **هندسهٔ خام** حساب می‌کند و فقط چاپ می‌کند (سوخت جدول ترجمه، نه یک چک).

---

## Stack

- React 19 + **Next.js 16 (App Router)** + TypeScript
- Chakra UI v3 + `@chakra-ui/charts` (BarSegment, BarList — wraps recharts)
- RTL / Persian (Vazirmatn font)
- pnpm
- Dev: `pnpm dev` (Next dev, Turbopack — port 5174 via `.claude/launch.json`) · Build: `pnpm build` · Serve prod: `pnpm start`

### Architectural Decisions

| موضوع | تصمیم | چرا |
|-------|-------|-----|
| Auth | `src/services/auth.ts` کاملاً mock (delay مصنوعی، بدون API واقعی) | تا وصل‌شدن به backend. `checkPhoneExists`: رقم آخر شماره فرد=کاربر جدید (signup)، زوج=کاربر موجود (login) — تا هر دو مسیر تست‌پذیر باشن |
| Signup progress | `getSignupProgress`/`saveSignupStep` در `auth.ts` با `localStorage` mock می‌شه | با همون شماره، کاربر به آخرین مرحلهٔ ذخیره‌شدهٔ signup برمی‌گرده (بعد از OTP verify) |
| OTP verify | `verifyOtp` در `auth.ts`: کد `۰۰۰۰۰` رد می‌شه، هر کد ۵رقمی دیگه تایید می‌شه | مسیر «کد اشتباه» تست‌پذیر باشه — همهٔ نقاط PinInput (`OtpForm`, `OtpDialog`, `AuthQrDialog` در `TwoFactorSection.tsx`) هم روی همین قرارداد auto-submit/auto-error دارن |
| Jalali DatePicker | `src/components/ui/DatePicker.tsx` — دستی با `Intl.DateTimeFormat('...-ca-persian-nu-latn')`، صفر کتابخانهٔ خارجی | هیچ پکیج jalali/date در پروژه نبود؛ ICU خودش leap-year/طول ماه رو حساب می‌کنه، پس نیازی به پیاده‌سازی الگوریتم تقویم یا اضافه‌کردن dependency نیست |
| چیدمان RTL | یک idiom (`start`/`end`) + سمت از **مقایسهٔ screenshot طرح با preview** تأیید می‌شود، نه از خروجی کد فیگما و نه با استدلال ذهنی | چهار incident (1404/05/12 ×۲، 05/17، 05/09) همه از قضاوت دستی آمدند؛ لایه‌های متنی هر بار سبز بودند. جزئیات: «RTL — مرجع واحد» |
| گیت چیدمان | hook `Stop` → `.claude/hooks/rtl_gate.py` (`dev-engine --changed`، ~۰.۳s) | فقط مقادیر فیزیکی (`flex-end`, `mr`, …) را می‌گیرد — ارزان و بی‌دردسر، ولی جهتِ درست را تشخیص نمی‌دهد |

### Next.js — App Router conventions (اجباری)

> پروژه از Vite SPA به Next 16 App Router مهاجرت کرد. این یه داشبورد client-rendered است؛ data fetching همچنان client-side (axios + TanStack Query). RSC/server-fetch استفاده نمی‌کنیم.

- **Routing فایل‌محور:** هر route یه `src/app/**/page.tsx` است که فقط کامپوننت متناظر را از `src/views/*` import و render می‌کند (thin wrapper). dynamic route: `[orderId]` (نه `:orderId`).
- **`'use client'` boundary:** wrapperهای `page.tsx` همگی `'use client'` دارند → کامپوننت‌های `src/views/*` و فرزندانشان خودکار client می‌شوند (نیازی به افزودن `'use client'` به هر فایل view نیست). Providerها (`src/app/providers.tsx`) و `Layout.tsx` هم `'use client'`.
- **Providers:** `ChakraProvider → LocaleProvider(fa-IR) → ColorModeProvider → QueryClientProvider` در `src/app/providers.tsx`. root layout: `src/app/layout.tsx`.
- **Navigation:** `next/link` (prop `href`، نه `to`) + `next/navigation` (`useRouter().push()`، `usePathname()`، `useSearchParams()`). react-router استفاده نمی‌شود. NavLink active = مقایسه‌ی دستی با `usePathname()`. انتقال state بین صفحات = query params (نه router state).
- **Assets:** import کردن هر تصویر (`.svg` و `.png/.jpg`) → `StaticImageData` object (نه string). برای استفاده در `<img>`/`<Image>` باید `.src` بگیری: `src={logo.src}`. ⚠️ Next نوع `.svg` import رو `any` می‌ده پس type-check **خطا نمی‌ده** ولی runtime object است → یادت باشه `.src`. (الگو: `Navbar.tsx`، `data.ts`، `Categories.tsx`.)
- **Env:** `process.env.NEXT_PUBLIC_*` (نه `import.meta.env`). نمونه: `NEXT_PUBLIC_API_BASE_URL` در `.env.local`.
- **type-check:** `npx tsc --noEmit` یا `pnpm build` (Next موقع build هم type-check می‌کند). `tsconfig.app.json` حذف شده — فقط `tsconfig.json`.

---

## Critical Rules

### Conventions — always-on (cross-project)

این قوانین در **همه** taskها اجباری‌ان (نه فقط Figma→code):

1. **Select فقط** — `NativeSelect` ممنوع. همه‌جا `Select` namespace + `createListCollection` (الگو: `Sidebar.tsx`). → عمیق: `dev-knowledge/design-systems/chakra-ui-v3/chakra-ui-v3.md §۱-الف`
2. **Table alt-row** — قبل از ساخت هر جدول از کاربر بپرس: سطرهای متناوب رنگ پس‌زمینه متفاوت بخوان؟ چه رنگی؟ (پیش‌فرض `bg.subtle`). پیاده‌سازی با token: `<Table.Row bg={i % 2 ? 'bg.subtle' : undefined}>`.
3. **Sidebar selected** — صفحه‌ی فعال باید item متناظرش در Sidebar را `active`/selected نشان دهد — هم parent (auto-open + highlight)، هم sub-item — به‌صورت route-aware (نه state دستی). → `dev-knowledge/universal/app-conventions.md`
4. **Responsive assets** — برای حالت responsive/mobile اگر لینک یا تصویر مخصوص آن view به تو داده نشده، قبل از ساخت **ماژولار بپرس** (نه حدس). → `dev-knowledge/universal/app-conventions.md`
5. **NumberField فقط** — هر input **عددی** (قیمت، مبلغ، وزن، تخفیف، موجودی، تعداد، روز/زمان، …) باید `<NumberField>` باشد (`src/components/ui/NumberField.tsx`) — نه `<Input inputMode="numeric">` خام و نه `<NumberInput.Root>` مستقیم. خودش جداکنندهٔ سه‌رقمیِ زنده + ارقام فارسی + فقط-رقم می‌دهد و مقدار **لاتینِ تمیز** برمی‌گرداند (برای API/محاسبه). با هر کیبورد (فارسی/عربی/لاتین) یکسان کار می‌کند — ورودی را داخل خودش به لاتین normalize می‌کند. (روی `<Input>` ساده ساخته شده، نه zag `NumberInput` — چون parserِ locale آن ورودیِ ترکیبیِ فارسی/لاتین را reject می‌کرد.)
   - props: `value`/`onChange(v)` (string لاتین) · `allowDecimals` (وزن) · `showSteppers` (تعداد/موجودی) · `startElement`/`endElement` + `*ElementProps` (addon واحد مثل تومان/kg — داخلش `InputGroup` می‌زند) · `inputProps` (style روی خودِ input مثل `bg="bg.panel"`، چون `{...rest}` به `Root` می‌رود نه input).
   - الگو: `InfoTab.tsx` (قیمت/تخفیف/وزن/موجودی)، `AddShippingMethod.tsx`، `ShippingCalculatorDialog.tsx`.
   - **استثنا:** `<Input>` متنیِ غیرعددی (نام، SKU، عنوان، جستجو) و فیلدهای read-only/derived که فقط نمایش می‌دهند (مقدار را با `toPersianDigits` فارسی کن، اما خودِ کامپوننت `NumberField` لازم نیست).

## RTL — مرجع واحد

> 📍 **مفاهیم عمومی جهت** (مکانیزم دابل-فلیپ، قانون ترجمه، logical props دو-گامی،
> بازگشتی‌بودن ترتیب DOM، استثنای centering) → `dev-knowledge/universal/language.md`.
> آن فایل canonical است. این بخش فقط چیزهای **مخصوص Vitrina** را دارد: setup،
> نگاشت prop به محور در Chakra، الگوهای کامپوننتی، و تاریخچهٔ incidentها.
> تناقض دیدی؟ `language.md` برنده است و این بخش باید اصلاح شود.

setup: `dir="rtl"` + `lang="fa"` روی `<html>` در `src/app/layout.tsx` · `LocaleProvider locale="fa-IR"` در `src/app/providers.tsx`.

### یک فکت، همه‌جا

```
start = راست        end = چپ
```

همین. هر جا لازم شد سمتی را بگویی، این دو کلمه‌اند — در `justify`، `align`، `textAlign`،
`alignSelf`، `ms/me`، `ps/pe`، `insetInlineStart/End`، snapshotهای فیگما، پیام‌های dev-engine.
یک DOM می‌نویسی؛ `dir` خودش flip می‌کند — هرگز per-direction دو نسخه ننویس.

**ممنوع (dev-engine خودکار error می‌دهد، rule `one-align-idiom`):**

| ننویس | بنویس | چرا |
|-------|-------|-----|
| `flex-start` / `flex-end` | `start` / `end` | رفتار یکیه، ولی «end» به‌غلط «راست» خوانده می‌شه — سه incident از همین اسم |
| `textAlign="right"` / `"left"` | `"start"` / `"end"` | فیزیکی، با جهت flip نمی‌شه |
| `mr` `ml` `pr` `pl` `right:` `left:` | `me` `ms` `pe` `ps` `insetInlineEnd` `insetInlineStart` | همان |

> ⚠️ تنها استثنا: centering با `left:"50%"` + `translateX(-50%)` — فرمول فیزیکی و
> جهت‌مستقل است، پس `left` فیزیکی لازم دارد. راه بهترش: `insetInlineStart`/`End`
> با مقدار **یکسان** (الگو: `ManualOrderFooter.tsx`).

### کدام prop روی کدام محور

| direction | محور افقی (سمت) | محور عمودی |
|-----------|------------------|------------|
| `row` (پیش‌فرض) | `justify` | `align` |
| `column` | `align` | `justify` |

پس `align="start"` روی یک `column` = **راست** (نه بالا). و `justify="start"` روی `row` = **راست**.

### ترتیب DOM

**قاعده:** اولین فرزند DOM = راست‌ترین بصری.

**⚠️ بازگشتی است.** برای *هر* container افقی جدا اعمالش کن — نه فقط ردیف بیرونی:
```
1. به screenshot طرح نگاه کن → راست‌ترین المان = اولین فرزند JSX
2. تکرار کن برای هر container افقیِ داخلِ آن
3. آخرش با screenshot preview مقایسه کن (بخش «تطابق با طرح فیگما»)
```
خروجی کد Figma فقط مرجع style/token است، نه ساختار ردیف‌های افقی — canvas فیگما
همیشه LTR است، پس کپی verbatim ترتیبش = layout آینه‌ای.

**استثنا:** namespace componentهای چاکرا (Table, Pagination, Steps, Select, Menu…) خودشان
`dir="rtl"` ست می‌کنند — داخلشان reorder نکن. قاعده فقط برای `Box`/`Flex`/`Grid` ساده است.

| الگو | اولین فرزند (= راست) | بعدی (= چپ) |
|------|------|------|
| Button + icon | **icon** (leading) | متن |
| Switch (standalone یا در ردیف) | **Switch.Control** (`flexShrink={0}`) | label / `<Text flex="1">` |
| Icon/Avatar row | **icon/avatar** | متن … action (LAST = چپ) |
| Dialog / ButtonFooter | **انصراف** | primary (LAST = چپ) |

- **استثنای icon trailing (فقط سه حالت):** کاربر صریح بگوید · آیکن هر دو طرف متن باشد ·
  یا در **screenshot طرح** آیکن واقعاً سمت پایانی باشد (دکمهٔ «ادامه/ورود»، نه «بازگشت»).
  هر سه باید کامنت توضیحی کنار کد داشته باشند، وگرنه بازبینِ بعدی به‌عنوان باگ «فیکس»شان
  می‌کند. الگوهای موجود: `SignupDoneView.tsx` · `OrderList.tsx` (خروجی اکسل) · `Sidebar.tsx`.
- `Tabs.Trigger` عمودی: `justifyContent="start"` → متن راست.
- theme `order:-1` روی `[data-scope="switch"][data-part="control"]` = CSS fallback؛ DOM order درست باز هم اجباری.

### چطور چک می‌شود

| لایه | چه چیزی را می‌گیرد | چطور فعال می‌شود |
|------|--------------------|------------------|
| **جدول ترجمه** | خطای ترجمه را **قبل از تولد** — ارزان‌ترین لایه | دستی، هر Tier 2 · «گام ۰» در Figma→Code Protocol |
| **مقایسهٔ preview با طرح** | **جهت و ساختار** بعد از کد — تنها لایه‌ای که خطای جاافتاده را می‌گیرد | دستی، هر Tier 2 · روش: بخش «تطابق با طرح فیگما» |
| **hook `rtl_gate`** | error چیدمانی، **قبل از بسته‌شدن turn** | خودکار (`Stop` در `.claude/settings.json`)، ~۰.۳s |
| `one-align-idiom` | هر `flex-*` یا مقدار فیزیکی (`mr`/`left`/`textAlign="right"`) | خودکار، بدون setup |
| `dom-order` | آیکن بعد از متن در Button | خودکار |

`one-align-idiom` فقط می‌گوید «فیزیکی ننویس» — **نمی‌گوید `start` درست است یا `end`.**
آن یکی را فقط جدول ترجمه (قبل) و مقایسهٔ preview (بعد) جواب می‌دهند. دو لایهٔ اول
جایگزین هم نیستند: جدول جلوی تولد خطا را می‌گیرد، preview خطای جاافتاده را.

### ⛔ قانون طلایی: سمت را ببین، حدس نزن

**alignment و ترتیب هرگز از خروجی کد Figma و هرگز از استدلال ذهنی گرفته نشود.**
مکانیزمش (دابل-فلیپ) → `language.md` § «دابل-فلیپ». اینجا فقط نتیجهٔ عملی:

**مسیر درست: screenshot طرح ← جدول ترجمه ← کد ← screenshot preview ← مقایسه ← فیکس.**
هزینه‌اش ~۳۰ ثانیه است و برخلاف هر لایهٔ دیگری، وقتی فهمِ خودت معکوس باشد هم می‌گیردش.

نکاتی که در incidentهای واقعی گم شده بودند:
- **عنصر `w="full"` باگ جهت را پنهان می‌کند** — چون جابه‌جا نمی‌شود. حتماً یک برچسب/دکمهٔ
  کوتاه را هم بسنج. (باگ «انتخاب شده» دقیقاً از همین‌جا از چشم من رد شد: ردیف چیپ‌ها
  full-width بود و درست دیده می‌شد، فقط آن یک برچسب کوتاه چپ افتاده بود.)
- **هر container جدا.** جدول دسکتاپ و کارت موبایلِ همان داده می‌توانند یک زوج را
  **برعکس هم** بچینند (در Discount: جدول متن‌راست، کارت آیکون‌راست). هیچ استنتاجی
  از یک container به دیگری مجاز نیست.
- **ساختار را هم مقایسه کن، نه فقط جهت را.** در همان incident، «دسته‌بندی» و «موقعیت
  جغرافیایی» در طرح سلسله‌مراتبی بودند (والد + زیرچیپ) ولی تخت پیاده شده بودند، و ۷ دکمهٔ
  حذف اصلاً وجود نداشتند — هیچ‌کدام باگ جهت نبود و هیچ ابزار متنی‌ای نمی‌گرفتشان.
- **screenshot کامپوزیت کل صفحه برای المان‌های کوچیک کافی نیست.** اگه یک المان ترکیبی
  (icon+text، badge با X، پیل) در رندر کل‌صفحه کوچک‌تر از ~۵۰px دیده می‌شه، سمت icon
  داخلش را با چشم از آن screenshot تشخیص نده — `get_screenshot` را جداگانه روی همان
  node بگیر (`maxDimension` بالا). در `ProductList2` (1404/05/22) دقیقاً همین باعث شد
  ترتیب icon/text در کارت KPI، بج فیلتر، و بج تخفیف هر سه برعکس ساخته بشن و از مقایسهٔ
  preview هم رد بشن — چون آن مقایسه از روی همون screenshot کامپوزیت انجام شده بود.

> **سابقهٔ این کلاس باگ — پنج بار:** `CampaignCard` (1404/05/12) · `NewCampaignDialog`
> (همان روز) · `DiscountCodesTable`+`DiscountCodeCard` (1404/05/17) · `DiscountCodeNew`
> (1404/05/09 — ۵ مورد جهت‌معکوس + ۲ نقص ساختاری، با dev-engine و type-check **همه سبز**) ·
> `KpiRow`+`FilterResultBadges`+قیمت جدول در `ProductList2` (1404/05/22).
>
> **دو درسِ متا:**
> ۱. سه‌تای اول با کامنت و بعد با snapshot متنی «فیکس» شدند و **هیچ‌کدام جلوی بعدی را نگرفت**؛
>    چهارمی با مقایسهٔ preview در چند دقیقه پیدا شد. به همین دلیل کل زیرسیستم snapshot متنی
>    در 1405/05 حذف شد (بالاتر، § «تطابق با طرح فیگما»).
> ۲. پنجمی **حتی از مقایسهٔ preview هم رد شد** — چون از screenshot کامپوزیت ۱۹۲۰px انجام
>    شده بود. قاعدهٔ «node کوچک ← screenshot مجزا» (بولت آخر بالا) از همان‌جا آمد؛ با
>    گزارش مستقیم کاربر پیدا شد، نه با هیچ ابزاری.

### RTL in Portal components (Menu, Drawer, Popover, Tooltip)

- Portal content renders under `<body>` but DOES inherit `dir="rtl"` from `<html>` via CSS cascade
- Add `dir="rtl"` to `Menu.Positioner` / `Drawer.Positioner` etc. as an explicit safeguard
- **DOM order still controls flex direction** — CSS نمی‌تواند جبرانش کند (فقط Switch یک
  `order:-1` در theme دارد). ترتیب درست ← جدول «ترتیب DOM» بالاتر در همین بخش.

---

### Chakra v3 Known Issues

- `lineHeight="8"` → **BROKEN** — resolves to unitless CSS `line-height: 8` = 8× font-size (e.g. 8×24px = 192px!). Use ratio strings instead: `lineHeight="1.333"` for 32px at 2xl, `lineHeight="1.14"` for 32px at 3xl. Never use numeric lineHeight tokens.
- `bg="bg.default"` → **BROKEN** (CSS var resolves to transparent). Use `bg="bg"` instead
- `bg="white"` روی کارت/پنل → **hardcode، dark mode رو می‌شکنه** (white در dark هم white می‌مونه). به‌جاش `bg="bg.panel"` (white در light، gray.950 در dark). سابقه: 1404 — چهار صفحهٔ auth (`AuthLayout`, `SignupLayout`, `SignupPreparingView`, `SignupDoneView`) با `bg="white"` ship شدن، در dark mode کارت روشن موند تا کشف و فیکس شد.
- `bg="bg.subtle"` → works (`#fafafa`)
- Tooltip = namespace: `Tooltip.Root` / `Tooltip.Trigger asChild` / `Tooltip.Content`
- `Text` and `Flex` don't accept `href` prop → for internal navigation wrap with `next/link` (`<Link href=...>`), e.g. logo/breadcrumb. (`SettingCard` uses `<Box as={Link} href=...>`.)
- `useColorMode` → **DOES NOT EXIST** in Chakra v3. Use `useColorMode` from `@/contexts/ColorModeContext` instead
- Dark mode: toggle `.dark` class on `document.documentElement` (NOT a wrapper div) — Portal content lives outside React tree and needs the class on `<html>` to get dark tokens
- Color mode toggle → uses `<Theme appearance="light"|"dark">` wrapper in `ColorModeProvider`; persists to `localStorage` key `vitrina-color-mode`
- Avatar.Root / complex components → do NOT forward refs for `asChild`. Wrap in `<Box as="button" type="button">` first
- `sx` prop → **nested selectors NOT injected** (`'& .child': {...}`, `'&:focus-within': {...}` کار نمی‌کنن). برای nested CSS از `editorProps.attributes.style` (Tiptap)، `_focusWithin` prop (Chakra)، یا `Global` از `@emotion/react` استفاده کن
- `Combobox.Root` با `inputValue` **کنترل‌شده** + `allowCustomValue={true}` → گاهی رویداد تایپِ متن دلخواه (که با هیچ آیتمی مطابقت ندارد) گم می‌شود و ورودی کاربر ثبت نمی‌شود. راه‌حل: `defaultInputValue` (uncontrolled) به‌جای `inputValue` + خواندن مقدار لحظهٔ ثبت مستقیم از DOM (`ref`)، نه از React state. برای reset از بیرون (بعد از ثبت) از `key` جدید برای remount استفاده کن، نه پاک‌کردن state کنترل‌شده. الگو: `src/components/products/new/VariantAccordion.tsx` (`SuggestCombobox`)
- `PinInput.Root autoFocus` باید روی **Root** باشه، نه `autoFocus` روی `PinInput.Input` (native HTML attribute) — وگرنه با hydration Next.js race می‌کنه و machine در state `idle` گیر می‌کنه (فقط خانهٔ اول پر می‌شه، بقیه advance نمی‌کنن). جزئیات: `dev-knowledge/design-systems/chakra-ui-v3/known-bugs.md`
- `PinInput` با `type="numeric"` ارقام فارسی (۰-۹) رو کامل reject می‌کنه (نه فقط نمایش اشتباه) — برای فیلد OTP باید `pattern="^[0-9۰-۹]+$"` بدی + در `onValueChange` با `toLatinDigits` نرمالایز کنی. الگو: `src/components/auth/OtpForm.tsx`
- Flex ستونی با `justify="center"` که تنها فرزندش `flex="1"` داره → `justify` بی‌اثر می‌شه (فرزند تمام فضا رو می‌بلعه، چیزی برای centering نمی‌مونه). باید `justify` رو مستقیم روی همون فرزند flex=1 هم بذاری. الگو: `src/components/auth/AuthLayout.tsx` (`centerContent` prop)
- `Steps.Root orientation="vertical"` → رسیپی پیش‌فرضش `height:100%` است؛ اگه پنل والد stretch شده باشه (`align="stretch"`)، آیتم‌ها (`flex:1 0 0`) کل ارتفاع پنل رو مساوی تقسیم می‌کنن و خط رابط (`separator`) خیلی کشیده می‌شه. فیکس: `h="auto"` روی `Steps.Root` (override رسیپی) + یه `Box flex="1"` spacer بعدش که فضای اضافه رو جذب کنه. الگو: `src/components/auth/SignupStepper.tsx`
- `Steps.Status` بدون prop `current` → قدم فعلی رو با عدد **لاتین** رندر می‌کنه (fallback به `incomplete` نمی‌ره). باید `current` رو صریح بدی (مثلاً `current={toPersianDigits(i+1)}`) وگرنه فقط قدم‌های غیرفعال فارسی می‌شن.
- `InputGroup` با `startElement`/`endElement` متنی (نه آیکون کوچیک) → فرمول پیش‌فرض padding (`ps`/`pe` بر اساس `var(--input-height)`) برای متن عریض‌تر از یک آیکون کافی نیست و متن ورودی با دکوریشن overlap می‌کنه. باید `ps`/`pe` رو دستی روی `<Input>` ست کنی متناسب با عرض واقعی متن (اندازه‌گیری با `getBoundingClientRect`). الگو: `src/views/auth/SignupBasicInfoView.tsx` (فیلد آدرس اختصاصی فروشگاه، `https://`/`.vitrinaa.shop`)
- `Progress.Root striped` → **BROKEN** (نسخهٔ `3.35.0`) — recipe داخلی `--stripe-color` رو با مقدار conditional (`_light`/`_dark`) روی یه CSS custom property ست می‌کنه که resolve نمی‌شه (computed value خالی → `backgroundImage` invalid → `none`). فیکس: `backgroundImage`/`backgroundSize` رو مستقیم روی `<Progress.Range>` بده + override با `_dark` (نه custom property). جزئیات: `dev-knowledge/design-systems/chakra-ui-v3/known-bugs.md`. الگو: `src/views/auth/SignupPreparingView.tsx`
- `position="fixed"` + centering با `left:"50%"` + `transform:"translateX(-50%)"` → اگه `left` رو با `insetInlineStart` (منطقی) بدی، در RTL به `right` تبدیل می‌شه و فرمول centering (که فیزیکی و جهت‌مستقله) بهم می‌ریزه — عنصر به‌جای وسط، به چپ صفحه پرت می‌شه. باید `left` فیزیکی باشه. **راه‌حل ساده‌تر و ترجیحی:** وقتی عرض باید «fill» بمونه (نه یک maxW ثابت)، اصلاً از `left+transform` استفاده نکن — `insetInlineStart`/`insetInlineEnd` رو با مقدار **یکسان** (مثلاً هر دو `'4'`) بده؛ چون مقدار دو طرف برابره، منطقی/فیزیکی فرقی نداره و عرض خودش از فاصلهٔ دو لبه محاسبه می‌شه (با کوچک‌شدن ویوپورت خودش کوچیک می‌شه، بدون نیاز به `maxW`/`w`/`transform`). الگو: `src/components/orders/manual/ManualOrderFooter.tsx`
- `RadioCard.Root value={x ?? undefined}` → **کنترل‌شده به‌درستی پاک نمی‌شه** — `undefined` برای RadioGroup زیرینِ zag یعنی uncontrolled، پس یه بار انتخاب‌شده دیگه با state بیرونی پاک نمی‌شه (مثلاً دکمهٔ «حذف» state رو null می‌کنه ولی کارت هنوز checked می‌مونه). باید `value` رو مستقیم (با نوع `string | null`) پاس بدی، نه با `?? undefined`. جزئیات: `dev-knowledge/design-systems/chakra-ui-v3/known-bugs.md`. الگو: `src/components/orders/manual/DiscountSelectPanel.tsx`
- `direction` prop روی هر کامپوننتی جز `Flex`/`Stack` (مثل `RadioCard.ItemControl`, `Grid`) → **بی‌صدا drop می‌شه**، چون ترجمهٔ `direction`→`flexDirection` فقط داخل `Flex`/`Stack` هست، نه یه shorthand عمومیِ style-system. همیشه `flexDirection` بنویس. جزئیات: `dev-knowledge/design-systems/chakra-ui-v3/known-bugs.md`. الگو: `src/components/orders/manual/DiscountSelectPanel.tsx`
- `Popover.Trigger asChild` + `<Box as="button">` → **type error** (`disabled`/`type` روی نوع props وجود نداره، چون `as` فقط تگ رندرشده رو عوض می‌کنه نه inference تایپ‌اسکریپت). به‌جاش استایل رو مستقیم روی خودِ `Popover.Trigger` بده (بدون `asChild`) — چون `PopoverTriggerProps` از `HTMLChakraProps<"button">` ارث می‌بره و خودش یه دکمهٔ استایل‌پذیره. الگو: `src/components/ui/DatePicker.tsx`

---

### Layout

- Navbar: full-width (no `maxW` on outer container); controls DOM order (RTL): Min/Max | Bell | Avatar with `gap="6"` (24px)
- Body (sidebar + content): `maxW="1920px" mx="auto"`, compact mode: `maxW="512px"`
- Sidebar: `w="256px"` expanded, `w="16"` collapsed
- **Sticky in-page panels (summary/step-nav columns):** Navbar خودش `position="sticky" top="0"` با `h="16"` (64px) و `zIndex="sticky"` است. هر پنل sticky دیگه‌ای زیر همون scroll container باید `top="20"` (80px = 64+16) بگیره، نه `top="4"` — وگرنه چون هر دو روی همون top=0 رقابت می‌کنن و Navbar zIndex بالاتری داره، پنل زیرِ Navbar گم می‌شه. الگوی درست از قبل در `NewProduct.tsx` (StepNav ستون) بود؛ `ManualOrderNew.tsx` (خلاصه سفارش) هم به همین اصلاح شد. ⚠️ `OrderDetails.tsx` و `GeneralInfo.tsx` هنوز `top="4"` دارن — احتمالاً همین باگ رو دارن، در صورت گزارش کاربر چک شه.

### Compact / Mobile mode

- Compact mode (`isCompact=true`) = 512px view — behaves like mobile
- In compact: sidebar hidden (`display="none"`), hamburger visible
- Hamburger is grouped with logo; hamburger FIRST in DOM → appears RIGHT of logo in RTL
- Drawer: `placement="start"` = opens from RIGHT in RTL ✓, `maxW="256px"` (same as desktop sidebar)
- Drawer header: logo (FIRST=right) + CloseButton (LAST=left) — no title
- Always add `dir="rtl"` to `Drawer.Positioner`

### CompactMode در صفحات (اجباری برای هر page جدید)

CSS media queries به **viewport** نگاه می‌کنن نه container — پس `maxW="512px"` به تنهایی کافی نیست.
هر page که responsive grid یا padding داره باید از context استفاده کنه:

```tsx
import { useCompactMode } from '@/contexts/CompactModeContext'

function MyPage() {
  const isCompact = useCompactMode()

  // Panel padding — pb همیشه '6' (24px) در همه حالت‌ها
  pt={isCompact ? '4' : { base: '4', sm: '6' }}
  pb="6"
  px={isCompact ? '4' : { base: '4', sm: '6' }}

  // Grid columns
  templateColumns={isCompact ? '1fr' : { base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }}
}
```

**قوانین:**
- `isCompact=true` → همه grids = `'1fr'` (single column)
- `isCompact=true` → panel pt/px = `'4'` (16px)، **pb همیشه `'6'` (24px)**
- `Layout.tsx` provider رو wrap می‌کنه — نیازی به Provider اضافه در page نیست
- هر sub-component داخل page (مثل Tab functions) هم باید `useCompactMode()` بگیره اگه grid داره
- SegmentGroup.Indicator → `bg="bg.panel"` (white در light، gray.950 در dark) — `bg="white"` dark mode رو می‌شکنه، `bg.default` broken

**⚠️ isCompact = toggle، نه real viewport detection:**
`isCompact` فقط برای شبیه‌سازی 512px در desktop هست. روی موبایل واقعی همیشه `false` است.
برای layout props (direction، columns، order) وقتی non-compact value هست، **باید responsive object باشه**:

```tsx
// ❌ BROKEN on real mobile — isCompact=false → direction='row' at 360px
direction={isCompact ? 'column' : 'row'}

// ✅ CORRECT — real mobile gets 'column' via base, compact mode gets 'column' direct
direction={isCompact ? 'column' : { base: 'column', lg: 'row' }}
```

قانون: `isCompact ? X : Y` — اگه Y یه string ساده‌ست و layout-affecting (direction، templateColumns، order، display)، باید `{ base: mobile-val, breakpoint: desktop-val }` بشه.

### viewport-based mobile detection (برای behavior، نه layout)

وقتی behavior (نه فقط layout) باید در موبایل واقعی تغییر کنه — مثل نمایش دکمه بدون hover:

```tsx
const [isMobile, setIsMobile] = useState(false)
useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 480)
  check()
  window.addEventListener('resize', check)
  return () => window.removeEventListener('resize', check)
}, [])
```

`isCompact` برای این کار مناسب نیست — روی موبایل واقعی همیشه `false` است.

### TitleBar — wrapping rule

- title و subtitle هیچ‌وقت truncate نمیشن (`whiteSpace="nowrap"` ممنوع)
- روی صفحه‌های باریک (360px) عناوین بلند wrap میشن — این intentional است

### Breadcrumb — wrap نه overflow (اجباری)

- وقتی breadcrumb در فضای موجود جا نمی‌شود باید **wrap** شود به خط بعد — هرگز overflow/scroll افقی نکند.
- پیاده‌سازی در `Header.tsx`: container breadcrumb = `flexWrap="wrap" w="full"` (نه `overflowX="auto"`، نه `flexShrink={0}`). هر crumb خودش `whiteSpace="nowrap"` است؛ شکست فقط بین crumbها.
- container-based است → روی موبایل واقعی **و** حالت compact هر دو درست کار می‌کند (نیازی به breakpoint نیست).

---

### Localization — اعداد و تاریخ فارسی (اجباری)

#### قانون کلی
```
user میبینه؟ → فارسی
code میخونه؟ → انگلیسی (API، محاسبات، ID، URL)
```

#### Persian Numbers
همه اعداد display باید از utility رد بشن:

```ts
// src/utils/numbers.ts
toPersianDigits(n: number | string): string  // برای نمایش
toLatinDigits(s: string): string             // برای input → API
```

**اعداد انگلیسی مجاز (هرگز convert نکن):**
- `<input>` value — ارسال به API
- API request/response
- محاسبات (`parseFloat`, `parseInt`)
- IDs، کدها (`SKU-123`)، URLs

**اعداد فارسی اجباری:**
- قیمت، تعداد، موجودی — هر عدد visible به کاربر
- pagination، آمار، جداول

#### Persian Calendar
همه تاریخ‌های نمایشی باید Jalali (شمسی) باشن:
- locale: `fa-IR-u-ca-persian` (نه فقط `fa-IR`)
- هر جا `Date` نمایش داده میشه باید این locale استفاده بشه

> **وضعیت:** `src/utils/numbers.ts` ساخته شده — `toPersianDigits` + `toLatinDigits` موجود.
> **DatePicker:** `src/components/ui/DatePicker.tsx` — تقویم جلالی سفارشی، **بدون کتابخانهٔ خارجی** (هیچ پکیج jalali/date در dependencies نیست). محاسبات (طول ماه، سال کبیسه، تبدیل) صرفاً با `Intl.DateTimeFormat('fa-IR-u-ca-persian-nu-latn')` روی حساب روزهای میلادی — چون هر دو تقویم شمسی‌اند، جابه‌جایی روزبه‌روز با `Date.setDate` صحیحه و ICU خودش کبیسه رو حساب می‌کنه. مقدار ورودی/خروجی همچنان ISO میلادی (`YYYY-MM-DD`) است، فقط نمایش/انتخاب جلالی‌ست. `DateField` (کمپین‌ها) از این کامپوننت استفاده می‌کنه؛ برای هر فیلد تاریخ جدید همینو import کن، دوباره نساز.

---

## Token Reference

> **مقادیر کامل semantic (bg/fg/border) و per-color (`{color}.{variant}`: contrast/fg/subtle/muted/emphasized/solid/focusRing/border) = استاندارد Chakra v3.**
> منبع داخل پروژه: `src/theme/tokens.ts` · مرجع مشترک: `dev-knowledge/.../tokens.md` · runtime: Chakra MCP `get_theme`.
> فقط توکن‌های **Vitrina-specific** اینجا inline‌اند:

### Vitrina Brand Tokens (`src/theme/tokens.ts`)
| Token | Light | Dark |
|-------|-------|------|
| `brand.solid` | teal.600 (#0D9488) | teal.600 (#0D9488) |
| `brand.contrast` | white | white |
| `brand.fg` | teal.700 | teal.300 |
| `brand.subtle` | teal.100 | teal.900 |
| `brand.muted` | teal.200 | teal.800 |
| `brand.emphasized` | teal.300 | teal.700 |
| `brand.focusRing` | teal.500 | teal.500 |
| `brand.border` | teal.500 | teal.400 |
| `brand.bg` | teal.50 | teal.950 |

### Vitrina Map Tokens (`src/theme/tokens.ts`)
| Token | Light | Dark |
|-------|-------|------|
| `map.controlBg` | gray.900 | gray.900 |
| `map.controlBgHover` | gray.700 | gray.700 |

### Vitrina Extra "bg" Tokens (`src/theme/tokens.ts`)
> Chakra v3 default palettes only ship `contrast/fg/subtle/muted/emphasized/solid/focusRing/border` — no `.bg`. `brand.bg` already existed; `purple.bg`/`blue.bg` added when a Figma spec called for an extra-light (`.50`/`.950`) card background distinct from `.subtle`. Add more `{color}.bg` entries the same way if another Figma spec needs one — don't fall back to `.subtle` as a stand-in.
| Token | Light | Dark |
|-------|-------|------|
| `purple.bg` | purple.50 | purple.950 |
| `blue.bg` | blue.50 | blue.950 |
| `red.bg` | red.50 | red.950 |
| `orange.bg` | orange.50 | orange.950 |
| `green.bg` | green.50 | green.950 |

---

## Design Scale

> **همهٔ scaleها (spacing، radius، shadow، font-size/weight، line-height، layer-style، z-index، palette raw) = استاندارد Chakra v3** → `src/theme/tokens.ts` یا Chakra MCP `get_theme`.
> ⚠️ تنها تله‌ای که باید یادت باشه (در Chakra Known Issues بالا هم هست): `lineHeight` numeric شکسته است — همیشه ratio string بده.

### Breakpoints — Vitrina targets (project-specific)
```
xs(360px) | sm(480px) | md(768px) | lg(1024px) | xl(1280px) | 2xl(1536px)
```
> `lg` واقعی Chakra v3 default = `1024px` (نه `992px` — که مقدار Chakra v2 بود). تأیید شده از `node_modules/@chakra-ui/react/dist/esm/theme/breakpoints.js` و مصرف پیوستهٔ `lg` در کل کدبیس (مثلاً `GeneralInfo.tsx`, `UserInfo.tsx`, `ThemeCustomize.tsx`).
Vitrina targets: **360px** (mobile) · **480px** (mobile+) · **1440px** (desktop) · **1920px** (wide)

**Responsive pattern برای 360px:**
- `xs` breakpoint فقط برای تمایز < 360px از 360-479px (نادر)
- اکثر padding/font: `{ base: 'small', sm: 'large' }` — jump-up در 480px