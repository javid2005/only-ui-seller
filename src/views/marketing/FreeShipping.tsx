'use client'

import { useState } from 'react'
import { Alert, Box, Flex, RadioCard, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { TitleBar } from '@/components/ui/TitleBar'
import { ButtonFooter } from '@/components/ui/ButtonFooter'
import { NumberField } from '@/components/ui/NumberField'
import { FreeShippingGeoSection } from '@/components/marketing/promotions/FreeShippingGeoSection'

type ShippingScope = 'geo' | 'all'

/**
 * صفحه «ارسال رایگان» — Figma «Promotion / Free-Shipping All» (node 2720:61061، کل کشور) و
 * «Promotion / Free-Shipping Selected» (node 2724:40253، موقعیت جغرافیایی). لایوت مثل صفحهٔ
 * پروموشن‌ها (One Column Center، پنل سفید max-960).
 *
 * RadioCard: کل کشور FIRST=راست‌ترین ← موقعیت جغرافیایی SECOND=چپ‌ترین — از متادیتای طرح
 * (کل‌کشور x بالاتر از موقعیت‌جغرافیایی در canvas LTR، برعکس برای DOM راست‌به‌چپ).
 */
export function FreeShipping() {
  const router = useRouter()
  const [scope, setScope] = useState<ShippingScope>('all')
  const [minItems, setMinItems] = useState('')
  const [minAmount, setMinAmount] = useState('')
  const [checkedValue, setCheckedValue] = useState<string[]>([])

  return (
    <Flex direction="column" gap="4" alignItems="end" w="full">
      <Header
        title="ارسال رایگان"
        breadcrumbs={[
          { label: 'داشبورد', href: '/' },
          { label: 'پروموشن ها', href: '/promotions/ads' },
          { label: 'ارسال رایگان' },
        ]}
      />

      <Box bg="bg.panel" borderWidth="1px" borderColor="border" rounded="2xl" p="6" w="full">
        <Flex direction="column" gap="10" alignItems="end" maxW="960px" w="full" mx="auto">
          <Alert.Root status="info" variant="subtle" w="full">
            <Alert.Indicator />
            <Alert.Content>
              <Text fontSize="xs">
                ارسال رایگان به صورت خودکار روی سفارش‌های واجد شرایط اعمال می‌شود. مشتری نیازی به وارد کردن کد ندارد. در هر فروشگاه فقط یک تنظیم ارسال رایگان می‌تواند وجود داشته باشد.
              </Text>
            </Alert.Content>
          </Alert.Root>

          <Flex direction="column" gap="4" alignItems="end" w="full">
            <TitleBar
              title="تنظیمات ارسال"
              subtitle="تعریف شرط‌های مکمل برای کنترل بهتر ارسال رایگان"
              size="xl"
              divider
            />
            <Flex gap="4" w="full" direction={{ base: 'column', sm: 'row' }}>
              <Box flex="1" minW="0" maxW={{ base: 'full', sm: '472px' }}>
                <NumberField
                  value={minItems}
                  onChange={setMinItems}
                  placeholder="مثال: ۲"
                />
                <Text fontSize="xs" color="fg.muted" textAlign="start" mt="1.5">
                  ارسال رایگان فقط زمانی اعمال می‌شود که سبد حداقل این تعداد کالا داشته باشد
                </Text>
              </Box>
              <Box flex="1" minW="0" maxW={{ base: 'full', sm: '472px' }}>
                <NumberField
                  value={minAmount}
                  onChange={setMinAmount}
                  placeholder="مثال: ۵۰٬۰۰۰"
                  endElement={<Text fontSize="sm" color="fg.muted" px="2">تومان</Text>}
                />
                <Text fontSize="xs" color="fg.muted" textAlign="start" mt="1.5">
                  ارسال رایگان فقط برای سفارش‌هایی با این مبلغ یا بیشتر اعمال می‌شود
                </Text>
              </Box>
            </Flex>
          </Flex>

          <Flex direction="column" gap="6" alignItems="end" w="full">
            <TitleBar
              title="محدوده جغرافیایی"
              subtitle="مشخص کنید ارسال رایگان برای کدام مناطق اعمال شود."
              size="xl"
              divider
            />

            <RadioCard.Root
              value={scope}
              onValueChange={(e) => setScope((e.value ?? 'all') as ShippingScope)}
              w="full"
            >
              <Flex gap="4" w="full" direction={{ base: 'column', sm: 'row' }}>
                {/* کل کشور FIRST=راست‌ترین */}
                <ShippingScopeCard value="all" title="کل کشور" description="ارسال رایگان برای همه مناطق ایران" />
                {/* موقعیت جغرافیایی SECOND=چپ‌ترین */}
                <ShippingScopeCard value="geo" title="موقعیت جغرافیایی" description="شهرها یا استان‌های منتخب" />
              </Flex>
            </RadioCard.Root>

            {scope === 'geo' && (
              <FreeShippingGeoSection checkedValue={checkedValue} onCheckedChange={setCheckedValue} />
            )}
          </Flex>

          <ButtonFooter
            primary={{ label: 'ذخیره تغییرات', onClick: () => {} }}
            back={{ label: 'بازگشت', onClick: () => router.push('/promotions/ads') }}
          />
        </Flex>
      </Box>
    </Flex>
  )
}

function ShippingScopeCard({ value, title, description }: { value: ShippingScope; title: string; description: string }) {
  return (
    <RadioCard.Item value={value} flex="1" rounded="lg" p="4" bg="bg.panel" borderWidth="1px" borderColor="border" boxShadow="none" cursor="pointer" _checked={{ bg: 'brand.bg', borderColor: 'brand.focusRing' }}>
      <RadioCard.ItemHiddenInput />
      {/* Content FIRST=راست‌ترین، RadioMark SECOND=چپ‌ترین — طبق طرح Left-Radio-Card
          (برعکسِ CampaignTypeCard که Indicator رو آخر می‌گذاشت؛ اون کارت آیکون هم داشت، این یکی نه) */}
      <RadioCard.ItemControl gap="4" p="0" border="none" bg="transparent" boxShadow="none" w="full" alignItems="start">
        <RadioCard.ItemContent gap="1" minW="0" alignItems="start" flex="1">
          <RadioCard.ItemText fontSize="sm" fontWeight="semibold" color="fg">{title}</RadioCard.ItemText>
          <Text fontSize="xs" color="fg.muted" textAlign="start" w="full">{description}</Text>
        </RadioCard.ItemContent>
        <RadioCard.ItemIndicator colorPalette="brand" flexShrink={0} />
      </RadioCard.ItemControl>
    </RadioCard.Item>
  )
}
