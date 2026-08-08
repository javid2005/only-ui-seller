'use client'

import { useState } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { Header } from '@/components/layout/Header'
import { TitleBar } from '@/components/ui/TitleBar'
import { toaster } from '@/components/ui/toaster'
import {
  AdChannelCard,
  type AdChannelActionVariant,
  type AdChannelBadgeColor,
  type AdChannelPrerequisite,
} from '@/components/marketing/channels/AdChannelCard'
import torobLogo from '@/assets/Marketing/torob.png'
import emallsLogo from '@/assets/Marketing/emalls.png'
import campaingoLogo from '@/assets/Marketing/campaingo.png'
import divarLogo from '@/assets/Marketing/divar.png'
import type { StaticImageData } from 'next/image'

interface AdChannel {
  id: string
  logo: StaticImageData
  title: string
  description: string
  badgeLabel: string
  badgeColor: AdChannelBadgeColor
  actionLabel: string
  actionVariant: AdChannelActionVariant
  prerequisite?: AdChannelPrerequisite
  activatable: boolean
}

const INITIAL_CHANNELS: AdChannel[] = [
  {
    id: 'torob',
    logo: torobLogo,
    title: 'ترب',
    description: 'محصولات فروشگاه شما در موتور جستجوی کالای ترب نمایش داده می‌شوند و بازدیدکننده بیشتری جذب می‌کنید.',
    badgeLabel: 'فعال',
    badgeColor: 'green',
    actionLabel: 'مدیریت',
    actionVariant: 'solid',
    activatable: false,
  },
  {
    id: 'emalls',
    logo: emallsLogo,
    title: 'ایمالز',
    description: 'محصولات شما در پلتفرم مقایسه قیمت ایمالز نمایش داده شده و مشتریان جدیدی جذب می‌کنید.',
    badgeLabel: 'غیرفعال',
    badgeColor: 'gray',
    actionLabel: 'فعالسازی',
    actionVariant: 'outline',
    activatable: true,
  },
  {
    id: 'campaingo',
    logo: campaingoLogo,
    title: 'کمپینو',
    description: 'کمپین‌های بازاریابی مشارکتی تعریف کنید و از ظرفیت بازاریاب‌ها برای افزایش فروش استفاده کنید.',
    badgeLabel: 'پیش نیاز دارد',
    badgeColor: 'orange',
    actionLabel: 'فعالسازی',
    actionVariant: 'disabled',
    activatable: false,
    prerequisite: {
      title: 'پیش نیاز فعالسازی',
      before: 'برای فعال‌سازی، ابتدا درگاه پرداخت پلتفرم را از صفحه ',
      linkLabel: 'تنظیمات فروشگاه',
      linkHref: '/settings',
      after: ' فعال کنید.',
    },
  },
  {
    id: 'divar',
    logo: divarLogo,
    title: 'دیوار',
    description: 'به‌زودی می‌توانید محصولات خود را در دیوار نیز نمایش دهید و از ترافیک بالای این پلتفرم بهره‌مند شوید.',
    badgeLabel: 'به زودی',
    badgeColor: 'blue',
    actionLabel: 'به زودی',
    actionVariant: 'disabled',
    activatable: false,
  },
]

export function AdChannels() {
  const [channels, setChannels] = useState(INITIAL_CHANNELS)

  const handleActivate = (id: string) => {
    setChannels((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, badgeLabel: 'فعال', badgeColor: 'green' as const, actionLabel: 'مدیریت', actionVariant: 'solid' as const, activatable: false }
          : c,
      ),
    )
    toaster.create({ id: `activate-${id}`, title: 'کانال فعال شد', type: 'success', duration: 2500 })
  }

  return (
    <Flex direction="column" gap="4" alignItems="end" w="full">
      <Header
        title="کانال‌های تبلیغاتی"
        breadcrumbs={[{ label: 'داشبورد', href: '/' }, { label: 'کانال‌های تبلیغاتی' }]}
      />

      {/* Panel spans full width — One Column Center: only the inner Flex is capped/centered
          at 960px (پترن پروژه: Reviews.tsx, ThemeSettings.tsx, SalesSettings.tsx, Badges.tsx) */}
      <Box bg="bg.panel" borderWidth="1px" borderColor="border" rounded="2xl" p="6" w="full">
        <Flex direction="column" gap="6" alignItems="end" maxW="960px" w="full" mx="auto">
          <TitleBar
            title="مدیریت کانال ها"
            subtitle="با فعال‌سازی هر کانال، دامنه دیده‌شدن محصولاتتان را گسترش دهید."
            size="xl"
            divider
          />

          <Flex direction="column" gap="4" alignItems="end" w="full">
            {channels.map((c) => (
              <AdChannelCard
                key={c.id}
                logo={c.logo}
                title={c.title}
                description={c.description}
                badgeLabel={c.badgeLabel}
                badgeColor={c.badgeColor}
                actionLabel={c.actionLabel}
                actionVariant={c.actionVariant}
                prerequisite={c.prerequisite}
                onAction={c.activatable ? () => handleActivate(c.id) : undefined}
              />
            ))}
          </Flex>
        </Flex>
      </Box>
    </Flex>
  )
}
