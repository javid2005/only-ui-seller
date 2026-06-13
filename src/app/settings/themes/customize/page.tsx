'use client'

import { Suspense } from 'react'
import { ThemeCustomize } from '@/views/settings/ThemeCustomize'

// ThemeCustomize reads query params via useSearchParams() → needs a Suspense boundary.
export default function Page() {
  return (
    <Suspense>
      <ThemeCustomize />
    </Suspense>
  )
}
