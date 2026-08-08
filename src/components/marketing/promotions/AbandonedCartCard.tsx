import { Avatar, Badge, Box, Flex, IconButton, Separator, Text } from '@chakra-ui/react'
import { Eye } from 'lucide-react'
import { toPersianDigits } from '@/utils/numbers'
import { STATUS_COLOR, type AbandonedCart } from './abandonedCartsData'

interface AbandonedCartCardProps {
  cart: AbandonedCart
  onView?: (id: string) => void
}

/**
 * کارت سبد رها شده — موبایل/ریسپانسیو. Figma: node 3126:80768 (Abandoned-Cart-Card)
 * لیبل فیلد وضعیت در فیگما «مخاطبان» بود ولی مقدارش بج وضعیت است و در جدول دسکتاپ همین
 * فیلد «وضعیت» نام‌گذاری شده — طبق تأیید کاربر همینجا هم «وضعیت» استفاده شد (هماهنگ با دسکتاپ).
 *
 * RTL DOM order — طبق re-fetch جدید از instance واقعی (node 3126:80977):
 *  Header row → شناسه(راست‌ترین) FIRST ← «|» ← تاریخ ایجاد ← دکمه مشاهده(چپ‌ترین) LAST
 *  Avatar row → Avatar(راست‌ترین) FIRST ← نام/شماره(چپ‌ترین) SECOND — طبق قرارداد پروژه (CustomerSelectPanel)
 *  Footer row → تعداد اقلام(راست‌ترین) FIRST ← جمع کل ← وضعیت(چپ‌ترین) LAST
 */
export function AbandonedCartCard({ cart, onView }: AbandonedCartCardProps) {
  return (
    <Box bg="bg.panel" borderWidth="1px" borderColor="border" rounded="lg" overflow="hidden" w="full">
      {/* Header — شناسه | تاریخ ایجاد */}
      <Flex align="center" justify="end" gap="2" px="4" py="2">
        <Flex flex="1" gap="2" align="center" justify="start">
          <Text fontSize="sm" color="fg.muted" whiteSpace="nowrap">{cart.id}</Text>
          <Text fontSize="sm" color="fg.muted">|</Text>
          <Text fontSize="sm" color="fg.muted" whiteSpace="nowrap">{cart.createdDate}</Text>
        </Flex>
        <IconButton
          aria-label="مشاهده سبد" size="sm"
          bg="gray.subtle" color="fg.muted" _hover={{ bg: 'gray.muted' }}
          onClick={() => onView?.(cart.id)}
        >
          <Eye size={18} />
        </IconButton>
      </Flex>

      {/* Avatar row */}
      <Flex justify="start" px="4" pb="4">
        <Flex align="center" justify="start" gap="4">
          <Avatar.Root size="md" bg="brand.solid" color="brand.contrast" flexShrink={0}>
            <Avatar.Fallback name={cart.customerName} />
          </Avatar.Root>
          <Flex direction="column" gap="1" align="start">
            <Text fontSize="sm" fontWeight="semibold" color="fg">{cart.customerName}</Text>
            <Text fontSize="xs" color="fg.muted">{cart.customerPhone}</Text>
          </Flex>
        </Flex>
      </Flex>

      {/* Footer — سه سلول */}
      <Flex bg="bg.subtle" borderTopWidth="1px" borderColor="border.muted" py="2" align="center">
        <Flex flex="1" direction="column" gap="2" align="center" p="2">
          <Text fontSize="xs" fontWeight="medium" color="fg.muted">تعداد اقلام</Text>
          <Text fontSize="sm" fontWeight="semibold" color="fg">{toPersianDigits(cart.itemsCount)}</Text>
        </Flex>
        <Separator orientation="vertical" h="6" />
        <Flex flex="1" direction="column" gap="2" align="center" p="2">
          <Text fontSize="xs" fontWeight="medium" color="fg.muted">جمع کل</Text>
          <Text fontSize="sm" fontWeight="semibold" color="fg">{toPersianDigits(cart.totalAmount)}</Text>
        </Flex>
        <Separator orientation="vertical" h="6" />
        <Flex flex="1" direction="column" gap="2" align="center" p="2">
          <Text fontSize="xs" fontWeight="medium" color="fg.muted">وضعیت</Text>
          <Badge size="sm" colorPalette={STATUS_COLOR[cart.status]} variant="subtle">{cart.status}</Badge>
        </Flex>
      </Flex>
    </Box>
  )
}
