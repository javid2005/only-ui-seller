import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, LocaleProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import { system } from './theme'
import { ColorModeProvider } from './contexts/ColorModeContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <LocaleProvider locale="fa-IR">
        <ColorModeProvider>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </ColorModeProvider>
      </LocaleProvider>
    </ChakraProvider>
  </StrictMode>,
)
