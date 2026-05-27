import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'
import { vitrinaTokens } from './tokens'

const layoutConfig = defineConfig({
  theme: {
    breakpoints: {
      xs: '360px',
    },
  },
  globalCss: {
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
