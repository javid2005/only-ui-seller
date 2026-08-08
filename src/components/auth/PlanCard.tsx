import { Badge, Box, Button, Flex, Text } from '@chakra-ui/react'
import { Check, Dot } from 'lucide-react'
import type { BillingPeriod } from '@/services/auth'
import type { SignupPlan } from '@/components/auth/plansData'

interface PlanCardProps {
  plan: SignupPlan
  period: BillingPeriod
  selected: boolean
  onSelect: () => void
}

export function PlanCard({ plan, period, selected, onSelect }: PlanCardProps) {
  return (
    <Flex
      role="group"
      onClick={onSelect}
      direction="column"
      align="stretch"
      gap="6"
      pt="2"
      px="2"
      pb="6"
      w="full"
      minH="480px"
      borderRadius="3xl"
      bg="white"
      borderWidth="1px"
      borderColor={selected ? 'brand.focusRing' : 'border.muted'}
      _hover={!selected ? { borderColor: 'border' } : undefined}
      transition="border-color 0.15s"
      textAlign="start"
      cursor="pointer"
    >
      {/* bg کارت رنگی داخلی (Top) نه کارت بیرونی — کارت بیرونی همیشه سفید با border همیشه ۱px (فقط رنگش عوض می‌شه، طبق طرح جدید Figma) تا با toggle شدن انتخاب جابه‌جا نشه.
          minH ثابت = ارتفاع بلندترین حالت (کارت با originalPrice/خط تخفیف) — اندازه‌گیری شده از رندر واقعی، نه حدسی.
          justifyContent="space-between" بین دو گروه (عنوان+توضیح بالا / قیمت+دکمه پایین) — برای پلن‌های بدون تخفیف
          که محتوا کمتره، فاصلهٔ اضافه بین دو گروه پخش می‌شه و قیمت+دکمه به پایین کادر می‌چسبن. */}
      <Box
        position="relative"
        bg={selected ? 'brand.bg' : 'bg.subtle'}
        _groupHover={!selected ? { bg: 'bg.muted' } : undefined}
        transition="background 0.15s"
        borderRadius="2xl"
        p="4"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        minH="238px"
      >
        {plan.badge && (
          <Badge position="absolute" top="2.5" insetInlineEnd="2.5" size="sm" variant="subtle" colorPalette={plan.badge.colorPalette} borderRadius="l2">
            {plan.badge.label}
          </Badge>
        )}

        <Flex direction="column" gap="2">
          <Text fontWeight="semibold" fontSize="md" lineHeight="1.5" color="fg">
            {plan.title}
          </Text>
          <Text fontSize="xs" lineHeight="1.333" color="fg.muted" minH="12">
            {plan.description}
          </Text>
        </Flex>

        <Flex direction="column" gap="2">
          <Flex direction="column" gap="1" pt="4" minH="17">
            {plan.originalPrice && (
              <Text fontSize="xs" color="fg.subtle" textDecoration="line-through">
                {plan.originalPrice[period]} ت
              </Text>
            )}
            {/* pixel-check طرح: قیمت راست‌تره، بج تخفیف چپش — یعنی قیمت FIRST در DOM. justify="start" چون در RTL end یعنی چپ. */}
            <Flex align="center" justify="start" gap="2.5">
              <Text fontWeight="semibold" fontSize="2xl" lineHeight="1.333" color="fg">
                {plan.price[period]}
                {!plan.isFree && ' ت'}
              </Text>
              {plan.discountLabel && (
                <Badge size="sm" variant="subtle" colorPalette="red" borderRadius="l2">
                  {plan.discountLabel}
                </Badge>
              )}
            </Flex>
          </Flex>

          {/* طرح جدید Figma: دکمهٔ پیش‌فرض/هاور پرشده با gray.subtle (نه outline تیل) + رینگ inset روی هاور؛ انتخاب‌شده = brand.solid.
              چک‌مارک FIRST در DOM = راست‌ترین — طبق pixel-check طرح (button-check-zoom)، نه ترتیب خام کد Figma.
              borderWidth همیشه ۱px (شفاف در حالت غیرهاور) تا رینگ هاور باعث جابه‌جایی نشه. */}
          <Button
            variant="ghost"
            bg={selected ? 'brand.solid' : 'gray.subtle'}
            color={selected ? 'white' : 'gray.fg'}
            borderWidth="1px"
            borderColor="transparent"
            _hover={!selected ? { bg: 'gray.subtle', borderColor: 'gray.muted' } : { bg: 'brand.solid' }}
            w="full"
            onClick={onSelect}
          >
            {selected && <Check size={20} />}
            {selected ? 'انتخاب شده' : 'انتخاب پلن'}
          </Button>
        </Flex>
      </Box>

      <Flex direction="column" gap="2" px="2">
        {/* pixel-check طرح: dot چسبیده به سمت راست متن — یعنی dot FIRST در DOM */}
        {plan.features.map((feature, i) => (
          <Flex key={i} align="center" justify="start" gap="2" w="full">
            <Box color="brand.solid" flexShrink={0}>
              <Dot size={20} />
            </Box>
            <Text flex="1" minW="0" fontSize="xs" fontWeight={feature.bold ? 'bold' : 'normal'} color="fg.muted">
              {feature.text}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}
