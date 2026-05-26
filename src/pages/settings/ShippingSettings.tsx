import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { Box, Flex, Grid, Text, Button } from '@chakra-ui/react'
import { Plus, Calculator } from 'lucide-react'
import { Header }      from '@/components/layout/Header'
import { TitleBar }    from '@/components/ui/TitleBar'
import { ButtonFooter } from '@/components/ui/ButtonFooter'
import { ShippingCardCustom } from '@/components/settings/shipping/ShippingCardCustom'
import { ShippingCardSystem }  from '@/components/settings/shipping/ShippingCardSystem'
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
  { id: 's1', name: 'پست جمهوری اسلامی', city: 'مازندران، آمل', logoSrc: postLogo,    enabled: true },
  { id: 's2', name: 'تیپاکس',             city: 'مازندران، آمل', logoSrc: tipaxLogo,   enabled: true },
  { id: 's3', name: 'الوپیک',             city: 'شهر مبدا ...',  logoSrc: alopeykLogo, comingSoon: true },
  { id: 's4', name: 'توپین',              city: 'شهر مبدا ...',  logoSrc: topinLogo,   comingSoon: true },
]

// ─── Start panel (sticky info box) ───────────────────────────────────────────

function InfoBox() {
  return (
    <Box
      bg="bg.subtle"
      borderWidth="1px"
      borderColor="border"
      rounded="xl"
      p="4"
    >
      <TitleBar title="محاسبه هزینه ارسال" />
      <Text fontSize="sm" color="fg.muted" lineHeight="1.7" mt="3">
        جهت محاسبه و مقایسه هزینه ارسال با روش های مختلف اینجا را کلیک کنید.
      </Text>
      <Button mt="4" size="sm" colorPalette="teal" w="full">
        محاسبه هزینه ارسال
        <Calculator size={14} />
      </Button>
    </Box>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ShippingSettings() {
  const navigate    = useNavigate()
  const isCompact   = useCompactMode()
  const [customCards, setCustomCards] = useState(CUSTOM_CARDS)
  const [systemCards, setSystemCards] = useState(SYSTEM_CARDS)

  const toggleCustom = (id: string, enabled: boolean) =>
    setCustomCards(prev => prev.map(c => c.id === id ? { ...c, enabled } : c))

  const toggleSystem = (id: string, enabled: boolean) =>
    setSystemCards(prev => prev.map(c => c.id === id ? { ...c, enabled } : c))

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
        <Flex gap="10" align="flex-start">

          {/* FIRST = rightmost در RTL: sticky info panel — فقط lg+ و non-compact */}
          {!isCompact && (
            <Box
              display={{ base: 'none', lg: 'block' }}
              w="256px"
              flexShrink={0}
              position="sticky"
              top="20"
              alignSelf="flex-start"
            >
              <InfoBox />
            </Box>
          )}

          {/* SECOND: main content column — max 960px, no bg/padding */}
          <Flex direction="column" gap="6" maxW="960px" flex="1" minW="0">

            {/* InfoBox روی mobile/compact — وقتی ستون Start مخفیه */}
            <Box display={isCompact ? 'block' : { base: 'block', lg: 'none' }}>
              <InfoBox />
            </Box>

            {/* Section 1: روش‌های سفارشی */}
            <TitleBar
              title="ارسال شخصی"
              subtitle="انتخاب روش های ارسال"
              divider
              cta={
                <Button size="sm" colorPalette="teal" variant="outline" onClick={() => navigate('/settings/shipping/add')}>
                  افزودن روش ارسال
                  <Plus size={14} />
                </Button>
              }
            />

            <Grid
              templateColumns={
                isCompact ? '1fr' : { base: '1fr', md: 'repeat(2, 1fr)' }
              }
              gap="4"
            >
              {customCards.map(card => (
                <ShippingCardCustom
                  key={card.id}
                  {...card}
                  onToggle={(enabled) => toggleCustom(card.id, enabled)}
                  onEdit={(id) => console.log('edit', id)}
                  onDelete={(id) => console.log('delete', id)}
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
                isCompact ? '1fr' : { base: '1fr', md: 'repeat(2, 1fr)' }
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
              primary={{ label: 'ذخیره', onClick: () => navigate('/settings') }}
              back={{ label: 'بازگشت به تنظیمات فروشگاه', onClick: () => navigate('/settings') }}
            />
          </Flex>

        </Flex>
      </Box>
    </Flex>
  )
}
