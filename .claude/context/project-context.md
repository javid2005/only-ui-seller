# Vitrina — Project Context
> updated: 2026-06-05 | tokens/breakpoints canonical → CLAUDE.md (اینجا فقط design-side context)

---

## معرفی پروژه

| فیلد | مقدار |
|------|-------|
| نام | Vitrina |
| نوع | Dashboard / E-commerce admin |
| Framework | React + Vite + TypeScript |
| Design System | Chakra UI v3 |
| زبان | فارسی — RTL only |
| فونت | Vazirmatn |
| Package Manager | pnpm |

---

## Brand Tokens

→ **canonical در `CLAUDE.md` پروژه** (بخش *Token Reference* — Brand + Map با Light/Dark کامل).
اینجا duplicate نمی‌کنیم (قبلاً drift شده بود: focusRing/border). برای مقدار دقیق → CLAUDE.md.

رنگ‌های پایه: Primary `teal` · Error `red` · Success `green` · Warning `orange`.

---

## Grid System

| Grid | ستون | Gutter | Margin |
|------|------|--------|--------|
| Main | 12 | 16px | 16px |
| Card Stretch | 10 | 16px | 24px |

---

## Breakpoints

→ **canonical در `CLAUDE.md`** (بخش *Design Scale → Breakpoints* — شامل **360px** + Chakra scale + responsive pattern).
زیر فقط **layout measurements** هر breakpoint (design-side، در CLAUDE.md نیست):

### Layout در هر breakpoint

| متغیر | 480px | 1440px | 1920px |
|--------|-------|--------|--------|
| Navbar width | 512px | 1440px | 1920px |
| Main width | 512px | 1184px | 1664px |
| Sidebar width | 0 | 256px | 256px |
| Content start | 0 | 256px | 256px |

---

## Feature Flags (Boolean Variables)

| Variable | Default | کاربرد |
|----------|---------|--------|
| Theme/Light | true | حالت روشن |
| Theme/Dark | false | حالت تاریک |
| Theme/isChecked | false | وضعیت تاگل تم |
| Products/Show Discount | false | نمایش تخفیف |
| Products/Show Selected-Prd CTA | true | نمایش CTA محصول انتخابی |
| Products/Currency/Show Currency-Alert | false | نمایش هشدار ارز |
| Badge | true | نمایش badge |
| btnScreen/Show Maximize | false | دکمه maximize |
| btnScreen/Show Minimize | true | دکمه minimize |

## String Variables

| Variable | مقدار | کاربرد |
|----------|-------|--------|
| Products/Currency/Currency | تومان | واحد پول نمایش محصولات |

---

## Layout

| فایل | مسیر | کاربرد |
|------|------|--------|
| `DashboardLayout` | `src/layouts/DashboardLayout.tsx` | layout اصلی — navbar + sidebar |

- **۹۰٪+ صفحات** از این layout استفاده می‌کنن
- صفحات **بدون layout**: login، signup
- sidebar items بر اساس **permission/role** فیلتر می‌شن (vendor vs user)
- در موبایل (480px): sidebar مخفی می‌شه، با drawer/hamburger جایگزین می‌شه
- قبل از ساخت هر صفحه جدید این فایل رو بخون

---

## نکات مهم پروژه

1. breakpoints → CLAUDE.md (canonical: 360/480/1440/1920)
2. Navbar عرض کامل — Content از سمت راست 256px offset داره
3. سیستم discount و currency جداگانه
4. Dark/Light mode از طریق boolean variable

---

## کارهای معوق (TODO)

| کار | جزئیات | وضعیت |
|-----|---------|--------|
| Persian Numbers | ساخت `src/utils/numbers.ts` با `toPersianDigits` + `toLatinDigits` — migrate همه JSX display | ⏳ |
| Persian Calendar | همه تاریخ‌های display باید `fa-IR-u-ca-persian` locale داشته باشن | ⏳ |

**قانون:** user میبینه؟ → فارسی. code میخونه؟ → انگلیسی (API، محاسبات، ID)
