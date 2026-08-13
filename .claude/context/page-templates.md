<!-- version: 7 | updated: 2026-06-15 | changelog: «Grid System (مبنای قالب‌ها)» اضافه شد — قالب‌ها بر اساس span ستون از grid ۱۲ستونه (margin/gutter 16) تعریف می‌شن، نه px ثابت. قالب Print-Label (6 ستون مرکز = 808px) اضافه شد. -->

# Page Templates — Vitrina Dashboard
> همیشه همراه با `.claude/context/project-context.md` استفاده شود

---

## مشخصات کلی

| مشخصه | مقدار |
|--------|-------|
| عرض canvas (desktop base) | 1920px |
| عرض Sidebar | 256px — ثابت |
| جهت | RTL |

---

## Grid System — مبنای قالب‌ها (canonical)

> **اصل:** قالب‌ها بر اساس **span ستون** از یک grid ۱۲ستونه روی Main تعریف می‌شن — **نه** عرض px ثابت.
> px فقط مقدار محاسبه‌شده‌ی span در یه canvas مشخصه. در Figma این همون layout-guide ـه:
> `Main → 12 columns · margin 16 · gutter 16 · type: Stretch`.

**فرمول (هر canvas):**
```
content   = Main − 2×margin            (margin = 16)
colWidth  = (content − 11×gutter) / 12  (gutter = 16)
span(N)   = N×colWidth + (N−1)×gutter   ← عرض N ستون متوالی
```

**جدول مرجع — canvas 1920 (Main = 1664px):**
```
content = 1664 − 32 = 1632    |    colWidth = (1632 − 176)/12 = 121.33px
```
| span | px | کاربرد نمونه |
|------|-----|-------------|
| 3 ستون | **396** | ستون باریک کناری (End — خلاصه/یادداشت) |
| 6 ستون | **808** | محتوای مرکز باریک (Print-Label) |
| 9 ستون | **1220** | ستون اصلی پهن (Middle — Order Details) |
| 9 + 3 | 1220 + 396 (+16) = 1632 | دوستونه (Order Details: راست پهن + چپ باریک) |

**ترجمه به کد:**
```tsx
// span مرکز (مثل Print-Label = 6 ستون):
<Flex direction="column" align="center" w="full">
  <Box w="full" maxW="808px"> … </Box>   {/* fill زیر 808، cap بالای آن */}
</Flex>

// دو ستون نامتقارن (مثل Order Details = 9 + 3):
<Flex gap="6" align="flex-start">       {/* gap ستون‌ها = gutter سیستم */}
  <Box flex="1" minW="0">…</Box>         {/* Middle ~9 ستون — راست (اول DOM) */}
  <Box w="396px" flexShrink={0}>…</Box>  {/* End 3 ستون — چپ (آخر DOM) */}
</Flex>
```
- `maxW` = `span(N)` در بزرگ‌ترین canvas؛ زیر آن fill می‌شه (Stretch).
- مرکز‌کردن: `mx="auto"` یا والد `align="center"`.
- قالب‌های px-محورِ پایین (960/1584/…) سابقه‌ی قدیمی‌ترن؛ برای صفحات **نو** این grid مبناست.

---

## ساختار لایه‌بندی استاندارد

```
Page
├── Navbar                          ← fill container | محتوا max 1920px
└── Body  [horizontal auto layout]
    ├── Main  [vertical auto layout]
    │   │   width: fill container
    │   │   padding: 16px
    │   │   gap: 16px
    │   ├── Page-Header (component)
    │   └── Content  [horizontal auto layout]
    │       │   padding: 24px
    │       │   gap: 40px
    │       ├── Start   ← ستون راست (RTL — اول رندر می‌شود)
    │       ├── Middle  ← ستون مرکزی (شامل کارت/panel)
    │       └── End     ← ستون چپ
    └── Sidebar (component)         ← width: 256px — fixed
```

### قوانین نام‌گذاری ستون‌ها در RTL

| نام | موقعیت | توضیح |
|-----|---------|-------|
| **Start** | راست | در RTL، شروع از راست — اول رندر می‌شود |
| **Middle** | مرکز | ستون اصلی محتوا |
| **End** | چپ | در RTL، انتها سمت چپ |

---

## Spacing

### Main Frame
| مشخصه | مقدار | Chakra token |
|--------|-------|-------------|
| padding | 16px (همه طرف) | `p="4"` |
| gap | 16px | `gap="4"` |

### Content Frame
| مشخصه | مقدار | Chakra token |
|--------|-------|-------------|
| padding | 24px (همه طرف) | `p="6"` |
| gap | 40px (بین ستون‌ها) | `gap="10"` |

