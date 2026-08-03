'use client'

import { useMemo, useRef, useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Field,
  Flex,
  Input,
  Select,
  Stat,
  TagsInput,
  Text,
  Textarea,
  createListCollection,
} from '@chakra-ui/react'
import { Calendar, Handshake, Package } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { TitleBar } from '@/components/ui/TitleBar'
import { ButtonFooter } from '@/components/ui/ButtonFooter'
import { toaster } from '@/components/ui/toaster'
import { toPersianDigits, formatThousands } from '@/utils/numbers'
import { formatJalaliDate } from '@/utils/dates'
import { CAMPAIGN_TYPE_OPTIONS } from '@/components/marketing/campaigns/NewCampaignDialog'
import { CAMPAIGN_CATEGORY_OPTIONS, type CampaignProduct } from '@/components/marketing/campaigns/data'
import { ProductPickerDialog } from '@/components/marketing/campaigns/ProductPickerDialog'
import { CampaignFeeInput, type CampaignFeeType } from '@/components/marketing/campaigns/CampaignFeeInput'

const CATEGORY_COLLECTION = createListCollection({ items: CAMPAIGN_CATEGORY_OPTIONS })

// ─── تاریخ — بدون date-picker جلالی در پروژه؛ input بومی type=date روی خودش
// استایل خورده (overlay شفاف) + نمایش با formatJalaliDate. جزئیات: DoD این task.

function DateField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  const ref = useRef<HTMLInputElement>(null)
  const display = value ? formatJalaliDate(new Date(value)) : ''

  return (
    <Field.Root required flex="1" minW="0">
      <Field.Label fontSize="sm" fontWeight="semibold" color="fg">
        {label}<Field.RequiredIndicator />
      </Field.Label>
      <Box
        position="relative"
        w="full"
        h="10"
        borderWidth="1px"
        borderColor="border"
        rounded="sm"
        bg="bg.panel"
        display="flex"
        alignItems="center"
        gap="2"
        px="3"
        cursor="pointer"
      >
        <Text flex="1" fontSize="sm" color={value ? 'fg' : 'fg.subtle'} textAlign="right">
          {display || placeholder}
        </Text>
        <Calendar size={16} color="var(--chakra-colors-fg-muted)" style={{ flexShrink: 0 }} />
        <Input
          ref={ref}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          position="absolute"
          inset="0"
          opacity="0"
          cursor="pointer"
          h="full"
          w="full"
          p="0"
          border="none"
        />
      </Box>
    </Field.Root>
  )
}

function FinancialStat({
  label,
  value,
  bg,
  borderColor,
  textColor,
}: {
  label: string
  value: number
  bg: string
  borderColor: string
  textColor: string
}) {
  return (
    <Stat.Root
      flex="1 0 0"
      minW="0"
      bg={bg}
      borderWidth="1px"
      borderColor={borderColor}
      rounded="lg"
      p="2"
      gap="2"
    >
      <Stat.Label color={textColor} fontSize="sm">{label}</Stat.Label>
      <Stat.ValueText color={textColor} fontSize="xl" fontWeight="semibold" letterSpacing="tight">
        {toPersianDigits(formatThousands(value))} تومان
      </Stat.ValueText>
    </Stat.Root>
  )
}

