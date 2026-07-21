'use client'

import { useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import NextLink from 'next/link'
import { Badge, Box, Button, Flex, Text } from '@chakra-ui/react'
import { ArrowLeft } from 'lucide-react'
import logoMarkSrc from '@/assets/logo-mark.svg'
import planGiftSrc from '@/assets/signup/plan-gift.png'
import { AuthFooter } from '@/components/auth/AuthFooter'
import { focusVisibleOnly } from '@/components/auth/AuthLayout'
import { SignupStepper } from '@/components/auth/SignupStepper'
import { SIGNUP_CATEGORIES } from '@/components/auth/signupCategoriesData'
import { getSignupProgress } from '@/services/auth'
import { formatJalaliDate } from '@/utils/dates'

const TRIAL_DAYS = 14

export function SignupDoneView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') ?? ''

  const progress = getSignupProgress(phone)
  const basicInfo = progress?.basicInfo
  const basicInfoSummary = basicInfo
    ? [
        `نام: ${basicInfo.firstName}`,
        `نام خانوادگی: ${basicInfo.lastName}`,
        `نام فارسی فروشگاه: ${basicInfo.storeNameFa}`,
        'آدرس اختصاصی فروشگاه:',
        `https://${basicInfo.storeSlug}.vitrinaa.shop`,
      ]
    : undefined
  const categorySummary = progress?.categoryIds?.length
    ? progress.categoryIds.map((id) => SIGNUP_CATEGORIES.find((c) => c.id === id)?.name).filter((name): name is string => Boolean(name))
    : undefined

  const trialEndDate = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + TRIAL_DAYS)
    return formatJalaliDate(d)
  }, [])

  useEffect(() => {
    if (!phone) router.replace('/login')
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
        h={{ base: 'auto', md: '880px' }}
        px="4"
        pt="4"
        pb={{ base: '10', md: '4' }}
        gap={{ base: '10', md: '4' }}
        direction={{ base: 'column', md: 'row' }}
        align="stretch"
      >
        {/* Stepper FIRST در DOM = راست‌ترین در دسکتاپ — همون الگوی SignupLayout (x-order فیگما: استپر سمت راست) */}
        <Box
          bg="bg.muted"
          borderRadius={{ base: 'lg', md: '2xl' }}
          p={{ base: '4', md: '6' }}
          w="full"
          maxW={{ base: 'full', md: '360px' }}
          minW={{ base: 'auto', md: '240px' }}
          flex={{ md: '1' }}
          flexShrink={0}
        >
          <SignupStepper currentStep={3} basicInfoSummary={basicInfoSummary} categorySummary={categorySummary} planSummary={['پلن ۱۴ روزه رایگان']} />
        </Box>

        <Flex flex="1" minW="0" direction="column" align="center" justify="center" py={{ base: '0', md: '10' }} px={{ base: '0', md: '10' }}>
          <Flex direction="column" align="center" gap="6" w="full">
            <NextLink href="/">
              <img src={logoMarkSrc.src} alt="ویترینا" height={53} style={{ width: 'auto' }} />
            </NextLink>

            <Text fontWeight="semibold" fontSize={{ base: 'xl', sm: '2xl' }} lineHeight="1.333" textAlign="center" w="full">
              کسب و کار شما با موفقیت ایجاد شد!
            </Text>

            <Flex
              bg="bg.subtle"
              borderWidth="1px"
              borderColor="border.emphasized"
              borderStyle="dashed"
              borderRadius="lg"
              p="6"
              gap="4"
              direction={{ base: 'column', sm: 'row' }}
              wrap="wrap"
              align="flex-start"
              justify="flex-start"
              w="full"
            >
              {/* آیکون هدیه FIRST در DOM = راست‌ترین در row / بالا در column (طبق screenshot تازهٔ 154:2664).
                  زیر sm: ستونی — آیکون بالا، نوشته‌ها زیرش (align="flex-start" هم در row (بالا) هم در column (راست) درسته، طبق قرارداد پروژه). */}
              <Box flexShrink={0} boxSize="40px" overflow="hidden">
                <img src={planGiftSrc.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
              <Flex direction="column" gap="2" align="flex-start" flex="1" minW="0" w="full">
                <Text fontWeight="medium" fontSize="xl" lineHeight="1.5" color="purple.fg" textAlign="right" w="full">
                  پلن رایگان ۱۴ روزه
                </Text>
                {/* راست‌ترین FIRST — «با ایجاد فروشگاه» → Badge → «برای شما فعال شد.» (ترتیب خام DOM فیگما آینه‌ای بود، طبق screenshot زوم‌شده تصحیح شد) */}
                <Flex gap="2" align="center" justify="flex-start" w="full" wrap="wrap">
                  <Text fontSize="sm" color="fg.muted">با ایجاد کسب و کار</Text>
                  <Badge variant="subtle" colorPalette="purple" size="sm" borderRadius="l2">
                    پلن رایگان ۱۴ روزه
                  </Badge>
                  <Text fontSize="sm" color="fg.muted">برای شما فعال شد.</Text>
                </Flex>
                <Text fontSize="sm" color="fg.muted" textAlign="right" w="full">
                  شما میتوانید تا تاریخ <Text as="span" fontWeight="bold" color="fg">{trialEndDate}</Text> از امکانات سایت بصورت رایگان استفاده نمایید.
                </Text>
              </Flex>
            </Flex>

            {/* طبق آخرین آپدیت Figma (154:2664): دکمهٔ solid پر با متن سفید — نه ghost/link مثل قبل.
                آیکون trailing (چپ) — استثنای مستند در قرارداد پروژه: این دکمه «ادامه/ورود» است نه «بازگشت»،
                طبق screenshot واقعی فیگما (button-fresh.png) arrow-left در سمت چپ دکمه‌ست، نه راست. */}
            <Button asChild colorPalette="brand" size="md" {...focusVisibleOnly}>
              <NextLink href="/">
                ورود به حساب کاربری
                <ArrowLeft size={20} />
              </NextLink>
            </Button>
          </Flex>
        </Flex>
      </Flex>

      <AuthFooter />
    </Flex>
  )
}
