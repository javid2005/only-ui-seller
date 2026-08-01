import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Flex, Grid } from '@chakra-ui/react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { Header } from '@/components/layout/Header'
import { ManualOrderStepper } from '@/components/orders/manual/ManualOrderStepper'
import { CustomerSelectPanel } from '@/components/orders/manual/CustomerSelectPanel'
import { ProductSelectPanel } from '@/components/orders/manual/ProductSelectPanel'
import { SelectedProductsPanel } from '@/components/orders/manual/SelectedProductsPanel'
import { ShippingSelectPanel } from '@/components/orders/manual/ShippingSelectPanel'
import { ShippingAddressForm, type ShippingAddressValue } from '@/components/orders/manual/ShippingAddressForm'
import { OrderDraftSummary } from '@/components/orders/manual/OrderDraftSummary'
import { ManualOrderFooter } from '@/components/orders/manual/ManualOrderFooter'
import { AddCustomerDialog } from '@/components/orders/manual/AddCustomerDialog'
import { VariantSelectDialog } from '@/components/orders/manual/VariantSelectDialog'
import {
  MANUAL_CUSTOMERS, MANUAL_PRODUCTS, MANUAL_SHIPPING_METHODS, formatToman, tomanToNumber, variantLineId,
  type ManualCustomer, type SelectedProductLine,
} from '@/components/orders/manual/manualOrderData'

const EMPTY_SHIPPING_ADDRESS: ShippingAddressValue = { province: '', city: '', postal: '', address: '', note: '' }

/**
 * ManualOrderNew — ویزارد «ایجاد سفارش دستی».
 * Route: /orders/new
 *
 * مراحل به‌صورت state داخلی مدیریت می‌شن (نه route جدا) — مرحله ۱: انتخاب مشتری،
 * مرحله ۲: انتخاب محصول. «بازگشت» در مرحلهٔ اول یعنی خروج از ویزارد (به لیست سفارشات)؛
 * از مرحلهٔ دوم به بعد یعنی برگشت به مرحلهٔ قبل — به همین خاطر برچسبِ دکمه فرق می‌کند
 * («بازگشت به لیست» در قدم اول، «بازگشت» در بقیه — مطابق Figma Footer CTA هر قدم).
 *
 * چیدمان (Grid با نام ناحیه — RTL: اولین نام هر سطر = راست‌ترین):
 *   lg+   → فرم راست، «جزئیات سفارش» چپ و sticky، نوار اکشن زیرِ فرم
 *   < lg  → تک‌ستونه: فرم → جزئیات → نوار اکشن (sticky به کف)
 */
