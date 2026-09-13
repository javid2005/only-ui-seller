import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'
import { vitrinaTokens } from './tokens'

const layoutConfig = defineConfig({
  theme: {
    breakpoints: {
      xs: '360px',
    },
    // ─── فاصلهٔ زیاد بین ارقام فارسی در Table/Badge ───────────────────────────
    // Chakra v3 روی recipe پیش‌فرض table/badge خودش `fontVariantNumeric:
    // "tabular-nums"` ست می‌کنه (بهینه‌سازی برای ارقام لاتین که ستون‌های عددی رو
    // هم‌عرض نگه می‌داره). ارقام فارسی (۰-۹) در Vazirmatn عرض طبیعی نامساوی دارن؛
    // تحمیل عرض یکسان (tabular) باعث می‌شه رقم‌های باریک (مثل ۱) با فاصلهٔ اضافه پر
    // بشن و کل عدد بی‌دلیل کش بیاد — دقیقاً چیزی که در جدول‌ها/Badgeها دیده می‌شه،
    // برخلاف Input/NumberField که این recipe رو ندارن (fontVariantNumeric پیش‌فرض/
    // proportional دارن و درست دیده می‌شن).
    // ⚠️ override با globalCss (سلکتور CSS خام) کار نکرد — Chakra/Panda از CSS
    // `@layer` استفاده می‌کنه و لایهٔ `recipes` همیشه بعد از `base`(globalCss) میاد،
    // پس صرف‌نظر از specificity سلکتور همیشه recipe می‌بره. راه درست: خودِ recipe رو
    // اینجا override کن — mergeConfigs (`createSystem`) این آبجکت رو deep-merge
    // می‌کنه با recipe پیش‌فرض، پس فقط همین یه property عوض می‌شه، بقیهٔ recipe دست‌نخورده.
    slotRecipes: {
      // slots: [] — فقط برای رضایت تایپ؛ در merge واقعی (runtime، createSystem) چون
      // آرایهٔ خالیه هیچ عنصری از slots اصلی table رو بازنویسی نمی‌کنه (فقط تا طول
      // source پیش می‌ره، که صفره) — لیست واقعی slots دست‌نخورده می‌مونه.
      table: { slots: [], base: { root: { fontVariantNumeric: 'normal' } } },
    },
    recipes: {
      badge: { base: { fontVariantNumeric: 'normal' } },
    },
  },
  globalCss: {
    // ─── نشانگر ماوس روی هر چیزِ کلیک‌شدنی ───────────────────────────────────
    // بازخورد مالک محصول (۱۴۰۵/۰۶): در بسیاری از جاها نشانگر به دست تغییر نمی‌کرد.
    // ریشه‌اش تک‌تک کامپوننت‌ها نبود: توکن `cursor.button` چاکرا pointer است ولی
    // فقط روی recipe دکمه اعمال می‌شود — `chakra.button` خام، تریگر Select، ریشهٔ
    // Switch/Checkbox و تب‌ها هیچ‌کدام cursor نمی‌گیرند و به `default` مرورگر
    // می‌افتند. پس قاعده را همین‌جا سراسری می‌گذاریم، نه در هر فایل.
    [[
      'button:not(:disabled)',
      '[role="button"]:not([aria-disabled="true"])',
      '[role="tab"]', '[role="switch"]', '[role="option"]', '[role="menuitem"]',
      '[role="radio"]', '[role="checkbox"]',
      'label[data-scope="switch"]', 'label[data-scope="checkbox"]', 'label[data-scope="radio"]',
      '[data-scope="select"][data-part="trigger"]',
      '[data-scope="combobox"][data-part="trigger"]',
      'a[href]', 'summary', 'select',
    ].join(', ')]: {
      cursor: 'pointer',
    },
    'button:disabled, [aria-disabled="true"], [data-disabled]': {
      cursor: 'not-allowed',
    },
    'html, body': {
      direction: 'rtl',
      fontFamily: 'body',
      bg: 'bg.subtle',
    },
    // ─── RTL defensive fix: Switch control always first (rightmost in RTL) ───
    // CSS order:-1 ensures control appears before label regardless of DOM order.
    // In RTL flex: order:-1 = first in main axis = rightmost ✓
    // In LTR flex: order:-1 = first in main axis = leftmost ✓  (also correct)
    '[data-scope="switch"][data-part="control"]': {
      order: -1,
    },
  },
})

export const system = createSystem(defaultConfig, vitrinaTokens, layoutConfig)
