'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type ColorMode = 'light' | 'dark'

interface ColorModeContextValue {
  colorMode: ColorMode
  toggleColorMode: () => void
}

const ColorModeContext = createContext<ColorModeContextValue>({
  colorMode: 'light',
  toggleColorMode: () => {},
})

export function ColorModeProvider({ children }: { children: ReactNode }) {
  // Start 'light' so the server render and first client render match (no hydration mismatch).
  // The persisted preference is read after mount.
  const [colorMode, setColorMode] = useState<ColorMode>('light')

  // Read persisted preference on mount — localStorage is client-only (undefined during SSR).
  useEffect(() => {
    const stored = localStorage.getItem('vitrina-color-mode') as ColorMode | null
    if (stored === 'dark' || stored === 'light') setColorMode(stored)
  }, [])

  // Reflect colorMode onto <html>. Chakra v3 dark mode selector is `.dark &`.
  // Must be on <html> so Portal content (Menu, Drawer, etc.) also gets dark tokens.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', colorMode === 'dark')
  }, [colorMode])

  const toggleColorMode = () =>
    setColorMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem('vitrina-color-mode', next)
      return next
    })

  return (
    <ColorModeContext.Provider value={{ colorMode, toggleColorMode }}>
      {children}
    </ColorModeContext.Provider>
  )
}

export const useColorMode = () => useContext(ColorModeContext)
