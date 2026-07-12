'use client'

import { Suspense } from 'react'
import { LoginPasswordView } from '@/views/auth/LoginPasswordView'

// LoginPasswordView reads query params via useSearchParams() → needs a Suspense boundary.
export default function Page() {
  return (
    <Suspense>
      <LoginPasswordView />
    </Suspense>
  )
}
