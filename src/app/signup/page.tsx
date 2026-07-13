'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// ورود شماره موبایل برای هر دو مسیر (ورود/ثبت‌نام) یکپارچه شده → /login
function SignupRedirect() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone')

  useEffect(() => {
    router.replace(phone ? `/login?phone=${phone}` : '/login')
  }, [phone, router])

  return null
}

export default function Page() {
  return (
    <Suspense>
      <SignupRedirect />
    </Suspense>
  )
}
