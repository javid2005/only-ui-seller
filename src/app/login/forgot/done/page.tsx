'use client'

import { Suspense } from 'react'
import { ForgotDoneView } from '@/views/auth/ForgotDoneView'

// ForgotDoneView reads query params via useSearchParams() → needs a Suspense boundary.
export default function Page() {
  return (
    <Suspense>
      <ForgotDoneView />
    </Suspense>
  )
}