export function CampaignNewSales() {
  const router = useRouter()
  const salesType = CAMPAIGN_TYPE_OPTIONS.find((o) => o.id === 'sales')!

  const [pickerOpen, setPickerOpen] = useState(false)
  const [product, setProduct] = useState<CampaignProduct | null>(null)
  const [category, setCategory] = useState<string[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [feeType, setFeeType] = useState<CampaignFeeType>('value')
  const [feeAmount, setFeeAmount] = useState('')
  const [feePercent, setFeePercent] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const { sellerShare, marketerShare, productPrice } = useMemo(() => {
    const price = product?.price ?? 0
    const fee = feeType === 'percent'
      ? Math.round((price * Number(feePercent || '0')) / 100)
      : Number(feeAmount || '0')
    const marketer = Math.min(Math.max(fee, 0), price)
    return { productPrice: price, marketerShare: marketer, sellerShare: Math.max(price - marketer, 0) }
  }, [product, feeType, feeAmount, feePercent])

  const canSubmit = Boolean(product && category.length > 0 && title.trim() && description.trim() && startDate && endDate)

  const handleCreate = () => {
    toaster.create({ id: 'campaign-created', title: 'کمپین ایجاد شد', type: 'success', duration: 2500 })
    router.push('/marketing/campaigns')
  }

  const handleSaveDraft = () => {
    toaster.create({ id: 'campaign-draft-saved', title: 'به عنوان پیش‌نویس ذخیره شد', type: 'success', duration: 2500 })
    router.push('/marketing/campaigns')
  }

  return (
    <Flex direction="column" gap="4" alignItems="flex-start" w="full">
      <Header
        title="ایجاد کمپین جدید"
        breadcrumbs={[
          { label: 'داشبورد', href: '/' },
          { label: 'کمپین ها', href: '/marketing/campaigns' },
          { label: 'ایجاد کمپین جدید' },
        ]}
      />

      <Flex
        direction="column"
        gap="10"
        alignItems="center"
        w="full"
        bg="bg.panel"
        borderWidth="1px"
        borderColor="border"
        rounded="2xl"
        p="6"
      >
        {/* بنر نوع کمپین — استاتیک، مطابق CampaignTypeCard در NewCampaignDialog
            زیر sm: ستونی (آیکون بالا، محتوا زیرش) — sm به بالا: هم‌ردیف */}
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          gap="4"
          align="flex-start"
          justify="flex-start"
          w="full"
          maxW="670px"
          bg="bg.subtle"
          borderWidth="1px"
          borderColor="border"
          rounded="lg"
          p="4"
        >
          {/* آیکون — FIRST = راست‌ترین */}
          <Flex bg={salesType.iconBg} color={salesType.iconColor} rounded="lg" p="2" flexShrink={0} align="center" justify="center">
            <Handshake size={24} />
          </Flex>
          <Flex direction="column" gap="1" flex="1" minW="0" alignItems="flex-start">
            <Flex gap="4" align="center" justify="flex-start" w="full">
              <Text fontSize="md" fontWeight="semibold" color="fg">{salesType.title}</Text>
              <Badge colorPalette={salesType.badgeColor} variant="subtle" size="sm">{salesType.badgeLabel}</Badge>
            </Flex>
            <Text fontSize="sm" color="fg.muted" textAlign="right" w="full">{salesType.description}</Text>
          </Flex>
        </Flex>

        {/* بخش ۱ — اطلاعات پایه */}
        <Flex direction="column" gap="6" alignItems="flex-start" w="full" maxW="670px">
          <TitleBar title="اطلاعات پایه" subtitle="اطلاعات پایه کمپین را وارد کنید." size="lg" divider />

          <Flex direction="column" gap="4" alignItems="flex-start" w="full">
            {/* محصول */}
            <Field.Root required w="full">
              <Field.Label fontSize="sm" fontWeight="semibold" color="fg">
                محصول<Field.RequiredIndicator />
              </Field.Label>
              <Field.HelperText>
                محصولی که می‌خواهید بازاریاب‌ها آن را تبلیغ کنند
              </Field.HelperText>

              {product ? (
                <Flex
                  direction={{ base: 'column', sm: 'row' }}
                  align={{ base: 'stretch', sm: 'center' }}
                  gap="4"
                  w="full"
                  p="4"
                  borderWidth="1px"
                  borderColor="border"
                  rounded="lg"
                >
                  {/* Wrapper (تصویر+محتوا) — FIRST = راست‌ترین (زیر sm: بالا) */}
                  <Flex align="center" gap="4" flex="1" minW="0">
                    <Flex boxSize="12" flexShrink={0} bg="bg.muted" borderWidth="1px" borderColor="border.muted" rounded="md" align="center" justify="center">
                      <Package size={20} color="var(--chakra-colors-fg-subtle)" />
                    </Flex>
                    <Flex direction="column" gap="2" flex="1" minW="0" alignItems="flex-start">
                      <Text fontSize="sm" fontWeight="semibold" color="fg" w="full" textAlign="right" lineClamp={1}>
                        {product.name}
                      </Text>
                      <Flex gap="2" align="center" justify="flex-start">
                        <Text fontSize="xs" color="fg.muted">{product.sku}</Text>
                        <Text fontSize="xs" color="fg.muted">•</Text>
                        <Text fontSize="xs" color="fg.muted" whiteSpace="nowrap">
                          {toPersianDigits(formatThousands(product.price))} ت
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                  {/* دکمهٔ تغییر محصول — LAST = چپ‌ترین (زیر sm: پایین، تمام عرض) */}
                  <Button
                    variant="outline"
                    colorPalette="brand"
                    size="sm"
                    flexShrink={0}
                    w={{ base: 'full', sm: 'auto' }}
                    onClick={() => setPickerOpen(true)}
                  >
                    تغییر محصول
                  </Button>
                </Flex>
              ) : (
                <Button variant="outline" colorPalette="brand" onClick={() => setPickerOpen(true)}>
                  انتخاب محصول از فروشگاه
                </Button>
              )}
            </Field.Root>

            {/* دسته بندی کمپین */}
            <Field.Root required w="full">
              <Field.Label fontSize="sm" fontWeight="semibold" color="fg">
                دسته بندی کمپین<Field.RequiredIndicator />
              </Field.Label>
              <Select.Root
                collection={CATEGORY_COLLECTION}
                value={category}
                onValueChange={(e) => setCategory(e.value)}
                w="full"
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="دسته بندی کمپین" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Select.Positioner>
                  <Select.Content>
                    {CATEGORY_COLLECTION.items.map((it) => (
                      <Select.Item key={it.value} item={it}>
                        <Select.ItemText>{it.label}</Select.ItemText>
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Select.Root>
            </Field.Root>

            {/* عنوان کمپین */}
            <Field.Root required w="full">
              <Field.Label fontSize="sm" fontWeight="semibold" color="fg">
                عنوان کمپین<Field.RequiredIndicator />
              </Field.Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: کمپین تابستانه کفش ورزشی"
                textAlign="right"
              />
            </Field.Root>

            {/* توضیحات کمپین */}
            <Field.Root required w="full">
              <Field.Label fontSize="sm" fontWeight="semibold" color="fg">
                توضیحات کمپین<Field.RequiredIndicator />
              </Field.Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیحات کمپین"
                textAlign="right"
                minH="30"
              />
              <Field.HelperText>
                به بازاریاب بگویید محصول چیست، مزیت آن چیست و چه نکاتی در تبلیغ مهم‌ترند
              </Field.HelperText>
            </Field.Root>

            {/* تگ‌های بازاریابی */}
            <Field.Root w="full">
              <Field.Label fontSize="sm" fontWeight="semibold" color="fg">تگ‌های بازاریابی</Field.Label>
              <TagsInput.Root value={tags} onValueChange={(e) => setTags(e.value)} w="full">
                <TagsInput.Control>
                  <TagsInput.Context>
                    {(api) => api.value.map((value, index) => (
                      <TagsInput.Item key={`${value}-${index}`} index={index} value={value}>
                        <TagsInput.ItemPreview>
                          <TagsInput.ItemText>{value}</TagsInput.ItemText>
                          <TagsInput.ItemDeleteTrigger />
                        </TagsInput.ItemPreview>
                        <TagsInput.ItemInput />
                      </TagsInput.Item>
                    ))}
                  </TagsInput.Context>
                  <TagsInput.Input placeholder="مثال: مناسب هدیه، ضدآب، اورجینال" />
                </TagsInput.Control>
                <TagsInput.HiddenInput />
              </TagsInput.Root>
              <Field.HelperText>
                ویژگی‌هایی که به بازاریاب در معرفی بهتر کمک می‌کند
              </Field.HelperText>
            </Field.Root>
          </Flex>
        </Flex>

        {/* بخش ۲ — کارمزد فروش */}
        <Flex direction="column" gap="6" alignItems="flex-start" w="full" maxW="670px">
          <TitleBar
            title="کارمزد فروش"
            subtitle="با وارد کردن مقدار کارمزد پیش نمایش های مالی فعال بروزرسانی خواهند شد."
            size="lg"
            divider
          />
          <CampaignFeeInput
            feeType={feeType}
            onFeeTypeChange={setFeeType}
            amount={feeAmount}
            onAmountChange={setFeeAmount}
            percent={feePercent}
            onPercentChange={setFeePercent}
          />
        </Flex>

        {/* پیش نمایش مالی */}
        <Flex direction="column" gap="2" alignItems="flex-start" w="full" maxW="670px">
          <TitleBar title="پیش نمایش مالی" size="md" />
          <Flex direction={{ base: 'column', sm: 'row' }} gap="4" w="full">
            {/* جای قیمت محصول و سهم فروشنده به درخواست کاربر جابه‌جا شد (خلاف ترتیب اولیه Figma) —
                قیمت محصول (راست) → سهم بازاریاب → سهم فروشنده (چپ). زیر sm: زیر هم به همین ترتیب */}
            <FinancialStat label="قیمت محصول" value={productPrice} bg="blue.bg" borderColor="blue.muted" textColor="blue.fg" />
            <FinancialStat label="سهم بازاریاب" value={marketerShare} bg="purple.bg" borderColor="purple.muted" textColor="purple.fg" />
            <FinancialStat label="سهم فروشنده" value={sellerShare} bg="brand.bg" borderColor="brand.muted" textColor="green.fg" />
          </Flex>
        </Flex>

        {/* بخش ۳ — بازه زمانی */}
        <Flex direction="column" gap="6" alignItems="flex-start" w="full" maxW="670px">
          <TitleBar title="بازه زمانی" subtitle="بازه زمانی فعال شدن کمپین را انتخاب نمایید." size="lg" divider />
          {/* تاریخ شروع FIRST = راست‌ترین — زیر sm: بالا (تاریخ پایان زیرش) */}
          <Flex direction={{ base: 'column', sm: 'row' }} gap="4" w="full">
            <DateField label="تاریخ شروع" value={startDate} onChange={setStartDate} placeholder="تاریخ شروع" />
            <DateField label="تاریخ پایان" value={endDate} onChange={setEndDate} placeholder="تاریخ پایان" />
          </Flex>
        </Flex>

        <Box w="full" maxW="670px">
          <ButtonFooter
            primary={{ label: 'ایجاد کمپین', onClick: handleCreate, disabled: !canSubmit }}
            secondary={{ label: 'ذخیره پیش‌نویس', onClick: handleSaveDraft }}
            back={{ label: 'انصراف', onClick: () => router.push('/marketing/campaigns'), hideIcon: true }}
          />
        </Box>
      </Flex>

      <ProductPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        selectedProductId={product?.id ?? null}
        onConfirm={(p) => {
          setProduct(p)
          setPickerOpen(false)
        }}
      />
    </Flex>
  )
}
