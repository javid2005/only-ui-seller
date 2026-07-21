'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import NextLink from 'next/link'
import { Box, Flex, Progress, Text } from '@chakra-ui/react'
import { CircleCheckBig } from 'lucide-react'
import logoMarkSrc from '@/assets/logo-mark.svg'
import { AuthFooter } from '@/components/auth/AuthFooter'

const STATUS_ROWS = [
  'ساخت پایگاه داده',
  'ایجاد دسترسی ها',
  'آپلود یا پیکربندی کدها',
  'ثبت و فعال سازی',
]

// زمان‌بندی از Figma motion data (نسبت‌های 5000ms) — هر ردیف با progress bar هماهنگ روشن می‌شه.
const ROW_DELAYS_MS = [1400, 2300, 3250, 4370]
const FILL_DELAY_MS = 500
const FILL_DURATION_MS = 4000
const HOLD_AFTER_FILL_MS = 2000
const TOTAL_MS = FILL_DELAY_MS + FILL_DURATION_MS + HOLD_AFTER_FILL_MS

export function SignupPreparingView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') ?? ''

  const [filled, setFilled] = useState(false)
  const [activeRows, setActiveRows] = useState([false, false, false, false])

  useEffect(() => {
    if (!phone) router.replace('/login')
  }, [phone, router])

  useEffect(() => {
    if (!phone) return

    const raf = requestAnimationFrame(() => setFilled(true))
    const timers = ROW_DELAYS_MS.map((delay, i) =>
      setTimeout(() => {
        setActiveRows((prev) => prev.map((v, idx) => (idx === i ? true : v)))
      }, delay),
    )
    const navigateTimer = setTimeout(() => {
      router.push(`/signup/plan?phone=${phone}`)
    }, TOTAL_MS)

    return () => {
      cancelAnimationFrame(raf)
      timers.forEach(clearTimeout)
      clearTimeout(navigateTimer)
    }
  }, [phone, router])

  if (!phone) return null

  return (
    <Flex direction="column" align="center" justify="center" minH="100dvh" bg="bg.subtle" px="4" py="4" gap="4">
      <Flex
        bg="bg.panel"
        borderWidth="1px"
        borderColor="border"
        borderRadius={{ base: '2xl', md: '3xl' }}
        maxW="1242px"
        w="full"
        minH={{ base: 'auto', md: '880px' }}
        p="4"
        align="center"
        justify="center"
      >
        <Flex direction="column" align="center" gap="10" maxW="400px" w="full" py="10">
          <Flex direction="column" align="center" gap="4" w="full">
            <NextLink href="/">
              <img src={logoMarkSrc.src} alt="ویترینا" height={53} style={{ width: 'auto' }} />
            </NextLink>
            <Text fontWeight="semibold" fontSize={{ base: 'xl', sm: '2xl' }} lineHeight="1.333" textAlign="center">
              درحال آماده سازی
            </Text>
          </Flex>

          <Flex direction="column" align="center" gap="10" w="full">
            <Progress.Root value={filled ? 100 : 0} size="xl" shape="full" variant="outline" colorPalette="brand" w="full">
              <Progress.Track>
                {/* striped recipe variant (Chakra v3.35) با conditional custom-property (--stripe-color: {_light,_dark})
                    خراب است — computed value خالی می‌مونه و backgroundImage نامعتبر می‌شه. جایگزین: مقدار مستقیم + _dark. */}
                <Progress.Range
                  backgroundImage="linear-gradient(45deg, rgba(255,255,255,0.3) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.3) 75%, transparent 75%, transparent)"
                  backgroundSize="1rem 1rem"
                  _dark={{
                    backgroundImage: 'linear-gradient(45deg, rgba(0,0,0,0.3) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.3) 75%, transparent 75%, transparent)',
                  }}
                  transitionProperty="width"
                  transitionDuration={`${FILL_DURATION_MS}ms`}
                  transitionDelay={`${FILL_DELAY_MS}ms`}
                  transitionTimingFunction="linear"
                />
              </Progress.Track>
            </Progress.Root>

            <Flex direction="column" gap="4" align="center" w="full" dir="rtl">
              {STATUS_ROWS.map((label, i) => (
                <Flex key={label} gap="2" align="center" justify="center" w="full" opacity={activeRows[i] ? 1 : 0.2} transition="opacity 0.2s">
                  {/* آیکون FIRST در DOM = راست‌ترین در RTL (قرارداد پروژه) */}
                  <Box color="green.solid" flexShrink={0}>
                    <CircleCheckBig size={20} />
                  </Box>
                  <Text fontSize="sm" color="fg" textAlign="center">{label}</Text>
                </Flex>
              ))}
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      <AuthFooter />
    </Flex>
  )
}
