import type { ReactNode } from 'react'
import type { StaticImageData } from 'next/image'
import { Box, Flex, Text, Button, Alert, Separator, Badge, Grid } from '@chakra-ui/react'
import { Global } from '@emotion/react'
import { Printer, Headset, Mail, MapPin, Mailbox, Phone, CreditCard, Info, ScissorsLineDashed } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { PrintFooterCTA } from '@/components/orders/PrintFooterCTA'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { MOCK_ORDER } from '@/components/orders/orderData'
import logoSrc from '@/assets/logo.svg'
import img1 from '@/assets/Products/Image-1.png'
import img2 from '@/assets/Products/Image-2.png'

/**
 * OrderPrintInvoice — صفحه «پرینت فاکتور» (Figma: Order / Print-Invoice — node 2182:34336).
 * قالب مشابه Print-Label: محتوای centered با max-width 808px، خروجی چاپ = فقط .print-invoice + خط برش.
 * RTL: همه ردیف‌های افقی نسبت به خروجی LTR فیگما reverse شده‌اند (راست‌ترین = اولین فرزند DOM).
 */

const ORDER = MOCK_ORDER
const CURRENCY = 'ت'

// ─── mock data (Figma values) ────────────────────────────────────────────────

const INVOICE = {
  number:      'INV-8821-1404',
  issueDate:   '۱۴۰۴/۰۱/۱۵',
  paymentDate: '۱۴۰۴/۰۱/۱۵ — ۱۴:۴۵',
  contact: {
    phone: '۰۲۱-۸۸۴۵۶۷۸۹',
    email: 'support@vitrina.ir',
  },
  paid: {
    title: 'پرداخت شده',
    body:  'درگاه پرداخت آنلاین • مبلغ ۲٬۵۵۰٬۰۰۰ تومان • ۱۴۰۴/۰۱/۱۵ — ۱۴:۴۵',
  },
  seller: {
    name:    'فروشگاه پیچ مزباکس',
    address: 'مازندران، آمل، نور، بلوار ارتش، خیابان درزی کلا، جنب بانک ملت',
    postal:  '۱۰۱۲۵۴۷۸۹۶',
    phone:   '(۰۱۱)۴۴۱۵۱۶۱۳ − (۰۱۱)۵۸۴۷۹۶۲۵',
  },
  buyer: {
    name:    'احمد گنجی',
    address: 'تهران، تهران، خیابان ولیعصر، کوچه گلستان، پلاک ۱۲، واحد ۳',
    postal:  '۱۴۵۶۷۸۹۰۱۲',
    phone:   '۰۹۱۲۴۵۶۰۰۸۹',
  },
  totals: {
    sum:          '۹۹٬۰۰۰٬۰۰۰',
    discountCode: 'SPRING20',
    discount:     '−۱۹٬۷۴۰٬۰۰۰',
    shipping:     'رایگان',
    payable:      '۷۹٬۲۶۰٬۰۰۰',
  },
  receiver: [
    { label: 'گیرنده مرسوله',     value: 'علی رضایی' },
    { label: 'شماره تماس گیرنده', value: '۰۹۱۲۳۳۴۵۶۷۸۹' },
    { label: 'آدرس تحویل',        value: 'تهران، تهران، خیابان ولیعصر، کوچه گلستان، پلاک ۱۲، واحد ۳\nکد پستی: ۱۴۵۶۷۸۹۰۱۲' },
  ],
  supplementary: [
    { label: 'روش ارسال',     value: 'پست پیشتاز' },
    { label: 'نوع',           value: 'درون شهری' },
    { label: 'کرایه',         value: 'پیش کرایه' },
    { label: 'کد رهگیری',     value: '−' },
    { label: 'تعداد بسته',    value: '۱ عدد' },
    { label: 'تعداد کل اقلام', value: '۳ عدد' },
  ],
  note: 'این سفارش کد تخفیف بهاره دارد. لطفاً با دقت بسته‌بندی شود.',
}

interface InvoiceItem {
  id: string
  name: string
  attrs: string
  sku: string
  qty: string
  unit: string
  total: string
  image: StaticImageData
}

