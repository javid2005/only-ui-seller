import { defineConfig } from '@chakra-ui/react'

/**
 * ============================================================
 * VITRINA — COMPLETE TOKEN REFERENCE
 * ============================================================
 *
 * ── SEMANTIC TOKENS (context-aware, auto light/dark) ────────
 *
 * BACKGROUND
 *   bg               → page background (white / gray.950)
 *   bg.subtle        → slightly off-white (gray.50 / gray.900)
 *   bg.muted         → muted surface (gray.100 / gray.800)
 *   bg.emphasized    → stronger surface (gray.200 / gray.700)
 *   bg.inverted      → inverted bg (gray.800 / gray.200)
 *   bg.panel         → card / panel bg (white / gray.900)
 *   bg.error         → error state bg
 *   bg.warning       → warning state bg
 *   bg.success       → success state bg
 *   bg.info          → info state bg
 *
 * FOREGROUND (text / icons)
 *   fg               → primary text (gray.800 / gray.100)
 *   fg.muted         → secondary text (gray.600 / gray.400)
 *   fg.subtle        → tertiary text (gray.500 / gray.500)
 *   fg.inverted      → text on dark bg
 *   fg.error / fg.warning / fg.success / fg.info
 *
 * BORDER
 *   border           → default border (gray.200 / gray.700)
 *   border.muted     → faint border
 *   border.subtle    → subtle border
 *   border.emphasized → stronger border (gray.300 / gray.600)
 *   border.inverted  → inverted border
 *   border.error / border.warning / border.success / border.info
 *
 * ── PER-COLOR SEMANTIC TOKENS ───────────────────────────────
 *   Available for: gray | red | orange | yellow | green |
 *                  teal | blue | cyan | purple | pink
 *
 *   {color}.contrast   → text on solid bg (usually white)
 *   {color}.fg         → colored foreground text
 *   {color}.subtle     → very light tint bg
 *   {color}.muted      → light tint bg
 *   {color}.emphasized → medium tint bg
 *   {color}.solid      → full-color bg (primary action)
 *   {color}.focusRing  → focus ring color
 *   {color}.border     → colored border
 *
 *   Example: teal.solid → #0D9488 (light) | #2DD4BF (dark)
 *
 * ── VITRINA BRAND TOKENS (custom — teal-based) ──────────────
 *   brand.solid        → teal.600 / teal.400  (primary action)
 *   brand.contrast     → white / teal.950     (text on brand)
 *   brand.fg           → teal.700 / teal.300  (brand text)
 *   brand.muted        → teal.100 / teal.900  (light brand bg)
 *   brand.subtle       → teal.50  / teal.950  (very light brand)
 *   brand.emphasized   → teal.200 / teal.800  (medium brand)
 *   brand.focusRing    → teal.600 / teal.400
 *
 * ── VITRINA SURFACE TOKENS (custom) ─────────────────────────
 *   surface.subtle     → gray.50  / gray.900
 *   surface.muted      → gray.100 / gray.800
 *   surface.card       → white / gray.900
 *
 * ── PALETTE TOKENS (raw colors) ─────────────────────────────
 *   transparent | current | black | white
 *   whiteAlpha.50–950  | blackAlpha.50–950
 *   gray.50–950
 *   red.50–950   | orange.50–950 | yellow.50–950
 *   green.50–950 | teal.50–950   | blue.50–950
 *   cyan.50–950  | purple.50–950 | pink.50–950
 *
 * ── TEXT STYLES ─────────────────────────────────────────────
 *   2xs | xs | sm | md | lg | xl | 2xl | 3xl | 4xl | 5xl | 6xl | 7xl
 *   label | none
 *
 * ── LAYER STYLES ────────────────────────────────────────────
 *   fill.muted | fill.subtle | fill.surface | fill.solid
 *   outline.subtle | outline.solid
 *   indicator.bottom | indicator.top | indicator.start | indicator.end
 *   disabled | none
 *
 * ── BREAKPOINTS ─────────────────────────────────────────────
 *   sm (480px) | md (768px) | lg (992px) | xl (1280px) | 2xl (1536px)
 *
 * ── SPACING SCALE ───────────────────────────────────────────
 *   0, 0.5(2px), 1(4px), 1.5(6px), 2(8px), 2.5(10px), 3(12px),
 *   3.5(14px), 4(16px), 5(20px), 6(24px), 7(28px), 8(32px),
 *   9(36px), 10(40px), 11(44px), 12(48px), 14(56px), 16(64px),
 *   20(80px), 24(96px), 28(112px), 32(128px), 36(144px),
 *   40(160px), 44(176px), 48(192px), 52(208px), 56(224px),
 *   60(240px), 64(256px), 72(288px), 80(320px), 96(384px)
 *
 * ── BORDER RADIUS ───────────────────────────────────────────
 *   none | sm(2px) | md(4px) | lg(6px) | xl(8px) | 2xl(12px) |
 *   3xl(16px) | full(9999px)
 *
 * ── SHADOWS ─────────────────────────────────────────────────
 *   xs | sm | md | lg | xl | 2xl | inner | none | inset
 *
 * ── Z-INDEX ─────────────────────────────────────────────────
 *   hide(-1) | base(0) | docked(10) | dropdown(1000) |
 *   sticky(1100) | banner(1200) | overlay(1300) | modal(1400) |
 *   popover(1500) | skipLink(1600) | toast(1700) | tooltip(1800)
 *
 * ── FONT SIZE ───────────────────────────────────────────────
 *   2xs(10px) | xs(12px) | sm(14px) | md(16px) | lg(18px) |
 *   xl(20px) | 2xl(24px) | 3xl(30px) | 4xl(36px) | 5xl(48px) |
 *   6xl(60px) | 7xl(72px)
 *
 * ── FONT WEIGHT ─────────────────────────────────────────────
 *   thin(100) | light(300) | normal(400) | medium(500) |
 *   semibold(600) | bold(700) | extrabold(800) | black(900)
 *
 * ── LINE HEIGHT ─────────────────────────────────────────────
 *   none(1) | tight(1.25) | snug(1.375) | normal(1.5) |
 *   relaxed(1.625) | loose(2)
 *   Numeric: 3(12px) 4(16px) 5(20px) 6(24px) 7(28px) 8(32px) 9(36px) 10(40px)
 *
 * ============================================================
 */

