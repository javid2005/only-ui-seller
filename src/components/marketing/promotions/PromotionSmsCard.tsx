import { Badge, Box, Flex, Separator, Text } from '@chakra-ui/react'
import { BULK_SMS_STATUS_COLOR, BULK_SMS_STATUS_LABEL, type BulkSmsHistoryItem } from './bulkSmsData'
import { BulkSmsRowActionsMenu } from './BulkSmsRowActionsMenu'

interface PromotionSmsCardProps {
  item: BulkSmsHistoryItem
}

/**
 * کارت موبایل تاریخچه ارسال — Figma «Promotion-Sms-Card» (node 3126:79000، state Default/Hover).
 * RTL DOM order (با screenshot تأیید شده، نه ترتیب خام JSX که LTR canvas است):
 *  Content → بج وضعیت (راست‌ترین در canvas) FIRST ← دکمه سه‌نقطه (چپ‌ترین) SECOND
 *  Row     → تاریخ شروع (راست‌ترین) FIRST ← تعداد نفرات ← مخاطبان (چپ‌ترین) LAST
 */
export function PromotionSmsCard({ item }: PromotionSmsCardProps) {
  return (
    <Box
      borderWidth="1px"
      borderColor="border"
      rounded="lg"
      overflow="hidden"
      w="full"
      bg="bg.panel"
      _hover={{ borderColor: 'brand.focusRing' }}
    >
      {/* justify="space-between" — بج (اولین DOM child) به لبه راست، دکمه سه‌نقطه به لبه چپ کارت */}
      <Flex align="center" justify="space-between" gap="2" px="4" py="2">
        <Badge colorPalette={BULK_SMS_STATUS_COLOR[item.status]} variant="subtle" size="sm">
          {BULK_SMS_STATUS_LABEL[item.status]}
        </Badge>
        <BulkSmsRowActionsMenu item={item} size="sm" />
      </Flex>

      <Text fontSize="sm" fontWeight="semibold" color="fg" textAlign="start" px="4" pb="4">
        {item.message}
      </Text>

      <Flex align="center" bg="bg.subtle" borderWidth="1px" borderColor="border.muted" borderBottomRadius="md" py="2">
        <Flex flex="1" direction="column" align="center" gap="2" p="2">
          <Text fontSize="xs" fontWeight="medium" color="fg.muted">تاریخ شروع</Text>
          <Text fontSize="sm" fontWeight="normal" color="fg">{item.startDate}</Text>
        </Flex>
        <Separator orientation="vertical" h="6" />
        <Flex flex="1" direction="column" align="center" gap="2" p="2">
          <Text fontSize="xs" fontWeight="medium" color="fg.muted">تعداد نفرات</Text>
          <Text fontSize="sm" fontWeight="normal" color="fg">{item.recipientCount}</Text>
        </Flex>
        <Separator orientation="vertical" h="6" />
        <Flex flex="1" direction="column" align="center" gap="2" p="2">
          <Text fontSize="xs" fontWeight="medium" color="fg.muted">مخاطبان</Text>
          <Text fontSize="sm" fontWeight="normal" color="fg">{item.audience}</Text>
        </Flex>
      </Flex>
    </Box>
  )
}
