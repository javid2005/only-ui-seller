import { Badge, Flex, IconButton, Table, Text } from '@chakra-ui/react'
import { Pencil, Trash2 } from 'lucide-react'
import { CAMPAIGN_STATUS_COLOR, CAMPAIGN_TYPE_COLOR, type Campaign } from './data'

interface CampaignTableProps {
  campaigns: Campaign[]
  onDelete: (id: string) => void
}

/**
 * جدول کمپین‌ها — desktop. RTL DOM order (اولین ستون = راست‌ترین):
 * نام کمپین(+نوع) → تاریخ شروع → تاریخ پایان → وضعیت → عملیات (چپ‌ترین)
 * رنگ متناوب سطر (striped) — طبق قرارداد پروژه (مثل لیست محصولات/سفارشات)، نه طرح فیگما.
 */
export function CampaignTable({ campaigns, onDelete }: CampaignTableProps) {
  return (
    <Table.ScrollArea overflowX="auto" borderWidth="1px" borderColor="border" rounded="lg" w="full">
      <Table.Root size="md" minW="640px">
        <Table.Header>
          <Table.Row bg="bg.muted">
            {/* نام کمپین — FIRST = rightmost */}
            <Table.ColumnHeader minW="0" textAlign="start">نام کمپین</Table.ColumnHeader>
            <Table.ColumnHeader minW="130px">تاریخ شروع</Table.ColumnHeader>
            <Table.ColumnHeader minW="130px">تاریخ پایان</Table.ColumnHeader>
            <Table.ColumnHeader minW="130px">وضعیت</Table.ColumnHeader>
            {/* عملیات — LAST = leftmost */}
            <Table.ColumnHeader w="112px" />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {campaigns.map((c, i) => (
            <Table.Row key={c.id} h="20" bg={i % 2 === 1 ? 'bg.subtle' : 'bg'} borderBottomWidth="1px" borderColor="border">
              {/* نام کمپین — عنوان + badge نوع */}
              <Table.Cell>
                <Flex direction="column" gap="1" align="start">
                  <Text fontSize="sm" fontWeight="semibold" color="fg">{c.name}</Text>
                  <Badge size="xs" colorPalette={CAMPAIGN_TYPE_COLOR[c.type]} variant="subtle">{c.type}</Badge>
                </Flex>
              </Table.Cell>

              <Table.Cell><Text fontSize="sm" color="fg">{c.startDate}</Text></Table.Cell>
              <Table.Cell><Text fontSize="sm" color="fg">{c.endDate}</Text></Table.Cell>

              {/* وضعیت */}
              <Table.Cell>
                <Badge size="sm" colorPalette={CAMPAIGN_STATUS_COLOR[c.status]} variant="subtle">
                  {c.status}
                </Badge>
              </Table.Cell>

              {/* عملیات — ویرایش (fg.muted) + حذف (red)، bg gray.subtle/red.subtle.
                  justify="end" چون RTL: start=راست، end=چپ — ستون آخر لبهٔ چپ جدوله،
                  آیکون‌ها باید به همون لبه بچسبن (قبلاً start بود، اشتباه) */}
              <Table.Cell>
                <Flex gap="2" justify="end">
                  <IconButton
                    aria-label="ویرایش کمپین" size="sm"
                    variant="outline" color="fg.muted"
                  >
                    <Pencil size={18} />
                  </IconButton>
                  <IconButton
                    aria-label="حذف کمپین" size="sm"
                    variant="outline" colorPalette="red"
                    onClick={() => onDelete(c.id)}
                  >
                    <Trash2 size={18} />
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
