'use client'

import { Suspense } from 'react'
import { SignupCategoriesView } from '@/views/auth/SignupCategoriesView'

// SignupCategoriesView reads query params via useSearchParams() → needs a Suspense boundary.
export default function Page() {
  return (
    <Suspense>
      <SignupCategoriesView />
    </Suspense>
  )
}
