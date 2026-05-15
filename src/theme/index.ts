import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'
import { vitrinaTokens } from './tokens'

const layoutConfig = defineConfig({
  globalCss: {
    'html, body': {
      direction: 'rtl',
      fontFamily: 'body',
      bg: 'bg.subtle',
    },
  },
})

export const system = createSystem(defaultConfig, vitrinaTokens, layoutConfig)
