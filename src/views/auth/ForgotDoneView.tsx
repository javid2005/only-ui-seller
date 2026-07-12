'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Box, Button, Text } from '@chakra-ui/react'
import { CircleCheckBig } from 'lucide-react'
import { AuthLayout } from '@/components/auth/AuthLayout'

export function ForgotDoneView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') ?? ''

  return (
    <AuthLayout centerContent>
      <Box bg="brand.subtle" color="brand.fg" p="4" borderRadius="lg" display="flex">
        <CircleCheckBig size={34} />
      </Box>
      <Text fontWeight="semibold" fontSize="xl" lineHeight="1.5" textAlign="center" w="full">
        رمز عبور جدید ثبت شد
      </Text>
      <Text fontSize="sm" color="fg.muted" textAlign="right" w="full">
        هم اکنون میتوانید برای ورود به سایت از رمز عبور جدید استفاده نمایید.
      </Text>
      <Button
        w="full"
        colorPalette="brand"
        onClick={() => router.push(phone ? `/login/password?phone=${phone}` : '/login/password')}
      >
        ورود به حساب کاربری
      </Button>
    </AuthLayout>
  )
}
