'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Flex } from '@chakra-ui/react'
import type { LucideIcon } from 'lucide-react'
import { Gift, RefreshCcw, Send, Truck } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { TitleBar } from '@/components/ui/TitleBar'
import { PromotionCard } from '@/components/marketing/promotions/PromotionCard'
import { PROMOTIONS } from '@/components/marketing/promotions/data'
import { DiscountSettingsDialog, type DiscountFormValues } from '@/components/marketing/promotions/DiscountSettingsDialog'

const ICONS: Record<string, LucideIcon> = {
  'first-purchase': Gift,
  'repeat-purchase': RefreshCcw,
  'free-shipping': Truck,
  'bulk-sms': Send,
}

/** دو کارتی که دیالوگ تنظیمات تخفیف واقعی دارن (بقیه کارت‌ها فعلاً بدون Figma برای دیالوگشون‌اند) */
type DialogId = 'first-purchase' | 'repeat-purchase'

const DIALOG_COPY: Record<DialogId, { title: string; alertText: string; showValidityField: boolean }> = {
  'first-purchase': {
    title: 'تنظیمات تخفیف خرید اول',
    alertText: 'این تخفیف برای اولین خرید هر مشتری به صورت خودکار اعمال می‌شود و نیازی به وارد کردن کد ندارد.',
    showValidityField: false,
  },
  'repeat-purchase': {
    title: 'سیاست‌های تخفیف خرید بعدی',
    alertText: '۳ ساعت پس از ارسال سفارش، سیستم به صورت خودکار کد تخفیف برای مشتری پیامک می‌کند.',
    showValidityField: true,
  },
}

/**
 * صفحه «پروموشن ها» — Figma «Promotion / List» (node 2681:38231، One Column Center).
 *
 * annotation روی Switch کارت اول (node 2700:40133): «این گزینه رو دفعه اول که فعال می‌کنه
 * هم‌زمان مودال تنظیمات هم باز می‌شه — اگر تنظیمات رو انجام بده و ذخیره کنه این گزینه فعال
 * می‌شه، وگرنه غیرفعال می‌مونه.» — با دیالوگ «تنظیمات تخفیف خرید اول» (node 2700:43295/43551)
 * پیاده شد: toggle از OFF→ON بلافاصله enabled نمی‌کنه، دیالوگ باز می‌شه؛ فقط با ذخیره enabled
 * می‌شه، با انصراف/بستن toggle به OFF برمی‌گرده. توضیح مشابهی برای کارت دوم annotate نشده بود،
 * پس toggle اون مستقیم عمل می‌کنه (فقط دکمهٔ «سیاست های تخفیف» دیالوگ رو باز می‌کنه).
 */
export function Promotions() {
  const router = useRouter()
  const [promotions, setPromotions] = useState(PROMOTIONS)
  const [activeDialog, setActiveDialog] = useState<DialogId | null>(null)

  const hasDialog = (id: string): id is DialogId => id === 'first-purchase' || id === 'repeat-purchase'

  const handleToggle = (id: string, checked: boolean) => {
    if (id === 'first-purchase' && checked) {
      // annotation: فعال‌سازی مستقیم نه — اول دیالوگ تنظیمات باز می‌شه، enabled فقط با ذخیره
      setActiveDialog('first-purchase')
      return
    }
    setPromotions((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: checked } : p)))
  }

  const handleOpenSettings = (id: string) => {
    if (hasDialog(id)) setActiveDialog(id)
  }

  const handleDialogClose = () => {
    setActiveDialog(null) // انصراف/بستن → توگل هیچ‌وقت ست نشد، همون OFF می‌مونه
  }

  const handleDialogSave = (id: DialogId, _values: DiscountFormValues) => {
    // فقط کارت اول enabled از دیالوگ گیت شده (annotation) — کارت دوم دکمه‌اش صرفاً ویرایش تنظیماته
    if (id === 'first-purchase') {
      setPromotions((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: true } : p)))
    }
    setActiveDialog(null)
  }

  return (
    <Flex direction="column" gap="4" alignItems="flex-end" w="full">
      <Header
        title="پروموشن ها"
        breadcrumbs={[{ label: 'داشبورد', href: '/' }, { label: 'پروموشن ها' }]}
      />

      {/* Panel spans full width — One Column Center: فقط Flex داخلی در 960px مرکزچین می‌شود */}
      <Box bg="bg.panel" borderWidth="1px" borderColor="border" rounded="2xl" p="6" w="full">
        <Flex direction="column" gap="6" alignItems="flex-end" maxW="960px" w="full" mx="auto">
          <TitleBar
            title="مدیریت پروموشن ها"
            subtitle="ابزارهای بازاریابی برای جذب، نگهداشت و بازگشت مشتری"
            size="xl"
            divider
          />

          <Flex direction="column" gap="4" w="full">
            {promotions.map((promo) => {
              const Icon = ICONS[promo.id]
              return (
                <PromotionCard
                  key={promo.id}
                  icon={<Icon size={32} />}
                  iconColor={promo.iconColor}
                  category={promo.category}
                  title={promo.title}
                  description={promo.description}
                  enabled={promo.enabled}
                  onToggle={(checked) => handleToggle(promo.id, checked)}
                  actionLabel={promo.actionLabel}
                  onAction={
                    hasDialog(promo.id)
                      ? () => handleOpenSettings(promo.id)
                      : promo.id === 'free-shipping'
                        ? () => router.push('/promotions/free-shipping')
                        : promo.id === 'bulk-sms'
                          ? () => router.push('/promotions/bulk-sms')
                          : undefined
                  }
                  badges={promo.badges}
                  disabled={promo.disabled}
                />
              )
            })}
          </Flex>
        </Flex>
      </Box>

      {(['first-purchase', 'repeat-purchase'] as DialogId[]).map((id) => (
        <DiscountSettingsDialog
          key={id}
          open={activeDialog === id}
          onClose={handleDialogClose}
          onSave={(values) => handleDialogSave(id, values)}
          title={DIALOG_COPY[id].title}
          alertText={DIALOG_COPY[id].alertText}
          showValidityField={DIALOG_COPY[id].showValidityField}
        />
      ))}
    </Flex>
  )
}
