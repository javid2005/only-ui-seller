import { Flex } from '@chakra-ui/react'
import { OrderCard } from './OrderCard'
import type { Order } from './data'

interface OrderGridProps {
  orders: Order[]
}

/**
 * نمای کارت سفارشات — فقط در حالت موبایل/compact (جایگزین جدول).
 * تک‌ستونه عمودی (مطابق Figma mobile List).
 */
export function OrderGrid({ orders }: OrderGridProps) {
  return (
    <Flex direction="column" gap="4">
      {orders.map((o) => (
        <OrderCard key={o.id} order={o} />
      ))}
    </Flex>
  )
}
