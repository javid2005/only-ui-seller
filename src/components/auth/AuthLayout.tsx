import type { ReactNode } from 'react'
import NextLink from 'next/link'
import { Box, Flex, Text, Separator, Link } from '@chakra-ui/react'
import { ArrowRight, Headset, TriangleAlert } from 'lucide-react'
import logoMarkSrc from '@/assets/logo-mark.svg'
import loginIllustration from '@/assets/login/Login.svg'

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
        bg="white"
        borderWidth="1px"
        borderColor="border"
        borderRadius="3xl"
        maxW="1242px"
        w="full"
        p="4"
        gap="4"
        wrap="nowrap"
        align="flex-start"
        justify="flex-end"
      >
        {/* محتوا FIRST در DOM = راست‌ترین در RTL (طبق مختصات x فیگما: ستون فرم x=629 > ستون تصویر x=16) */}
        <Flex
          flex="1"
          w="full"
          minW="0"
          h={{ base: 'auto', md: '720px' }}
          direction="column"
          align="center"
          pt={{ base: title ? '10' : '6', md: title ? '24' : '10' }}
          pb={{ base: '6', md: '4' }}
          px={{ base: '4', sm: '6', md: '10' }}
          position="relative"
          borderRadius="2xl"
          overflow="hidden"
          justify={centerContent ? 'center' : undefined}
        >
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
              px="4"
              py="2"
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

          <Flex
            direction="column"
            align={centerContent ? 'center' : 'flex-end'}
            justify={centerContent ? 'center' : undefined}
            gap="4"
            w="full"
            maxW="400px"
            minW="0"
            flex="1"
          >
            {title && (
              <Flex direction="column" align="center" gap="4" w="full">
                <NextLink href="/">
                  <img src={logoMarkSrc.src} alt="ویترینا" height={53} style={{ width: 'auto' }} />
                </NextLink>
                <Text fontWeight="semibold" fontSize="2xl" lineHeight="1.333" textAlign="center" w="full">
                  {title}
                </Text>
              </Flex>
            )}

            {subtitle && (
              // gap="4" پدر ۱۶px می‌ده؛ +mt="6" (۲۴px) = ۴۰px فاصلهٔ کل از عنوان
              <Text fontSize="sm" color="fg.muted" textAlign="right" w="full" mt="6">
                {subtitle}
              </Text>
            )}

            {/* بدون subtitle (مثل صفحات OTP): این اسپیسر gap=۱۶px هم قبل و هم بعدش می‌گیره → h=۸px + ۱۶+۱۶ = ۴۰px */}
            {title && !subtitle && <Box h="2" w="full" flexShrink={0} />}

            {children}

            {!centerContent && <Box flex="1" minH="0" w="full" />}

            {showFooterLinks && (
              <Flex gap="4" align="center" justify="center" w="full">
                {/* آیکون FIRST در DOM = راست (قرارداد پروژه) */}
                <Link href="#" variant="plain" display="flex" gap="1" alignItems="center" px="2" py="0.5" borderRadius="l2" fontSize="xs" fontWeight="medium" color="gray.fg" {...focusVisibleOnly}>
                  <Headset size={14} />
                  تماس با پشتیبانی
                </Link>
                <Separator orientation="vertical" h="5" />
                <Link href="#" variant="plain" display="flex" gap="1" alignItems="center" px="2" py="0.5" borderRadius="l2" fontSize="xs" fontWeight="medium" color="gray.fg" {...focusVisibleOnly}>
                  <TriangleAlert size={14} />
                  قوانین و مقررات
                </Link>
              </Flex>
            )}
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

      <Flex gap="4" align="center" justify="center" maxW="1242px" w="full" fontSize="xs" color="fg.muted" wrap="wrap">
        {/* راست‌ترین FIRST: متن حقوقی (x=533) → جداکننده → کردیت سپهر (x=365) */}
        <Text lineHeight="4">تمامی حقوق مادی و معنوی ویترینا مربوط به آکادمی معین فرجی می‌باشد.</Text>
        <Text lineHeight="4">|</Text>
        <Text lineHeight="4">
          {'طراحی و توسعه توسط '}
          <Link href="https://Sepehr.it" target="_blank" rel="noreferrer" variant="underline" colorPalette="brand" {...focusVisibleOnly}>
            سپهر
          </Link>
        </Text>
      </Flex>
    </Flex>
  )
}
