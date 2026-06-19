import type { ReactNode } from 'react'
import type { StaticImageData } from 'next/image'
import { Box, Flex, Text, Button, Alert, Separator, Badge, Grid } from '@chakra-ui/react'
import { Global } from '@emotion/react'
import { Printer, Headset, Mail, MapPin, Mailbox, Phone, CreditCard, Info, ScissorsLineDashed } from 'lucide-react'
import { Header } from '@/components/layout/Header'
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

/** سلول متا — RTL: label اول (راست) · value بعد (چپِ label). */
function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <Flex gap="2" w="full" align="baseline" justify="flex-start">
      <Text fontSize="xs" fontWeight="medium" color="fg.muted" textAlign="right" minW="20" flexShrink={0}>
        {label}
      </Text>
      <Text fontSize="sm" fontWeight="semibold" color="fg" dir="auto">
        {value}
      </Text>
    </Flex>
  )
}

/** ردیف آیکن + متن داخل کارت فروشنده/خریدار — RTL: آیکن اول (راست). */
function PartyRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <Flex align="flex-start" gap="2" w="full" minW="0">
      <Box flexShrink={0} color="brand.solid" display="flex" alignItems="center" mt="0.5">{icon}</Box>
      <Text flex="1" minW="0" fontSize="sm" fontWeight="medium" color="fg.muted" textAlign="right" dir="auto">
        {children}
      </Text>
    </Flex>
  )
}

