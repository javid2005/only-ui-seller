# Vitrina — Claude Reference

## Knowledge References
→ `dev-knowledge/` repo — دانش مشترک بین پروژه‌ها (RTL، tokens، known bugs، چک‌لیست)

| موضوع | فایل |
|-------|------|
| RTL concepts | `dev-knowledge/universal/rtl-concepts.md` |
| Chakra v3 bugs | `dev-knowledge/design-systems/chakra-ui-v3/known-bugs.md` |
| Chakra v3 tokens | `dev-knowledge/design-systems/chakra-ui-v3/tokens.md` |
| RTL در Chakra | `dev-knowledge/design-systems/chakra-ui-v3/rtl.md` |
| Figma→Code workflow | `dev-knowledge/universal/figma-to-code.md` |
| Page Templates | `dev-knowledge/projects/vitrina/page-templates.md` |

---

## Root Cause Protocol (اجباری)

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

## Figma Access Gate (اجباری — بالاتر از همه)

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

## Figma → Code Protocol (اجباری)

هر task که از Figma به کد تبدیل میشه — حتی «اصلاح کن» / «مقایسه کن» / «ریسپانسیو کن» — این gate رو رد نکن.

**Component Resolution (به ترتیب، اجباری):**
```
1. Local first → src/components/ رو grep کن. موجوده؟ import کن (نساز).
2. DS second   → از Chakra UI MCP بگیر. هیچ‌وقت کامپوننت DS رو از HTML/div خام rebuild نکن.
3. Build last  → فقط اگه هیچ‌کدوم نبود، با primitives (Box/Flex/Text). صفر hardcode.
```

**MCP servers این پروژه:**
- Chakra UI MCP — `mcp__chakra-ui__list_components` / `get_component_example` / `get_component_props` / `get_theme`
- Figma MCP — `get_design_context` / `get_screenshot` / `get_variable_defs`

**Definition of Done — آخر هر task point-by-point گزارش بده:**
- [ ] Component Resolution رعایت شد (Local→DS MCP→Build) — کدوم مسیر؟
- [ ] صفر hardcode (رنگ/spacing/font) — همه token
- [ ] logical CSS props (`insetInlineEnd` نه `right`)
- [ ] RTL DOM order (اولین child = rightmost)
- [ ] responsive روی 480 / 1440 / 1920 چک شد
- [ ] `pnpm type-check` سبز

اگه چکی skip شد → با ⚠️ علامت بزن، نگو ✅.
مرجع عمیق: `dev-knowledge/universal/figma-to-code.md` · pipeline قدم‌به‌قدم: skill `figma-implement-design`

---

## Stack
- React 19 + Vite + TypeScript
- Chakra UI v3 + `@chakra-ui/charts` (BarSegment, BarList — wraps recharts)
- RTL / Persian (Vazirmatn font)
- pnpm

## Critical Rules

### RTL
- `dir="rtl"` on `<html>` in `index.html`
- `LocaleProvider locale="fa-IR"` wraps app in `main.tsx`
- RTL flex: **first DOM child = rightmost visually**
- Use logical CSS props: `insetInlineEnd` not `right`, `borderInlineEndWidth` not `borderRightWidth`, `borderEndStartRadius` not `borderBottomRightRadius`

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

### RTL in Portal components (Menu, Drawer, Popover, Tooltip)
- Portal content renders under `<body>` but DOES inherit `dir="rtl"` from `<html>` via CSS cascade
- Add `dir="rtl"` to `Menu.Positioner` / `Drawer.Positioner` etc. as an explicit safeguard
- **DOM order still controls flex direction** — cannot be fixed globally with CSS
- Always put elements in correct RTL DOM order: icon/avatar FIRST (rightmost), text SECOND, action LAST (leftmost)
- `bg="white"` → OK (Chakra palette token, not hardcoded). `bg="#ffffff"` → NOT OK

