'use client'

import { Box, Flex, Text } from '@chakra-ui/react'
import { Plus } from 'lucide-react'
import { Header, HeaderCTA } from '@/components/layout/Header'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { DISCOUNT_CODES } from '@/components/marketing/promotions/discountCodesData'
import { DiscountCodesTable } from '@/components/marketing/promotions/DiscountCodesTable'
import { DiscountCodeCard } from '@/components/marketing/promotions/DiscountCodeCard'

/**
 * صفحه «کدهای تخفیف» — Figma «Discount / List»، قالب One Column Fill.
 * دسکتاپ: node 2659:81934 · موبایل/ریسپانسیو: node 3033:64241 · کارت لوکال: instance 3122:71946
 */
export function DiscountCodes() {
  const isCompact = useCompactMode()

  return (
    <Flex direction="column" gap="4" alignItems="end" w="full">
      <Header
        title="کدهای تخفیف"
        breadcrumbs={[
          { label: 'داشبورد', href: '/' },
          { label: 'پروموشن ها', href: '/promotions/ads' },
          { label: 'کدهای تخفیف' },
        ]}
        cta={<HeaderCTA label="افزودن کد تخفیف" icon={<Plus size={16} />} />}
      />

      <Box
        bg="bg.panel" borderWidth="1px" borderColor="border" rounded="2xl"
        p={isCompact ? '4' : { base: '4', sm: '6' }} w="full"
      >
        {DISCOUNT_CODES.length === 0 ? (
          <Flex w="full" py="10" justify="center">
            <Text fontSize="sm" color="fg.muted">کد تخفیفی برای نمایش وجود ندارد</Text>
          </Flex>
        ) : (
          <>
            <Box display={{ base: 'none', md: isCompact ? 'none' : 'block' }} w="full">
              <DiscountCodesTable items={DISCOUNT_CODES} />
            </Box>
            <Flex display={{ base: 'flex', md: isCompact ? 'flex' : 'none' }} direction="column" gap="4" w="full">
              {DISCOUNT_CODES.map((item) => (
                <DiscountCodeCard key={item.id} item={item} />
              ))}
            </Flex>
          </>
        )}
      </Box>
    </Flex>
  )
}