const INVOICE_ITEMS: InvoiceItem[] = [
  { id: '1', name: 'گلکسی S24 اولترا', attrs: 'رنگ مشکی، ۱ ترابایت', sku: 'NK-1001', qty: '۲', unit: '۴۵٬۰۰۰٬۰۰۰', total: '۹۰٬۰۰۰٬۰۰۰', image: img1 },
  { id: '2', name: 'آنر ۱۲۰ پرو',     attrs: 'رنگ رز گلد، ۵۱۲ گیگ',  sku: 'SK-2034', qty: '۱', unit: '۵۴٬۰۰۰٬۰۰۰', total: '۵۴٬۰۰۰٬۰۰۰', image: img2 },
]

interface Party {
  name: string
  address: string
  postal: string
  phone: string
}

// ─── building blocks ─────────────────────────────────────────────────────────

/** ردیف تماس در سرفصل (آیکن چپ + متن راست) — dir=ltr چون شماره/ایمیل لاتین‌اند. */
function ContactRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <Flex dir="ltr" align="center" gap="1.5">
      <Box flexShrink={0} color="brand.solid" display="flex" alignItems="center">{icon}</Box>
      <Text fontSize="2xs" color="fg.muted">{children}</Text>
    </Flex>
  )
}

/**
 * سلول متا.
 *  sm+    : stacked — label بالا · value زیرِ آن، راست‌چین (مطابق Figma)
 *  < sm   : ردیفی — label راست · value چپ
 */
function MetaCell({ label, value, isCompact }: { label: string; value: string; isCompact: boolean }) {
  return (
    <Flex
      direction={isCompact ? 'row' : { base: 'row', sm: 'column' }}
      justify="space-between"
      align={isCompact ? 'center' : { base: 'center', sm: 'start' }}
      gap="1"
      w="full"
    >
      <Text fontSize="xs" fontWeight="medium" color="fg.muted" textAlign="start" whiteSpace="nowrap" flexShrink={0}>
        {label}
      </Text>
      <Text
        fontSize="sm"
        fontWeight="semibold"
        color="fg"
        dir="auto"
        textAlign={isCompact ? 'left' : { base: 'left', sm: 'right' }}
        w={isCompact ? 'auto' : { base: 'auto', sm: 'full' }}
      >
        {value}
      </Text>
    </Flex>
  )
}

/** ردیف آیکن + متن داخل کارت فروشنده/خریدار — RTL: آیکن اول (راست). */
function PartyRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <Flex align="start" gap="2" w="full" minW="0">
      <Box flexShrink={0} color="brand.solid" display="flex" alignItems="center" mt="0.5">{icon}</Box>
      <Text flex="1" minW="0" fontSize="sm" fontWeight="medium" color="fg.muted" textAlign="start" dir="auto">
        {children}
      </Text>
    </Flex>
  )
}

/** کارت فروشنده یا خریدار. */
function PartyCard({ title, party }: { title: string; party: Party }) {
  return (
    <Flex direction="column" flex="1" minW="0">
      <Text fontSize="md" fontWeight="semibold" color="fg.muted" textAlign="start" pb="2">
        {title}
      </Text>
      <Flex direction="column" gap="2" w="full" h="full" minH="20" px="6" py="4" rounded="xl" borderWidth="1px" borderColor="border.muted">
        <Text fontSize="lg" fontWeight="semibold" color="fg" textAlign="start" dir="auto" pb="1">
          {party.name}
        </Text>
        <PartyRow icon={<MapPin size={16} />}>{party.address}</PartyRow>
        <PartyRow icon={<Mailbox size={16} />}>{party.postal}</PartyRow>
        <PartyRow icon={<Phone size={16} />}>{party.phone}</PartyRow>
      </Flex>
    </Flex>
  )
}

/** ردیف label–value (گیرنده / اطلاعات تکمیلی) — RTL: label راست · value چپ. */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Flex justify="space-between" align="start" gap="4" py="1" w="full">
      <Text fontSize="xs" fontWeight="medium" color="fg.muted" textAlign="start" flexShrink={0}>
        {label}
      </Text>
      <Text fontSize="sm" fontWeight="semibold" color="fg" textAlign="end" dir="auto" maxW="65%" whiteSpace="pre-line">
        {value}
      </Text>
    </Flex>
  )
}

/** ردیف جمع‌بندی — RTL: label راست · value چپ. */
function TotalRow({ label, value }: { label: string; value: string }) {
  return (
    <Flex justify="space-between" align="center" py="1" w="full">
      <Text fontSize="xs" fontWeight="medium" color="fg.muted">{label}</Text>
      <Text fontSize="sm" fontWeight="semibold" color="fg" dir="auto">{value}</Text>
    </Flex>
  )
}

