import type { ReactNode } from 'react'
import NextLink from 'next/link'
import { Box, Flex, Text, Link } from '@chakra-ui/react'
import { ArrowRight } from 'lucide-react'
import logoMarkSrc from '@/assets/logo-mark.svg'
import loginIllustration from '@/assets/login/Login.svg'
import { AuthFooter } from '@/components/auth/AuthFooter'

interface AuthLayoutProps {
  /** عنوان زیر لوگو — نبودش یعنی هدر/لوگو اصلاً رندر نشه (صفحهٔ Done) */
  title?: string
  subtitle?: ReactNode
  /** نمایش دکمهٔ «بازگشت» بالا-راستِ ستون فرم و مقصدش */
  backHref?: string
  /** ردیف «تماس با پشتیبانی | قوانین و مقررات» — پیش‌فرض نمایش داده می‌شه */
  showFooterLinks?: boolean
  /** صفحهٔ Done محتوا رو وسط‌چین افقی+عمودی می‌خواد، بدون اسپیسر بالا */
  centerContent?: boolean
  children: ReactNode
}

// فقط :focus-visible (کیبورد) رینگ نشون بده، نه هر :focus (کلیک ماوس) — پیش‌فرض چاکرا focusRing="outside" روی هر :focus فعاله
export const focusVisibleOnly = { focusRing: 'none', focusVisibleRing: 'outside' } as const

export function AuthLayout({
  title,
  subtitle,
  backHref,
  showFooterLinks = true,
  centerContent = false,
  children,
}: AuthLayoutProps) {
  return (
    <Flex direction="column" align="center" justify="center" minH="100dvh" bg="bg.subtle" px="4" py="4" gap="4">
      <Flex
        bg="bg.panel"
        borderWidth="1px"
        borderColor="border"
        borderRadius="3xl"
        maxW="1242px"
        w="full"
        p="4"
        gap="4"
        wrap="nowrap"
        align="start"
        justify="end"
      >
        {/* محتوا FIRST در DOM = راست‌ترین در RTL (طبق مختصات x فیگما: ستون فرم x=629 > ستون تصویر x=16) */}
        <Flex
          flex="1"
          w="full"
          minW="0"
          h={{ base: 'auto', md: '720px' }}
          direction="column"
          align="center"
          gap="6"
          pt={{ base: '0', md: title ? '24' : '10' }}
          pb={{ base: centerContent ? '4' : '0', md: '4' }}
          px={{ base: '0', md: '10' }}
          position="relative"
          borderRadius="2xl"
          overflow="hidden"
          justify={centerContent ? 'center' : undefined}
        >
          {/* موبایل: باکس تصویر کوچیک بالای محتوا (طبق Figma، در همهٔ صفحات از جمله Done) — دسکتاپ: illustration جدا سمت چپ (پایین‌تر) */}
          <Flex
            display={{ base: 'flex', md: 'none' }}
            bg="purple.subtle"
            borderRadius="2xl"
            w="full"
            h={{ base: 'auto', sm: '256px' }}
            aspectRatio={{ base: 448 / 256, sm: 'auto' }}
            align="center"
            justify="center"
            overflow="hidden"
            flexShrink={0}
          >
            <img
              src={loginIllustration.src}
              alt=""
              width={208}
              height={208}
              style={{ width: 'auto', height: 'auto', maxWidth: '82%', maxHeight: '82%' }}
            />
          </Flex>

          <Flex
            direction="column"
            align={centerContent ? 'center' : 'end'}
            justify={centerContent ? 'center' : undefined}
            gap="4"
            w="full"
            maxW="400px"
            minW="0"
            flex="1"
            position="relative"
          >
            {/* هم‌تراز با بالای لوگو، سمت راست — sibling هدر در فیگما (هر دو y=0 همون Content) */}
            {backHref && (
              <Link
                asChild
                variant="plain"
                colorPalette="gray"
                position="absolute"
                top="0"
                insetInlineStart="0"
                display="flex"
                alignItems="center"
                gap="2"
                px="0"
                py="0"
                fontSize="sm"
                fontWeight="semibold"
                color="gray.fg"
                {...focusVisibleOnly}
              >
                <NextLink href={backHref}>
                  {/* آیکون FIRST در DOM = راست (قرارداد پروژه) */}
                  <ArrowRight size={20} />
                  بازگشت
                </NextLink>
              </Link>
            )}

            {title && (
              <Flex direction="column" align="center" gap="4" w="full">
                <NextLink href="/">
                  <img src={logoMarkSrc.src} alt="ویترینا" height={53} style={{ width: 'auto' }} />
                </NextLink>
                <Text fontWeight="semibold" fontSize={{ base: 'xl', sm: '2xl' }} lineHeight="1.333" textAlign="center" w="full">
                  {title}
                </Text>
              </Flex>
            )}

            {subtitle && (
              // gap="4" پدر ۱۶px می‌ده؛ +mt="6" (۲۴px) = ۴۰px فاصلهٔ کل از عنوان
              <Text fontSize="sm" color="fg.muted" textAlign="start" w="full" mt="6">
                {subtitle}
              </Text>
            )}

            {/* بدون subtitle (مثل صفحات OTP): این اسپیسر gap=۱۶px هم قبل و هم بعدش می‌گیره → h=۸px + ۱۶+۱۶ = ۴۰px */}
            {title && !subtitle && <Box h="2" w="full" flexShrink={0} />}

            {children}

            {!centerContent && <Box flex="1" minH="0" w="full" />}
          </Flex>
        </Flex>

        {/* تصویر LAST در DOM = چپ‌ترین در RTL — فقط دسکتاپ، زیر md مخفی */}
        <Flex
          display={{ base: 'none', md: 'flex' }}
          flex="1"
          minW="400px"
          h="720px"
          bg="purple.subtle"
          borderRadius="2xl"
          align="center"
          justify="center"
          overflow="hidden"
        >
          <img src={loginIllustration.src} alt="" width={400} height={400} />
        </Flex>
      </Flex>

      <AuthFooter showLinks={showFooterLinks} />
    </Flex>
  )
}
