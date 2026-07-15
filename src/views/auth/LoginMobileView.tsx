'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import NextLink from 'next/link'
import { Button, Link, chakra } from '@chakra-ui/react'
import { AuthLayout, focusVisibleOnly } from '@/components/auth/AuthLayout'
import { PhoneInput } from '@/components/auth/PhoneInput'
import { sendOtp } from '@/services/auth'

const PHONE_RE = /^09\d{9}$/

export function LoginMobileView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [phone, setPhone] = useState(searchParams.get('phone') ?? '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSendOtp(e?: FormEvent) {
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
    // برای هر دو مسیر (ورود/ثبت‌نام) ابتدا OTP ارسال می‌شه؛ تشخیص کاربر جدید بعد از تایید OTP انجام می‌شه
    await sendOtp(phone)
    router.push(`/login/otp?phone=${phone}`)
  }

  return (
    <AuthLayout title="به ویترینا خوش آمدید" subtitle="جهت ورود یا ثبت نام شماره موبایل خود را وارد نمایید.">
      {/* form + type="submit" = Enter در فیلد شماره موبایل هم دکمه رو trigger می‌کنه (رفتار پیش‌فرض مرورگر) */}
      <chakra.form onSubmit={handleSendOtp} display="flex" flexDirection="column" gap="4" w="full">
        <PhoneInput value={phone} onChange={setPhone} error={error} />
        <Button type="submit" w="full" colorPalette="brand" loading={loading}>
          ارسال کد تایید
        </Button>
      </chakra.form>
      <Link asChild variant="plain" colorPalette="brand" display="block" w="full" textAlign="center" fontSize="sm" fontWeight="semibold" {...focusVisibleOnly}>
        <NextLink href={phone ? `/login/password?phone=${phone}` : '/login/password'}>
          ورود با رمز عبور
        </NextLink>
      </Link>
    </AuthLayout>
  )
}
