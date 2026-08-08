import { Badge, Box, Flex, IconButton, Menu, Portal, Separator, Text } from '@chakra-ui/react'
import { MoreVertical } from 'lucide-react'
import { CAMPAIGN_STATUS_COLOR, CAMPAIGN_TYPE_COLOR, type Campaign } from './data'

interface CampaignCardProps {
  campaign: Campaign
  onDelete: (id: string) => void
}

/**
 * کارت کمپین — معادل ردیف جدول در حالت موبایل/کامپکت (Figma: Campaign-Card, node 3033:78334).
 * RTL DOM order:
 *  header  → عنوان+badge نوع (FIRST=راست، flex) → منوی ⋮ (LAST=چپ)
 *  footer  → تاریخ شروع (FIRST=راست) → تاریخ پایان (وسط) → وضعیت (LAST=چپ)
 * ترتیب footer برعکسِ خروجی خام Figma (LTR) است چون راست‌ترین ستون طرح = تاریخ شروع.
 */
export function CampaignCard({ campaign: c, onDelete }: CampaignCardProps) {
  return (
    <Box borderWidth="1px" borderColor="border" rounded="lg" overflow="hidden" bg="bg.panel" w="full">
      {/* header — عنوان+badge (راست، flex) ← منوی عملیات (چپ) */}
      <Flex justify="space-between" align="center" gap="2" px="4" pt="4" pb="4">
        <Flex flex="1" minW="0" gap="2" wrap="wrap" justify="start">
          <Text fontSize="sm" fontWeight="semibold" color="fg" textAlign="start">{c.name}</Text>
          <Badge size="xs" colorPalette={CAMPAIGN_TYPE_COLOR[c.type]} variant="subtle">{c.type}</Badge>
        </Flex>

        <Menu.Root positioning={{ placement: 'bottom-end' }}>
          <Menu.Trigger asChild>
            <IconButton variant="ghost" size="sm" aria-label="عملیات کمپین" color="fg.muted" flexShrink={0}>
              <MoreVertical size={20} />
            </IconButton>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner dir="rtl">
              <Menu.Content minW="160px" p="1">
                <Menu.Item value="edit">
                  <Text fontSize="sm" w="full" textAlign="start" color="fg">ویرایش</Text>
                </Menu.Item>
                <Menu.Item value="delete" _hover={{ bg: 'red.subtle' }} onClick={() => onDelete(c.id)}>
                  <Text fontSize="sm" w="full" textAlign="start" color="fg.error">حذف</Text>
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Flex>

      {/* footer — تاریخ شروع (راست) · تاریخ پایان (وسط) · وضعیت (چپ) */}
      <Flex borderTopWidth="1px" borderColor="border" bg="bg.subtle" align="center" py="2">
        <Flex flex="1" direction="column" gap="2" align="center" p="2">
          <Text fontSize="xs" fontWeight="medium" color="fg.muted">تاریخ شروع</Text>
          <Text fontSize="sm" fontWeight="semibold" color="fg">{c.startDate}</Text>
        </Flex>
        <Separator orientation="vertical" h="6" />
        <Flex flex="1" direction="column" gap="2" align="center" p="2">
          <Text fontSize="xs" fontWeight="medium" color="fg.muted">تاریخ پایان</Text>
          <Text fontSize="sm" fontWeight="semibold" color="fg">{c.endDate}</Text>
        </Flex>
        <Separator orientation="vertical" h="6" />
        <Flex flex="1" direction="column" gap="2" align="center" p="2">
          <Text fontSize="xs" fontWeight="medium" color="fg.muted">وضعیت</Text>
          <Badge size="sm" colorPalette={CAMPAIGN_STATUS_COLOR[c.status]} variant="subtle">{c.status}</Badge>
        </Flex>
      </Flex>
    </Box>
  )
}
