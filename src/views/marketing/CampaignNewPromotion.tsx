'use client'

import { useMemo, useState } from 'react'
import {
  Alert,
  Badge,
  Box,
  Button,
  Field,
  Flex,
  Input,
  Select,
  Stat,
  Text,
  Textarea,
  createListCollection,
} from '@chakra-ui/react'
import { Info, Megaphone, Package } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { TitleBar } from '@/components/ui/TitleBar'
import { ButtonFooter } from '@/components/ui/ButtonFooter'
import { toaster } from '@/components/ui/toaster'
import { NumberField } from '@/components/ui/NumberField'
import { toPersianDigits, formatThousands } from '@/utils/numbers'
import { CAMPAIGN_TYPE_OPTIONS } from '@/components/marketing/campaigns/NewCampaignDialog'
import { CAMPAIGN_CATEGORY_OPTIONS, type CampaignProduct } from '@/components/marketing/campaigns/data'
import { ProductPickerDialog } from '@/components/marketing/campaigns/ProductPickerDialog'
import { DateField } from '@/components/marketing/campaigns/DateField'

const CATEGORY_COLLECTION = createListCollection({ items: CAMPAIGN_CATEGORY_OPTIONS })

function PromotionStat({
  label,
  value,
  caption,
  bg,
  borderColor,
  textColor,
}: {
  label: string
  value: string
  caption: string
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
        {value}
      </Stat.ValueText>
      <Text fontSize="xs" color={textColor}>{caption}</Text>
    </Stat.Root>
  )
}

