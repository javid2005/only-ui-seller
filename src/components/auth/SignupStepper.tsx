import { Box, Flex, Steps, Text } from '@chakra-ui/react'
import { Check } from 'lucide-react'
import { toPersianDigits } from '@/utils/numbers'

const STEPS = [
  { title: 'اطلاعات پایه', description: 'اطلاعات پایه و  هویتی' },
  { title: 'دسته بندی ها', description: 'دسته بندی های مرتبط با کسب و کار' },
  { title: 'انتخاب اشتراک', description: 'اشتراک انتخاب شده برای کسب و کار' },
]

export interface SignupStepperProps {
  /** ایندکس صفر-پایه (۰=اطلاعات پایه، ۱=دسته‌بندی، ۲=پلن) — ۳ = عبور از همه (صفحهٔ Done، هر سه complete) */
  currentStep: 0 | 1 | 2 | 3
  /** خطوط توضیحِ اطلاعات پایهٔ واردشده — وقتی موجوده، جای description پیش‌فرض step۰ (فقط عمودی) رو می‌گیره */
  basicInfoSummary?: string[]
  /** نام دسته‌بندی‌های انتخاب‌شده — وقتی موجوده، جای description پیش‌فرض step۱ (فقط عمودی) رو می‌گیره */
  categorySummary?: string[]
  /** خط توضیحِ پلن انتخابی — وقتی موجوده، جای description پیش‌فرض step۲ (فقط عمودی) رو می‌گیره */
  planSummary?: string[]
}

// ‌Steps.Indicator سپس Steps.Title/Description (ترتیب Chakra) = indicator راست‌ترین در RTL —
// طبق مختصات x فیگما (indicator x=280 > title x=0) دقیقاً همین ترتیب لازمه، بدون نیاز به reverse دستی.

export function SignupStepper({ currentStep, basicInfoSummary, categorySummary, planSummary }: SignupStepperProps) {
  return (
    <>
      {/* دسکتاپ (md+) — عمودی، با description. Steps.Root رسیپی پیش‌فرضش h=100% است که با پنل کشیده‌شده (align=stretch)
          باعث می‌شد آیتم‌ها (flex:1 0 0) به‌طور مساوی کل ارتفاع پنل رو ببلعن و separator خیلی کشیده بشه —
          اینجا h="auto" ست می‌کنیم (override رسیپی) و فضای اضافه رو یه spacer flex=1 بعدش جذب می‌کنه (مثل Spacing فیگما). */}
      <Box display={{ base: 'none', md: 'block' }} w="full" h="full">
        <Flex direction="column" h="full" w="full">
          <Steps.Root step={currentStep} count={STEPS.length} orientation="vertical" colorPalette="green" size="sm" w="full" h="auto">
            <Steps.List gap="2.5" alignItems="flex-end" w="full">
              {STEPS.map((s, i) => (
                // minH=112px = steps-size(32) + gutter*2(24) + حداقل 32px خط رابط (فرمول separator رسیپی Chakra) + 24px اضافه (به‌درخواست کاربر، فاصلهٔ بین step‌ها بیشتر) —
                // اگه description چندخطی بشه و ارتفاع محتوا از این بیشتر بشه، طول خط رابط هم به همون نسبت زیاد می‌شه.
                <Steps.Item key={i} index={i} gap="4" w="full" flex="0 0 auto" minH="112px">
                  <Steps.Indicator>
                    <Steps.Status complete={<Check size={16} />} current={toPersianDigits(i + 1)} incomplete={toPersianDigits(i + 1)} />
                  </Steps.Indicator>
                  <Box display="flex" flexDirection="column" gap="1.5" flex="1" minW="0">
                    <Steps.Title fontWeight="semibold" fontSize="sm" textAlign="right">{s.title}</Steps.Title>
                    {(() => {
                      const summary = i === 0 ? basicInfoSummary : i === 1 ? categorySummary : i === 2 ? planSummary : undefined
                      if (!summary?.length) return <Steps.Description fontSize="xs" textAlign="right">{s.description}</Steps.Description>
                      return (
                        <Box fontSize="xs" color="fg.muted">
                          {summary.map((line, idx) => {
                            const isUrl = line.startsWith('http')
                            return (
                              <Text key={idx} lineHeight="1.333" textAlign={isUrl ? 'left' : 'right'} dir={isUrl ? 'ltr' : undefined}>
                                {line}
                              </Text>
                            )
                          })}
                        </Box>
                      )
                    })()}
                  </Box>
                  <Steps.Separator minH="12" />
                </Steps.Item>
              ))}
            </Steps.List>
          </Steps.Root>
          <Box flex="1" minH="0" />
        </Flex>
      </Box>

      {/* موبایل (< md) — افقی، بدون description. هر step flex=1 (fill) با minW=120px کف —
          اگه جمع minWها از عرض باکس بیشتر بشه (نه بخاطر wrap، بخاطر minW) خودِ flex overflow می‌کنه و
          overflowX="auto" اسکرول افقی می‌ده. overflowY="hidden" که هیچ‌وقت اسکرول عمودی نخوره. */}
      <Box display={{ base: 'block', md: 'none' }} w="full" overflowX="auto" overflowY="hidden">
        <Steps.Root step={currentStep} count={STEPS.length} orientation="horizontal" colorPalette="green" size="sm" w="full">
          {/* gap=4 (16px) بین آیتم‌ها */}
          <Steps.List flexWrap="nowrap" gap="4" w="full">
            {STEPS.map((s, i) => (
              // alignItems="flex-start" = سمت راست در RTL برای ستون flex (طبق قرارداد تأیید‌شدهٔ پروژه — flex-end این‌جا چپ می‌شد)
              <Steps.Item key={i} index={i} flexDirection="column" alignItems="flex-start" gap="2" flex="1" minW="120px">
                <Flex align="center" w="full">
                  <Steps.Indicator flexShrink={0}>
                    <Steps.Status complete={<Check size={16} />} current={toPersianDigits(i + 1)} incomplete={toPersianDigits(i + 1)} />
                  </Steps.Indicator>
                  {/* minW=8 (32px) = حداقل طول خط رابط بین دو step */}
                  <Steps.Separator flex="1" minW="8" />
                </Flex>
                <Steps.Title fontWeight="semibold" fontSize="sm" textAlign="right" whiteSpace="nowrap" minW="max-content">{s.title}</Steps.Title>
              </Steps.Item>
            ))}
          </Steps.List>
        </Steps.Root>
      </Box>
    </>
  )
}
