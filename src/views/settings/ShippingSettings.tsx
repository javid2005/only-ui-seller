import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { Box, Flex, Grid, Text, Button, IconButton } from '@chakra-ui/react'
import { Plus, Calculator } from 'lucide-react'
import { Header }      from '@/components/layout/Header'
import { TitleBar }    from '@/components/ui/TitleBar'
import { ButtonFooter } from '@/components/ui/ButtonFooter'
import { ShippingCardCustom } from '@/components/settings/shipping/ShippingCardCustom'
import { ShippingCardSystem }  from '@/components/settings/shipping/ShippingCardSystem'
import {
  ShippingCalculatorDialog,
  type MethodForCalc,
} from '@/components/settings/shipping/ShippingCalculatorDialog'
import postLogo    from '@/assets/Icons/Shipping-Logo/Post.svg'
import tipaxLogo   from '@/assets/Icons/Shipping-Logo/Tipax.svg'
import alopeykLogo from '@/assets/Icons/Shipping-Logo/Alopeyk.svg'
import topinLogo   from '@/assets/Icons/Shipping-Logo/Topin.svg'

// ─── Mock data ────────────────────────────────────────────────────────────────

const CUSTOM_CARDS = [
  {
    id: '1',
    name: 'ارسال با پیک موتوری',
    city: 'مازندران، آمل',
    isDefault: true,
    enabled: true,
    routes: [
      { label: 'درون شهری', icon: 'bike'  as const, days: '۱ روز کاری', method: 'free'  as const },
      { label: 'بین شهری',  icon: 'truck' as const, days: '۳ روز کاری', paymentType: 'پیش کرایه', method: 'fixed' as const },
    ],
  },
  {
    id: '2',
    name: 'ارسال با وانت',
    city: 'مازندران، آمل',
    isDefault: false,
    enabled: true,
    routes: [
      { label: 'درون شهری', icon: 'bike'  as const, days: '۱ روز کاری', method: 'free'   as const },
      { label: 'بین شهری',  icon: 'truck' as const, days: '۳ روز کاری', paymentType: 'پیش کرایه', method: 'weight' as const },
    ],
  },
  {
    id: '3',
    name: 'ارسال با کامیون',
    city: 'مازندران، آمل',
    isDefault: false,
    enabled: false,
    routes: [
      { label: 'درون شهری', icon: 'bike'  as const, days: '۲ روز کاری', method: 'weight' as const },
      { label: 'بین شهری',  icon: 'truck' as const, days: '۷ روز کاری', paymentType: 'پس کرایه', method: 'weight' as const },
    ],
  },
]

const SYSTEM_CARDS = [
  { id: 's1', name: 'پست جمهوری اسلامی', city: 'مازندران، آمل', logoSrc: postLogo.src,    enabled: true },
  { id: 's2', name: 'تیپاکس',             city: 'مازندران، آمل', logoSrc: tipaxLogo.src,   enabled: true },
  { id: 's3', name: 'الوپیک',             city: 'شهر مبدا ...',  logoSrc: alopeykLogo.src, comingSoon: true },
  { id: 's4', name: 'توپین',              city: 'شهر مبدا ...',  logoSrc: topinLogo.src,   comingSoon: true },
]

// ─── Mock calc data (matches Figma sample prices) ────────────────────────────