export const vitrinaTokens = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'Vazirmatn', sans-serif` },
        body: { value: `'Vazirmatn', sans-serif` },
        mono: { value: `'Vazirmatn', monospace` },
      },
    },
    semanticTokens: {
      colors: {
        // ── Brand (teal-based primary) ──────────────────────
        brand: {
          solid: { value: { _light: '{colors.teal.600}', _dark: '{colors.teal.400}' } },
          contrast: { value: { _light: '{colors.white}', _dark: '{colors.teal.950}' } },
          fg: { value: { _light: '{colors.teal.700}', _dark: '{colors.teal.300}' } },
          muted: { value: { _light: '{colors.teal.100}', _dark: '{colors.teal.900}' } },
          subtle: { value: { _light: '{colors.teal.50}', _dark: '{colors.teal.950}' } },
          emphasized: { value: { _light: '{colors.teal.200}', _dark: '{colors.teal.800}' } },
          focusRing: { value: { _light: '{colors.teal.600}', _dark: '{colors.teal.400}' } },
          border: { value: { _light: '{colors.teal.300}', _dark: '{colors.teal.700}' } },
        },
        // ── Background helpers ───────────────────────────────
        bg: {
          teal: { value: { _light: '{colors.teal.50}', _dark: '{colors.teal.950}' } },
        },
        // ── Surface helpers ──────────────────────────────────
        surface: {
          subtle: { value: { _light: '{colors.gray.50}', _dark: '{colors.gray.900}' } },
          muted: { value: { _light: '{colors.gray.100}', _dark: '{colors.gray.800}' } },
          card: { value: { _light: '{colors.white}', _dark: '{colors.gray.900}' } },
        },
      },
    },
  },
})