### عرض‌های محاسبه‌شده در canvas 1920px

| لایه | محاسبه | نتیجه |
|------|--------|-------|
| Body | 1920 − 256 (Sidebar) | **1664px** |
| Main | 1664 − 16×2 (padding) | **1632px** |
| Content | 1632 − 24×2 (padding) | **1584px** |

### داخل Panel

> **قانون:** `bg="bg.panel"`, `borderWidth="1px"`, `borderColor="border"`, `rounded="2xl"` و `p="6"` (24px) فقط روی **panel wrapper** قرار می‌گیرد.  
> ستون‌های داخل (Start/Middle/End) هیچ‌کدام `bg` یا `padding` ندارند.  
> inner content داخل هر ستون میتواند padding داشته باشد — این به طراحی همان component بستگی دارد.

---

## Template ها

---

### 1. One Column Fill
> **Figma:** https://www.figma.com/design/CfbQjlet5WMabrTfZt46iL/Vitrina?node-id=1984-27376&t=MC27TP1VjEnFONmR-11

```
Content (1584px)
└── Middle — fill (max 1584px)
```

| ستون | width |
|------|-------|
| Middle | fill |

**کاربرد:** لیست محصولات، جداول داده، داشبورد اصلی

**کد Chakra:**
```tsx
<Box w="full" bg="bg.panel" borderWidth="1px" borderColor="border" rounded="2xl" p="6">
  {/* content: fill */}
</Box>
```

---

### 2. One Column Center ⭐ default
> **Figma:** https://www.figma.com/design/CfbQjlet5WMabrTfZt46iL/Vitrina?node-id=281-5698&t=MC27TP1VjEnFONmR-11

```
Content (1584px)
└── Middle — max 960px | fill در canvas کوچک‌تر
```

| ستون | width |
|------|-------|
| Middle | max 960px |

**کاربرد:** فرم‌های تک‌ستونه، صفحات تنظیمات، ثبت اطلاعات

> اگه template مشخص نشد از این استفاده کن

**کد Chakra:**
```tsx
<Box maxW="960px" w="full" bg="bg.panel" borderWidth="1px" borderColor="border" rounded="2xl" p="6">
  {/* content: max 960px */}
</Box>
```

---

### 3. Two Columns Right Center
> **Figma:** https://www.figma.com/design/CfbQjlet5WMabrTfZt46iL/Vitrina?node-id=281-5732&t=MC27TP1VjEnFONmR-11

```
Content (1584px)
├── Start  — 256px fixed      ← راست
└── Middle — max 960px fill   ← مرکز
```

| ستون | موقعیت | width |
|------|---------|-------|
| Start | راست | 256px fixed |
| Middle | مرکز | max 960px fill |

**کاربرد:** پنل اطلاعات جانبی (راست) + محتوای اصلی (مرکز)

**کد Chakra:**
```tsx
<Box bg="bg.panel" borderWidth="1px" borderColor="border" rounded="2xl" p="6" w="full">
  <Flex gap="10" align="flex-start">
    {/* Start — RTL: first = rightmost */}
    <Box w="256px" flexShrink={0} />
    {/* Middle */}
    <Box maxW="960px" flex="1" />
  </Flex>
</Box>
```

---

### 4. Two Columns Right Fill
> **Figma:** https://www.figma.com/design/CfbQjlet5WMabrTfZt46iL/Vitrina?node-id=281-5708&t=MC27TP1VjEnFONmR-11

```
Content (1584px)
├── Start  — 256px fixed        ← راست
└── Middle — fill (~1288px)     ← مرکز/چپ
```

| ستون | موقعیت | width | محاسبه |
|------|---------|-------|--------|
| Start | راست | 256px fixed | — |
| Middle | مرکز | fill | 1584 − 256 − 40(gap) = **1288px** |

**کاربرد:** محتوای گسترده + پنل کوچک جانبی راست

**کد Chakra:**
```tsx
<Box bg="bg.panel" borderWidth="1px" borderColor="border" rounded="2xl" p="6" w="full">
  <Flex gap="10" align="flex-start">
    {/* Start — RTL: first = rightmost */}
    <Box w="256px" flexShrink={0} />
    {/* Middle */}
    <Box flex="1" />
  </Flex>
</Box>
```

---

### 5. Three Columns
> **Figma:** https://www.figma.com/design/CfbQjlet5WMabrTfZt46iL/Vitrina?node-id=281-5719&t=MC27TP1VjEnFONmR-11

```
Content (1584px)
├── Start  — max 288px fixed    ← راست
├── Middle — max 960px fill     ← مرکز
└── End    — max 256px fixed    ← چپ
```

