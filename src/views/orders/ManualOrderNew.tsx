import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Alert, Box, Button, Flex, Grid, Text } from '@chakra-ui/react'
import { NotepadText } from 'lucide-react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { Header } from '@/components/layout/Header'
import { ManualOrderStepper } from '@/components/orders/manual/ManualOrderStepper'
import { CustomerSelectPanel } from '@/components/orders/manual/CustomerSelectPanel'
import { ProductSelectPanel } from '@/components/orders/manual/ProductSelectPanel'
import { SelectedProductsPanel } from '@/components/orders/manual/SelectedProductsPanel'
import { ShippingSelectPanel } from '@/components/orders/manual/ShippingSelectPanel'
import { ShippingAddressForm, type ShippingAddressValue } from '@/components/orders/manual/ShippingAddressForm'
import { DiscountSelectPanel } from '@/components/orders/manual/DiscountSelectPanel'
import { DiscountCodeForm } from '@/components/orders/manual/DiscountCodeForm'
import { OrderReviewPanel } from '@/components/orders/manual/OrderReviewPanel'
import { OrderDraftSummary } from '@/components/orders/manual/OrderDraftSummary'
import { OrderCompletePanel } from '@/components/orders/manual/OrderCompletePanel'
import { ManualOrderFooter } from '@/components/orders/manual/ManualOrderFooter'
import { ManualOrderConfirmFooter } from '@/components/orders/manual/ManualOrderConfirmFooter'
import { AddCustomerDialog } from '@/components/orders/manual/AddCustomerDialog'
import { VariantSelectDialog } from '@/components/orders/manual/VariantSelectDialog'
import {
  MANUAL_CUSTOMERS, MANUAL_PRODUCTS, MANUAL_SHIPPING_METHODS, MANUAL_DISCOUNTS, formatToman, tomanToNumber, variantLineId,
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
  const summaryRef = useRef<HTMLDivElement>(null)

  /** با تغییر مرحله («ادامه»/«بازگشت») اسکرول به بالای صفحه برمی‌گردد */
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [step])

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

  // ─── تخفیف (مرحلهٔ ۴) — انتخاب از لیست یا ورودِ دستیِ کد، دوتا mutually-exclusive ────
  const [discountId, setDiscountId] = useState<string | null>(null)
  const [manualCodeInput, setManualCodeInput] = useState('')
  const [manualCodeError, setManualCodeError] = useState<string | undefined>(undefined)
  const [manualDiscountId, setManualDiscountId] = useState<string | null>(null)

  // ─── تکمیل سفارش (بعد از «ثبت و ایجاد لینک پرداخت») ─────────────────────────
  const [orderCreated, setOrderCreated] = useState(false)
  const [paymentLink, setPaymentLink] = useState('')

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

  /** از دیالوگِ «انتخاب تنوع» — با «افزودن تنوع» خودِ دیالوگ هم بسته می‌شود (VariantSelectDialog) */
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
  const selectedCustomer = customers.find((c) => c.id === customerId) ?? null

  // ─── روش ارسال (مرحلهٔ ۳) ────────────────────────────────────────────────────
  const shippingMethod = MANUAL_SHIPPING_METHODS.find((m) => m.id === shippingMethodId) ?? null
  const hasShippingAddress = Boolean(
    shippingAddress.province && shippingAddress.city
    && shippingAddress.postal.trim() && shippingAddress.address.trim(),
  )

  // ─── تخفیف (مرحلهٔ ۴) ────────────────────────────────────────────────────────
  const appliedDiscount = discountId
    ? MANUAL_DISCOUNTS.find((d) => d.id === discountId)
    : MANUAL_DISCOUNTS.find((d) => d.id === manualDiscountId)
  const discountAmountNumber = appliedDiscount?.amount ?? 0

  function handleSelectDiscount(id: string) {
    setDiscountId(id)
    setManualDiscountId(null)
    setManualCodeInput('')
    setManualCodeError(undefined)
  }

  /** کد وارد شده با کدِ تخفیف‌های موجود مقایسه می‌شود — تطبیق یعنی معتبر (مطابق قرارداد mock پروژه، مثل verifyOtp) */
  function handleApplyCode() {
    const match = MANUAL_DISCOUNTS.find((d) => d.code.toLowerCase() === manualCodeInput.trim().toLowerCase())
    if (match) {
      setManualDiscountId(match.id)
      setDiscountId(null)
      setManualCodeError(undefined)
    } else {
      setManualDiscountId(null)
      setManualCodeError('کد تخفیف نامعتبر است.')
    }
  }

  function handleRemoveDiscount() {
    setDiscountId(null)
    setManualDiscountId(null)
    setManualCodeInput('')
    setManualCodeError(undefined)
  }

  const payableNumber = Math.max(0, itemsTotalNumber + (shippingMethod?.price ?? 0) - discountAmountNumber)

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
    setStep((s) => Math.min(s + 1, 4))
  }

  function handleBack() {
    if (step === 0) router.push('/orders/list')
    else setStep((s) => s - 1)
  }

  /** مرحلهٔ ۵ — mock: لینک پرداختِ ساختگی ساخته می‌شود و صفحهٔ «پیام تکمیل سفارش» نشان
   * داده می‌شود (به‌جای redirect فوری) — طبق طرح Manual/Order Complete. کدِ سفارش هم‌الگو
   * با orderNo موجود در لیست سفارشات (`ORD-####`، الگوی `orderData.ts`/`list/data.ts`). */
  function handleCreateOrder() {
    const orderCode = `ORD-${Math.floor(1000 + Math.random() * 9000)}`
    setPaymentLink(`https://vitrina.ir/pay/${orderCode}?t=${Date.now()}`)
    setOrderCreated(true)
  }

  /** «ایجاد سفارش جدید» — ویزارد را کامل به حالت اولیه برمی‌گرداند (بدون navigation،
   * چون همان route است و push به همان URL چیزی را remount نمی‌کند). */
  function handleCreateNewOrder() {
    setStep(0)
    setCustomerId(null)
    setSelectedLines([])
    setShippingMethodId(null)
    setShippingAddress(EMPTY_SHIPPING_ADDRESS)
    setShippingSubmitAttempted(false)
    setDiscountId(null)
    setManualCodeInput('')
    setManualCodeError(undefined)
    setManualDiscountId(null)
    setOrderCreated(false)
    setPaymentLink('')
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
        cta={step === 4 && isCompact && !orderCreated ? (
          <Button
            variant="outline"
            size="sm"
            h="9"
            px="3.5"
            rounded="md"
            fontWeight="semibold"
            fontSize="sm"
            color="brand.fg"
            borderColor="brand.solid"
            bg="bg.panel"
            _hover={{ bg: 'brand.bg' }}
            onClick={() => summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          >
            {/* RTL: آیکن trailing = چپِ متن (طبق screenshot طرح) */}
            خلاصه سفارش
            <NotepadText size={16} />
          </Button>
        ) : undefined}
      />

      {orderCreated ? (
        <OrderCompletePanel
          customerName={selectedCustomer?.name ?? ''}
          paymentLink={paymentLink}
          onCreateNew={handleCreateNewOrder}
          onGoToList={() => router.push('/orders/list')}
        />
      ) : (
        <>
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

              {step === 3 && (
                <Flex direction="column" gap="4">
                  <Alert.Root status="info" variant="subtle">
                    <Alert.Indicator />
                    <Alert.Content>
                      <Text fontSize="xs">اعمال تخفیف اختیاری است. در صورت عدم نیاز، این مرحله را رد کنید.</Text>
                    </Alert.Content>
                  </Alert.Root>

                  <DiscountSelectPanel
                    discounts={MANUAL_DISCOUNTS}
                    value={discountId}
                    onChange={handleSelectDiscount}
                    disabled={Boolean(manualDiscountId)}
                  />

                  <DiscountCodeForm
                    value={manualCodeInput}
                    onChange={setManualCodeInput}
                    onApply={handleApplyCode}
                    error={manualCodeError}
                    disabled={Boolean(appliedDiscount)}
                  />
                </Flex>
              )}

              {step === 4 && selectedCustomer && shippingMethod && (
                <OrderReviewPanel
                  customer={selectedCustomer}
                  lines={selectedLines}
                  products={MANUAL_PRODUCTS}
                  shippingMethod={shippingMethod}
                />
              )}
            </Box>

            {/* top="20" (80px) = ارتفاعِ Navbar (h="16"=64px، sticky top=0) + فاصلهٔ ۱۶px —
                وگرنه با top="4" پنل زیرِ Navbar (zIndex بالاتر) گم می‌شود. الگو: NewProduct.tsx */}
            <Box
              ref={summaryRef}
              gridArea="summary"
              minW="0"
              position={isCompact ? 'static' : { base: 'static', lg: 'sticky' }}
              top="20"
            >
              <OrderDraftSummary
                itemCount={hasProductSelection ? itemCount : undefined}
                itemsTotal={hasProductSelection ? `${formatToman(itemsTotalNumber)} ت` : undefined}
                payable={hasProductSelection ? `${formatToman(payableNumber)} ت` : undefined}
                showShipping={step >= 2}
                shippingPrice={shippingMethod ? `${formatToman(shippingMethod.price)} ت` : undefined}
                discountAmount={step >= 3 && discountAmountNumber > 0 ? `${formatToman(discountAmountNumber)} ت` : undefined}
              />
            </Box>

            <Box gridArea="footer" minW="0">
              {step < 4 ? (
                <ManualOrderFooter
                  nextDisabled={nextDisabled}
                  onNext={handleNext}
                  onCancel={handleBack}
                  cancelLabel={step === 0 ? 'بازگشت به لیست' : 'بازگشت'}
                  extraAction={step === 3 && appliedDiscount ? { label: 'حذف تخفیف', onClick: handleRemoveDiscount } : undefined}
                />
              ) : (
                <Flex direction="column" gap="4">
                  <Alert.Root status="info" variant="subtle">
                    <Alert.Indicator />
                    <Alert.Content>
                      <Alert.Title>نهایی سازی سفارش</Alert.Title>
                      <Alert.Description>
                        بعد از کلیک روی «ثبت و ایجاد لینک پرداخت»، یک لینک پرداخت اختصاصی برای این مشتری ساخته می‌شود. این لینک را کپی کرده و برای مشتری ارسال کنید.
                      </Alert.Description>
                    </Alert.Content>
                  </Alert.Root>

                  <ManualOrderConfirmFooter onCreate={handleCreateOrder} onBack={handleBack} />
                </Flex>
              )}
            </Box>
          </Grid>
        </>
      )}

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
