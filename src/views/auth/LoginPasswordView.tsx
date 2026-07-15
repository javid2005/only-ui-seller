'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import NextLink from 'next/link'
import { Button, Flex, Field, Link, chakra } from '@chakra-ui/react'
import { AuthLayout, focusVisibleOnly } from '@/components/auth/AuthLayout'
import { PhoneInput } from '@/components/auth/PhoneInput'
import { PasswordInput } from '@/components/ui/password-input'
import { loginWithPassword } from '@/services/auth'

export function LoginPasswordView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [phone, setPhone] = useState(searchParams.get('phone') ?? '')
  const [password, setPassword] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e?: FormEvent) {
    e?.preventDefault()
    const nextPhoneError = phone ? '' : 'شماره موبایل را وارد نمایید'
    const nextPasswordError = password ? '' : 'رمز عبور را وارد نمایید'
    setPhoneError(nextPhoneError)
    setPasswordError(nextPasswordError)
    if (nextPhoneError || nextPasswordError) return

    setLoading(true)
    const { success } = await loginWithPassword(phone, password)
    setLoading(false)
    if (success) router.push('/')
  }

  return (
    <AuthLayout
      title="ورود به ویترینا"
      subtitle="جهت ورود شماره موبایل و رمز عبور خود را وارد نمایید."
      backHref={phone ? `/login?phone=${phone}` : '/login'}
    >
      {/* form + type="submit" = Enter در فیلد شماره موبایل یا رمز عبور هم دکمه رو trigger می‌کنه (رفتار پیش‌فرض مرورگر) */}
      <chakra.form onSubmit={handleLogin} display="flex" flexDirection="column" gap="4" w="full">
        <PhoneInput value={phone} onChange={setPhone} error={phoneError} />
        <Field.Root invalid={!!passwordError} w="full">
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="رمز عبور"
            dir="rtl"
            w="full"
          />
          {passwordError && (
            <Field.ErrorText display="block" fontSize="xs" textAlign="right" w="full">{passwordError}</Field.ErrorText>
          )}
        </Field.Root>
        <Flex w="full" justify="flex-end">
          <Link asChild variant="plain" colorPalette="brand" fontSize="xs" fontWeight="medium" {...focusVisibleOnly}>
            <NextLink href={phone ? `/login/forgot?phone=${phone}` : '/login/forgot'}>
              رمز خود را فراموش کرده اید؟
            </NextLink>
          </Link>
        </Flex>
        <Button type="submit" w="full" colorPalette="brand" loading={loading}>
          ورود
        </Button>
      </chakra.form>
      <Link asChild variant="plain" colorPalette="brand" display="block" w="full" textAlign="center" fontSize="sm" fontWeight="semibold" {...focusVisibleOnly}>
        <NextLink href={phone ? `/login?phone=${phone}` : '/login'}>
          ورود با کد تایید
        </NextLink>
      </Link>
    </AuthLayout>
  )
}
