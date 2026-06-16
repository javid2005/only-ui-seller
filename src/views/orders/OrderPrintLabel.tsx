import type { ReactNode } from 'react'
import { Box, Flex, Text, Button, Alert, Separator, Badge, Grid, QrCode } from '@chakra-ui/react'
import { Global } from '@emotion/react'
import { Phone, Map, MapPin, Mailbox, Printer, ArrowLeft, ScissorsLineDashed, Info } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { MOCK_ORDER } from '@/components/orders/orderData'
import logoMarkSrc from '@/assets/logo-mark.svg'

/**
 * OrderPrintLabel — صفحه «پرینت برچسب» (Figma: Order / Print-Label — node 2180:32979).
 * قالب: محتوای centered با max-width 808px (متفاوت با بقیه صفحات).
 * Route: /orders/:orderId/print-label
 *
 * خروجی چاپ = فقط کارت برچسب + خط برش (`.print-label`)؛ navbar/sidebar/header/alert چاپ نمی‌شوند.
 * RTL: همه ردیف‌های افقی نسبت به خروجی LTR فیگما reverse شده‌اند (راست‌ترین = اولین فرزند DOM).
 */

// ─── mock data (Figma values) ───────────────────────────────────────────────
const ORDER = MOCK_ORDER

const RECEIVER = {
  name:    ORDER.receiver.name,                                  // احمد گنجی
  phone:   '۰۹۱۲۴۵۶۰۰۸۹',
  city:    `${ORDER.shipping.province}، ${ORDER.shipping.city}`, // تهران، تهران
  address: ORDER.shipping.address,
  postal:  ORDER.shipping.postal,
}

const SENDER = {
  name:    'دفتر پخش ویترینا',
  phone:   '(۰۱۱)۴۴۱۵۱۶۱۳ - (۰۱۱)۵۸۴۷۹۶۲۵',
  city:    'مازندران، آمل',
  address: 'نور، بلوار ارتش، خیابان درزی کلا، جنب بانک ملت',
  postal:  '۱۰۱۲۵۴۷۸۹۶',
}

const LABEL = {
  date:     '۱۴۰۴/۰۱/۱۵',
  tracking: '۱۰۵۴۲۲۰۸۹۹۰۰۰۶۵۴۱۲۵۵۰',
  packages: '۱ عدد',
  items:    '۲ قلم کالا',
  qr:       'هنوز وارد نشده',
}

interface Party {
  name: string
  phone: string
  city: string
  address: string
  postal: string
}

// ─── small building blocks ──────────────────────────────────────────────────

/** ردیف داده داخل کارت گیرنده/فرستنده — RTL: آیکن اول (راست) سپس متن. */
function DataRow({ icon, iconColor, children }: { icon: ReactNode; iconColor: string; children: ReactNode }) {
  return (
    // RTL: default justify (flex-start) = راست. آیکن اول (راست‌ترین) سپس متن راست‌چین.
    <Flex align="center" gap="2" w="full" minW="0">
      <Box flexShrink={0} color={iconColor} display="flex" alignItems="center">
        {icon}
      </Box>
      <Text flex="1" minW="0" fontSize="sm" color="fg.muted" textAlign="right" truncate dir="auto">
        {children}
      </Text>
    </Flex>
  )
}

/** یک خانه از نوار اطلاعات بالای کارت (label بالا، value پایین). */
function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <Flex direction="column" gap="2" minW="0" px="4" py="4" bg="bg.muted">
      <Text fontSize="xs" fontWeight="medium" color="fg.muted" textAlign="right" truncate>
        {label}
      </Text>
      <Text fontSize="sm" fontWeight="semibold" color="fg" textAlign="right" truncate dir="auto">
        {value}
      </Text>
    </Flex>
  )
}

/** کارت گیرنده یا فرستنده. `highlight` = نسخه‌ی گیرنده (teal). */
function PartyCard({ title, party, highlight }: { title: string; party: Party; highlight?: boolean }) {
  const iconColor = highlight ? 'brand.solid' : 'fg.subtle'
  return (
    <Flex direction="column" flex="1" minW="0">
      {/* Title-Bar */}
      <Text fontSize="md" fontWeight="semibold" color="fg.muted" textAlign="right" pb="2">
        {title}
      </Text>

      {/* Card */}
      <Flex
        direction="column"
        gap="2"
        w="full"
        minH="20"
        p="4"
        rounded="xl"
        borderWidth="1px"
        borderColor={highlight ? 'brand.muted' : 'border'}
        bg={highlight ? 'brand.bg' : 'bg.subtle'}
        overflow="hidden"
      >
        <Text fontSize="lg" fontWeight="semibold" color="fg" textAlign="right" dir="auto">
          {party.name}
        </Text>

        <Flex direction="column" gap="1" w="full">
          <DataRow icon={<Phone size={16} />} iconColor={iconColor}>{party.phone}</DataRow>
          <DataRow icon={<Map size={16} />} iconColor={iconColor}>{party.city}</DataRow>
          <DataRow icon={<MapPin size={16} />} iconColor={iconColor}>{party.address}</DataRow>
          <DataRow icon={<Mailbox size={16} />} iconColor={iconColor}>{party.postal}</DataRow>
        </Flex>
      </Flex>
    </Flex>
  )
}

