# Vitrina — Claude Reference

## Table of Contents
1. [Knowledge References](#knowledge-references)
2. [Protocols](#protocols) — Figma Gate · Root Cause · Figma→Code · DoD
3. [Stack](#stack)
4. [Critical Rules](#critical-rules) — RTL · Chakra Bugs · Layout · Compact · Localization
5. [Token Reference](#token-reference) — Semantic · Brand · Design Scale
6. [File Structure](#file-structure)

---

## Knowledge References

→ `dev-knowledge/` repo — دانش مشترک بین پروژه‌ها (RTL، tokens، known bugs، چک‌لیست)

| موضوع | فایل |
|-------|------|
| RTL concepts | `dev-knowledge/universal/language.md` |
| Chakra v3 bugs | `dev-knowledge/design-systems/chakra-ui-v3/known-bugs.md` |
| Chakra v3 tokens | `dev-knowledge/design-systems/chakra-ui-v3/tokens.md` |
| RTL در Chakra | `dev-knowledge/design-systems/chakra-ui-v3/chakra-ui-v3.md` |
| Figma→Code workflow | `dev-knowledge/universal/figma-to-code.md` |
| Page Templates | `dev-knowledge/projects/vitrina/page-templates.md` |
| Chakra v3 components | `dev-knowledge/design-systems/chakra-ui-v3/components.md` |

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
   - pattern پروژه‌ای  → CLAUDE.md همین پروژه
   - pattern shared  → dev-knowledge/ (page-templates, tokens, known-bugs, ...)
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
| **1 — code/style** | prop، token swap، spacing، bugfix، refactor، ریسپانسیو روی component موجود — **بدون surface نو از Figma** | Edit + `pnpm type-check` | ❌ |
| **2 — Figma→code نو** | frame/page/component نو از Figma، یا تغییری که باید pixel با Figma spec بخوره | کل Protocol پایین | ✅ |

- **screenshot = opt-in.** default نزن. فقط **Tier 2** یا وقتی کاربر صریح گفت «compare / pixel / screenshot».
- **MCP Figma fetch فقط Tier 2.** Tier 0/1 از local cache، صفر MCP call.
- **شک بین دو tier؟ → پایین‌تر رو بگیر**، لازم شد escalate کن. سرعت اول.

مرجع عمیق: `dev-knowledge/universal/scope-triage.md`

---

### Figma → Code Protocol (اجباری — فقط Tier 2)

هر task که از Figma به کد تبدیل میشه — حتی «اصلاح کن» / «مقایسه کن» / «ریسپانسیو کن» — این gate رو رد نکن.

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

**⚠️ Figma DOM order ≠ RTL DOM order — قانون مکانیکی، نه ذهنی:**
```
Figma canvas = LTR. خروجی get_design_context فرزندها رو چپ→راست لیست می‌کنه.
در RTL app: FIRST child = راست. کپی verbatim ترتیب Figma = layout آینه‌ای.

❌ ممنوع: ترتیب فرزندهای خروجی Figma رو برای هیچ container افقی کپی نکن.
✅ الگوریتم اجباری (هر ردیف افقی Box/Flex/Grid):
   1. مختصات x فرزندها رو از get_metadata (یا screenshot) بگیر
   2. sort بر اساس x نزولی → راست‌ترین = اولین child در JSX
   3. خروجی کد Figma فقط مرجع style/token هست، نه ساختار ردیف‌های افقی

استثنا: namespace components چاکرا (Table, Pagination, Steps, Select, Menu...)
خودشون dir="rtl" ست می‌کنن — داخلشون رو reorder نکن. قانون فقط برای
Box/Flex/Grid ساده‌ست. (همین استثنا بود که باعث گیج‌شدن و کپی verbatim می‌شد.)

قانون پروژه (از ButtonFooter): primary LAST در DOM = leftmost در RTL (سمت چپ).
Dialog footer order: انصراف FIRST (راست) · brand LAST (چپ).

سابقه: 1404 — سه نقطه آینه‌ای ship شد (OrderDetails cards، ShippingAddressPanel
buttons، pagination rows) — هر سه کپی verbatim ترتیب Figma بودن.
```

**Component descriptions = implementation checklist (اجباری):**
```
get_design_context output بخش "Component descriptions" داشت؟
  → آن لیست = تمام DS componentهای استفاده‌شده در آن node
  → قبل از نوشتن هر sub-element، اسمش رو در آن لیست چک کن
  → هر component لیست‌شده باید از DS import بشه — rebuild ممنوع

مثال: Figma گفت Badge استفاده شده → <Badge> از Chakra، نه <Text bg="purple.50">
مثال: Figma گفت Alert استفاده شده → <Alert.Root>، نه <Flex bg="blue.50">
```

**MCP servers این پروژه:**
- Chakra UI MCP — `mcp__chakra-ui__list_components` / `get_component_example` / `get_component_props` / `get_theme`
- Figma MCP — `get_design_context` / `get_screenshot` / `get_variable_defs`

---

### Definition of Done (اجباری — آخر هر task)

point-by-point گزارش بده. چک skip‌شده = ⚠️ نه ✅.

- [ ] Component Resolution رعایت شد (Local→DS MCP→Build) — کدوم مسیر؟
- [ ] صفر hardcode (رنگ/spacing/font) — همه token
- [ ] logical CSS props (`insetInlineEnd` نه `right`)
- [ ] RTL DOM order — **با evidence، نه checkbox خالی:** برای هر container افقیِ ساخته‌شده
  یک خط گزارش: `container → اولین DOM child → راست‌ترین المان در Figma` — تیک بدون این جدول = ⚠️
- [ ] type-check سبز (`npx tsc -p tsconfig.app.json --noEmit` — اسکریپت `type-check` وجود نداره)
- [ ] Visual verification vs Figma — **opt-in، هیچ‌وقت خودکار نه.**
  > **قانون اجباری (کاربر، ۱۴۰۴):** هرگز خودبه‌خود preview/screenshot نگیر. **همیشه اول بپرس:**
  > «preview بگیرم و pixel-perfect با طرح چک کنم؟» — فقط اگه کاربر گفت «بله»، آن‌وقت:
  > ```
  > 1. preview_start (اگه server نیست)
  > 2. preview_resize(1920) → screenshot → compare با Figma desktop frame
  > 3. preview_resize(360)  → screenshot → compare با Figma mobile frame
  > 4. مغایرت‌ها list → fix → re-screenshot تا match
  > ```
  > type-check سبز + RTL DOM order = کافی برای بستن task. verify بصری جداست و فقط با تأیید کاربر.

مرجع عمیق: `dev-knowledge/universal/figma-to-code.md` · pipeline قدم‌به‌قدم: skill `figma-implement-design`

---

## Stack

- React 19 + Vite + TypeScript
- Chakra UI v3 + `@chakra-ui/charts` (BarSegment, BarList — wraps recharts)
- RTL / Persian (Vazirmatn font)
- pnpm

---

## Critical Rules

### Conventions — always-on (cross-project)

این قوانین در **همه** taskها اجباری‌ان (نه فقط Figma→code):

1. **Select فقط** — `NativeSelect` ممنوع. همه‌جا `Select` namespace + `createListCollection` (الگو: `Sidebar.tsx`). → عمیق: `dev-knowledge/design-systems/chakra-ui-v3/chakra-ui-v3.md §۱-الف`
2. **Table alt-row** — قبل از ساخت هر جدول از کاربر بپرس: سطرهای متناوب رنگ پس‌زمینه متفاوت بخوان؟ چه رنگی؟ (پیش‌فرض `bg.subtle`). پیاده‌سازی با token: `<Table.Row bg={i % 2 ? 'bg.subtle' : undefined}>`.
3. **Sidebar selected** — صفحه‌ی فعال باید item متناظرش در Sidebar را `active`/selected نشان دهد — هم parent (auto-open + highlight)، هم sub-item — به‌صورت route-aware (نه state دستی). → `dev-knowledge/universal/app-conventions.md`
4. **Responsive assets** — برای حالت responsive/mobile اگر لینک یا تصویر مخصوص آن view به تو داده نشده، قبل از ساخت **ماژولار بپرس** (نه حدس). → `dev-knowledge/universal/app-conventions.md`

### RTL — پایه

- `dir="rtl"` on `<html>` in `index.html`
- `LocaleProvider locale="fa-IR"` wraps app in `main.tsx`
- RTL flex: **first DOM child = rightmost visually**
- Use logical CSS props: `insetInlineEnd` not `right`, `borderInlineEndWidth` not `borderRightWidth`, `borderEndStartRadius` not `borderBottomRightRadius`
- RTL column flex: `align="flex-start"` = RIGHT side, `align="flex-end"` = LEFT side (counterintuitive!)

### RTL DOM Order — الگوهای اجباری

**قانون کلی:** در RTL، اولین child در DOM = راست‌ترین المان بصری.

#### Button + icon (start icon = سمت راست در RTL)
```tsx
// ✅ CORRECT — icon FIRST = rightmost (start position)
<Button>
  <Plus size={16} />   {/* FIRST → راست ✓ */}
  افزودن
</Button>

// ❌ WRONG — icon on LEFT (end position, only for intentional end icons)
<Button>
  افزودن
  <Plus size={16} />   {/* LAST → چپ ✗ */}
</Button>
```

#### Switch + label (standalone toggle)
```tsx
// ✅ CORRECT — Switch FIRST = rightmost
<Flex align="center" gap="2.5">
  <Switch.Root ...>
    <Switch.HiddenInput />
    <Switch.Control><Switch.Thumb /></Switch.Control>
  </Switch.Root>
  <Text>ارسال رایگان</Text>   {/* LAST → چپ ✓ */}
</Flex>

// ❌ WRONG — text before switch
<Flex align="center" gap="2.5">
  <Text>ارسال رایگان</Text>   {/* FIRST → راست ✗ */}
  <Switch.Root ...>...</Switch.Root>
</Flex>
```

#### Switch.Label inside Switch.Root
```tsx
// ✅ CORRECT — Control FIRST = rightmost
<Switch.Root>
  <Switch.HiddenInput />
  <Switch.Control><Switch.Thumb /></Switch.Control>   {/* FIRST → راست ✓ */}
  <Switch.Label>فعال</Switch.Label>                   {/* SECOND → چپ ✓ */}
</Switch.Root>

// ❌ WRONG — label before control
<Switch.Root>
  <Switch.Label>فعال</Switch.Label>                   {/* FIRST → راست ✗ */}
  <Switch.Control>...</Switch.Control>
</Switch.Root>
```
> **Note:** theme/index.ts adds `order: -1` to `[data-scope="switch"][data-part="control"]` as CSS fallback — اما DOM order صحیح باز هم اجباری است.

#### Form row (full-width settings row)
```tsx
// ✅ Switch on RIGHT (start), label on LEFT (end)
<Flex align="center" gap="2.5" w="full">
  <Switch.Root flexShrink={0}>...</Switch.Root>   {/* FIRST → راست ✓ */}
  <Text flex="1">عنوان تنظیم</Text>               {/* LAST → چپ ✓ */}
</Flex>
```

#### Icon/Avatar in any row component
```tsx
// ✅ Icon FIRST = rightmost (start/leading icon)
<Flex align="center" gap="3">
  <Icon />          {/* FIRST → راست ✓ */}
  <Text>محتوا</Text>
  <ActionButton />  {/* LAST → چپ ✓ */}
</Flex>
```

#### Tabs.Trigger vertical orientation (RTL text alignment)
```tsx
// ✅ CORRECT — justifyContent="flex-start" در RTL = text راست ✓
<Tabs.Root variant="subtle" orientation="vertical">
  <Tabs.List w="full">
    <Tabs.Trigger value="x" w="full" justifyContent="flex-start">
      متن تب
    </Tabs.Trigger>
  </Tabs.List>
</Tabs.Root>

// ❌ WRONG — justifyContent="flex-end" در RTL = text چپ ✗
<Tabs.Trigger w="full" justifyContent="flex-end">متن تب</Tabs.Trigger>
```
> **قانون:** در RTL، `justifyContent="flex-start"` = راست، `justifyContent="flex-end"` = چپ.

### RTL in Portal components (Menu, Drawer, Popover, Tooltip)

- Portal content renders under `<body>` but DOES inherit `dir="rtl"` from `<html>` via CSS cascade
- Add `dir="rtl"` to `Menu.Positioner` / `Drawer.Positioner` etc. as an explicit safeguard
- **DOM order still controls flex direction** — only partially fixable via CSS (Switch has order:-1 in theme)
- Always put elements in correct RTL DOM order: icon/avatar FIRST (rightmost), text SECOND, action LAST (leftmost)
- **Switch + label RTL rule:** Switch FIRST in DOM (rightmost = right side) → label text LAST (leftmost = left side). Never text-then-switch.
- `bg="white"` → OK (Chakra palette token, not hardcoded). `bg="#ffffff"` → NOT OK

---

### Chakra v3 Known Issues

- `lineHeight="8"` → **BROKEN** — resolves to unitless CSS `line-height: 8` = 8× font-size (e.g. 8×24px = 192px!). Use ratio strings instead: `lineHeight="1.333"` for 32px at 2xl, `lineHeight="1.14"` for 32px at 3xl. Never use numeric lineHeight tokens.
- `bg="bg.default"` → **BROKEN** (CSS var resolves to transparent). Use `bg="white"` or `bg="bg"` instead
- `bg="bg.subtle"` → works (`#fafafa`)
- Tooltip = namespace: `Tooltip.Root` / `Tooltip.Trigger asChild` / `Tooltip.Content`
- `Text` and `Flex` don't accept `href` prop → wrap with plain `<a>`
- `useColorMode` → **DOES NOT EXIST** in Chakra v3. Use `useColorMode` from `@/contexts/ColorModeContext` instead
- Dark mode: toggle `.dark` class on `document.documentElement` (NOT a wrapper div) — Portal content lives outside React tree and needs the class on `<html>` to get dark tokens
- Color mode toggle → uses `<Theme appearance="light"|"dark">` wrapper in `ColorModeProvider`; persists to `localStorage` key `vitrina-color-mode`
- Avatar.Root / complex components → do NOT forward refs for `asChild`. Wrap in `<Box as="button" type="button">` first
- `sx` prop → **nested selectors NOT injected** (`'& .child': {...}`, `'&:focus-within': {...}` کار نمی‌کنن). برای nested CSS از `editorProps.attributes.style` (Tiptap)، `_focusWithin` prop (Chakra)، یا `Global` از `@emotion/react` استفاده کن

---

### Layout

- Navbar: full-width (no `maxW` on outer container); controls DOM order (RTL): Min/Max | Bell | Avatar with `gap="6"` (24px)
- Body (sidebar + content): `maxW="1920px" mx="auto"`, compact mode: `maxW="512px"`
- Sidebar: `w="256px"` expanded, `w="16"` collapsed

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

---

## Token Reference

### Semantic Tokens — Background
| Token | Light | Dark |
|-------|-------|------|
| `bg` | white | black |
| `bg.subtle` | gray.50 | gray.950 |
| `bg.muted` | gray.100 | gray.900 |
| `bg.emphasized` | gray.200 | gray.800 |
| `bg.inverted` | black | white |
| `bg.panel` | white | gray.950 |
| `bg.error` | red.50 | red.950 |
| `bg.warning` | orange.50 | orange.950 |
| `bg.success` | green.50 | green.950 |
| `bg.info` | blue.50 | blue.950 |

### Semantic Tokens — Foreground
| Token | Light | Dark |
|-------|-------|------|
| `fg` | black | gray.50 |
| `fg.muted` | gray.600 | gray.400 |
| `fg.subtle` | gray.400 | gray.500 |
| `fg.inverted` | gray.50 | black |
| `fg.error` | red.500 | red.400 |
| `fg.warning` | orange.600 | orange.300 |
| `fg.success` | green.600 | green.300 |
| `fg.info` | blue.600 | blue.300 |

### Semantic Tokens — Border
| Token | Light | Dark |
|-------|-------|------|
| `border` | gray.200 | gray.800 |
| `border.muted` | gray.100 | gray.900 |
| `border.subtle` | gray.50 | gray.950 |
| `border.emphasized` | gray.300 | gray.700 |
| `border.inverted` | gray.800 | gray.200 |
| `border.error` | red.500 | red.400 |
| `border.warning` | orange.500 | orange.400 |
| `border.success` | green.500 | green.400 |
| `border.info` | blue.500 | blue.400 |

### Per-Color Semantic Tokens
Pattern: `{color}.{variant}` — available for:
`gray | red | orange | yellow | green | teal | blue | cyan | purple | pink`

| Variant | Description |
|---------|-------------|
| `.contrast` | text on solid bg (usually white) |
| `.fg` | colored text |
| `.subtle` | very light tint bg |
| `.muted` | light tint bg |
| `.emphasized` | medium tint bg |
| `.solid` | full-color action bg |
| `.focusRing` | focus ring color |
| `.border` | colored border |

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

---

## Design Scale

### Spacing
```
0.5→2px  | 1→4px   | 1.5→6px  | 2→8px   | 2.5→10px | 3→12px
3.5→14px | 4→16px  | 5→20px   | 6→24px  | 7→28px   | 8→32px
9→36px   | 10→40px | 11→44px  | 12→48px | 14→56px  | 16→64px
20→80px  | 24→96px
```

### Border Radius
```
none | sm(2px) | md(4px) | lg(6px) | xl(8px) | 2xl(12px) | 3xl(16px) | full(9999px)
```

### Shadows
```
xs | sm | md | lg | xl | 2xl | inner | none
```

### Typography

**Font Size:**
```
2xs(10) | xs(12) | sm(14) | md(16) | lg(18) | xl(20) | 2xl(24)
3xl(30) | 4xl(36) | 5xl(48) | 6xl(60) | 7xl(72)
```

**Font Weight:**
```
thin(100) | light(300) | normal(400) | medium(500)
semibold(600) | bold(700) | extrabold(800) | black(900)
```

**Line Height:**
```
none(1) | tight(1.25) | snug(1.375) | normal(1.5) | relaxed(1.625) | loose(2)
Numeric: 3(12px) 4(16px) 5(20px) 6(24px) 7(28px) 8(32px) 9(36px) 10(40px)
```

**Text Styles:** `2xs | xs | sm | md | lg | xl | 2xl | 3xl | 4xl | 5xl | 6xl | 7xl | label | none`

### Layer Styles
```
fill.muted | fill.subtle | fill.surface | fill.solid
outline.subtle | outline.solid
indicator.bottom | indicator.top | indicator.start | indicator.end
disabled | none
```

### Z-Index
```
hide(-1) | base(0) | docked(10) | dropdown(1000) | sticky(1100)
banner(1200) | overlay(1300) | modal(1400) | popover(1500)
skipLink(1600) | toast(1700) | tooltip(1800)
```

### Breakpoints
```
xs(360px) | sm(480px) | md(768px) | lg(992px) | xl(1280px) | 2xl(1536px)
```
Vitrina targets: **360px** (mobile) · **480px** (mobile+) · **1440px** (desktop) · **1920px** (wide)

**Responsive pattern برای 360px:**
- `xs` breakpoint فقط برای تمایز < 360px از 360-479px (نادر)
- اکثر padding/font: `{ base: 'small', sm: 'large' }` — jump-up در 480px

### Palette Tokens (raw)
```
transparent | current | black | white
whiteAlpha.50–950 | blackAlpha.50–950
gray/red/orange/yellow/green/teal/blue/cyan/purple/pink → .50 .100 .200 .300 .400 .500 .600 .700 .800 .900 .950
```

---

## File Structure

```
src/
  components/layout/
    Layout.tsx       — outer shell, drawer mobile
    Navbar.tsx       — full-width sticky header
    Sidebar.tsx      — nav groups + store selector
    SidebarItem.tsx  — collapsible items w/ sub-lines (Chakra Collapsible + ChevronDown)
    Header.tsx       — page title + breadcrumb + CTA slot
    UserMenu.tsx     — avatar dropdown (Menu.Root, Box as="button" trigger, Portal+dir="rtl")
  components/settings/
    SettingCard.tsx  — navigation card (icon + title + description + chevron, RTL)
    categories/
      CategoryAccordion.tsx — accordion row (controlled/uncontrolled، Collapsible، 6 states، RTL)
    info/
      AddressCard.tsx      — address display card (map placeholder, active toggle, 3-dot menu)
      AddAddressDialog.tsx — add/edit address dialog (2-col desktop, map area)
      PhoneCard.tsx        — phone number card (3-dot menu)
      AddPhoneDialog.tsx   — add/edit phone dialog (SegmentGroup type selector)
      SocialCard.tsx       — social network card (brand SVG icons, 3-dot menu)
      AddSocialDialog.tsx  — add/edit social dialog
    shipping/
      ShippingCardCustom.tsx        — custom shipping card (default/disabled states، toggle، 3-dot menu)
      ShippingCardSystem.tsx        — system shipping card (default/disabled/comingSoon states، toggle)
      ShippingCalculatorDialog.tsx  — modal محاسبه هزینه ارسال (weight input → calc per method، responsive 3-col/2-col grid)
    themes/
      ThemeCard.tsx   — کارت پوسته (SVG thumbnail، active/inactive state، badge)
      SliderItem.tsx  — آیتم اسلایدر (image upload، title input، reorder، delete)
      BannerCard.tsx  — کارت بنر (image upload، link input، delete)
  components/ui/
    ButtonFooter.tsx   — footer با دکمه‌های ذخیره/لغو/بازگشت
    RichTextEditor.tsx — Tiptap editor (Global emotion CSS برای ProseMirror styles)
    TitleBar.tsx       — section header با title + optional CTA
  contexts/
    ColorModeContext.tsx   — custom dark mode (.dark on <html>, localStorage)
    CompactModeContext.tsx — 512px simulation context (useCompactMode hook)
  pages/
    Dashboard.tsx
    Settings.tsx          — settings landing page با SettingCard grid
    account/
      UserInfo.tsx            — حساب کاربری (3 tabs: user-info / security / auth)
      SecuritySection.tsx     — تب امنیت (تغییر رمز + 2FA)
      TwoFactorSection.tsx    — تایید دو مرحله‌ای (SMS / Email / Authenticator)
      IdentitySection.tsx     — احراز هویت (3 states: empty / pending / approved، Steps + FileUpload)
      LoginHistorySection.tsx — تاریخچه ورود (جدول 4 ستون RTL، horizontal scroll در موبایل)
    settings/
      GeneralInfo.tsx        — اطلاعات فروشگاه (3 tabs: identity / contact / address)
      Categories.tsx         — دسته‌بندی‌ها (Two Columns Right Center، accordion + search + InfoBox)
      SalesSettings.tsx      — تنظیمات فروش (One Column Center، dollar/gold switch، phone grid)
      ShippingSettings.tsx   — روش‌های ارسال (Two Columns Right Center، ShippingCardCustom + ShippingCardSystem grids)
      AddShippingMethod.tsx  — افزودن روش ارسال (One Column Center، Collapsible sections، WeightRangeChart با BarSegment)
      ThemeSettings.tsx      — پوسته‌ها (Two Columns Right Center، ThemeCard grid، SVG thumbnail)
      ThemeCustomize.tsx     — سفارشی‌سازی پوسته (One Column Center، SliderItem + BannerCard)
      Badges.tsx             — نمادها و مجوزها (One Column Center، 3 badge sections، enamad + ecunion + samandehi)
  services/
    api.ts
  theme/
    index.ts   — createSystem entry
    tokens.ts  — Vitrina custom tokens + full reference comment
  utils/
    numbers.ts — toPersianDigits + toLatinDigits
  types/
    nav.ts     — NavGroup, NavItem types
```
