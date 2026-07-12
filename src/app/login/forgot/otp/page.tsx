'use client'

import { Suspense } from 'react'
import { ForgotOtpView } from '@/views/auth/ForgotOtpView'

// ForgotOtpView reads query params via useSearchParams() → needs a Suspense boundary.
export default function Page() {
  return (
    <Suspense>
      <ForgotOtpView />
    </Suspense>
  )
}