/** کارت پایین برچسب — value بزرگ زیر یک label. */
function FooterStatCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Flex
      direction="column"
      gap="2"
      justify="center"
      flex="1"
      minW="0"
      minH="20"
      p="4"
      rounded="xl"
      borderWidth="1px"
      borderColor="border"
      overflow="hidden"
    >
      <Text fontSize="xs" fontWeight="medium" color="fg.muted" textAlign="right" w="full">
        {label}
      </Text>
      {children}
    </Flex>
  )
}

// ─── view ────────────────────────────────────────────────────────────────────

export function OrderPrintLabel() {
  const isCompact = useCompactMode()

  function handlePrint() {
    window.print()
  }

  return (
    <Flex direction="column" align="center" w="full">
      {/* فقط هنگام چاپ: همه‌چیز پنهان، فقط .print-label دیده می‌شود */}
      <Global
        styles={`
          @media print {
            body * { visibility: hidden !important; }
            .print-label, .print-label * { visibility: visible !important; }
            .print-label {
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
        {/* ── Page-Header: breadcrumb + عنوان + دکمه پرینت ── */}
        <Header
          title="پرینت برچسب"
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
              {/* RTL: متن اول (راست) + آیکن پرینتر آخر (چپ) — مطابق Figma */}
              پرینت برچسب
              <Printer size={16} />
            </Button>
          }
        />

        {/* ── Alert راهنما (چاپ نمی‌شود) ── */}
        <Alert.Root status="info" variant="surface" rounded="lg" px="3" py="3" gap="2">
          <Alert.Indicator />
          <Alert.Title flex="1" fontSize="xs" fontWeight="medium" textAlign="right">
            این برگه را پرینت بگیرید و روی بسته بچسبانید یا داخل آن قرار دهید.
          </Alert.Title>
        </Alert.Root>

        {/* ── ناحیه‌ی چاپ: کارت برچسب + خط برش ── */}
        <Flex className="print-label" direction="column" gap="4" w="full">
          {/* کارت برچسب */}
          <Box w="full" rounded="3xl" borderWidth="1px" borderColor="border" overflow="hidden" bg="bg.panel">
            {/* Header مشکی */}
            <Flex
              position="relative"
              align="center"
              justify="space-between"
              p="6"
              bg="bg.inverted"
              overflow="hidden"
            >
              {/* glow تزئینی */}
              <Box position="absolute" insetInlineEnd="-60px" top="-90px" w="235px" h="225px" rounded="full" bg="teal.700" opacity={0.25} filter="blur(60px)" pointerEvents="none" />
              <Box position="absolute" insetInlineStart="20%" top="18px" w="121px" h="115px" rounded="full" bg="teal.600" opacity={0.2} filter="blur(50px)" pointerEvents="none" />

              {/* RTL (justify-between، 3 بلوک): شماره سفارش راست · تاریخ وسط · logo-mark چپ */}
              <Flex direction="column" position="relative" zIndex={1}>
                <Text fontSize="xs" fontWeight="medium" color="fg.subtle" textAlign="right">شماره سفارش:</Text>
                <Text fontSize="md" fontWeight="semibold" color="fg.inverted" textAlign="right">{ORDER.code}</Text>
              </Flex>

              <Flex direction="column" position="relative" zIndex={1}>
                <Text fontSize="xs" fontWeight="medium" color="fg.subtle" textAlign="right">تاریخ:</Text>
                <Text fontSize="md" fontWeight="semibold" color="fg.inverted" textAlign="right">{LABEL.date}</Text>
              </Flex>

              <Box position="relative" zIndex={1} flexShrink={0}>
                <img src={logoMarkSrc.src} alt="ویترینا" style={{ height: '32px' }} />
              </Box>
            </Flex>

            {/* بدنه سفید */}
            <Flex direction="column" gap="10" p="6">
              {/* نوار اطلاعات ۴ خانه — RTL: روش ارسال راست‌ترین */}
              <Grid
                templateColumns={isCompact ? 'repeat(2, 1fr)' : { base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
                gap="1px"
                w="full"
                rounded="xl"
                borderWidth="1px"
                borderColor="border"
                bg="border"
                overflow="hidden"
              >
                {/* RTL grid: اولین cell = راست‌بالا → روش ارسال راست‌ترین */}
                <InfoCell label="روش ارسال" value={ORDER.shipping.method} />
                <InfoCell label="نوع" value={ORDER.shipping.kind} />
                <InfoCell label="پست پیشتاز" value={ORDER.shipping.fare} />
                <InfoCell label="کد رهگیری" value={LABEL.tracking} />
              </Grid>

              {/* گیرنده / فرستنده — RTL: فرستنده راست، گیرنده چپ، فلش وسط */}
              <Flex
                position="relative"
                align={isCompact ? 'stretch' : { base: 'stretch', md: 'flex-start' }}
                direction={isCompact ? 'column' : { base: 'column', md: 'row' }}
                gap="6"
                w="full"
              >
                <PartyCard title="مشخصات فرستنده" party={SENDER} />

                {/* جداکننده */}
                <Separator
                  orientation={isCompact ? 'horizontal' : { base: 'horizontal', md: 'vertical' }}
                  variant="dashed"
                  alignSelf="stretch"
                />

                <PartyCard title="مشخصات گیرنده" party={RECEIVER} highlight />

                {/* فلش وسط (فقط دسکتاپ) */}
                <Flex
                  position="absolute"
                  left="50%"
                  top="50%"
                  transform={isCompact ? 'translate(-50%, -50%) rotate(-90deg)' : { base: 'translate(-50%, -50%) rotate(-90deg)', md: 'translate(-50%, -50%)' }}
                  align="center"
                  justify="center"
                  p="1"
                  rounded="full"
                  borderWidth="1px"
                  borderColor="border"
                  bg="bg.muted"
                  color="brand.solid"
                >
                  <ArrowLeft size={12} />
                </Flex>
              </Flex>

              {/* ردیف پایین: QR / تعداد بسته / کد رهگیری پستی — RTL: کد رهگیری راست‌ترین */}
              <Flex
                direction={isCompact ? 'column' : { base: 'column', md: 'row' }}
                align={isCompact ? 'stretch' : { base: 'stretch', md: 'center' }}
                gap="4"
                w="full"
              >
                {/* کد رهگیری پستی (راست) */}
                <FooterStatCard label="کد رهگیری پستی">
                  <Text fontSize="sm" fontWeight="semibold" color="fg" textAlign="right" dir="auto">
                    {LABEL.tracking}
                  </Text>
                </FooterStatCard>

                {/* تعداد بسته (وسط) */}
                <FooterStatCard label="تعداد بسته">
                  <Flex align="center" gap="2" w="full">
                    <Text flex="1" minW="0" fontSize="sm" fontWeight="semibold" color="fg" textAlign="right" dir="auto">
                      {LABEL.packages}
                    </Text>
                    <Badge colorPalette="gray" variant="subtle" size="sm" flexShrink={0}>
                      {LABEL.items}
                    </Badge>
                  </Flex>
                </FooterStatCard>

                {/* QR (چپ) — RTL: متن اول (راست) + QR آخر (چپ) */}
                <Flex
                  align="center"
                  justify="space-between"
                  gap="4"
                  flex="1"
                  minW="0"
                  minH="20"
                  p="4"
                  rounded="xl"
                  borderWidth="1px"
                  borderColor="border"
                  overflow="hidden"
                >
                  <Flex direction="column" gap="2" textAlign="right">
                    <Text fontSize="xs" fontWeight="medium" color="fg.muted">QR کد سفارش</Text>
                    <Text fontSize="sm" fontWeight="semibold" color="fg" dir="auto">{LABEL.qr}</Text>
                  </Flex>
                  <Box flexShrink={0}>
                    <QrCode.Root value={`https://vitrina.ir/orders/${ORDER.code}`} size="2xs">
                      <QrCode.Frame>
                        <QrCode.Pattern />
                      </QrCode.Frame>
                    </QrCode.Root>
                  </Box>
                </Flex>
              </Flex>
            </Flex>

            {/* footer برچسب — RTL: راهنما راست، آدرس سایت چپ */}
            <Flex align="center" justify="space-between" gap="2" p="6" bg="bg.muted">
              <Flex align="center" gap="2" minW="0">
                <Box flexShrink={0} color="fg.subtle" display="flex" alignItems="center">
                  <Info size={14} />
                </Box>
                <Text fontSize="xs" color="fg.subtle" textAlign="right" truncate>
                  در صورت بروز مشکل با شماره فروشنده تماس بگیرید
                </Text>
              </Flex>
              <Text fontSize="xs" fontWeight="medium" color="brand.solid" flexShrink={0}>
                vitrina.ir
              </Text>
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
