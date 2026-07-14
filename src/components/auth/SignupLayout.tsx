import type { ReactNode } from 'react'
import NextLink from 'next/link'
import { Box, Button, Flex, Link, Text } from '@chakra-ui/react'
import logoMarkSrc from '@/assets/logo-mark.svg'
import { AuthFooter } from '@/components/auth/AuthFooter'
import { focusVisibleOnly } from '@/components/auth/AuthLayout'
import { SignupStepper } from '@/components/auth/SignupStepper'

interface SignupLayoutProps {
  title: string
  subtitle?: string
  currentStep: 0 | 1 | 2
  backHref?: string
  changePhoneHref: string
  onContinue: () => void
  continueLoading?: boolean
  continueDisabled?: boolean
  /** متن دکمهٔ ادامه — پیش‌فرض «ادامه» */
  continueLabel?: string
  /** فاصلهٔ بین محتوا و ردیف دکمه‌های پایین — پیش‌فرض همون فاصلهٔ هدر↔محتوا (base:6/md:10) */
  footerGap?: { base: string; md: string }
  /** خطوط اطلاعات پایهٔ واردشده — در description مرحلهٔ ۱ استپر عمودی نمایش داده می‌شه */
  basicInfoSummary?: string[]
  /** نام دسته‌بندی‌های انتخاب‌شده — در description مرحلهٔ ۲ استپر عمودی نمایش داده می‌شه */
  categorySummary?: string[]
  children: ReactNode
}

const CONTENT_GAP = { base: '6', md: '10' }

export function SignupLayout({
  title,
  subtitle,
  currentStep,
  backHref,
  changePhoneHref,
  onContinue,
  continueLoading,
  continueDisabled,
  continueLabel = 'ادامه',
  footerGap = CONTENT_GAP,
  basicInfoSummary,
  categorySummary,
  children,
}: SignupLayoutProps) {
  return (
    <Flex direction="column" align="center" justify="center" minH="100dvh" bg="bg.subtle" px="4" py="4" gap="4">
      <Flex
        bg="white"
        borderWidth="1px"
        borderColor="border"
        borderRadius={{ base: '2xl', md: '3xl' }}
        maxW="1242px"
        w="full"
        h={{ base: 'auto', md: '880px' }}
        p="4"
        gap={{ base: '10', md: '4' }}
        direction={{ base: 'column', md: 'row' }}
        align="stretch"
      >
        {/* Stepper FIRST در DOM = راست‌ترین در دسکتاپ (x=866 > x=16 فیگما) و بالای کارت در موبایل (media < md) */}
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
          <SignupStepper currentStep={currentStep} basicInfoSummary={basicInfoSummary} categorySummary={categorySummary} />
        </Box>

        <Flex
          direction="column"
          flex="1"
          minW="0"
          minH="0"
          pt={{ base: '0', md: '10' }}
          px={{ base: '0', md: '10' }}
          pb={{ base: '0', md: '4' }}
        >
          {/* flex=1 + minH=0 + overflowY=auto = کل محتوا (هدر+subtitle+children) اسکرول می‌خوره؛ فقط ردیف دکمه‌های پایین بیرون از این بلوکه و ثابت می‌مونه (ستون ۸۸۰px دسکتاپ).
              gap روی این Flex عمداً ست نشده — فاصلهٔ هدر↔محتوا باید دقیقاً CONTENT_GAP (40px@md) باشه، نه +gap دوباره؛ فاصلهٔ subtitle↔children جدا با gap روی Flex داخلی مدیریت می‌شه.
              align="center" = هدر و هر بچهٔ بدون w="full" (مثل SegmentGroup) وسط‌چین می‌شه؛ بچه‌های w="full" (متن/فرم‌ها) تحت تأثیر قرار نمی‌گیرن. */}
          <Flex direction="column" align="center" w="full" flex="1" minH="0" overflowY="auto" overflowX="hidden">
            <Flex direction="column" align="center" gap="4" w="full" flexShrink={0}>
              <NextLink href="/">
                <img src={logoMarkSrc.src} alt="ویترینا" height={53} style={{ width: 'auto' }} />
              </NextLink>
              <Text fontWeight="semibold" fontSize={{ base: 'xl', sm: '2xl' }} lineHeight="1.333" textAlign="center" w="full">
                {title}
              </Text>
            </Flex>

            <Box h={CONTENT_GAP} flexShrink={0} />

            <Flex direction="column" gap="4" align="center" w="full">
              {subtitle && (
                <Text fontSize="sm" color="fg.muted" textAlign="right" w="full">
                  {subtitle}
                </Text>
              )}
              {children}
            </Flex>
          </Flex>

          <Box h={footerGap} flexShrink={0} />

          <Flex gap="2" align="center" w="full" wrap="wrap">
            {/* راست‌ترین FIRST: تغییر شماره موبایل → اسپیسر → بازگشت → ادامه (LAST=چپ، طبق قرارداد پروژه primary LAST) */}
            <Link asChild variant="plain" colorPalette="brand" display="flex" alignItems="center" gap="2" fontSize="sm" fontWeight="semibold" flexShrink={0} {...focusVisibleOnly}>
              <NextLink href={changePhoneHref}>
                تغییر شماره موبایل
              </NextLink>
            </Link>
            <Box flex="1" />
            {backHref && (
              <Button asChild variant="outline" colorPalette="gray">
                <NextLink href={backHref}>بازگشت</NextLink>
              </Button>
            )}
            <Button colorPalette="brand" loading={continueLoading} disabled={continueDisabled} onClick={onContinue}>
              {continueLabel}
            </Button>
          </Flex>
        </Flex>
      </Flex>

      <AuthFooter />
    </Flex>
  )
}
