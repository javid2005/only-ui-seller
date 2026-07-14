'use client'

import { Suspense } from 'react'
import { SignupPreparingView } from '@/views/auth/SignupPreparingView'

// SignupPreparingView reads query params via useSearchParams() → needs a Suspense boundary.
export default function Page() {
  return (
    <Suspense>
      <SignupPreparingView />
    </Suspense>
  )
}
