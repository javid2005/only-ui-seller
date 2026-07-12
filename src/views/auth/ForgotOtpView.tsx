'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { OtpForm } from '@/components/auth/OtpForm'
import { sendOtp, verifyOtp } from '@/services/auth'

export function ForgotOtpView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') ?? ''
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!phone) router.replace('/login/forgot')
  }, [phone, router])

  async function handleSubmit(code: string) {
    setLoading(true)
    const { success } = await verifyOtp(phone, code)
    setLoading(false)
    if (success) router.push(`/login/forgot/new-password?phone=${phone}`)
  }

  if (!phone) return null

  return (
    <AuthLayout title="فراموشی رمز عبور" backHref={`/login/forgot?phone=${phone}`}>
      <OtpForm
        phone={phone}
        submitLabel="ادامه"
        loading={loading}
        editHref={`/login/forgot?phone=${phone}`}
        onSubmit={handleSubmit}
        onResend={() => { void sendOtp(phone) }}
      />
    </AuthLayout>
  )
}
