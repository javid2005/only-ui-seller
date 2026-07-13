'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { OtpForm } from '@/components/auth/OtpForm'
import { checkPhoneExists, getSignupProgress, sendOtp, verifyOtp, SIGNUP_STEP_ROUTE } from '@/services/auth'

export function LoginOtpView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') ?? ''
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!phone) router.replace('/login')
  }, [phone, router])

  async function handleSubmit(code: string) {
    setLoading(true)
    const { success } = await verifyOtp(phone, code)
    if (!success) {
      setLoading(false)
      return
    }
    const exists = await checkPhoneExists(phone)
    setLoading(false)
    if (!exists) {
      const step = getSignupProgress(phone)?.step ?? 'basic-info'
      router.push(`${SIGNUP_STEP_ROUTE[step]}?phone=${phone}`)
      return
    }
    router.push('/')
  }

  if (!phone) return null

  return (
    <AuthLayout title="ورود به ویترینا" backHref={`/login?phone=${phone}`}>
      <OtpForm
        phone={phone}
        submitLabel="ورود"
        loading={loading}
        editHref={`/login?phone=${phone}`}
        onSubmit={handleSubmit}
        onResend={() => { void sendOtp(phone) }}
      />
    </AuthLayout>
  )
}
