'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import NextLink from 'next/link'
import { Button, Link } from '@chakra-ui/react'
import { AuthLayout, focusVisibleOnly } from '@/components/auth/AuthLayout'
import { PhoneInput } from '@/components/auth/PhoneInput'
import { checkPhoneExists, sendOtp } from '@/services/auth'

const PHONE_RE = /^09\d{9}$/

export function LoginMobileView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [phone, setPhone] = useState(searchParams.get('phone') ?? '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSendOtp() {
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
    const exists = await checkPhoneExists(phone)
    if (!exists) {
      router.push(`/signup?phone=${phone}`)
      return
    }
    await sendOtp(phone)
    router.push(`/login/otp?phone=${phone}`)
  }

  return (
    <AuthLayout title="به ویترینا خوش آمدید" subtitle="جهت ورود یا ثبت نام شماره موبایل خود را وارد نمایید.">
      <PhoneInput value={phone} onChange={setPhone} error={error} />
      <Button w="full" colorPalette="brand" loading={loading} onClick={handleSendOtp}>
        ارسال کد تایید
      </Button>
      <Link asChild variant="plain" colorPalette="brand" display="block" w="full" textAlign="center" fontSize="sm" fontWeight="semibold" {...focusVisibleOnly}>
        <NextLink href={phone ? `/login/password?phone=${phone}` : '/login/password'}>
          ورود با رمز عبور
        </NextLink>
      </Link>
    </AuthLayout>
  )
}
