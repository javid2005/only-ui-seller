'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, chakra } from '@chakra-ui/react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { PhoneInput } from '@/components/auth/PhoneInput'
import { sendOtp } from '@/services/auth'

const PHONE_RE = /^09\d{9}$/

export function ForgotMobileView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [phone, setPhone] = useState(searchParams.get('phone') ?? '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault()
    if (!phone) {
      setError('شماره موبایل را وارد نمایید')
      return
    }
    if (!PHONE_RE.test(phone)) {
      setError('شماره موبایل وارد شده معتبر نیست')
      return
    }
    setError('')
    setLoading(true)
    await sendOtp(phone)
    router.push(`/login/forgot/otp?phone=${phone}`)
  }

  return (
    <AuthLayout
      title="فراموشی رمز عبور"
      subtitle="جهت بازیابی رمز عبور شماره موبایل خود را وارد نمایید"
      backHref={phone ? `/login/password?phone=${phone}` : '/login'}
    >
      {/* form + type="submit" = Enter در فیلد شماره موبایل هم دکمه رو trigger می‌کنه */}
      <chakra.form onSubmit={handleSubmit} display="flex" flexDirection="column" gap="4" w="full">
        <PhoneInput value={phone} onChange={setPhone} error={error} />
        <Button type="submit" w="full" colorPalette="brand" loading={loading}>
          ارسال کد تایید
        </Button>
      </chakra.form>
    </AuthLayout>
  )
}
