'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Box, Flex, Input, InputGroup, Text } from '@chakra-ui/react'
import { CirclePlus, Search } from 'lucide-react'
import { SignupLayout } from '@/components/auth/SignupLayout'
import { SignupCategoryAccordion } from '@/components/auth/SignupCategoryAccordion'
import { SIGNUP_CATEGORIES } from '@/components/auth/signupCategoriesData'
import { getSignupProgress, saveSignupStep } from '@/services/auth'

export function SignupCategoriesView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') ?? ''

  const progress = getSignupProgress(phone)
  // آرایه (نه Set) چون ترتیب انتخاب مهمه: اولی = پیش‌فرض. حذف پیش‌فرض → نفر بعدی به ترتیب انتخاب جایگزین می‌شه.
  const [selectedIds, setSelectedIds] = useState<string[]>(progress?.categoryIds ?? [])
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
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!phone) router.replace('/login')
  }, [phone, router])

  const filtered = useMemo(() => {
    const q = searchQuery.trim()
    if (!q) return SIGNUP_CATEGORIES
    return SIGNUP_CATEGORIES.filter(
      (c) => c.name.includes(q) || c.subcategories.some((s) => s.includes(q)),
    )
  }, [searchQuery])

  // اولین دسته‌بندیِ انتخاب‌شده به ترتیب کلیک (نه ترتیب لیست) = پیش‌فرض
  const defaultId = selectedIds[0]

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  function toggleOpen(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function handleContinue() {
    if (selectedIds.length === 0) return
    setLoading(true)
    saveSignupStep(phone, 'plan', { categoryIds: selectedIds })
    router.push(`/signup/preparing?phone=${phone}`)
  }

  if (!phone) return null

  return (
    <SignupLayout
      title="دسته بندی فروشگاه"
      subtitle="دسته بندی(های) مورد نظر خود را به فروشگاه اضافه کنید."
      currentStep={1}
      backHref={`/signup/basic-info?phone=${phone}`}
      changePhoneHref={`/login?phone=${phone}`}
      onContinue={handleContinue}
      continueLoading={loading}
      continueDisabled={selectedIds.length === 0}
      footerGap={{ base: '6', md: '6' }}
      basicInfoSummary={basicInfoSummary}
    >
      {/* هر خط: بولت اول در DOM = راست‌ترین (کنار شروع متن)، بعد متن (یک <Text> بلوکی با محتوای inline). */}
      <Flex direction="column" gap="1.5" w="full">
        <Flex align="flex-start" gap="2" w="full">
          <Text as="span" fontSize="xs" color="fg.muted" flexShrink={0}>•</Text>
          <Text fontSize="xs" color="fg.muted" textAlign="right" flex="1" minW="0">
            برای افزودن دسته به فروشگاه روی{' '}
            <Box as="span" display="inline-block" verticalAlign="middle" color="fg.muted">
              <CirclePlus size={14} />
            </Box>{' '}
            کلیک کنید.
          </Text>
        </Flex>
        <Flex align="flex-start" gap="2" w="full">
          <Text as="span" fontSize="xs" color="fg.muted" flexShrink={0}>•</Text>
          <Text fontSize="xs" color="fg.muted" textAlign="right" flex="1" minW="0">
            اولین دسته بندی انتخاب شده به عنوان <Text as="span" fontWeight="bold" color="fg">دسته بندی پیش فرض</Text> در سایت نمایش داده می شود.
          </Text>
        </Flex>
      </Flex>

      <InputGroup startElement={<Search size={16} />} w="full">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="جستجو در دسته ها و زیردسته ها..."
        />
      </InputGroup>

      <Box borderWidth="1px" borderColor="border" borderRadius="l3" w="full" maxH={{ base: 'auto', md: '420px' }} overflowY="auto">
        {filtered.map((category, i) => (
          <SignupCategoryAccordion
            key={category.id}
            category={category}
            selected={selectedIds.includes(category.id)}
            isDefault={category.id === defaultId}
            isOpen={openIds.has(category.id)}
            onToggleSelect={() => toggleSelect(category.id)}
            onToggleOpen={() => toggleOpen(category.id)}
            isLast={i === filtered.length - 1}
          />
        ))}
      </Box>
    </SignupLayout>
  )
}
