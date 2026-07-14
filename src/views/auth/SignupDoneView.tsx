'use client'

import { Box, Text } from '@chakra-ui/react'
import { CircleCheckBig } from 'lucide-react'
import { AuthLayout } from '@/components/auth/AuthLayout'

// جایگزین موقت — طرح Figma برای این صفحه هنوز ارائه نشده. بعد از دریافت طرح باید جایگزین بشه.
export function SignupDoneView() {
  return (
    <AuthLayout centerContent>
      <Box bg="brand.subtle" color="brand.fg" p="4" borderRadius="lg" display="flex">
        <CircleCheckBig size={34} />
      </Box>
      <Text fontWeight="semibold" fontSize="xl" lineHeight="1.5" textAlign="center" w="full">
        فروشگاه شما با موفقیت ثبت شد
      </Text>
      <Text fontSize="sm" color="fg.muted" textAlign="right" w="full">
        به‌زودی می‌توانید از داشبورد فروشگاه خود استفاده کنید.
      </Text>
    </AuthLayout>
  )
}
