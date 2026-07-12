'use client'

import { Suspense } from 'react'
import { ForgotNewPasswordView } from '@/views/auth/ForgotNewPasswordView'

// ForgotNewPasswordView reads query params via useSearchParams() → needs a Suspense boundary.
export default function Page() {
  return (
    <Suspense>
      <ForgotNewPasswordView />
    </Suspense>
  )
}
