'use client'

import { useState, type ReactNode } from 'react'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { useServerInsertedHTML } from 'next/navigation'
import { ChakraProvider, LocaleProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { system } from '@/theme'
import { ColorModeProvider } from '@/contexts/ColorModeContext'

// Emotion SSR registry — flushes Chakra/Emotion styles into the server HTML <head>
// via useServerInsertedHTML so the server and client markup match (no hydration mismatch / FOUC).
function EmotionRegistry({ children }: { children: ReactNode }) {
  const [cache] = useState(() => {
    const c = createCache({ key: 'css' })
    c.compat = true
    return c
  })

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: Object.values(cache.inserted).join(' ') }}
    />
  ))

  return <CacheProvider value={cache}>{children}</CacheProvider>
}

export function Providers({ children }: { children: ReactNode }) {
  // Create the QueryClient once per client mount (lazy init avoids leaking state across requests).
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
          },
        },
      }),
  )

  return (
    <EmotionRegistry>
      <ChakraProvider value={system}>
        <LocaleProvider locale="fa-IR">
          <ColorModeProvider>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
          </ColorModeProvider>
        </LocaleProvider>
      </ChakraProvider>
    </EmotionRegistry>
  )
}
