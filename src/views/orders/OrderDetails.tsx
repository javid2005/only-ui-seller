import { useState } from 'react'
import { Flex, Grid, Box } from '@chakra-ui/react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { Header } from '@/components/layout/Header'
import { OrderStatusMenu } from '@/components/orders/OrderStatusMenu'
import { OrderSteps } from '@/components/orders/OrderSteps'
import { OrderItemsPanel } from '@/components/orders/OrderItemsPanel'
import { ContactInfoCard } from '@/components/orders/ContactInfoCard'
import { ShippingAddressPanel } from '@/components/orders/ShippingAddressPanel'
import { OrderSummaryCard } from '@/components/orders/OrderSummaryCard'
import { OrderSummaryAccordion } from '@/components/orders/OrderSummaryAccordion'
import { SellerNoteCard } from '@/components/orders/SellerNoteCard'
import {
  ShipDialog, CancelOrderDialog, TrackingCodeDialog,
  EditReceiverDialog, EditAddressDialog, SelectSenderAddressDialog,
} from '@/components/orders/OrderDialogs'
import type { AddressData } from '@/components/orders/OrderDialogs'
import { MOCK_ORDER } from '@/components/orders/orderData'
import type { OrderStatus, OrderAction, ContactInfo } from '@/components/orders/orderData'

/**
 * OrderDetails — صفحه «سفارش» (Figma: Order / Details).
 * Template: دو ستونه — Middle (پهن، راست) + End (باریک، چپ: خلاصه + یادداشت).
 * Route: /orders/:orderId
 */
export function OrderDetails() {
  const isCompact = useCompactMode()
  const [status, setStatus] = useState<OrderStatus>(MOCK_ORDER.status)

  // editable order data (mock — در نبود API)
  const [receiver, setReceiver] = useState<ContactInfo>(MOCK_ORDER.receiver)
  const [tracking, setTracking] = useState(MOCK_ORDER.shipping.tracking)
  const [address, setAddress]   = useState<AddressData>({
    province: MOCK_ORDER.shipping.province,
    city:     MOCK_ORDER.shipping.city,
    postal:   MOCK_ORDER.shipping.postal,
    address:  MOCK_ORDER.shipping.address,
  })

  // dialog open states
  const [shipOpen, setShipOpen]           = useState(false)
  const [cancelOpen, setCancelOpen]       = useState(false)
  const [trackingOpen, setTrackingOpen]   = useState(false)
  const [editReceiverOpen, setEditReceiverOpen] = useState(false)
  const [editAddressOpen, setEditAddressOpen]   = useState(false)
  const [senderOpen, setSenderOpen]       = useState(false)

  function handleAction(action: OrderAction) {
    switch (action) {
      case 'ship':           setShipOpen(true);   break
      case 'cancel':         setCancelOpen(true); break
      case 'markPaid':       setStatus('paid');       break
      case 'confirmPayment': setStatus('processing'); break
      case 'requestReturn':  setStatus('returned');   break
    }
  }

  return (
    <Flex direction="column" gap="4" w="full">

      <Header
        title={`سفارش ${MOCK_ORDER.code}`}
        breadcrumbs={[
          { label: 'داشبورد', href: '/' },
          { label: 'لیست سفارشات', href: '/orders/list' },
          { label: `سفارش ${MOCK_ORDER.code}` },
        ]}
        cta={<OrderStatusMenu status={status} onAction={handleAction} />}
      />

      {/* Content — RTL: Middle (اول = راست، پهن) | End (آخر = چپ، باریک) */}
      <Flex
        direction={isCompact ? 'column' : { base: 'column', xl: 'row' }}
        gap={isCompact ? '4' : { base: '4', xl: '10' }}
        align="flex-start"
        w="full"
      >
        {/* Middle — ستون اصلی */}
        <Flex direction="column" gap="6" flex="1" minW="0" w="full">
          <OrderSteps />
          <OrderItemsPanel />
          <Grid templateColumns={isCompact ? '1fr' : { base: '1fr', md: '1fr 1fr' }} gap="6">
            {/* RTL: مشتری راست‌ترین (اول DOM)، گیرنده چپ — مطابق Figma */}
            <ContactInfoCard title="اطلاعات مشتری" info={MOCK_ORDER.customer} />
            <ContactInfoCard title="اطلاعات گیرنده" info={receiver} onEdit={() => setEditReceiverOpen(true)} />
          </Grid>
          <ShippingAddressPanel
            tracking={tracking}
            address={address}
            onEdit={() => setEditAddressOpen(true)}
            onEditTracking={() => setTrackingOpen(true)}
            onPrint={() => setSenderOpen(true)}
          />
          {/* یادداشت فروشنده — در mobile/compact داخل flow (ستون End فقط xl) */}
          <Box display={isCompact ? 'block' : { base: 'block', xl: 'none' }}>
            <SellerNoteCard />
          </Box>
        </Flex>

        {/* End — ستون چپ، فقط دسکتاپ xl (در mobile/compact جاش accordion sticky) */}
        <Box
          display={isCompact ? 'none' : { base: 'none', xl: 'block' }}
          w="360px"
          flexShrink={0}
          position="sticky"
          top="4"
        >
          <Flex direction="column" gap="6">
            <OrderSummaryCard />
            <SellerNoteCard />
          </Flex>
        </Box>
      </Flex>

      {/* خلاصه سفارش — sticky پایین، فقط mobile/compact (sticky نسبت به container 512/full کار می‌کند) */}
      <Box
        display={isCompact ? 'block' : { base: 'block', xl: 'none' }}
        position="sticky"
        bottom="2"
        zIndex="sticky"
      >
        <OrderSummaryAccordion />
      </Box>

      <ShipDialog
        open={shipOpen}
        onClose={() => setShipOpen(false)}
        onSubmit={(code) => { if (code) setTracking(code); setStatus('sent') }}
      />
      <CancelOrderDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={() => setStatus('canceled')}
      />
      <TrackingCodeDialog
        open={trackingOpen}
        onClose={() => setTrackingOpen(false)}
        onSubmit={setTracking}
        initial={tracking === MOCK_ORDER.shipping.tracking ? '' : tracking}
      />
      <EditReceiverDialog
        open={editReceiverOpen}
        onClose={() => setEditReceiverOpen(false)}
        onSubmit={setReceiver}
        initial={receiver}
      />
      <EditAddressDialog
        open={editAddressOpen}
        onClose={() => setEditAddressOpen(false)}
        onSubmit={setAddress}
        initial={address}
      />
      <SelectSenderAddressDialog
        open={senderOpen}
        onClose={() => setSenderOpen(false)}
        onSubmit={() => {}}
      />

    </Flex>
  )
}