### Layout
- Navbar: full-width (no `maxW` on outer container); controls DOM order (RTL): Min/Max | Bell | Avatar with `gap="6"` (24px)
- Body (sidebar + content): `maxW="1920px" mx="auto"`, compact mode: `maxW="512px"`
- Sidebar: `w="256px"` expanded, `w="16"` collapsed
- RTL column flex: `align="flex-start"` = RIGHT side, `align="flex-end"` = LEFT side (counterintuitive!)

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
- SegmentGroup.Indicator → `bg="bg.panel"` (white در light، gray.900 در dark) — `bg="white"` dark mode رو می‌شکنه، `bg.default` broken

### TitleBar — wrapping rule
- title و subtitle هیچ‌وقت truncate نمیشن (`whiteSpace="nowrap"` ممنوع)
- روی صفحه‌های باریک (360px) عناوین بلند wrap میشن — این intentional است
- truncation مفهوم رو پنهان می‌کنه؛ wrap حفظ می‌کنه

---

## Token Reference

### Semantic Tokens — Background
| Token | Light | Dark |
|-------|-------|------|
| `bg` | white | gray.950 |
| `bg.subtle` | gray.50 | gray.900 |
| `bg.muted` | gray.100 | gray.800 |
| `bg.emphasized` | gray.200 | gray.700 |
| `bg.inverted` | gray.800 | gray.200 |
| `bg.panel` | white | gray.900 |
| `bg.error` | red.50 | red.950 |
| `bg.warning` | orange.50 | orange.950 |
| `bg.success` | green.50 | green.950 |
| `bg.info` | blue.50 | blue.950 |

### Semantic Tokens — Foreground
| Token | Light | Dark |
|-------|-------|------|
| `fg` | gray.800 | gray.100 |
| `fg.muted` | gray.600 | gray.400 |
| `fg.subtle` | gray.500 | gray.500 |
| `fg.inverted` | white | gray.900 |
| `fg.error` | red.700 | red.300 |
| `fg.warning` | orange.700 | orange.300 |
| `fg.success` | green.700 | green.300 |
| `fg.info` | blue.700 | blue.300 |

### Semantic Tokens — Border
| Token | Light | Dark |
|-------|-------|------|
| `border` | gray.200 | gray.700 |
| `border.muted` | gray.100 | gray.800 |
| `border.subtle` | gray.200 | gray.700 |
| `border.emphasized` | gray.300 | gray.600 |
| `border.inverted` | gray.800 | gray.200 |
| `border.error` | red.500 | red.500 |
| `border.warning` | orange.500 | orange.500 |
| `border.success` | green.500 | green.500 |
| `border.info` | blue.500 | blue.500 |

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

