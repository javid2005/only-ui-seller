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
  const [colorMode, setColorMode] = useState<ColorMode>(() => {
    return (localStorage.getItem('vitrina-color-mode') as ColorMode) ?? 'light'
  })

  useEffect(() => {
    // Chakra v3 dark mode selector: `.dark &`
    // Must be on <html> so Portal content (Menu, Drawer, etc.) also gets dark tokens
    const root = document.documentElement
    if (colorMode === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('vitrina-color-mode', colorMode)
  }, [colorMode])

  const toggleColorMode = () =>
    setColorMode((prev) => (prev === 'light' ? 'dark' : 'light'))

  return (
    <ColorModeContext.Provider value={{ colorMode, toggleColorMode }}>
      {children}
    </ColorModeContext.Provider>
  )
}

export const useColorMode = () => useContext(ColorModeContext)
