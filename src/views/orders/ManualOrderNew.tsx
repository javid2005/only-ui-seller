import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Flex, Grid } from '@chakra-ui/react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { Header } from '@/components/layout/Header'
import { ManualOrderStepper } from '@/components/orders/manual/ManualOrderStepper'
import { CustomerSelectPanel } from '@/components/orders/manual/CustomerSelectPanel'
import { OrderDraftSummary } from '@/components/orders/manual/OrderDraftSummary'
import { ManualOrderFooter } from '@/components/orders/manual/ManualOrderFooter'
import { AddCustomerDialog } from '@/components/orders/manual/AddCustomerDialog'
import { MANUAL_CUSTOMERS, type ManualCustomer } from '@/components/orders/manual/manualOrderData'

/**
 * ManualOrderNew — ویزارد «ایجاد سفارش دستی»، مرحله ۱: انتخاب مشتری.
 * Route: /orders/new
 *
 * چیدمان (Grid با نام ناحیه — RTL: اولین نام هر سطر = راست‌ترین):
 *   lg+   → فرم راست، «جزئیات سفارش» چپ و sticky، نوار اکشن زیرِ فرم
 *   < lg  → تک‌ستونه: فرم → جزئیات → نوار اکشن (sticky به کف)
 */
export function ManualOrderNew() {
  const isCompact = useCompactMode()
  const router = useRouter()
  const [customers, setCustomers] = useState<ManualCustomer[]>(MANUAL_CUSTOMERS)
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  const customer = customers.find((c) => c.id === customerId) ?? null

  function handleAddCustomer(newCustomer: ManualCustomer) {
    setCustomers((prev) => [newCustomer, ...prev])
    setCustomerId(newCustomer.id)
    setAddOpen(false)
  }

  const singleCol = `"form" "summary" "footer"`

  return (
    <Flex direction="column" gap="4" w="full" maxW="1082px" mx="auto">

      <Header
        title="ایجاد سفارش دستی"
        breadcrumbs={[
          { label: 'داشبورد', href: '/' },
          { label: 'لیست سفارشات', href: '/orders/list' },
          { label: 'ایجاد سفارش دستی' },
        ]}
      />

      <ManualOrderStepper step={0} />

      <Grid
        w="full"
        gap="4"
        alignItems="start"
        templateAreas={isCompact ? singleCol : { base: singleCol, lg: `"form summary" "footer summary"` }}
        templateColumns={isCompact ? '1fr' : { base: '1fr', lg: '1fr minmax(320px, 396px)' }}
      >
        <Box gridArea="form" minW="0">
          <CustomerSelectPanel
            customers={customers}
            value={customerId}
            onChange={setCustomerId}
            onAddNew={() => setAddOpen(true)}
          />
        </Box>

        <Box
          gridArea="summary"
          minW="0"
          position={isCompact ? 'static' : { base: 'static', lg: 'sticky' }}
          top="4"
        >
          <OrderDraftSummary customer={customer} />
        </Box>

        <Box gridArea="footer" minW="0">
          <ManualOrderFooter
            nextDisabled={!customerId}
            onNext={() => {}}
            onCancel={() => router.push('/orders/list')}
          />
        </Box>
      </Grid>

      <AddCustomerDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAddCustomer}
      />

    </Flex>
  )
}
