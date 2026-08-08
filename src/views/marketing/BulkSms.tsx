'use client'

import { useState } from 'react'
import { Badge, Box, Flex, SegmentGroup, Stat, Text } from '@chakra-ui/react'
import { ArrowUp, Send } from 'lucide-react'
import { Header, HeaderCTA } from '@/components/layout/Header'
import { TitleBar } from '@/components/ui/TitleBar'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { BULK_SMS_HISTORY, BULK_SMS_STATS, type BulkSmsStat } from '@/components/marketing/promotions/bulkSmsData'
import { BulkSmsHistoryTable } from '@/components/marketing/promotions/BulkSmsHistoryTable'
import { PromotionSmsCard } from '@/components/marketing/promotions/PromotionSmsCard'

type SendTab = 'current' | 'archived'

function SmsStatCard({ stat }: { stat: BulkSmsStat }) {
  return (
    <Stat.Root
      flex="1 0 0" minW="200px"
      bg="bg.panel" borderWidth="1px" borderColor="border" rounded="md" p="4" gap="2"
    >
      <Stat.Label color="fg.muted" fontSize="sm">{stat.label}</Stat.Label>
      <Flex align="center" gap="3">
        {/* RTL: مقدار (راست‌ترین در Figma) FIRST ← بج روند (چپ‌تر) SECOND */}
        <Stat.ValueText fontSize="2xl" fontWeight="normal" letterSpacing="tight">
          {stat.value}
        </Stat.ValueText>
        {stat.trend && (
          <Badge colorPalette="green" variant="subtle" size="xs" display="inline-flex" alignItems="center" gap="1">
            {/* داخل بج: آیکون (راست‌ترین) FIRST ← عدد درصد SECOND — طبق screenshot */}
            <ArrowUp size={12} />
            {stat.trend}
          </Badge>
        )}
      </Flex>
    </Stat.Root>
  )
}

/**
 * صفحه «ارسال پیامک انبوه» — Figma «Promotion / Bulk-Sms»
 * دسکتاپ: node 2729:42803 · موبایل/ریسپانسیو: node 3033:66157 · کارت لوکال: node 3126:79000
 *
 * RTL DOM order (با screenshot تأیید شده، نه ترتیب خام JSX که LTR canvas است):
 *  Stats row  → کل مشتریان(راست‌ترین) FIRST ← پیامک ارسالی این ماه ← نرخ تحویل(چپ‌ترین) LAST
 *  SegmentGroup → ارسال های جاری(راست‌ترین/selected) FIRST ← آرشیو شده(چپ‌ترین) LAST
 */
export function BulkSms() {
  const isCompact = useCompactMode()
  const [tab, setTab] = useState<SendTab>('current')

  const filtered = BULK_SMS_HISTORY.filter((item) => (tab === 'archived' ? item.archived : !item.archived))

  return (
    <Flex direction="column" gap="4" alignItems="end" w="full">
      <Header
        title="ارسال پیامک انبوه"
        breadcrumbs={[
          { label: 'داشبورد', href: '/' },
          { label: 'پروموشن ها', href: '/promotions/ads' },
          { label: 'ارسال پیامک انبوه' },
        ]}
        cta={<HeaderCTA label="ارسال پیامک جدید" icon={<Send size={16} />} />}
      />

      <Box
        bg="bg.panel" borderWidth="1px" borderColor="border" rounded="2xl"
        p={{ base: '4', md: isCompact ? '4' : '6' }} w="full"
      >
        <Flex direction="column" gap="10" alignItems="center" maxW="960px" w="full" mx="auto">

          {/* نمای کلی */}
          <Flex direction="column" gap="6" alignItems="end" w="full">
            <TitleBar
              title="نمای کلی"
              subtitle="ارسال پیامک تبلیغاتی، اطلاع‌رسانی یا کد تخفیف به مشتریان فروشگاه"
              size="xl"
              divider
            />
            <Flex gap="4" w="full" flexWrap="wrap">
              {[...BULK_SMS_STATS].reverse().map((stat) => (
                <SmsStatCard key={stat.label} stat={stat} />
              ))}
            </Flex>
          </Flex>

          {/* تاریخچه ارسال ها */}
          <Flex direction="column" gap="6" alignItems="end" w="full">
            <TitleBar title="تاریخچه ارسال ها" size="xl" divider />

            <SegmentGroup.Root
              value={tab}
              onValueChange={(e) => setTab((e.value ?? 'current') as SendTab)}
              w="full"
              size="md"
            >
              <SegmentGroup.Indicator bg="bg.panel" />
              <SegmentGroup.Item value="current" flex="1" justifyContent="center">
                <SegmentGroup.ItemText>ارسال های جاری</SegmentGroup.ItemText>
                <SegmentGroup.ItemHiddenInput />
              </SegmentGroup.Item>
              <SegmentGroup.Item value="archived" flex="1" justifyContent="center">
                <SegmentGroup.ItemText>آرشیو شده</SegmentGroup.ItemText>
                <SegmentGroup.ItemHiddenInput />
              </SegmentGroup.Item>
            </SegmentGroup.Root>

            {filtered.length === 0 ? (
              <Flex w="full" py="10" justify="center">
                <Text fontSize="sm" color="fg.muted">موردی برای نمایش وجود ندارد</Text>
              </Flex>
            ) : (
              <>
                <Box display={{ base: 'none', md: isCompact ? 'none' : 'block' }} w="full">
                  <BulkSmsHistoryTable items={filtered} />
                </Box>
                <Flex display={{ base: 'flex', md: isCompact ? 'flex' : 'none' }} direction="column" gap="4" w="full">
                  {filtered.map((item) => (
                    <PromotionSmsCard key={item.id} item={item} />
                  ))}
                </Flex>
              </>
            )}
          </Flex>

        </Flex>
      </Box>
    </Flex>
  )
}
