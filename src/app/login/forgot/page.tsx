'use client'

import { Suspense } from 'react'
import { ForgotMobileView } from '@/views/auth/ForgotMobileView'

// ForgotMobileView reads query params via useSearchParams() → needs a Suspense boundary.
export default function Page() {
  return (
    <Suspense>
      <ForgotMobileView />
    </Suspense>
  )
}
