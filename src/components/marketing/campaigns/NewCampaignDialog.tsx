'use client'

import { useEffect, useState } from 'react'
import { Badge, Box, Button, CloseButton, Dialog, Flex, Portal, RadioCard, Text } from '@chakra-ui/react'
import { Handshake, Megaphone } from 'lucide-react'
import type { ComponentType } from 'react'

export type CampaignTypeId = 'sales' | 'promotion'

export interface CampaignTypeOption {
  id: CampaignTypeId
  title: string
  description: string
  badgeLabel: string
  badgeColor: string
  icon: ComponentType<{ size?: number }>
  iconBg: string
  iconColor: string
}

export const CAMPAIGN_TYPE_OPTIONS: CampaignTypeOption[] = [
  {
    id: 'sales',
    title: 'همکاری در فروش',
    description: 'بازاریاب محصول شما را تبلیغ میکند و در ازای هر فروش موفق، کمیسیون دریافت میکند.',
    badgeLabel: 'براساس فروش',
    badgeColor: 'green',
    icon: Handshake,
    iconBg: 'brand.subtle',
    iconColor: 'brand.fg',
  },
  {
    id: 'promotion',
    title: 'کمپین پروموشن',
    description: 'بازاریاب براساس بازدید یا ثبت نام پاداش می گیرد. بودجه کمپین از ابتدا پرداخت می شود.',
    badgeLabel: 'براساس بازدید/ثبت نام',
    badgeColor: 'purple',
    icon: Megaphone,
    iconBg: 'purple.subtle',
    iconColor: 'purple.fg',
  },
]

/**
 * کارت انتخاب نوع کمپین — RadioCard.Item (Figma local: Campaign-Type-Card, node 4993:76459).
 * RTL DOM order (بر اساس x در طرح، نه ترتیب خام خروجی Figma که LTR است):
 *   Icon (راست‌ترین) → Content(عنوان+بج، توضیح) → ItemIndicator (چپ‌ترین)
 *   ردیف عنوان+بج: عنوان (راست‌تر) → بج (چپ‌تر)
 *
 * INCIDENT 2026-08-03: RadioCard.ItemContent (flexDirection=column) داشت alignItems="flex-end"
 * با نیت «راست‌چین کن» — ولی طبق قانون ستونیِ RTL پروژه (CLAUDE.md)، در column flex زیر dir=rtl
 * align="flex-end" یعنی چپ، نه راست (align="flex-start" یعنی راست). همون خطای justify=flex-end
 * قبلی (CampaignCard) اینجا با align تکرار شد. فیکس شد به alignItems="flex-start".
 */
function CampaignTypeCard({ option }: { option: CampaignTypeOption }) {
  const Icon = option.icon
  return (
    <RadioCard.Item
      value={option.id}
      w="full"
      rounded="lg"
      p="4"
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border"
      boxShadow="none"
      cursor="pointer"
      _hover={{ borderColor: 'brand.focusRing' }}
      _checked={{ bg: 'brand.bg', borderColor: 'brand.focusRing' }}
    >
      <RadioCard.ItemHiddenInput />
      <RadioCard.ItemControl gap="4" p="0" border="none" bg="transparent" boxShadow="none" w="full" alignItems="flex-start">
        {/* آیکون — FIRST = راست‌ترین */}
        <Box
          bg={option.iconBg} color={option.iconColor}
          rounded="lg" p="2" flexShrink={0}
          display="flex" alignItems="center" justifyContent="center"
        >
          <Icon size={24} />
        </Box>

        <RadioCard.ItemContent gap="1" minW="0" alignItems="flex-start" flex="1">
          {/* زیر sm: بج wrap می‌شه زیر عنوان (ستونی) — عنوان تنگ کنار بج نمی‌شکنه.
              sm به بالا: کنار هم، هم‌ردیف (طبق طرح دسکتاپ) */}
          <Flex
            direction={{ base: 'column', sm: 'row' }}
            align={{ base: 'flex-start', sm: 'center' }}
            justify="flex-start"
            gap={{ base: '1.5', sm: '2' }}
            w="full"
          >
            {/* flexGrow={0} چون RadioCard.ItemText به‌صورت پیش‌فرض flex:1 داره (برای truncation) —
                بدونش عنوان کل عرض ردیف رو fill می‌کرد و بج رو تا لبه‌ی چپ هل می‌داد،
                به‌جای این‌که با فاصله‌ی gap (16px) چسبیده به عنوان بمونه. */}
            <RadioCard.ItemText
              fontSize="sm"
              fontWeight="semibold"
              color="fg"
              flexGrow={0}
              whiteSpace={{ base: 'normal', sm: 'nowrap' }}
            >
              {option.title}
            </RadioCard.ItemText>
            <Badge colorPalette={option.badgeColor} variant="subtle" size="sm">{option.badgeLabel}</Badge>
          </Flex>
          <Text fontSize="xs" color="fg.muted" textAlign="right" w="full">{option.description}</Text>
        </RadioCard.ItemContent>

        {/* اندیکاتور — LAST = چپ‌ترین */}
        <RadioCard.ItemIndicator colorPalette="brand" flexShrink={0} />
      </RadioCard.ItemControl>
    </RadioCard.Item>
  )
}

