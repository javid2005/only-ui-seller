import { Badge, Flex, IconButton, Link, Table, Text } from '@chakra-ui/react'
import { Eye, Link2 } from 'lucide-react'
import { STATUS_COLOR, TYPE_COLOR, type Order } from './data'

interface OrderTableProps {
  orders: Order[]
}

/**
 * جدول سفارشات — desktop (Figma node 1923:21949). RTL DOM order (اولین cell = راست‌ترین،
 * تأیید شده با اندازه‌گیری هدر ردیف روی screenshot طرح، نه خروجی کد فیگما):
 * شماره/نوع → تاریخ → مشتری → مبلغ کل → روش ارسال → وضعیت → اکشن (چپ‌ترین)
 * سطرهای زوج/فرد رنگ متناوب (bg.subtle) — پیش‌فرض پروژه.
 */
export function OrderTable({ orders }: OrderTableProps) {
  return (
    <Table.ScrollArea overflowX="auto" borderWidth="0">
      <Table.Root size="md" minW="900px">
        <Table.Header>
          <Table.Row bg="bg.subtle">
            {/* شماره/نوع سفارش — FIRST = rightmost */}
            <Table.ColumnHeader w="200px" textAlign="start">شماره/نوع سفارش</Table.ColumnHeader>
            <Table.ColumnHeader w="140px">تاریخ</Table.ColumnHeader>
            <Table.ColumnHeader w="200px">مشتری</Table.ColumnHeader>
            <Table.ColumnHeader w="200px">مبلغ کل</Table.ColumnHeader>
            <Table.ColumnHeader w="160px">روش ارسال</Table.ColumnHeader>
            <Table.ColumnHeader w="160px">وضعیت</Table.ColumnHeader>
            {/* اکشن — LAST = leftmost */}
            <Table.ColumnHeader w="120px" />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {orders.map((o, i) => (
            <Table.Row
              key={o.id}
              h="20"
              bg={i % 2 === 1 ? 'bg.subtle' : 'bg'}
              _hover={{ bg: 'bg.muted' }}
              transition="background 0.15s"
            >
              {/* شماره/نوع سفارش — orderNo (brand.fg لینک) + type badge */}
              <Table.Cell>
                <Flex direction="column" gap="1" align="start">
                  <Link href="#" fontSize="sm" fontWeight="semibold" color="brand.fg">
                    {o.orderNo}
                  </Link>
                  <Badge size="xs" colorPalette={TYPE_COLOR[o.type]} variant="subtle">
                    {o.type}
                  </Badge>
                </Flex>
              </Table.Cell>

              {/* تاریخ */}
              <Table.Cell>
                <Text fontSize="sm" color="fg.muted">{o.date}</Text>
              </Table.Cell>

              {/* مشتری — نام + تلفن */}
              <Table.Cell>
                <Flex direction="column" gap="0.5" minW="0">
                  <Text fontSize="sm" fontWeight="medium" lineClamp={1}>{o.customer}</Text>
                  <Text fontSize="xs" color="fg.muted">{o.phone}</Text>
                </Flex>
              </Table.Cell>

              {/* مبلغ کل — قیمت FIRST=راست، badge دلاری بعدش=چپ */}
              <Table.Cell>
                <Flex align="center" gap="2">
                  <Text fontSize="sm" fontWeight="semibold">{o.amount}</Text>
                  {o.amountBadge && (
                    <Badge size="xs" colorPalette="gray" variant="subtle">{o.amountBadge}</Badge>
                  )}
                </Flex>
              </Table.Cell>

              {/* روش ارسال */}
              <Table.Cell>
                <Text fontSize="sm" color="fg.muted">{o.shipping}</Text>
              </Table.Cell>

              {/* وضعیت — badge رنگی */}
              <Table.Cell>
                <Badge size="sm" colorPalette={STATUS_COLOR[o.status]} variant="subtle">
                  {o.status}
                </Badge>
              </Table.Cell>

              {/* اکشن — کپی لینک FIRST=راستِ جفت، مشاهده(eye) بعدش=چپِ جفت (تأیید با
                  screenshot مجزای Figma روی همین دو دکمه — چون کل ستون full-height بود
                  و باگ جهت داخلش با نگاه به کل صفحه دیده نمی‌شد) */}
              <Table.Cell>
                {/* justify="end" چون RTL: start=راست، end=چپ — ستون آخر لبهٔ چپ جدوله،
                    آیکون‌ها باید به همون لبه بچسبن (auto table-layout این ستون رو
                    گاهی از محتوا پهن‌تر می‌کنه) */}
                <Flex gap="2" align="center" justify="end">
                  <IconButton
                    aria-label="کپی لینک" size="sm"
                    variant="outline" color="fg.muted"
                  >
                    <Link2 size={18} />
                  </IconButton>
                  <IconButton
                    aria-label="مشاهده سفارش" size="sm"
                    variant="outline" color="fg.muted"
                  >
                    <Eye size={18} />
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
