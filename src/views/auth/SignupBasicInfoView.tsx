'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Box, Field, Flex, Input, InputGroup, Text } from '@chakra-ui/react'
import { CircleCheck, Circle } from 'lucide-react'
import { SignupLayout } from '@/components/auth/SignupLayout'
import { saveSignupStep, type SignupBasicInfo } from '@/services/auth'
import { toPersianDigits } from '@/utils/numbers'

const ALLOWED_CHARS_RE = /^[a-z0-9-]+$/
const RESERVED_SLUGS = ['admin', 'test', 'shop', 'api', 'www']

// mock — تا وصل‌شدن به API واقعی: یکتا بودن آدرس فروشگاه رو شبیه‌سازی می‌کنه
function checkSlugAvailable(slug: string): Promise<boolean> {
  return new Promise((resolve) => setTimeout(() => resolve(!RESERVED_SLUGS.includes(slug)), 400))
}

function normalizeSlug(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9-]/g, '')
}

export function SignupBasicInfoView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') ?? ''

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [storeNameFa, setStoreNameFa] = useState('')
  const [slug, setSlug] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)

  const [firstNameError, setFirstNameError] = useState('')
  const [lastNameError, setLastNameError] = useState('')
  const [storeNameFaError, setStoreNameFaError] = useState('')
  const [slugError, setSlugError] = useState('')

  useEffect(() => {
    if (!phone) router.replace('/login')
  }, [phone, router])

  const noEdgeDash = slug.length > 0 && !slug.startsWith('-') && !slug.endsWith('-')
  const onlyAllowedChars = slug.length > 0 && ALLOWED_CHARS_RE.test(slug)

  useEffect(() => {
    if (!onlyAllowedChars || !noEdgeDash) return
    const t = setTimeout(() => {
      void checkSlugAvailable(slug).then(setSlugAvailable)
    }, 400)
    return () => clearTimeout(t)
  }, [slug, onlyAllowedChars, noEdgeDash])

  const rules = [
    { key: 'unique', ok: onlyAllowedChars && noEdgeDash && slugAvailable === true, label: 'نام انگلیسی تکراری نباشد.' },
    { key: 'edge-dash', ok: noEdgeDash, label: 'عدم شروع یا پایان با خط تیره' },
    { key: 'chars', ok: onlyAllowedChars, label: 'فقط حروف انگلیسی کوچک، اعداد و خط تیره' },
  ]

  async function handleContinue() {
    const nextFirstNameError = firstName ? '' : 'نام را وارد نمایید'
    const nextLastNameError = lastName ? '' : 'نام خانوادگی را وارد نمایید'
    const nextStoreNameFaError = storeNameFa ? '' : 'نام فارسی فروشگاه را وارد نمایید'
    const nextSlugError = !slug
      ? 'آدرس اختصاصی فروشگاه را وارد نمایید'
      : !onlyAllowedChars || !noEdgeDash
        ? 'آدرس اختصاصی فروشگاه معتبر نیست'
        : slugAvailable !== true
          ? 'این آدرس در دسترس نیست'
          : ''

    setFirstNameError(nextFirstNameError)
    setLastNameError(nextLastNameError)
    setStoreNameFaError(nextStoreNameFaError)
    setSlugError(nextSlugError)

    if (nextFirstNameError || nextLastNameError || nextStoreNameFaError || nextSlugError) return

    setLoading(true)
    const basicInfo: SignupBasicInfo = {
      firstName,
      lastName,
      storeNameFa,
      storeSlug: slug,
      inviteCode: inviteCode || undefined,
    }
    saveSignupStep(phone, 'categories', { basicInfo })
    router.push(`/signup/categories?phone=${phone}`)
  }

  if (!phone) return null

  return (
    <SignupLayout
      title="اطلاعات پایه"
      subtitle="جهت ثبت نام اطلاعات زیر را وارد نمایید."
      currentStep={1}
      mobile={toPersianDigits(phone)}
      changePhoneHref={`/login?phone=${phone}`}
      onContinue={handleContinue}
      continueLoading={loading}
    >
      {/* نام FIRST در DOM = راست‌ترین (طبق x فیگما: نام x=385 > نام‌خانوادگی x=0) */}
      <Flex gap="4" wrap="wrap" w="full">
        <Field.Root required invalid={!!firstNameError} flex="1" minW="200px">
          <Field.Label fontSize="sm" fontWeight="semibold">
            نام<Field.RequiredIndicator />
          </Field.Label>
          <Input
            value={firstName}
            onChange={(e) => { setFirstName(e.target.value); if (firstNameError) setFirstNameError('') }}
            placeholder="نام"
          />
          {firstNameError && <Field.ErrorText display="block" fontSize="xs" textAlign="start" w="full">{firstNameError}</Field.ErrorText>}
        </Field.Root>
        <Field.Root required invalid={!!lastNameError} flex="1" minW="200px">
          <Field.Label fontSize="sm" fontWeight="semibold">
            نام خانوادگی<Field.RequiredIndicator />
          </Field.Label>
          <Input
            value={lastName}
            onChange={(e) => { setLastName(e.target.value); if (lastNameError) setLastNameError('') }}
            placeholder="نام خانوادگی"
          />
          {lastNameError && <Field.ErrorText display="block" fontSize="xs" textAlign="start" w="full">{lastNameError}</Field.ErrorText>}
        </Field.Root>
      </Flex>

      {/* نام فارسی فروشگاه FIRST = راست‌ترین (x=385 > آدرس اختصاصی x=0) */}
      <Flex gap="4" w="full" align="start" wrap="wrap">
        <Field.Root required invalid={!!storeNameFaError} flex="1" minW="220px">
          <Field.Label fontSize="sm" fontWeight="semibold">
            نام فارسی فروشگاه<Field.RequiredIndicator />
          </Field.Label>
          <Input
            value={storeNameFa}
            onChange={(e) => { setStoreNameFa(e.target.value); if (storeNameFaError) setStoreNameFaError('') }}
            placeholder="نام فارسی فروشگاه"
          />
          {storeNameFaError && <Field.ErrorText display="block" fontSize="xs" textAlign="start" w="full">{storeNameFaError}</Field.ErrorText>}
        </Field.Root>
        <Field.Root required invalid={!!slugError} flex="1" minW="220px">
          <Field.Label fontSize="sm" fontWeight="semibold">
            آدرس اختصاصی<Field.RequiredIndicator />
          </Field.Label>
          {/* dir="ltr" روی خود InputGroup لازمه — وگرنه start/end منطقی بر اساس dir=rtl صفحه resolve می‌شن و https:// سمت چپ/.vitrinaa.shop سمت راست جابه‌جا می‌شن.
              ps/pe دستی چون فرمول پیش‌فرض InputGroup (بر اساس ارتفاع اینپوت) برای دکوریشن‌های متنی عریض‌تر از یک آیکون کوچیک کافی نیست و باعث overlap با متن ورودی می‌شه. */}
          <InputGroup
            dir="ltr"
            startElement={<Text fontSize="sm" color="fg.muted" whiteSpace="nowrap">https://</Text>}
            endElement={<Text fontSize="sm" color="fg.muted" whiteSpace="nowrap">.vitrinaa.shop</Text>}
          >
            <Input
              value={slug}
              onChange={(e) => { setSlug(normalizeSlug(e.target.value)); if (slugError) setSlugError('') }}
              placeholder="آدرس اختصاصی"
              dir="ltr"
              ps="20"
              pe="32"
            />
          </InputGroup>
          {slugError && <Field.ErrorText display="block" fontSize="xs" textAlign="start" w="full">{slugError}</Field.ErrorText>}
          <Text fontSize="xs" color="fg.muted" textAlign="start" w="full">
            {`https://${slug || 'mazbox'}.vitrinaa.shop`}
          </Text>
        </Field.Root>
      </Flex>

      <Box w="full">
        <Text fontWeight="semibold" fontSize="sm" textAlign="start" mb="1.5" w="full">
          قوانین ثبت آدرس اختصاصی:
        </Text>
        {/* آیکون FIRST در DOM = راست (قرارداد پروژه) */}
        <Flex bg="bg.subtle" borderWidth="1px" borderStyle="dashed" borderColor="border.emphasized" borderRadius="sm" py="1" wrap="wrap" gap="2">
          {rules.map((rule) => (
            <Flex key={rule.key} flex="1" minW="220px" gap="2" align="center" px="3" py="1.5" borderRadius="l3">
              <Box color={rule.ok ? 'green.solid' : 'fg.subtle'} flexShrink={0}>
                {rule.ok ? <CircleCheck size={14} /> : <Circle size={14} />}
              </Box>
              <Text fontSize="xs" fontWeight="medium" color={rule.ok ? 'green.fg' : 'fg.subtle'} textAlign="start" flex="1">
                {rule.label}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Box>

      {/* alignSelf="start" = سمت راست در RTL (پدر align="end" پیش‌فرضش چپ است) */}
      <Field.Root maxW={{ base: 'full', md: '369px' }} alignSelf="start">
        <Field.Label fontSize="sm" fontWeight="semibold">کد دعوت دارید؟</Field.Label>
        <Input value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} placeholder="کد دعوت را وارد کنید." />
      </Field.Root>
    </SignupLayout>
  )
}