/** کارت عنوان‌دار (گیرنده / اطلاعات تکمیلی). */
function TitledCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Flex direction="column" flex="1" minW="0">
      <Text fontSize="md" fontWeight="semibold" color="fg.muted" textAlign="start" pb="2">
        {title}
      </Text>
      <Flex direction="column" gap="0.5" w="full" h="full" minH="20" px="6" py="4" rounded="xl" borderWidth="1px" borderColor="border.muted">
        {children}
      </Flex>
    </Flex>
  )
}

/** کارت یک قلم سفارش — فقط در حالت موبایل (< sm) و compact به‌جای ردیف جدول. */
function ItemCard({ item }: { item: InvoiceItem }) {
  return (
    <Flex direction="column" gap="3" w="full" p="3" rounded="xl" borderWidth="1px" borderColor="border.muted">
      {/* بالا — RTL: تصویر اول (راست/leading) · متن چپ */}
      <Flex gap="3" align="start" w="full">
        <Box
          flexShrink={0}
          w="12"
          h="12"
          rounded="md"
          overflow="hidden"
          bg="bg.muted"
          borderWidth="1px"
          borderColor="border.muted"
        >
          <img src={item.image.src} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Box>
        <Flex direction="column" gap="1" flex="1" minW="0" align="start">
          <Text fontSize="sm" fontWeight="semibold" color="fg" textAlign="start" w="full">{item.name}</Text>
          <Text fontSize="xs" color="fg.muted" textAlign="start" w="full">{item.attrs}</Text>
          <Badge colorPalette="gray" variant="subtle" size="sm">SKU: {item.sku}</Badge>
        </Flex>
      </Flex>

      <Separator />

      {/* پایین — RTL: تعداد راست · فی چپ */}
      <Flex justify="space-between" align="center" w="full">
        <Flex align="center" gap="1.5">
          <Text fontSize="xs" color="fg.muted">تعداد:</Text>
          <Text fontSize="sm" fontWeight="semibold" color="fg">{item.qty}</Text>
        </Flex>
        <Flex align="center" gap="1.5">
          <Text fontSize="xs" color="fg.muted">فی:</Text>
          <Text fontSize="sm" fontWeight="semibold" color="fg" dir="auto">{item.unit} {CURRENCY}</Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

// ─── view ─────────────────────────────────────────────────────────────────────

export function OrderPrintInvoice() {
  const isCompact = useCompactMode()

  function handlePrint() {
    window.print()
  }

  // اجزای سرفصل — در دسکتاپ یک ردیف (logo·title·contact)، در < sm: ردیف logo+contact و عنوان زیرِ آن
  const logoBlock = (
    <Flex direction="column" flex="1" minW="0" align="start" gap="1">
      <img src={logoSrc.src} alt="ویترینا" style={{ height: '20px' }} />
      <Text fontSize="2xs" color="fg.muted">پلتفرم فروشگاه های اینستاگرام</Text>
    </Flex>
  )
  const titleBlock = (
    <Flex direction="column" flex="1" align="center" gap="1">
      <Text fontSize="lg" fontWeight="semibold" color="fg">فاکتور فروش</Text>
      <Text fontSize="xs" color="fg.muted">فاکتور سیستمی</Text>
    </Flex>
  )
  const contactBlock = (
    <Flex direction="column" flex="1" minW="0" align="end" gap="1.5">
      <ContactRow icon={<Headset size={14} />}>{INVOICE.contact.phone}</ContactRow>
      <ContactRow icon={<Mail size={14} />}>{INVOICE.contact.email}</ContactRow>
    </Flex>
  )

  return (
    <Flex direction="column" align="center" w="full">
      <Global
        styles={`
          @media print {
            body * { visibility: hidden !important; }
            .print-invoice, .print-invoice * { visibility: visible !important; }
            .print-invoice {
              position: absolute !important;
              inset-block-start: 0;
              inset-inline: 0;
              width: 100%; max-width: 808px;
              margin-inline: auto;
            }
            /* نوار CTA (بازگشت/پرینت) جزو خروجی چاپ نیست */
            .print-cta { display: none !important; }
            @page { margin: 12mm; }
          }
        `}
      />

      <Flex direction="column" gap="4" w="full" maxW="808px">
        {/* ── Page-Header ── */}
        <Header
          title="پرینت فاکتور"
          breadcrumbs={[
            { label: 'داشبورد', href: '/' },
            { label: 'لیست سفارشات', href: '/orders/list' },
            { label: `سفارش ${ORDER.code}` },
          ]}
          cta={
            <Button
              bg="brand.solid"
              color="brand.contrast"
              size="sm"
              h="9"
              /* < sm یا compact → دکمه آیکنی مربعی · sm+ → دکمه با متن */
              w={isCompact ? '9' : { base: '9', sm: 'auto' }}
              minW={isCompact ? '9' : { base: '9', sm: 'auto' }}
              px={isCompact ? '0' : { base: '0', sm: '3.5' }}
              rounded="md"
              fontWeight="semibold"
              fontSize="sm"
              _hover={{ bg: 'brand.emphasized', color: 'brand.fg' }}
              onClick={handlePrint}
              aria-label="پرینت فاکتور"
            >
              {/* RTL: آیکن FIRST (راست = leading) */}
              <Printer size={16} />
              <Box as="span" display={isCompact ? 'none' : { base: 'none', sm: 'inline' }}>
                پرینت فاکتور
              </Box>
            </Button>
          }
        />

        {/* ── Alert راهنما (چاپ نمی‌شود) ── */}
        <Alert.Root status="info" variant="surface" rounded="lg" px="3" py="3" gap="2">
          <Alert.Indicator />
          <Alert.Title flex="1" fontSize="xs" fontWeight="medium" textAlign="start">
            این برگه را پرینت بگیرید و به‌عنوان فاکتور فروش نگهداری کنید.
          </Alert.Title>
        </Alert.Root>

        {/* ── ناحیه‌ی چاپ ── */}
        <Flex className="print-invoice" direction="column" gap="4" w="full">
          {/* کارت فاکتور */}
          <Box w="full" rounded="2xl" borderWidth="1px" borderColor="border" overflow="hidden" bg="bg.panel">
            {/* محتوای اصلی (padding 24) */}
            <Flex direction="column" gap="6" p="6">

              {/* ══ ۱. سرفصل (لوگو · عنوان · تماس) + متا ══ */}
              <Flex
                direction="column"
                gap="6"
                p="4"
                bg="bg.subtle"
                borderWidth="1px"
                borderColor="border"
                rounded="xl"
                w="full"
              >
                {/* ردیف بالا — sm+ : logo راست · title وسط · contact چپ (یک ردیف) */}
                <Flex
                  display={isCompact ? 'none' : { base: 'none', sm: 'flex' }}
                  direction="row"
                  align="start"
                  gap="4"
                  w="full"
                >
                  {logoBlock}
                  {titleBlock}
                  {contactBlock}
                </Flex>

                {/* ردیف بالا — < sm یا compact : logo راست + contact چپ یک ردیف · عنوان ردیفِ پایین، وسط */}
                <Flex
                  display={isCompact ? 'flex' : { base: 'flex', sm: 'none' }}
                  direction="column"
                  gap="4"
                  w="full"
                >
                  <Flex direction="row" align="start" gap="4" w="full">
                    {logoBlock}
                    {contactBlock}
                  </Flex>
                  {titleBlock}
                </Flex>

                {/* متا ۲×۲ — RTL: item1 = راست‌بالا */}
                <Grid
                  templateColumns={isCompact ? '1fr' : { base: '1fr', sm: 'repeat(2, 1fr)' }}
                  columnGap="8"
                  rowGap="2"
                  w="full"
                >
                  <MetaCell isCompact={isCompact} label="شماره سفارش"  value={ORDER.code} />
                  <MetaCell isCompact={isCompact} label="تاریخ صدور"   value={INVOICE.issueDate} />
                  <MetaCell isCompact={isCompact} label="شماره فاکتور" value={INVOICE.number} />
                  <MetaCell isCompact={isCompact} label="تاریخ پرداخت" value={INVOICE.paymentDate} />
                </Grid>
              </Flex>

              {/* ══ ۲. وضعیت پرداخت (Alert سبز) ══ */}
              <Alert.Root status="success" variant="surface" rounded="xl" px="3" py="2.5" gap="2" alignItems="start">
                {/* RTL: Alert خودش dir می‌ذارد → آیکن سمت راست */}
                <Alert.Indicator mt="0.5"><CreditCard size={16} /></Alert.Indicator>
                <Alert.Content gap="0.5">
                  <Alert.Title fontSize="xs" fontWeight="medium" textAlign="start">{INVOICE.paid.title}</Alert.Title>
                  <Alert.Description fontSize="2xs" textAlign="start">{INVOICE.paid.body}</Alert.Description>
                </Alert.Content>
              </Alert.Root>

              {/* ══ ۳. فروشنده / خریدار — RTL: فروشنده راست · خریدار چپ ══ */}
              <Flex
                direction={isCompact ? 'column' : { base: 'column', md: 'row' }}
                gap="4"
                w="full"
              >
                <PartyCard title="فروشنده" party={INVOICE.seller} />
                <PartyCard title="خریدار"  party={INVOICE.buyer} />
              </Flex>

              {/* ══ ۴. اقلام سفارش ══ */}
              <Flex direction="column" gap="3" w="full">
                <Text fontSize="md" fontWeight="semibold" color="fg.muted" textAlign="start">اقلام سفارش</Text>

                {/* جدول — sm+ · RTL: کالا راست · تعداد وسط · فی چپ */}
                <Box w="full" display={isCompact ? 'none' : { base: 'none', sm: 'block' }}>
                  {/* سرستون */}
                  <Flex w="full" borderBottomWidth="1px" borderColor="border" bg="bg.muted">
                    <Box flex="1" minW="0" px="4" py="2">
                      <Text fontSize="xs" fontWeight="medium" color="fg.muted" textAlign="start">کالا</Text>
                    </Box>
                    <Box flexShrink={0} w="16" px="4" py="2">
                      <Text fontSize="xs" fontWeight="medium" color="fg.muted" textAlign="center">تعداد</Text>
                    </Box>
                    <Box flexShrink={0} w="32" px="4" py="2">
                      <Text fontSize="xs" fontWeight="medium" color="fg.muted" textAlign="end">فی (تومان)</Text>
                    </Box>
                  </Flex>

                  {/* ردیف‌های آیتم */}
                  {INVOICE_ITEMS.map((item) => (
                    <Flex key={item.id} w="full" borderBottomWidth="1px" borderColor="border.muted" minH="20">
                      {/* کالا — RTL: تصویر راست (leading) · متن چپ */}
                      <Flex flex="1" minW="0" gap="4" align="center" px="4" py="3">
                        <Box
                          flexShrink={0}
                          w="12"
                          h="12"
                          rounded="md"
                          overflow="hidden"
                          bg="bg.muted"
                          borderWidth="1px"
                          borderColor="border.muted"
                        >
                          <img src={item.image.src} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                        {/* RTL: align start = راست → SKU badge زیر متن، سمت راست */}
                        <Flex direction="column" gap="1" flex="1" minW="0" align="start">
                          <Text fontSize="sm" fontWeight="semibold" color="fg" textAlign="start" w="full" truncate>{item.name}</Text>
                          <Text fontSize="xs" color="fg.muted" textAlign="start" w="full">{item.attrs}</Text>
                          <Badge colorPalette="gray" variant="subtle" size="sm">SKU: {item.sku}</Badge>
                        </Flex>
                      </Flex>

                      {/* تعداد */}
                      <Flex flexShrink={0} w="16" px="4" py="3" align="center" justify="center">
                        <Text fontSize="sm" fontWeight="semibold" color="fg">{item.qty}</Text>
                      </Flex>

                      {/* فی (قیمت واحد) — RTL: چپ‌چین */}
                      <Box flexShrink={0} w="32" px="4" py="3" display="flex" alignItems="center">
                        <Text fontSize="sm" fontWeight="semibold" color="fg" textAlign="end" dir="auto" w="full">{item.unit} {CURRENCY}</Text>
                      </Box>
                    </Flex>
                  ))}
                </Box>

                {/* کارت‌ها — < sm یا compact: هر قلم یک کارت جدا، زیر هم */}
                <Flex
                  direction="column"
                  gap="3"
                  w="full"
                  display={isCompact ? 'flex' : { base: 'flex', sm: 'none' }}
                >
                  {INVOICE_ITEMS.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </Flex>

                {/* جمع‌بندی — RTL: سمت چپ */}
                <Box w={isCompact ? 'full' : { base: 'full', md: '320px' }} alignSelf="end" pt="2">
                  <TotalRow label="جمع کل اقلام" value={`${INVOICE.totals.sum} ${CURRENCY}`} />
                  <Separator my="2" />

                  {/* تخفیف — RTL: label+badge راست · value چپ */}
                  <Flex justify="space-between" align="center" py="1" w="full">
                    <Flex align="center" gap="2">
                      <Text fontSize="xs" fontWeight="medium" color="fg.muted">تخفیف</Text>
                      <Badge colorPalette="green" variant="subtle" size="sm">{INVOICE.totals.discountCode}</Badge>
                    </Flex>
                    <Text fontSize="sm" fontWeight="semibold" color="fg.success" dir="auto">{INVOICE.totals.discount} {CURRENCY}</Text>
                  </Flex>
                  <Separator my="2" />

                  <TotalRow label="هزینه ارسال" value={INVOICE.totals.shipping} />

                  {/* مبلغ قابل پرداخت — بدون خط جداکننده بالای آن (مطابق Figma) */}
                  <Flex justify="space-between" align="center" px="4" py="2.5" rounded="xl" bg="bg.muted" mt="2" w="full">
                    <Text fontSize="xs" fontWeight="medium" color="fg">مبلغ قابل پرداخت</Text>
                    <Text fontSize="md" fontWeight="semibold" color="fg" dir="auto">{INVOICE.totals.payable} {CURRENCY}</Text>
                  </Flex>
                </Box>
              </Flex>

              {/* ══ ۵. گیرنده / اطلاعات تکمیلی — RTL: گیرنده راست · اطلاعات چپ ══ */}
              <Flex
                direction={isCompact ? 'column' : { base: 'column', md: 'row' }}
                align="stretch"
                gap="4"
                w="full"
              >
                <TitledCard title="گیرنده">
                  {INVOICE.receiver.map((r) => <InfoRow key={r.label} label={r.label} value={r.value} />)}
                </TitledCard>
                <TitledCard title="اطلاعات تکمیلی">
                  {INVOICE.supplementary.map((r) => <InfoRow key={r.label} label={r.label} value={r.value} />)}
                </TitledCard>
              </Flex>

              {/* ══ ۶. یادداشت فروشنده (Alert نارنجی) ══ */}
              <Alert.Root status="warning" variant="surface" rounded="xl" px="3" py="2.5" gap="2" alignItems="start">
                <Alert.Indicator mt="0.5"><Info size={14} /></Alert.Indicator>
                <Alert.Content gap="0.5">
                  <Alert.Title fontSize="xs" fontWeight="medium" textAlign="start">یادداشت فروشنده:</Alert.Title>
                  <Alert.Description fontSize="2xs" textAlign="start">{INVOICE.note}</Alert.Description>
                </Alert.Content>
              </Alert.Root>
            </Flex>

            {/* ══ ۷. Footer ══ RTL: info-text راست · صفحه وسط · vitrina.ir چپ */}
            <Flex align="center" gap="2" px="6" py="2" bg="bg.muted" w="full">
              {/* info text (راست) — آیکن اول (راست‌ترین) */}
              <Flex flex="1" align="center" gap="1.5" minW="0">
                <Box flexShrink={0} color="fg.subtle" display="flex" alignItems="center">
                  <Info size={13} />
                </Box>
                <Text fontSize="2xs" color="fg.subtle" textAlign="start" flex="1" minW="0">
                  این فاکتور به صورت سیستمی صادر شده و معتبر است.
                </Text>
              </Flex>

              {/* صفحه (وسط) */}
              <Text fontSize="2xs" color="fg.subtle" textAlign="center" flexShrink={0} px="2">صفحه ۱ از ۱</Text>

              {/* vitrina.ir (چپ) */}
              <Flex flex="1" justify="end">
                <Text fontSize="xs" fontWeight="medium" color="brand.solid">vitrina.ir</Text>
              </Flex>
            </Flex>
          </Box>

          {/* نوار CTA (بازگشت / پرینت) — چاپ نمی‌شود */}
          <PrintFooterCTA printLabel="پرینت فاکتور" onPrint={handlePrint} />

          {/* خط برش */}
          <Flex align="center" gap="4" w="full">
            <Separator variant="dashed" flex="1" />
            <Flex align="center" gap="2" flexShrink={0} color="fg.subtle">
              <ScissorsLineDashed size={14} />
              <Text fontSize="2xs">خط برش</Text>
            </Flex>
            <Separator variant="dashed" flex="1" />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