### Vitrina Brand Tokens (custom — `src/theme/tokens.ts`)
| Token | Light | Dark |
|-------|-------|------|
| `brand.solid` | teal.600 (#0D9488) | teal.400 |
| `brand.contrast` | white | teal.950 |
| `brand.fg` | teal.700 | teal.300 |
| `brand.muted` | teal.100 | teal.900 |
| `brand.subtle` | teal.50 | teal.950 |
| `brand.emphasized` | teal.200 | teal.800 |
| `brand.focusRing` | teal.600 | teal.400 |
| `brand.border` | teal.300 | teal.700 |

### Vitrina Surface Tokens (custom)
| Token | Light | Dark |
|-------|-------|------|
| `surface.subtle` | gray.50 | gray.900 |
| `surface.muted` | gray.100 | gray.800 |
| `surface.card` | white | gray.900 |

### Vitrina Background Helpers (custom)
| Token | Light | Dark |
|-------|-------|------|
| `bg.teal` | teal.50 | teal.950 |

---

## Spacing Scale
```
0.5 → 2px   | 1 → 4px    | 1.5 → 6px  | 2 → 8px
2.5 → 10px  | 3 → 12px   | 3.5 → 14px | 4 → 16px
5 → 20px    | 6 → 24px   | 7 → 28px   | 8 → 32px
9 → 36px    | 10 → 40px  | 11 → 44px  | 12 → 48px
14 → 56px   | 16 → 64px  | 20 → 80px  | 24 → 96px
```

## Border Radius
```
none | sm(2px) | md(4px) | lg(6px) | xl(8px) | 2xl(12px) | 3xl(16px) | full(9999px)
```

## Shadows
```
xs | sm | md | lg | xl | 2xl | inner | none
```

## Typography

### Font Size
```
2xs(10) | xs(12) | sm(14) | md(16) | lg(18) | xl(20) | 2xl(24)
3xl(30) | 4xl(36) | 5xl(48) | 6xl(60) | 7xl(72)
```

### Font Weight
```
thin(100) | light(300) | normal(400) | medium(500)
semibold(600) | bold(700) | extrabold(800) | black(900)
```

### Line Height
```
none(1) | tight(1.25) | snug(1.375) | normal(1.5) | relaxed(1.625) | loose(2)
Numeric: 3(12px) 4(16px) 5(20px) 6(24px) 7(28px) 8(32px) 9(36px) 10(40px)
```

### Text Styles
```
2xs | xs | sm | md | lg | xl | 2xl | 3xl | 4xl | 5xl | 6xl | 7xl | label | none
```

## Layer Styles
```
fill.muted | fill.subtle | fill.surface | fill.solid
outline.subtle | outline.solid
indicator.bottom | indicator.top | indicator.start | indicator.end
disabled | none
```

## Z-Index
```
hide(-1) | base(0) | docked(10) | dropdown(1000) | sticky(1100)
banner(1200) | overlay(1300) | modal(1400) | popover(1500)
skipLink(1600) | toast(1700) | tooltip(1800)
```

## Breakpoints
```
xs(360px) | sm(480px) | md(768px) | lg(992px) | xl(1280px) | 2xl(1536px)
```
Vitrina targets: 360px (small mobile), 480px (mobile), 1440px (desktop), 1920px (wide)

### Responsive pattern برای 360px
- `xs` breakpoint فقط برای تمایز < 360px از 360-479px استفاده می‌شه (نادر)
- برای اکثر padding/font: `{ base: 'small', sm: 'large' }` — jump-up در 480px
- `isCompact` path دست نمی‌خوره — مستقل از viewport breakpoints

## Palette Tokens (raw)
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
      ShippingCardCustom.tsx — custom shipping card (default/disabled states، toggle، 3-dot menu)
      ShippingCardSystem.tsx — system shipping card (default/disabled/comingSoon states، toggle)
  components/ui/
    ButtonFooter.tsx  — footer با دکمه‌های ذخیره/لغو/بازگشت
    RichTextEditor.tsx — Tiptap editor (Global emotion CSS برای ProseMirror styles)
    TitleBar.tsx      — section header با title + optional CTA
  contexts/
    ColorModeContext.tsx  — custom dark mode (.dark on <html>, localStorage)
    CompactModeContext.tsx — 512px simulation context (useCompactMode hook)
  pages/
    Dashboard.tsx
    Settings.tsx          — settings landing page با SettingCard grid
    settings/
      GeneralInfo.tsx     — اطلاعات فروشگاه (3 tabs: identity / contact / address)
      Categories.tsx      — دسته‌بندی‌ها (Two Columns Right Center، accordion + search + InfoBox)
      SalesSettings.tsx      — تنظیمات فروش (One Column Center، dollar/gold switch، phone grid)
      ShippingSettings.tsx   — روش‌های ارسال (Two Columns Right Center، ShippingCardCustom + ShippingCardSystem grids)
      AddShippingMethod.tsx  — افزودن روش ارسال (One Column Center، Collapsible sections، WeightRangeChart با BarSegment)
  services/
    api.ts
  theme/
    index.ts         — createSystem entry
    tokens.ts        — Vitrina custom tokens + full reference comment
  types/
    nav.ts           — NavGroup, NavItem types
```
