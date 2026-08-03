import { defineConfig } from '@chakra-ui/react'

/**
 * ============================================================
 * VITRINA — COMPLETE TOKEN REFERENCE
 * ============================================================
 *
 * ── SEMANTIC TOKENS (context-aware, auto light/dark) ────────
 *
 * BACKGROUND
 *   bg               → page background (white / black)
 *   bg.subtle        → slightly off-white (gray.50 / gray.950)
 *   bg.muted         → muted surface (gray.100 / gray.900)
 *   bg.emphasized    → stronger surface (gray.200 / gray.800)
 *   bg.inverted      → inverted bg (black / white)
 *   bg.panel         → card / panel bg (white / gray.950)
 *   bg.error         → error state bg
 *   bg.warning       → warning state bg
 *   bg.success       → success state bg
 *   bg.info          → info state bg
 *
 * FOREGROUND (text / icons)
 *   fg               → primary text (black / gray.50)
 *   fg.muted         → secondary text (gray.600 / gray.400)
 *   fg.subtle        → tertiary text (gray.400 / gray.500)
 *   fg.inverted      → text on dark bg (gray.50 / black)
 *   fg.error / fg.warning / fg.success / fg.info
 *
 * BORDER
 *   border           → default border (gray.200 / gray.800)
 *   border.muted     → faint border (gray.100 / gray.900)
 *   border.subtle    → subtle border (gray.50 / gray.950)
 *   border.emphasized → stronger border (gray.300 / gray.700)
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
 * ── VITRINA BRAND TOKENS (custom — teal-based, mirrors teal.* pattern) ──
 *   brand.solid        → teal.600 / teal.600  (primary action — same both modes)
 *   brand.contrast     → white / white        (text on brand solid)
 *   brand.fg           → teal.700 / teal.300  (brand text)
 *   brand.subtle       → teal.100 / teal.900  (light tint bg)
 *   brand.muted        → teal.200 / teal.800  (medium-light tint bg)
 *   brand.emphasized   → teal.300 / teal.700  (medium tint bg)
 *   brand.focusRing    → teal.500 / teal.500  (focus ring)
 *   brand.border       → teal.500 / teal.400  (brand border)
 *   brand.bg           → teal.50  / teal.950  (extra-light hover bg)
 *
 * ── VITRINA MAP TOKENS (custom — always-dark for map overlay controls) ──
 *   map.controlBg      → gray.900 / gray.900  (map button bg, dark in both modes)
 *   map.controlBgHover → gray.700 / gray.700  (map button hover)
 *
 * ── EXTRA "bg" VARIANT (custom — Chakra's default palettes don't ship one) ──
 *   purple.bg          → purple.50 / purple.950  (extra-light tint bg)
 *   blue.bg            → blue.50   / blue.950    (extra-light tint bg)
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
          solid: { value: { _light: '{colors.teal.600}', _dark: '{colors.teal.600}' } },
          contrast: { value: { _light: '{colors.white}', _dark: '{colors.white}' } },
          fg: { value: { _light: '{colors.teal.700}', _dark: '{colors.teal.300}' } },
          subtle: { value: { _light: '{colors.teal.100}', _dark: '{colors.teal.900}' } },
          muted: { value: { _light: '{colors.teal.200}', _dark: '{colors.teal.800}' } },
          emphasized: { value: { _light: '{colors.teal.300}', _dark: '{colors.teal.700}' } },
          focusRing: { value: { _light: '{colors.teal.500}', _dark: '{colors.teal.500}' } },
          border: { value: { _light: '{colors.teal.500}', _dark: '{colors.teal.400}' } },
          bg: { value: { _light: '{colors.teal.50}', _dark: '{colors.teal.950}' } },
        },
        // ── Map overlay controls (always dark regardless of color mode) ──
        map: {
          controlBg: { value: { _light: '{colors.gray.900}', _dark: '{colors.gray.900}' } },
          controlBgHover: { value: { _light: '{colors.gray.700}', _dark: '{colors.gray.700}' } },
        },
        // ── extra-light "bg" variant (Chakra default palettes only ship
        // contrast/fg/subtle/muted/emphasized/solid/focusRing/border) ──
        purple: {
          bg: { value: { _light: '{colors.purple.50}', _dark: '{colors.purple.950}' } },
        },
        blue: {
          bg: { value: { _light: '{colors.blue.50}', _dark: '{colors.blue.950}' } },
        },
      },
    },
  },
})
