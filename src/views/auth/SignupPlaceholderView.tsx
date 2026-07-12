'use client'

import { useSearchParams } from 'next/navigation'
import { Button, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { toPersianDigits } from '@/utils/numbers'

// placeholder — پروسهٔ ثبت‌نام هنوز طراحی نشده؛ فقط مسیر redirect برای شماره‌های جدید
export function SignupPlaceholderView() {
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') ?? ''

  return (
    <AuthLayout title="ثبت نام">
      <Text fontSize="sm" color="fg.muted" textAlign="right" w="full">
        {phone
          ? `شمارهٔ ${toPersianDigits(phone)} در سیستم ثبت نشده است. صفحهٔ ثبت‌نام به‌زودی تکمیل می‌شود.`
          : 'صفحهٔ ثبت‌نام به‌زودی تکمیل می‌شود.'}
      </Text>
      <Button asChild w="full" colorPalette="brand">
        <Link href="/login">بازگشت به ورود</Link>
      </Button>
    </AuthLayout>
  )
}
