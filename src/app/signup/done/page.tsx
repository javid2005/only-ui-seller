'use client'

import { Suspense } from 'react'
import { SignupDoneView } from '@/views/auth/SignupDoneView'

export default function Page() {
  return (
    <Suspense>
      <SignupDoneView />
    </Suspense>
  )
}
