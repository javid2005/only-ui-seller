'use client'

import { Suspense } from 'react'
import { LoginMobileView } from '@/views/auth/LoginMobileView'

// LoginMobileView reads query params via useSearchParams() → needs a Suspense boundary.
export default function Page() {
  return (
    <Suspense>
      <LoginMobileView />
    </Suspense>
  )
}
