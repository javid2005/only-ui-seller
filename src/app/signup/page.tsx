'use client'

import { Suspense } from 'react'
import { SignupPlaceholderView } from '@/views/auth/SignupPlaceholderView'

// SignupPlaceholderView reads query params via useSearchParams() → needs a Suspense boundary.
export default function Page() {
  return (
    <Suspense>
      <SignupPlaceholderView />
    </Suspense>
  )
}