export function ManualOrderNew() {
  const isCompact = useCompactMode()
  const router = useRouter()
  const [step, setStep] = useState(0)

  const [customers, setCustomers] = useState<ManualCustomer[]>(MANUAL_CUSTOMERS)
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  const [selectedLines, setSelectedLines] = useState<SelectedProductLine[]>([])
  /** id محصولی که دیالوگ «انتخاب تنوع» برایش باز است — null یعنی بسته */
  const [variantDialogProductId, setVariantDialogProductId] = useState<string | null>(null)

  const [shippingMethodId, setShippingMethodId] = useState<string | null>(null)
  const [shippingAddress, setShippingAddress] = useState<ShippingAddressValue>(EMPTY_SHIPPING_ADDRESS)
  /** true بعد از اولین «ادامه»یِ ناموفق در مرحلهٔ روش ارسال — فیلدهای آدرسِ خالی را نشان می‌دهد */
  const [shippingSubmitAttempted, setShippingSubmitAttempted] = useState(false)

  const customer = customers.find((c) => c.id === customerId) ?? null

  function handleAddCustomer(newCustomer: ManualCustomer) {
    setCustomers((prev) => [newCustomer, ...prev])
    setCustomerId(newCustomer.id)
    setAddOpen(false)
  }

  // ─── محصولات — افزودن/تغییر تعداد/حذف ──────────────────────────────────────
  // موجودیِ باقی‌مانده در سطح محصول — جمعِ همهٔ ردیف‌ها (صرف‌نظر از ترکیب تنوع) کسر می‌شود
  function remainingStock(productId: string) {
    const product = MANUAL_PRODUCTS.find((p) => p.id === productId)
    if (!product) return 0
    const inCart = selectedLines
      .filter((l) => l.productId === productId)
      .reduce((sum, l) => sum + l.quantity, 0)
    return product.inventory - inCart
  }

  function addOrBumpLine(productId: string, variantLabels?: string[]) {
    setSelectedLines((prev) => {
      const id = variantLineId(productId, variantLabels)
      const existing = prev.find((l) => l.id === id)
      const product = MANUAL_PRODUCTS.find((p) => p.id === productId)
      const totalInCart = prev.filter((l) => l.productId === productId).reduce((sum, l) => sum + l.quantity, 0)
      if (product && totalInCart >= product.inventory) return prev
      if (existing) {
        return prev.map((l) => (l.id === id ? { ...l, quantity: l.quantity + 1 } : l))
      }
      return [...prev, { id, productId, quantity: 1, variantLabels }]
    })
  }

  function handleAddProduct(productId: string) {
    const product = MANUAL_PRODUCTS.find((p) => p.id === productId)
    if (product?.hasVariety) {
      setVariantDialogProductId(productId)
      return
    }
    addOrBumpLine(productId)
  }

  /** از دیالوگِ «انتخاب تنوع» — دیالوگ بسته نمی‌شود تا کاربر خودش «بستن» را بزند */
  function handleAddVariant(variantLabels: string[]) {
    if (!variantDialogProductId) return
    addOrBumpLine(variantDialogProductId, variantLabels)
  }

  function handleQtyChange(lineId: string, quantity: number) {
    setSelectedLines((prev) => prev.map((l) => (l.id === lineId ? { ...l, quantity } : l)))
  }

  function handleRemoveProduct(lineId: string) {
    setSelectedLines((prev) => prev.filter((l) => l.id !== lineId))
  }

  // ─── جزئیات سفارش (پنل sticky) ──────────────────────────────────────────────
  const itemCount = selectedLines.reduce((sum, l) => sum + l.quantity, 0)
  // فقط اقلامِ دارای priceToman در جمعِ تومانی محاسبه می‌شن (اقلامِ فقط-دلاری در این دمو
  // وارد جمع تومانی نمی‌شن — تبدیل نرخ ارز خارج از scope این مرحله است)
  const itemsTotalNumber = selectedLines.reduce((sum, l) => {
    const product = MANUAL_PRODUCTS.find((p) => p.id === l.productId)
    if (!product?.priceToman) return sum
    return sum + tomanToNumber(product.priceToman) * l.quantity
  }, 0)
  const hasProductSelection = selectedLines.length > 0

  const variantDialogProduct = MANUAL_PRODUCTS.find((p) => p.id === variantDialogProductId) ?? null

  // ─── روش ارسال (مرحلهٔ ۳) ────────────────────────────────────────────────────
  const shippingMethod = MANUAL_SHIPPING_METHODS.find((m) => m.id === shippingMethodId) ?? null
  const hasShippingAddress = Boolean(
    shippingAddress.province && shippingAddress.city
    && shippingAddress.postal.trim() && shippingAddress.address.trim(),
  )
  const payableNumber = itemsTotalNumber + (shippingMethod?.price ?? 0)

  const singleCol = `"form" "summary" "footer"`

  // مرحلهٔ روش ارسال: دکمهٔ «ادامه» فقط با انتخابِ روش ارسال فعال می‌شود — تکمیلِ فرم آدرس
  // با کلیکِ «ادامه» اعتبارسنجی می‌شود (نه با غیرفعال‌نگه‌داشتنِ دکمه)، مطابق درخواست کاربر
  const nextDisabled = step === 0
    ? !customerId
    : step === 1
      ? !hasProductSelection
      : step === 2
        ? !shippingMethodId
        : false

  function handleNext() {
    if (step === 2 && !hasShippingAddress) {
      setShippingSubmitAttempted(true)
      return
    }
    setStep((s) => Math.min(s + 1, 2))
  }

  function handleBack() {
    if (step === 0) router.push('/orders/list')
    else setStep((s) => s - 1)
  }

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

      <ManualOrderStepper step={step} />

      <Grid
        w="full"
        gap="4"
        alignItems="start"
        templateAreas={isCompact ? singleCol : { base: singleCol, lg: `"form summary" "footer summary"` }}
        templateColumns={isCompact ? '1fr' : { base: '1fr', lg: '1fr minmax(320px, 396px)' }}
      >
        <Box gridArea="form" minW="0">
          {step === 0 && (
            <CustomerSelectPanel
              customers={customers}
              value={customerId}
              onChange={setCustomerId}
              onAddNew={() => setAddOpen(true)}
            />
          )}

          {step === 1 && (
            <Flex direction="column" gap="4">
              <ProductSelectPanel
                products={MANUAL_PRODUCTS}
                remainingStock={remainingStock}
                onAdd={handleAddProduct}
              />
              {hasProductSelection && (
                <SelectedProductsPanel
                  lines={selectedLines}
                  products={MANUAL_PRODUCTS}
                  onQtyChange={handleQtyChange}
                  onRemove={handleRemoveProduct}
                />
              )}
            </Flex>
          )}

          {step === 2 && (
            <Flex direction="column" gap="4">
              <ShippingSelectPanel
                methods={MANUAL_SHIPPING_METHODS}
                value={shippingMethodId}
                onChange={setShippingMethodId}
              />
              <ShippingAddressForm
                value={shippingAddress}
                onChange={setShippingAddress}
                attemptedSubmit={shippingSubmitAttempted}
              />
            </Flex>
          )}
        </Box>

        <Box
          gridArea="summary"
          minW="0"
          position={isCompact ? 'static' : { base: 'static', lg: 'sticky' }}
          top="4"
        >
          <OrderDraftSummary
            customer={customer}
            itemCount={hasProductSelection ? itemCount : undefined}
            itemsTotal={hasProductSelection ? `${formatToman(itemsTotalNumber)} ت` : undefined}
            payable={hasProductSelection ? `${formatToman(payableNumber)} ت` : undefined}
            shippingLabel={step >= 2 ? (shippingMethod?.title ?? '-') : undefined}
            shippingPrice={step >= 2 ? (shippingMethod ? `${formatToman(shippingMethod.price)} ت` : '-') : undefined}
          />
        </Box>

        <Box gridArea="footer" minW="0">
          <ManualOrderFooter
            nextDisabled={nextDisabled}
            onNext={handleNext}
            onCancel={handleBack}
            cancelLabel={step === 0 ? 'بازگشت به لیست' : 'بازگشت'}
          />
        </Box>
      </Grid>

      <AddCustomerDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAddCustomer}
      />

      <VariantSelectDialog
        open={variantDialogProductId !== null}
        product={variantDialogProduct}
        remainingStock={variantDialogProductId ? remainingStock(variantDialogProductId) : 0}
        onClose={() => setVariantDialogProductId(null)}
        onAddVariant={handleAddVariant}
      />

    </Flex>
  )
}
