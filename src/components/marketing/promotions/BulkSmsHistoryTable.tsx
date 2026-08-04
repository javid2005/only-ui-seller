import { Badge, Flex, IconButton, Table, Text } from '@chakra-ui/react'
import { Archive, Pencil, RefreshCcw } from 'lucide-react'
import { BULK_SMS_STATUS_COLOR, BULK_SMS_STATUS_LABEL, type BulkSmsHistoryItem } from './bulkSmsData'

interface BulkSmsHistoryTableProps {
  items: BulkSmsHistoryItem[]
}

/**
 * جدول تاریخچه ارسال — desktop. Figma «Table» (node 2732:43899).
 * RTL DOM order (با screenshot تأیید شده — نه ترتیب خام JSX که LTR canvas است):
 * تاریخ شروع(راست‌ترین) → متن پیامک → مخاطبان → تعداد نفرات → وضعیت → عملیات(چپ‌ترین).
 * داخل ستون عملیات هم به همین ترتیب: ارسال‌مجدد(راست‌ترین این ستون) → ویرایش → آرشیو(چپ‌ترین).
 * بدون رنگ متناوب سطر — طبق طرح فیگما (فقط border-b + header با bg.muted).
 */
export function BulkSmsHistoryTable({ items }: BulkSmsHistoryTableProps) {
  return (
    <Table.ScrollArea overflowX="auto" borderWidth="1px" borderColor="border" rounded="lg" w="full">
      <Table.Root size="md" minW="720px">
        <Table.Header>
          <Table.Row bg="bg.muted">
            <Table.ColumnHeader w="130px" textAlign="start">تاریخ شروع</Table.ColumnHeader>
            <Table.ColumnHeader minW="0" textAlign="start">متن پیامک</Table.ColumnHeader>
            <Table.ColumnHeader w="120px">مخاطبان</Table.ColumnHeader>
            <Table.ColumnHeader w="120px">تعداد نفرات</Table.ColumnHeader>
            <Table.ColumnHeader w="120px">وضعیت</Table.ColumnHeader>
            <Table.ColumnHeader w="130px" />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {items.map((item) => (
            <Table.Row key={item.id} h="20" borderBottomWidth="1px" borderColor="border">
              <Table.Cell>
                <Text fontSize="sm" color="fg">{item.startDate}</Text>
              </Table.Cell>

              <Table.Cell>
                <Text fontSize="sm" fontWeight="semibold" color="fg">{item.message}</Text>
              </Table.Cell>

              <Table.Cell>
                <Text fontSize="sm" color="fg">{item.audience}</Text>
              </Table.Cell>

              <Table.Cell>
                <Text fontSize="sm" color="fg">{item.recipientCount}</Text>
              </Table.Cell>

              <Table.Cell>
                <Badge size="sm" colorPalette={BULK_SMS_STATUS_COLOR[item.status]} variant="subtle">
                  {BULK_SMS_STATUS_LABEL[item.status]}
                </Badge>
              </Table.Cell>

              <Table.Cell>
                {/* justify="flex-end" چون RTL: flex-start=راست، flex-end=چپ — می‌خواهیم آیکون‌ها به لبه چپ ستون بچسبند */}
                <Flex gap="2" justify="flex-end">
                  {item.status === 'sent' && (
                    <IconButton
                      aria-label="ارسال مجدد" size="sm"
                      bg="gray.subtle" color="fg.muted" _hover={{ bg: 'gray.muted' }}
                    >
                      <RefreshCcw size={18} />
                    </IconButton>
                  )}
                  <IconButton
                    aria-label="ویرایش" size="sm"
                    bg="gray.subtle" color="fg.muted" _hover={{ bg: 'gray.muted' }}
                  >
                    <Pencil size={18} />
                  </IconButton>
                  <IconButton
                    aria-label="آرشیو" size="sm"
                    bg="orange.subtle" color="orange.fg" _hover={{ bg: 'orange.muted' }}
                  >
                    <Archive size={18} />
                  </IconButton>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  )
}
