'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Flex, Grid, SegmentGroup } from '@chakra-ui/react'
import { SignupLayout } from '@/components/auth/SignupLayout'
import { PlanCard } from '@/components/auth/PlanCard'
import { SIGNUP_PLANS, DEFAULT_SIGNUP_PLAN_ID } from '@/components/auth/plansData'
import { SIGNUP_CATEGORIES } from '@/components/auth/signupCategoriesData'
import { getSignupProgress, saveSignupStep, type BillingPeriod } from '@/services/auth'

// ۶ماهه FIRST در آرایه = راست‌ترین (RTL) — طبق درخواست کاربر
const PERIOD_ITEMS = [
  { value: '6', label: '۶ ماهه' },
  { value: '12', label: '۱۲ ماهه' },
]

export function SignupPlanView() {
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

  const [period, setPeriod] = useState<BillingPeriod>(progress?.billingPeriod ?? '6')
  const [selectedPlanId, setSelectedPlanId] = useState(progress?.planId ?? DEFAULT_SIGNUP_PLAN_ID)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!phone) router.replace('/login')
  }, [phone, router])

  async function handleContinue() {
    setLoading(true)
    saveSignupStep(phone, 'done', { planId: selectedPlanId, billingPeriod: period })
    router.push(`/signup/done?phone=${phone}`)
  }

  if (!phone) return null

  return (
    <SignupLayout
      title="انتخاب اشتراک"
      currentStep={2}
      backHref={`/signup/categories?phone=${phone}`}
      changePhoneHref={`/login?phone=${phone}`}
      onContinue={handleContinue}
      continueLoading={loading}
      continueLabel="ادامه و ثبت فروشگاه"
      footerGap={{ base: '6', md: '6' }}
      basicInfoSummary={basicInfoSummary}
      categorySummary={categorySummary}
    >
      {/* gap="10" (40px) طبق Content container فیگما — هدر/segment/پلن‌ها همه ۴۰px فاصله دارن.
          یک Flex جدا از SignupLayout چون گپ پیش‌فرض بین subtitle/children اونجا 16px (برای فیلدهای فرم صفحات دیگه) است. */}
      <Flex direction="column" gap="10" align="center" w="full">
        <SegmentGroup.Root value={period} onValueChange={(e) => setPeriod(e.value as BillingPeriod)}>
          {/* bg="bg.panel" نه "white" — باگ شناخته‌شدهٔ Chakra v3.35: bg پیش‌فرض indicator transparent resolve می‌شه (dev-knowledge/chakra-ui-v3/known-bugs.md) */}
          <SegmentGroup.Indicator bg="bg.panel" />
          <SegmentGroup.Items items={PERIOD_ITEMS} />
        </SegmentGroup.Root>

        {/* زیر md: تک‌ستونه fluid ۱fr خالص (بدون کف min-width) که همیشه دقیقاً عرض کامل رو پر می‌کنه.
            md به بالا: auto-fit/minmax(320px,1fr) — کف ۳۲۰px فقط اینجا لازمه تا کارت‌ها بیش‌ازحد باریک نشن. */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(auto-fit, minmax(320px, 1fr))' }} gap="4" w="full">
          {SIGNUP_PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} period={period} selected={selectedPlanId === plan.id} onSelect={() => setSelectedPlanId(plan.id)} />
          ))}
        </Grid>
      </Flex>
    </SignupLayout>
  )
}