export function CampaignNewPromotion() {
  const router = useRouter()
  const promotionType = CAMPAIGN_TYPE_OPTIONS.find((o) => o.id === 'promotion')!

  const [pickerOpen, setPickerOpen] = useState(false)
  const [product, setProduct] = useState<CampaignProduct | null>(null)
  const [category, setCategory] = useState<string[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [perSignupRate, setPerSignupRate] = useState('')
  const [perViewRate, setPerViewRate] = useState('')
  const [totalBudget, setTotalBudget] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const { estimatedSignups, estimatedViews, conversionRate } = useMemo(() => {
    const budget = Number(totalBudget || '0')
    const signupRate = Number(perSignupRate || '0')
    const viewRate = Number(perViewRate || '0')
    const signups = signupRate > 0 ? Math.floor(budget / signupRate) : 0
    const views = viewRate > 0 ? Math.round((budget / viewRate) * 1000) : 0
    const rate = views > 0 ? (signups / views) * 100 : 0
    return { estimatedSignups: signups, estimatedViews: views, conversionRate: rate }
  }, [totalBudget, perSignupRate, perViewRate])

  const canSubmit = Boolean(
    product && category.length > 0 && title.trim() && description.trim()
    && perSignupRate && perViewRate && totalBudget && startDate && endDate
  )

  const handlePublish = () => {
    toaster.create({ id: 'campaign-published', title: 'کمپین منتشر شد', type: 'success', duration: 2500 })
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
          <Flex bg={promotionType.iconBg} color={promotionType.iconColor} rounded="lg" p="2" flexShrink={0} align="center" justify="center">
            <Megaphone size={24} />
          </Flex>
          <Flex direction="column" gap="1" flex="1" minW="0" alignItems="flex-start">
            <Flex gap="4" align="center" justify="flex-start" w="full">
              <Text fontSize="md" fontWeight="semibold" color="fg">{promotionType.title}</Text>
              <Badge colorPalette={promotionType.badgeColor} variant="subtle" size="sm">{promotionType.badgeLabel}</Badge>
            </Flex>
            <Text fontSize="sm" color="fg.muted" textAlign="right" w="full">{promotionType.description}</Text>
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
                placeholder="مثال: پروموشن ویژه عید"
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
                هدف کمپین و مخاطب مورد نظر را برای بازاریاب توضیح دهید
              </Field.HelperText>
            </Field.Root>
          </Flex>
        </Flex>

        {/* بخش ۲ — مدل پرداخت و بودجه */}
        <Flex direction="column" gap="6" alignItems="flex-start" w="full" maxW="670px">
          <TitleBar
            title="مدل پرداخت و بودجه"
            subtitle="اطلاعات پرداخت و بودجه را تکمیل کنید."
            size="lg"
            divider
          />

          <Flex direction="column" gap="4" alignItems="flex-start" w="full">
            {/* نرخ‌های پرداخت — راست: هر ۱۰۰۰ بازدید · چپ: هر ثبت‌نام (بر اساس x-metadata طرح) */}
            <Flex direction={{ base: 'column', sm: 'row' }} gap="4" w="full">
              <Field.Root required flex="1" minW="0">
                <Field.Label fontSize="sm" fontWeight="semibold" color="fg">
                  پرداخت به ازای هر ۱۰۰۰ بازدید<Field.RequiredIndicator />
                </Field.Label>
                <NumberField
                  value={perViewRate}
                  onChange={setPerViewRate}
                  placeholder="مبلغ را وارد کنید"
                  endElement={<Text fontSize="sm" color="fg.muted" px="2">تومان</Text>}
                />
              </Field.Root>
              <Field.Root required flex="1" minW="0">
                <Field.Label fontSize="sm" fontWeight="semibold" color="fg">
                  پرداخت به ازای هر ثبت‌نام<Field.RequiredIndicator />
                </Field.Label>
                <NumberField
                  value={perSignupRate}
                  onChange={setPerSignupRate}
                  placeholder="مبلغ را وارد کنید"
                  endElement={<Text fontSize="sm" color="fg.muted" px="2">تومان</Text>}
                />
              </Field.Root>
            </Flex>

            {/* بودجه کل کمپین */}
            <Field.Root required w="full">
              <Field.Label fontSize="sm" fontWeight="semibold" color="fg">
                بودجه کل کمپین<Field.RequiredIndicator />
              </Field.Label>
              <NumberField
                value={totalBudget}
                onChange={setTotalBudget}
                placeholder="مبلغ را وارد کنید"
                endElement={<Text fontSize="sm" color="fg.muted" px="2">تومان</Text>}
              />
              <Field.HelperText>
                بودجه هنگام انتشار کمپین پرداخت می‌شود و به عنوان سقف اجرایی عمل می‌کند
              </Field.HelperText>
            </Field.Root>

            <Alert.Root status="warning" variant="subtle" w="full">
              <Alert.Indicator />
              <Alert.Content>
                <Text fontSize="xs">
                  مبلغ {toPersianDigits(formatThousands(totalBudget || '0'))} تومان هنگام انتشار کمپین از حساب شما کسر می‌شود.
                </Text>
              </Alert.Content>
            </Alert.Root>
          </Flex>
        </Flex>

        {/* پیش نمایش مالی — راست: برآورد بازدید · وسط: برآورد ثبت‌نام · چپ: نرخ تبدیل (بر اساس x-metadata طرح) */}
        <Flex direction="column" gap="2" alignItems="flex-start" w="full" maxW="670px">
          <TitleBar title="پیش نمایش مالی" size="md" />
          <Flex direction={{ base: 'column', sm: 'row' }} gap="4" w="full">
            <PromotionStat
              label="برآورد بازدید"
              value={toPersianDigits(formatThousands(estimatedViews))}
              caption={`براساس نرخ ${toPersianDigits(formatThousands(perViewRate || '0'))} ت / ۱۰۰۰ بازدید`}
              bg="blue.bg" borderColor="blue.muted" textColor="blue.fg"
            />
            <PromotionStat
              label="برآورد ثبت نام"
              value={toPersianDigits(formatThousands(estimatedSignups))}
              caption={`براساس نرخ ${toPersianDigits(formatThousands(perSignupRate || '0'))} ت / هر ثبت نام`}
              bg="purple.bg" borderColor="purple.muted" textColor="purple.fg"
            />
            <PromotionStat
              label="نرخ تبدیل تخمینی"
              value={`% ${toPersianDigits(conversionRate.toFixed(1))}`}
              caption="نسبت ثبت نام به بازدید"
              bg="brand.bg" borderColor="brand.muted" textColor="green.fg"
            />
          </Flex>
          <Flex gap="2" align="center" justify="flex-start" w="full" pt="4">
            <Info size={16} color="var(--chakra-colors-fg-muted)" style={{ flexShrink: 0 }} />
            <Text flex="1" fontSize="xs" color="fg.muted" textAlign="right">
              این برآورد صرفاً جهت راهنمایی است و بازدهی واقعی بستگی به کیفیت تبلیغ و مخاطب هدف دارد.
            </Text>
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
            primary={{ label: 'انتشار کمپین', onClick: handlePublish, disabled: !canSubmit }}
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