const CALC_METHODS: MethodForCalc[] = [
  {
    id: '1',
    name: 'ارسال با پیک موتوری',
    intraCity: { enabled: true,  costType: 'fixed',  isFree: true,  amount: '0',      weightRanges: [] },
    interCity: { enabled: true,  costType: 'fixed',  isFree: false, amount: '65000',  weightRanges: [] },
  },
  {
    id: '2',
    name: 'ارسال با وانت',
    intraCity: { enabled: true, costType: 'fixed',  isFree: false, amount: '70000',  weightRanges: [] },
    interCity: {
      enabled: true, costType: 'weight', isFree: false, amount: '', weightRanges: [
        { fromWeight: '0',  fromUnit: 'kg', toWeight: '5',   toUnit: 'kg', isFree: false, amount: '70000'  },
        { fromWeight: '5',  fromUnit: 'kg', toWeight: '20',  toUnit: 'kg', isFree: false, amount: '120000' },
        { fromWeight: '20', fromUnit: 'kg', toWeight: '50',  toUnit: 'kg', isFree: false, amount: '200000' },
        { fromWeight: '50', fromUnit: 'kg', toWeight: '200', toUnit: 'kg', isFree: false, amount: '350000' },
      ],
    },
  },
  {
    id: '3',
    name: 'ارسال با کامیون',
    intraCity: {
      enabled: true, costType: 'weight', isFree: false, amount: '', weightRanges: [
        { fromWeight: '0',   fromUnit: 'kg', toWeight: '10',  toUnit: 'kg', isFree: false, amount: '80000'  },
        { fromWeight: '10',  fromUnit: 'kg', toWeight: '50',  toUnit: 'kg', isFree: false, amount: '148000' },
        { fromWeight: '50',  fromUnit: 'kg', toWeight: '200', toUnit: 'kg', isFree: false, amount: '300000' },
      ],
    },
    interCity: {
      enabled: true, costType: 'weight', isFree: false, amount: '', weightRanges: [
        { fromWeight: '0',   fromUnit: 'kg', toWeight: '10',  toUnit: 'kg', isFree: false, amount: '120000' },
        { fromWeight: '10',  fromUnit: 'kg', toWeight: '50',  toUnit: 'kg', isFree: false, amount: '230000' },
        { fromWeight: '50',  fromUnit: 'kg', toWeight: '200', toUnit: 'kg', isFree: false, amount: '450000' },
      ],
    },
  },
  {
    id: 's1',
    name: 'پست جمهوری اسلامی',
    intraCity: { enabled: true, costType: 'fixed', isFree: false, amount: '55000',  weightRanges: [] },
    interCity: { enabled: true, costType: 'fixed', isFree: false, amount: '85000',  weightRanges: [] },
  },
  {
    id: 's2',
    name: 'تیپاکس',
    intraCity: { enabled: true, costType: 'fixed', isFree: false, amount: '170000', weightRanges: [] },
    interCity: { enabled: true, costType: 'fixed', isFree: false, amount: '230000', weightRanges: [] },
  },
]

// ─── InfoBox (sticky calculator panel) ───────────────────────────────────────

interface InfoBoxProps {
  onOpen:  () => void
  /** true در sidebar (256px) — همیشه column، بدون responsive row */
  sidebar?: boolean
}

