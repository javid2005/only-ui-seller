'use client'

import { Suspense } from 'react'
import { LoginOtpView } from '@/views/auth/LoginOtpView'

// LoginOtpView reads query params via useSearchParams() → needs a Suspense boundary.
export default function Page() {
  return (
    <Suspense>
      <LoginOtpView />
    </Suspense>
  )
}