/** کارت فروشنده یا خریدار. */
function PartyCard({ title, party }: { title: string; party: Party }) {
  return (
    <Flex direction="column" flex="1" minW="0">
      <Text fontSize="md" fontWeight="semibold" color="fg.muted" textAlign="right" pb="2">
        {title}
      </Text>
      <Flex direction="column" gap="2" w="full" h="full" minH="20" px="6" py="4" rounded="xl" borderWidth="1px" borderColor="border.muted">
        <Text fontSize="lg" fontWeight="semibold" color="fg" textAlign="right" dir="auto" pb="1">
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
    <Flex justify="space-between" align="flex-start" gap="4" py="1" w="full">
      <Text fontSize="xs" fontWeight="medium" color="fg.muted" textAlign="right" flexShrink={0}>
        {label}
      </Text>
      <Text fontSize="sm" fontWeight="semibold" color="fg" textAlign="left" dir="auto" maxW="65%" whiteSpace="pre-line">
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
      <Text fontSize="md" fontWeight="semibold" color="fg.muted" textAlign="right" pb="2">
        {title}
      </Text>
      <Flex direction="column" gap="0.5" w="full" h="full" minH="20" px="6" py="4" rounded="xl" borderWidth="1px" borderColor="border.muted">
        {children}
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
              px="3.5"
              rounded="md"
              fontWeight="semibold"
              fontSize="sm"
              _hover={{ bg: 'brand.emphasized', color: 'brand.fg' }}
              onClick={handlePrint}
            >
              {/* RTL: آیکن FIRST (راست = leading) */}
              <Printer size={16} />
              پرینت فاکتور
            </Button>
          }
        />

        {/* ── Alert راهنما (چاپ نمی‌شود) ── */}
        <Alert.Root status="info" variant="surface" rounded="lg" px="3" py="3" gap="2">
          <Alert.Indicator />
          <Alert.Title flex="1" fontSize="xs" fontWeight="medium" textAlign="right">
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
                {/* ردیف بالا: RTL → logo راست · title وسط · contact چپ */}
                <Flex
                  direction={isCompact ? 'column' : { base: 'column', sm: 'row' }}
                  align={isCompact ? 'center' : { base: 'center', sm: 'flex-start' }}
                  gap="4"
                  w="full"
                >
                  {/* Logo (راست) */}
                  <Flex
                    direction="column"
                    flex="1"
                    align={isCompact ? 'center' : { base: 'center', sm: 'flex-start' }}
                    gap="1"
                  >
                    <img src={logoSrc.src} alt="ویترینا" style={{ height: '24px' }} />
                    <Text fontSize="2xs" color="fg.muted">پلتفرم فروشگاه های اینستاگرام</Text>
                  </Flex>

                  {/* Title (وسط) */}
                  <Flex direction="column" flex="1" align="center" gap="1">
                    <Text fontSize="xl" fontWeight="semibold" color="fg">فاکتور فروش</Text>
                    <Text fontSize="sm" color="fg.muted">فاکتور سیستمی</Text>
                  </Flex>

                  {/* Contact (چپ) */}
                  <Flex
                    direction="column"
                    flex="1"
                    align={isCompact ? 'center' : { base: 'center', sm: 'flex-end' }}
                    gap="1.5"
                  >
                    <ContactRow icon={<Headset size={14} />}>{INVOICE.contact.phone}</ContactRow>
                    <ContactRow icon={<Mail size={14} />}>{INVOICE.contact.email}</ContactRow>
                  </Flex>
                </Flex>

                {/* متا ۲×۲ — RTL: item1 = راست‌بالا */}
                <Grid
                  templateColumns={isCompact ? '1fr' : { base: '1fr', sm: 'repeat(2, 1fr)' }}
                  columnGap="8"
                  rowGap="2"
                  w="full"
                >
                  <MetaCell label="شماره سفارش"  value={ORDER.code} />
                  <MetaCell label="تاریخ صدور"   value={INVOICE.issueDate} />
                  <MetaCell label="شماره فاکتور" value={INVOICE.number} />
                  <MetaCell label="تاریخ پرداخت" value={INVOICE.paymentDate} />
                </Grid>
              </Flex>

              {/* ══ ۲. وضعیت پرداخت (Alert سبز) ══ */}
              <Alert.Root status="success" variant="surface" rounded="xl" px="3" py="2.5" gap="2" alignItems="flex-start">
                {/* RTL: Alert خودش dir می‌ذارد → آیکن سمت راست */}
                <Alert.Indicator mt="0.5"><CreditCard size={16} /></Alert.Indicator>
                <Alert.Content gap="0.5">
                  <Alert.Title fontSize="xs" fontWeight="medium" textAlign="right">{INVOICE.paid.title}</Alert.Title>
                  <Alert.Description fontSize="2xs" textAlign="right">{INVOICE.paid.body}</Alert.Description>
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
                <Text fontSize="md" fontWeight="semibold" color="fg.muted" textAlign="right">اقلام سفارش</Text>

                {/* جدول — RTL: کالا راست · تعداد وسط · جمع چپ */}
                <Box w="full">
                  {/* سرستون */}
                  <Flex w="full" borderTopWidth="1px" borderBottomWidth="1px" borderColor="border.muted" bg="bg.subtle">
                    <Box flex="1" minW="0" px="4" py="2">
                      <Text fontSize="xs" fontWeight="medium" color="fg.muted" textAlign="right">کالا</Text>
                    </Box>
                    <Box flexShrink={0} w="20" px="4" py="2">
                      <Text fontSize="xs" fontWeight="medium" color="fg.muted" textAlign="center">تعداد</Text>
                    </Box>
                    <Box flexShrink={0} w="40" px="4" py="2">
                      <Text fontSize="xs" fontWeight="medium" color="fg.muted" textAlign="right">جمع (تومان)</Text>
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
                        {/* RTL: align flex-start = راست → SKU badge زیر متن، سمت راست */}
                        <Flex direction="column" gap="1" flex="1" minW="0" align="flex-start">
                          <Text fontSize="sm" fontWeight="semibold" color="fg" textAlign="right" w="full" truncate>{item.name}</Text>
                          <Text fontSize="xs" color="fg.muted" textAlign="right" w="full">{item.attrs}</Text>
                          <Badge colorPalette="gray" variant="subtle" size="sm">SKU: {item.sku}</Badge>
                        </Flex>
                      </Flex>

                      {/* تعداد */}
                      <Flex flexShrink={0} w="20" px="4" py="3" align="center" justify="center">
                        <Text fontSize="sm" fontWeight="semibold" color="fg">{item.qty}</Text>
                      </Flex>

                      {/* جمع */}
                      <Flex flexShrink={0} w="40" px="4" py="3" direction="column" gap="1" justify="center">
                        <Text fontSize="xs" color="fg.muted" textAlign="right" dir="auto">{item.qty} x {item.unit} {CURRENCY}</Text>
                        <Text fontSize="sm" fontWeight="semibold" color="fg" textAlign="right" dir="auto">{item.total} {CURRENCY}</Text>
                      </Flex>
                    </Flex>
                  ))}
                </Box>

                {/* جمع‌بندی — RTL: سمت چپ */}
                <Box w={isCompact ? 'full' : { base: 'full', md: '320px' }} alignSelf="flex-end" pt="2">
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
                  <Separator my="2" />

                  {/* مبلغ قابل پرداخت */}
                  <Flex justify="space-between" align="center" px="4" py="2.5" rounded="xl" bg="bg.muted" mt="1" w="full">
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
              <Alert.Root status="warning" variant="surface" rounded="xl" px="3" py="2.5" gap="2" alignItems="flex-start">
                <Alert.Indicator mt="0.5"><Info size={14} /></Alert.Indicator>
                <Alert.Content gap="0.5">
                  <Alert.Title fontSize="xs" fontWeight="medium" textAlign="right">یادداشت فروشنده:</Alert.Title>
                  <Alert.Description fontSize="2xs" textAlign="right">{INVOICE.note}</Alert.Description>
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
                <Text fontSize="2xs" color="fg.subtle" textAlign="right" flex="1" minW="0">
                  این فاکتور به صورت سیستمی صادر شده و معتبر است.
                </Text>
              </Flex>

              {/* صفحه (وسط) */}
              <Text fontSize="2xs" color="fg.subtle" textAlign="center" flexShrink={0} px="2">صفحه ۱ از ۱</Text>

              {/* vitrina.ir (چپ) */}
              <Flex flex="1" justify="flex-end">
                <Text fontSize="xs" fontWeight="medium" color="brand.solid">vitrina.ir</Text>
              </Flex>
            </Flex>
          </Box>

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
