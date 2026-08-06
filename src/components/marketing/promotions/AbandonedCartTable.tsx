import { Avatar, Badge, HStack, IconButton, Stack, Table, Text } from '@chakra-ui/react'
import { Eye } from 'lucide-react'
import { toPersianDigits } from '@/utils/numbers'
import { STATUS_COLOR, type AbandonedCart } from './abandonedCartsData'

interface AbandonedCartTableProps {
  carts: AbandonedCart[]
  onView?: (id: string) => void
}

/**
 * جدول سبدهای خرید رها شده — desktop. Figma: node 2746:63227 (Abandoned-Cart / List)
 * ستون‌ها/ترتیب بر اساس اسکرین‌شات به‌روزِ کاربر + re-fetch از Figma (نسخه‌ی جدیدتر از
 * fetch اولیه — «تاریخ ایجاد» ستون تازه است، «مشتری»→«ایجاد کننده»، «تعداد کالا در سبد»→«تعداد اقلام»، «مبلغ کل»→«جمع کل»)
 * RTL DOM order (اولین ستون = راست‌ترین، طبق x نزولی):
 * شناسه(x=876) → تاریخ ایجاد(x=736) → ایجاد کننده(x=492) → تعداد اقلام(x=352) → جمع کل(x=212) → وضعیت(x=72) → عملیات(x=0، چپ‌ترین)
 * بدون رنگ متناوب سطر — طبق طرح فیگما همه‌ی ردیف‌ها سفیدند، فقط header با bg.muted.
 */
export function AbandonedCartTable({ carts, onView }: AbandonedCartTableProps) {
  return (
    <Table.ScrollArea overflowX="auto" borderWidth="1px" borderColor="border" rounded="lg" w="full">
      <Table.Root size="md" minW="960px">
        <Table.Header>
          <Table.Row bg="bg.muted">
            {/* شناسه — FIRST = rightmost */}
            <Table.ColumnHeader w="84px" textAlign="start">شناسه</Table.ColumnHeader>
            <Table.ColumnHeader w="140px">تاریخ ایجاد</Table.ColumnHeader>
            <Table.ColumnHeader minW="244px" textAlign="start">ایجاد کننده</Table.ColumnHeader>
            <Table.ColumnHeader w="140px">تعداد اقلام</Table.ColumnHeader>
            <Table.ColumnHeader w="140px">جمع کل</Table.ColumnHeader>
            <Table.ColumnHeader w="140px">وضعیت</Table.ColumnHeader>
            {/* عملیات — LAST = leftmost */}
            <Table.ColumnHeader w="72px" />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {carts.map((cart) => (
            <Table.Row key={cart.id} h="20" borderBottomWidth="1px" borderColor="border">
              {/* شناسه */}
              <Table.Cell>
                <Text fontSize="sm" fontWeight="semibold" color="fg.subtle">{cart.id}</Text>
              </Table.Cell>

              {/* تاریخ ایجاد */}
              <Table.Cell>
                <Text fontSize="sm" color="fg.muted">{cart.createdDate}</Text>
              </Table.Cell>

              {/* ایجاد کننده — الگوی رسمی Persona (Chakra docs: Avatar#persona)، Avatar(راست) → نام/شماره(چپ) */}
              <Table.Cell>
                <HStack w="full" gap="4" justify="flex-start">
                  <Avatar.Root size="md" bg="brand.solid" color="brand.contrast" flexShrink={0}>
                    <Avatar.Fallback name={cart.customerName} />
                  </Avatar.Root>
                  <Stack gap="1" align="flex-start" minW="0">
                    <Text fontSize="sm" fontWeight="semibold" color="fg">{cart.customerName}</Text>
                    <Text fontSize="xs" color="fg.muted">{cart.customerPhone}</Text>
                  </Stack>
                </HStack>
              </Table.Cell>

              {/* تعداد اقلام */}
              <Table.Cell>
                <Text fontSize="sm" color="fg">{toPersianDigits(cart.itemsCount)}</Text>
              </Table.Cell>

              {/* جمع کل */}
              <Table.Cell>
                <Text fontSize="sm" fontWeight="semibold" color="fg">{toPersianDigits(cart.totalAmount)}</Text>
              </Table.Cell>

              {/* وضعیت */}
              <Table.Cell>
                <Badge size="sm" colorPalette={STATUS_COLOR[cart.status]} variant="subtle">
                  {cart.status}
                </Badge>
              </Table.Cell>

              {/* عملیات — مشاهده (eye)، bg gray.subtle */}
              <Table.Cell>
                <IconButton
                  aria-label="مشاهده سبد" size="sm"
                  bg="gray.subtle" color="fg.muted" _hover={{ bg: 'gray.muted' }}
                  onClick={() => onView?.(cart.id)}
                >
                  <Eye size={18} />
                </IconButton>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  )
}
