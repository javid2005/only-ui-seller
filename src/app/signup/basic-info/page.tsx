'use client'

import { Suspense } from 'react'
import { SignupBasicInfoView } from '@/views/auth/SignupBasicInfoView'

// SignupBasicInfoView reads query params via useSearchParams() → needs a Suspense boundary.
export default function Page() {
  return (
    <Suspense>
      <SignupBasicInfoView />
    </Suspense>
  )
}
