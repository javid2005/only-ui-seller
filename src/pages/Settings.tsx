import { useState } from 'react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import storeCover from '@/assets/store/store-cover.jpg'
import storeThumbnail from '@/assets/store/store-thumbnail.jpg'
import {
  Box, Flex, Text, Badge, IconButton,
  Menu, Dialog, Button, Portal, Grid,
} from '@chakra-ui/react'
import {
  Truck,
  Store,
  Shield,
  Palette,
  LayoutGrid,
  DollarSign,
  Globe,
  CreditCard,
  EllipsisVertical,
  X,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { TitleBar } from '@/components/ui/TitleBar'
import { SettingCard } from '@/components/settings/SettingCard'
import type { SettingCardProps } from '@/components/settings/SettingCard'

// ─── Data ────────────────────────────────────────────────────────────────────

type Section = {
  title: string
  cards: Omit<SettingCardProps, 'icon'> & { icon: React.ReactNode }[]
}

const SETTINGS_SECTIONS: Section[] = [
  {
    title: 'تنظیمات عمومی',
    cards: [
      {
        title: 'اطلاعات فروشگاه',
        description: 'ویرایش اطلاعات عمومی، راه های ارتباطی و آدرس فروشگاه',
        icon: <Store size={24} />,
        iconBg: 'teal.subtle',
        iconColor: 'teal.fg',
        to: '/settings/store-info',
      },
      {
        title: 'روش های ارسال',
        description: 'ایجاد و مدیریت روش های ارسال شخصی و سیستمی',
        icon: <Truck size={24} />,
        iconBg: 'purple.subtle',
        iconColor: 'purple.fg',
        to: '/settings/shipping',
      },
      {
        title: 'نمادها و مجوزها',
        description: 'مشاهده و مدیریت نمادها و مجوزهای فروشگاه',
        icon: <Shield size={24} />,
        iconBg: 'red.subtle',
        iconColor: 'red.fg',
        to: '/settings/badges',
      },
      {
        title: 'پوسته ها',
        description: 'تغییر و ویرایش پوسته های قابل اجرا روی فروشگاه',
        icon: <Palette size={24} />,
        iconBg: 'orange.subtle',
        iconColor: 'orange.fg',
        to: '/settings/themes',
      },
    ],
  },
  {
    title: 'تنظیمات محصول',
    cards: [
      {
        title: 'دسته بندی ها',
        description: 'مشاهده و مدیریت دسته بندی های اصلی فروشگاه',
        icon: <LayoutGrid size={24} />,
        iconBg: 'green.subtle',
        iconColor: 'green.fg',
        to: '/settings/categories',
      },
      {
        title: 'تنظیمات فروش',
        description: 'قیمت دلاری، قیمت گذاری طلا، فروش تلفنی و...',
        icon: <DollarSign size={24} />,
        iconBg: 'yellow.subtle',
        iconColor: 'yellow.fg',
        to: '/settings/sales',
      },
    ],
  },
  {
    title: 'به زودی...',
    cards: [
      {
        title: 'دامنه',
        description: 'مشاهده و ویرایش دامنه اختصاصی فروشگاه',
        icon: <Globe size={24} />,
        iconBg: 'pink.subtle',
        iconColor: 'pink.fg',
        state: 'disabled' as const,
      },
      {
        title: 'درگاه پرداخت',
        description: 'مدیریت و ویرایش تنظیمات درگاه های پرداخت',
        icon: <CreditCard size={24} />,
        iconBg: 'blue.subtle',
        iconColor: 'blue.fg',
        state: 'disabled' as const,
      },
    ],
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function CardList({ cards }: { cards: Section['cards'] }) {
  const isCompact = useCompactMode()
  return (
    <Grid
      templateColumns={isCompact ? '1fr' : { base: '1fr', lg: 'repeat(2, 1fr)' }}
      gap="4"
      w="full"
    >
      {cards.map((card) => (
        <SettingCard key={card.title} {...card} />
      ))}
    </Grid>
  )
}

// ─── Store Profile Header ─────────────────────────────────────────────────────

function StoreHeader() {
  const [isOrderActive, setIsOrderActive] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleConfirm = () => {
    setIsOrderActive((prev) => !prev)
    setDialogOpen(false)
  }

  return (
    <Box w="full" flexShrink={0}>
      {/* Cover banner — 160px desktop / 120px mobile, overlaps into data row below */}
      <Box
        h={{ base: '120px', sm: '160px' }}
        rounded="lg"
        overflow="hidden"
        mb={{ base: '-8', sm: '-10' }}
        position="relative"
        bg="bg.muted"
      >
        <Box
          as="img"
          src={storeCover}
          w="full"
          h="full"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
      </Box>

      {/* Data row: thumbnail | store info | ellipsis */}
      <Flex gap={{ base: '3', sm: '6' }} alignItems="flex-start" px={{ base: '3', sm: '6' }} w="full">

        {/* Thumbnail — FIRST in DOM = rightmost in RTL */}
        <Box
          w={{ base: '80px', sm: '120px' }}
          h={{ base: '80px', sm: '120px' }}
          flexShrink={0}
          rounded="lg"
          borderWidth={{ base: '2px', sm: '4px' }}
          borderStyle="solid"
          borderColor="bg.panel"
          shadow="md"
          overflow="hidden"
          bg="bg.subtle"
          position="relative"
          zIndex={1}
        >
          <Box
            as="img"
            src={storeThumbnail}
            w="full"
            h="full"
            style={{ objectFit: 'cover', borderRadius: '4px' }}
          />
        </Box>

        {/* Store info — SECOND = middle */}
        <Flex
          flex="1"
          direction="column"
          gap="1"
          alignItems="flex-start"
          pt={{ base: '10', sm: '14' }}
          minW="0"
        >
          <Text fontSize={{ base: 'lg', sm: 'xl' }} fontWeight="semibold" color="fg" lineHeight="1.5">
            فروشگاه مزباکس
          </Text>
          <Badge
            colorPalette={isOrderActive ? 'green' : 'gray'}
            variant="subtle"
            size="md"
          >
            {isOrderActive ? 'سفارش گیری فعال' : 'سفارش گیری غیرفعال'}
          </Badge>
        </Flex>

        {/* Ellipsis menu — LAST in DOM = leftmost in RTL */}
        <Box pt={{ base: '10', sm: '14' }} flexShrink={0}>
          <Menu.Root
            positioning={{
              placement: 'bottom-start',
              flip: true,
              shift: true,
            }}
          >
            <Menu.Trigger asChild>
              <IconButton
                variant="ghost"
                size="md"
                aria-label="گزینه‌های بیشتر"
                color="fg.muted"
              >
                <EllipsisVertical size={20} />
              </IconButton>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner dir="rtl">
                <Menu.Content minW="200px">
                  <Menu.Item
                    value="toggle-orders"
                    onClick={() => setDialogOpen(true)}
                  >
                    {isOrderActive
                      ? 'غیرفعالسازی سفارش گیری'
                      : 'فعالسازی سفارش گیری'}
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Box>

      </Flex>

      {/* ── Confirmation Dialog ── */}
      <Dialog.Root
        open={dialogOpen}
        onOpenChange={(details) => setDialogOpen(details.open)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner
            dir="rtl"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Dialog.Content maxW="420px" w="full" mx="4">

              {/* Close button — insetInlineEnd = physical LEFT in RTL */}
              <Dialog.CloseTrigger
                position="absolute"
                top="2"
                insetInlineEnd="2"
                asChild
              >
                <IconButton variant="ghost" size="sm" aria-label="بستن">
                  <X size={16} />
                </IconButton>
              </Dialog.CloseTrigger>

              <Dialog.Header pt="6" pb="2" px="6">
                <Dialog.Title fontSize="lg" fontWeight="semibold">
                  {isOrderActive ? 'غیرفعالسازی' : 'فعالسازی'}
                </Dialog.Title>
              </Dialog.Header>

              <Dialog.Body px="6" py="2">
                <Text fontSize="sm" color="fg.muted">
                  {isOrderActive
                    ? 'آیا از غیرفعال کردن سفارش گیری فروشگاه خود مطمئن هستید ؟'
                    : 'آیا از فعال کردن سفارش گیری فروشگاه خود مطمئن هستید ؟'}
                </Text>
              </Dialog.Body>

              <Dialog.Footer pt="2" pb="4" px="6">
                {/* DOM order: primary action FIRST = rightmost in RTL */}
                <Button
                  colorPalette={isOrderActive ? 'red' : 'green'}
                  size="sm"
                  onClick={handleConfirm}
                >
                  {isOrderActive ? 'غیرفعال کن' : 'فعال کن'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDialogOpen(false)}
                >
                  لغو
                </Button>
              </Dialog.Footer>

            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

    </Box>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function Settings() {
  const isCompact = useCompactMode()

  return (
    <Flex direction="column" gap="4" alignItems="flex-end" w="full">

      {/* Page header: breadcrumb + title */}
      <Header
        title="تنظیمات فروشگاه"
        breadcrumbs={[
          { label: 'داشبورد', href: '/' },
          { label: 'تنظیمات فروشگاه' },
        ]}
      />

      {/* Content card */}
      <Box
        bg="bg.panel"
        borderWidth="1px"
        borderColor="border"
        rounded="2xl"
        pt={isCompact ? '4' : { base: '4', sm: '6' }}
        pb="6"
        px={isCompact ? '4' : { base: '4', sm: '6' }}
        w="full"
        overflow="hidden"
      >
        {/* Middle column: max 960px, centered */}
        <Flex
          direction="column"
          gap={isCompact ? '8' : { base: '8', sm: '16' }}
          maxW="960px"
          w="full"
          mx="auto"
          alignItems="flex-end"
        >
          {/* Store profile header */}
          <StoreHeader />

          {/* Settings sections */}
          {SETTINGS_SECTIONS.map((section) => (
            <Flex
              key={section.title}
              direction="column"
              gap="6"
              alignItems="flex-end"
              w="full"
              flexShrink={0}
            >
              <TitleBar title={section.title} divider size="xl" />
              <CardList cards={section.cards} />
            </Flex>
          ))}

        </Flex>
      </Box>

    </Flex>
  )
}