| ستون | موقعیت | width |
|------|---------|-------|
| Start | راست | max 288px |
| Middle | مرکز | max 960px fill |
| End | چپ | max 256px |

**کاربرد:** ناوبری/فیلتر (Start-راست) + محتوای اصلی (Middle) + اطلاعات جانبی (End-چپ)

**کد Chakra:**
```tsx
<Box bg="bg.panel" borderWidth="1px" borderColor="border" rounded="2xl" p="6" w="full">
  <Flex gap="10" align="flex-start">
    {/* Start — RTL: first = rightmost */}
    <Box maxW="288px" w="full" flexShrink={0} />
    {/* Middle */}
    <Box maxW="960px" flex="1" />
    {/* End — RTL: last = leftmost */}
    <Box maxW="256px" w="full" flexShrink={0} />
  </Flex>
</Box>
```

---

### 6. One Card Center
> **Figma:** https://www.figma.com/design/CfbQjlet5WMabrTfZt46iL/Vitrina?node-id=281-5698&t=MC27TP1VjEnFONmR-11

```
Main (fill, max 1664px)
└── Panel — max 960px، centered
```

| لایه | width | توضیح |
|------|-------|-------|
| Panel | max 960px | خود panel سفید، centered در Main |

**کاربرد:** فرم‌های فوکوس‌شده، صفحات login/register، wizard های تک‌مرحله‌ای

> تنها template‌ای که **panel خودش** max-width دارد — در بقیه panel = fill است

**کد Chakra:**
```tsx
<Box maxW="960px" w="full" mx="auto" bg="bg.panel" borderWidth="1px" borderColor="border" rounded="2xl" p="6">
  {/* content: max 960px */}
</Box>
```

---

### 7. One Column Center — Narrow (6-col / 808px)
> **Figma:** Order / Print-Label — node 2180:32979

```
Main (fill, items-center)
└── Container — span 6 ستون = max 808px، centered
```

| لایه | width |
|------|-------|
| Container | 6 ستون → maxW 808px (fill زیر آن) |

**کاربرد:** صفحات سند/چاپ، محتوای فوکوس‌شده‌ی باریک (برچسب، رسید)

> تنها تفاوت با «One Column Center» (960px): عرض = span 6 ستونِ grid (نه 960px دلخواه). محتوا مستقیم در Main مرکز می‌شه (panel سفید جدا لازم نیست).

**کد Chakra:** → بخش «Grid System → ترجمه به کد» بالا.

---

## خلاصه مقایسه‌ای

| Template | Panel | ستون‌های داخل panel |
|----------|------|-------------------|
| One Column Fill | fill | Middle = fill |
| **One Column Center** ⭐ | max 960px | Middle = max 960px |
| Two Columns Right Center | fill | Start=256px + Middle=max 960px |
| Two Columns Right Fill | fill | Start=256px + Middle=fill |
| Three Columns | fill | Start=max 288px + Middle=max 960px + End=max 256px |
| **One Card Center** | **max 960px** | — |

> ستون‌ها **هیچ‌وقت** `bg` یا `p` ندارند — فقط `w`/`maxW`/`flex`

---

## Responsive Behavior

| المان | canvas = 1920px | canvas < 1920px | tablet/mobile |
|-------|----------------|----------------|---------------|
| Navbar | fill — محتوا max 1920px | fill — کوچک می‌شه | fill |
| Sidebar | 256px fixed | 256px fixed | hidden — hamburger |
| Main | fill | fill — کوچک می‌شه | fill |
| Middle (max 960px) | 960px | fill تا max | fill |

> در canvas کوچک‌تر از 1920px، اگه Content area از 960px کمتر باشه، Middle column fill می‌شه.

---

## نکات مهم برای Claude

1. **`bg="bg.panel"` + `borderWidth="1px"` + `borderColor="border"` + `rounded="2xl"` + `p="6"` فقط روی panel wrapper** — ستون‌ها (Start/Middle/End) هیچ‌کدام `bg` یا `padding` ندارند. inner content داخل هر ستون میتواند padding داشته باشد (به طراحی component بستگی دارد)
2. **همه frame ها Auto Layout** — هیچ frame معمولی استفاده نکن
3. **Main و Content همیشه fill container** — عرض ثابت نده
4. **Start = راست / End = چپ** در RTL — DOM order: Start → Middle → End
5. **gap بین ستون‌ها = 40px** (gap="10" در Chakra)
6. **Sidebar در tablet/mobile** hidden می‌شود
7. اگه template مشخص نشد → **1 Column Center** به عنوان default
8. **maxW فقط روی Middle** — نه روی Flex wrapper بیرونی
