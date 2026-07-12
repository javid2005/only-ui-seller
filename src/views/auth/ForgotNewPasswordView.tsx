'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Field } from '@chakra-ui/react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { PasswordInput } from '@/components/ui/password-input'
import { resetPassword } from '@/services/auth'

export function ForgotNewPasswordView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') ?? ''
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmError, setConfirmError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!phone) router.replace('/login/forgot')
  }, [phone, router])

  async function handleSubmit() {
    let nextPasswordError = ''
    let nextConfirmError = ''
    if (!password) nextPasswordError = 'رمز عبور جدید را وارد نمایید'
    else if (password.length < 6) nextPasswordError = 'رمز عبور باید حداقل ۶ کاراکتر باشد.'

    if (!confirmPassword) nextConfirmError = 'تکرار رمز عبور را وارد نمایید'
    else if (confirmPassword !== password) nextConfirmError = 'رمز عبور و تکرار آن یکسان نیستند'

    setPasswordError(nextPasswordError)
    setConfirmError(nextConfirmError)
    if (nextPasswordError || nextConfirmError) return

    setLoading(true)
    await resetPassword(phone, password)
    setLoading(false)
    router.push('/login/forgot/done')
  }

  if (!phone) return null

  return (
    <AuthLayout
      title="انتخاب رمز عبور جدید"
      subtitle="رمز عبور جدید خود را وارد نمایید."
      backHref={`/login/forgot/otp?phone=${phone}`}
    >
      <Field.Root invalid={!!passwordError} w="full">
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="رمز عبور جدید"
          dir="rtl"
          w="full"
        />
        {passwordError && (
          <Field.ErrorText display="block" fontSize="xs" textAlign="right" w="full">{passwordError}</Field.ErrorText>
        )}
      </Field.Root>
      <Field.Root invalid={!!confirmError} w="full">
        <PasswordInput
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="تکرار رمز عبور جدید"
          dir="rtl"
          w="full"
        />
        {confirmError ? (
          <Field.ErrorText display="block" fontSize="xs" textAlign="right" w="full">{confirmError}</Field.ErrorText>
        ) : (
          <Field.HelperText display="block" fontSize="xs" textAlign="right" w="full">
            رمز عبور باید حداقل ۶ کاراکتر باشد.
          </Field.HelperText>
        )}
      </Field.Root>
      <Button w="full" colorPalette="brand" loading={loading} onClick={handleSubmit}>
        تایید
      </Button>
    </AuthLayout>
  )
}
