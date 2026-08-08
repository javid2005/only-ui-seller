import { Badge, Flex, IconButton, Progress, Table, Text } from '@chakra-ui/react'
import { Copy, Pencil, Trash2 } from 'lucide-react'
import { toaster } from '@/components/ui/toaster'
import { toPersianDigits } from '@/utils/numbers'
import {
  DISCOUNT_STATUS_COLOR,
  DISCOUNT_STATUS_LABEL,
  DISCOUNT_TYPE_COLOR,
  DISCOUNT_TYPE_LABEL,
  usageProgressColor,
  type DiscountCodeItem,
} from './discountCodesData'

interface DiscountCodesTableProps {
  items: DiscountCodeItem[]
}

function handleCopyCode(code: string) {
  navigator.clipboard?.writeText(code)
  toaster.create({ id: `copy-discount-code-${code}`, title: 'کد کپی شد', type: 'success', duration: 2000 })
}

/**
 * جدول کدهای تخفیف — desktop. Figma «Discount / List» Table (node 2659:81942).
 * RTL DOM order (با x مختصات Figma + screenshot تأیید شده — نه ترتیب خام export که LTR canvas است):
 * عنوان/نوع(راست‌ترین) → کد تخفیف → مقدار تخفیف → استفاده شده → تاریخ شروع → تاریخ پایان → وضعیت → عملیات(چپ‌ترین).
 * داخل ستون عملیات: ویرایش(راست‌ترین این ستون) → حذف(چپ‌ترین) — طبق x مختصات export (pencil x=56 > trash x=0).
 * بدون رنگ متناوب سطر — طبق طرح فیگما (فقط border-b + header با bg.muted).
 */
export function DiscountCodesTable({ items }: DiscountCodesTableProps) {
  return (
    <Table.ScrollArea overflowX="auto" borderWidth="1px" borderColor="border" rounded="lg" w="full">
      <Table.Root size="md" minW="1040px">
        <Table.Header>
          <Table.Row bg="bg.muted">
            <Table.ColumnHeader minW="0" textAlign="start">عنوان / نوع</Table.ColumnHeader>
            <Table.ColumnHeader w="150px" textAlign="start">کد تخفیف</Table.ColumnHeader>
            <Table.ColumnHeader w="150px" textAlign="start">مقدار تخفیف</Table.ColumnHeader>
            <Table.ColumnHeader w="150px" textAlign="start">استفاده شده</Table.ColumnHeader>
            <Table.ColumnHeader w="110px">تاریخ شروع</Table.ColumnHeader>
            <Table.ColumnHeader w="110px">تاریخ پایان</Table.ColumnHeader>
            <Table.ColumnHeader w="100px">وضعیت</Table.ColumnHeader>
            <Table.ColumnHeader w="100px" />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {items.map((item) => (
            <Table.Row key={item.id} h="20" borderBottomWidth="1px" borderColor="border">
              <Table.Cell>
                <Flex direction="column" gap="1" align="flex-end">
                  <Text fontSize="sm" fontWeight="semibold" color="fg">{item.title}</Text>
                  <Badge size="xs" colorPalette={DISCOUNT_TYPE_COLOR[item.type]} variant="subtle">
                    {DISCOUNT_TYPE_LABEL[item.type]}
                  </Badge>
                </Flex>
              </Table.Cell>

              <Table.Cell>
                <Flex align="center" gap="2" justify="flex-end">
                  <Text fontSize="sm" color="fg">{item.code}</Text>
                  <IconButton
                    aria-label={`کپی کد ${item.code}`} variant="ghost" size="2xs" color="fg.muted"
                    onClick={() => handleCopyCode(item.code)}
                  >
                    <Copy size={14} />
                  </IconButton>
                </Flex>
              </Table.Cell>

              <Table.Cell>
                {item.type === 'percentage' ? (
                  <Flex direction="column" gap="1" align="flex-end">
                    <Badge size="xs" colorPalette="orange" variant="solid">{item.amountValue}</Badge>
                    <Text fontSize="xs" color="fg.muted">{item.amountCap}</Text>
                  </Flex>
                ) : (
                  <Text fontSize="sm" color="fg">{item.amountValue}</Text>
                )}
              </Table.Cell>

              <Table.Cell>
                {item.usage.limit === null ? (
                  <Text fontSize="sm" color="fg">{toPersianDigits(item.usage.used)}</Text>
                ) : (
                  <Flex direction="column" gap="2" align="flex-end" w="full">
                    <Text fontSize="sm" color="fg">
                      {toPersianDigits(item.usage.limit)} / {toPersianDigits(item.usage.used)}
                    </Text>
                    <Progress.Root
                      value={(item.usage.used / item.usage.limit) * 100}
                      size="xs" shape="full" colorPalette={usageProgressColor(item.status)} w="full"
                    >
                      <Progress.Track>
                        <Progress.Range />
                      </Progress.Track>
                    </Progress.Root>
                  </Flex>
                )}
              </Table.Cell>

              <Table.Cell><Text fontSize="sm" color="fg">{item.startDate ?? '-'}</Text></Table.Cell>
              <Table.Cell><Text fontSize="sm" color="fg">{item.endDate ?? '-'}</Text></Table.Cell>

              <Table.Cell>
                <Badge size="sm" colorPalette={DISCOUNT_STATUS_COLOR[item.status]} variant="subtle">
                  {DISCOUNT_STATUS_LABEL[item.status]}
                </Badge>
              </Table.Cell>

              <Table.Cell>
                {/* justify="flex-end" چون RTL: flex-start=راست، flex-end=چپ — می‌خواهیم آیکون‌ها به لبه چپ ستون بچسبند */}
                <Flex gap="2" justify="flex-end">
                  <IconButton
                    aria-label={`ویرایش ${item.title}`} size="sm"
                    bg="gray.subtle" color="fg.muted" _hover={{ bg: 'gray.muted' }}
                  >
                    <Pencil size={18} />
                  </IconButton>
                  <IconButton
                    aria-label={`حذف ${item.title}`} size="sm"
                    bg="red.subtle" color="red.fg" _hover={{ bg: 'red.muted' }}
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