interface NewCampaignDialogProps {
  open: boolean
  onClose: () => void
  /** کاربر نوع رو انتخاب کرد و «تایید و ادامه» رو زد */
  onConfirm: (type: CampaignTypeId) => void
}

/**
 * دیالوگ «کمپین جدید» — انتخاب نوع کمپین (Figma: Dialog, node 2643:53793).
 * کاربر اول یک نوع رو انتخاب می‌کند، بعد «تایید و ادامه» را می‌زند (تا انتخاب نشده غیرفعال است).
 * فلوی ساخت کمپین بعد از تایید (مرحله بعد) خارج از scope این تسک است.
 */
export function NewCampaignDialog({ open, onClose, onConfirm }: NewCampaignDialogProps) {
  const [selectedType, setSelectedType] = useState<CampaignTypeId | null>(null)

  useEffect(() => {
    if (!open) setSelectedType(null)
  }, [open])

  return (
    <Dialog.Root
      open={open}
      onOpenChange={({ open: o }) => !o && onClose()}
      placement="center"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl">
          <Dialog.Content maxW="512px" w="full" mx="4">
            <Dialog.Header pt="6" pb="4" px="6">
              <Dialog.Title fontSize="lg" fontWeight="semibold" color="fg">کمپین جدید</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body pt="2" pb="6" px="6">
              <Flex direction="column" gap="4" alignItems="flex-end" w="full">
                <Text fontSize="sm" color="fg.muted" textAlign="right" w="full">
                  نوع کمپین پس از ایجاد قابل تغییر نیست.
                </Text>

                <RadioCard.Root
                  value={selectedType}
                  onValueChange={(e) => setSelectedType(e.value as CampaignTypeId | null)}
                  w="full"
                >
                  <Flex direction="column" gap="4" w="full">
                    {CAMPAIGN_TYPE_OPTIONS.map((opt) => (
                      <CampaignTypeCard key={opt.id} option={opt} />
                    ))}
                  </Flex>
                </RadioCard.Root>
              </Flex>
            </Dialog.Body>

            {/* دو دکمه — چپ (طبق طرح Figma و قرارداد پروژه: primary LAST در DOM = چپ‌ترین).
                DOM order: بستن(secondary, راست‌ترِ گروه) → تایید و ادامه(primary, چپ‌ترین) */}
            <Dialog.Footer pt="2" pb="4" px="6">
              <Flex justify="flex-end" gap="3" w="full">
                <Button variant="outline" colorPalette="gray" onClick={onClose}>بستن</Button>
                <Button
                  colorPalette="brand"
                  disabled={!selectedType}
                  onClick={() => selectedType && onConfirm(selectedType)}
                >
                  تایید و ادامه
                </Button>
              </Flex>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild position="absolute" top="3" insetEnd="3">
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