function InfoBox({ onOpen, sidebar = false }: InfoBoxProps) {
  const isCompact = useCompactMode()
  // sidebar یا compact → همیشه column / inline → md+ به row تبدیل میشه
  const forceColumn = sidebar || isCompact

  return (
    <Box
      bg="bg.subtle"
      borderWidth="1px"
      borderColor="border"
      rounded="xl"
      p="4"
    >
      <Flex
        direction={forceColumn ? 'column' : { base: 'column', md: 'row' }}
        align={forceColumn ? 'stretch' : { base: 'stretch', md: 'center' }}
        gap="4"
      >
        {/* FIRST = rightmost در RTL = title + description */}
        <Flex direction="column" gap="2" flex="1" minW="0">
          <TitleBar title="محاسبه هزینه ارسال" />
          <Text fontSize="sm" color="fg.muted" lineHeight="1.7">
            جهت محاسبه و مقایسه هزینه ارسال با روش های مختلف اینجا را کلیک کنید.
          </Text>
        </Flex>

        {/* LAST = leftmost در RTL = دکمه */}
        <Button
          colorPalette="brand"
          flexShrink={0}
          w={forceColumn ? 'full' : { base: 'full', md: 'auto' }}
          onClick={onOpen}
        >
          {/* RTL: icon FIRST = rightmost (leading/start icon) ✓ */}
          <Box display="flex" alignItems="center" flexShrink={0}>
            <Calculator size={16} />
          </Box>
          محاسبه هزینه ارسال
        </Button>
      </Flex>
    </Box>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ShippingSettings() {
  const router    = useRouter()
  const isCompact   = useCompactMode()
  const [customCards, setCustomCards] = useState(CUSTOM_CARDS)
  const [systemCards, setSystemCards] = useState(SYSTEM_CARDS)
  const [calcOpen, setCalcOpen] = useState(false)

  const toggleCustom = (id: string, enabled: boolean) =>
    setCustomCards(prev => prev.map(c => c.id === id ? { ...c, enabled } : c))

  const toggleSystem = (id: string, enabled: boolean) =>
    setSystemCards(prev => prev.map(c => c.id === id ? { ...c, enabled } : c) as typeof prev)

  return (
    <Flex direction="column" gap="4" w="full">
      <Header
        title="روش های ارسال"
        breadcrumbs={[
          { label: 'داشبورد', href: '/' },
          { label: 'تنظیمات فروشگاه', href: '/settings' },
          { label: 'روش های ارسال' },
        ]}
      />

      {/* ─── Panel wrapper — Two Columns Right Center ──────────────────────── */}
      <Box
        bg="bg.panel"
        borderWidth="1px"
        borderColor="border"
        rounded="2xl"
        pt={isCompact ? '4' : { base: '4', sm: '6' }}
        pb="6"
        px={isCompact ? '4' : { base: '4', sm: '6' }}
        w="full"
      >
        <Flex gap="10" align="start">

          {/* FIRST = rightmost در RTL: sticky info panel — فقط xl+ و non-compact */}
          {!isCompact && (
            <Box
              display={{ base: 'none', xl: 'block' }}
              w="256px"
              flexShrink={0}
              position="sticky"
              top="20"
              alignSelf="start"
            >
              <InfoBox onOpen={() => setCalcOpen(true)} sidebar />
            </Box>
          )}

          {/* SECOND: main content column — max 960px, no bg/padding */}
          <Flex direction="column" gap="6" maxW="960px" flex="1" minW="0">

            {/* InfoBox روی < xl و compact — وقتی ستون Start مخفیه */}
            <Box display={isCompact ? 'block' : { base: 'block', xl: 'none' }}>
              <InfoBox onOpen={() => setCalcOpen(true)} />
            </Box>

            {/* Section 1: روش‌های سفارشی */}
            <TitleBar
              title="ارسال شخصی"
              subtitle="انتخاب روش های ارسال"
              divider
              cta={
                <>
                  <IconButton display={{ base: 'flex', sm: 'none' }} size="sm" variant="outline" colorPalette="brand" aria-label="افزودن روش ارسال" onClick={() => router.push('/settings/shipping/add')}><Plus size={14} /></IconButton>
                  <Button display={{ base: 'none', sm: 'flex' }} size="sm" colorPalette="brand" variant="outline" onClick={() => router.push('/settings/shipping/add')}><Plus size={14} />افزودن روش ارسال</Button>
                </>
              }
            />

            <Grid
              templateColumns={
                isCompact ? '1fr' : { base: '1fr', lg: 'repeat(2, 1fr)' }
              }
              gap="4"
            >
              {customCards.map(card => (
                <ShippingCardCustom
                  key={card.id}
                  {...card}
                  onToggle={(enabled) => toggleCustom(card.id, enabled)}
                  onEdit={(_id) => {}}
                  onDelete={(_id) => {}}
                />
              ))}
            </Grid>

            {/* Section 2: روش‌های سیستمی */}
            <TitleBar
              title="ارسال سیستمی"
              subtitle="روش های ارسال توسط پست های سیستمی و پست یارها"
              divider
            />

            <Grid
              templateColumns={
                isCompact ? '1fr' : { base: '1fr', lg: 'repeat(2, 1fr)' }
              }
              gap="4"
            >
              {systemCards.map(card => (
                <ShippingCardSystem
                  key={card.id}
                  {...card}
                  onToggle={(enabled) => toggleSystem(card.id, enabled)}
                />
              ))}
            </Grid>

            <ButtonFooter
              primary={{ label: 'ذخیره', onClick: () => router.push('/settings') }}
              back={{ label: 'بازگشت', onClick: () => router.push('/settings') }}
            />
          </Flex>

        </Flex>
      </Box>
      <ShippingCalculatorDialog
        open={calcOpen}
        onClose={() => setCalcOpen(false)}
        methods={CALC_METHODS}
      />
    </Flex>
  )
}
