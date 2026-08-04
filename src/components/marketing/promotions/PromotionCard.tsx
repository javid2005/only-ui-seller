import type { ReactNode } from 'react'
import { Badge, Box, Button, Flex, Separator, Switch, Text } from '@chakra-ui/react'
import { useCompactMode } from '@/contexts/CompactModeContext'

export interface PromotionCardProps {
  icon: ReactNode
  iconColor: 'orange' | 'red' | 'pink' | 'purple'
  category: string
  title: string
  description: string
  enabled: boolean
  onToggle: (checked: boolean) => void
  actionLabel: string
  onAction?: () => void
  badges: string[]
}

/**
 * کارت پروموشن — Figma «Promotion-Card» (node 2681:39033، state Default/Hover/Disabled).
 * RTL DOM order (metadata x-coords، نه ترتیب خام JSX که LTR canvas است):
 *  root  → آیکون (x=896-944, راست‌ترین) FIRST ← ستون محتوا SECOND
 *  Top   → بلوک عنوان+برچسب+توضیحات (x=56-864, راست‌تر) FIRST ← Switch (x=0-40, چپ) SECOND
 *  Wrapper → عنوان (x=702-808) FIRST ← برچسب دسته (x=573-694) SECOND — مطابق قرارداد AdChannelCard
 *  Bottom  → برچسب‌های سبز (x=516-864) FIRST ← دکمه عملیات (x=0-77) SECOND — بج‌های سبز خودشون هم
 *  به ترتیب معکوسِ JSX خام‌اند (data.ts از قبل به ترتیب راست‌ترین اول نگه‌داری می‌شه).
 *
 * media<md (کاربر، ۱۴۰۴): چیدمان عمودی — ردیف بالا [آیکون(راست) + Switch(چپ)]، بعد عنوان/بج/توضیحات،
 * بعد بج‌های سبز، بعد دکمه تمام‌عرض. دو بلوک (دسکتاپ/موبایل) با display توگل می‌شن — مثل الگوی
 * AdChannelCard (دو کپی از دکمه اکشن) — نه ری‌فلوی CSS تنها، چون چینش آیکون/Switch/عنوان بین دو حالت
 * ساختاراً فرق می‌کنه (دسکتاپ: آیکون sibling کارت، Switch کنار عنوان — موبایل: آیکون+Switch یک ردیف جدا).
 */
export function PromotionCard({
  icon,
  iconColor,
  category,
  title,
  description,
  enabled,
  onToggle,
  actionLabel,
  onAction,
  badges,
}: PromotionCardProps) {
  const isCompact = useCompactMode()

  const iconBox = (
    <Flex
      flexShrink={0}
      align="center"
      justify="center"
      boxSize="12"
      bg={`${iconColor}.subtle`}
      borderWidth="1px"
      borderColor={`${iconColor}.muted`}
      color={`${iconColor}.solid`}
      rounded="4px"
    >
      {icon}
    </Flex>
  )

  const switchControl = (
    <Switch.Root
      colorPalette="brand"
      size="md"
      checked={enabled}
      onCheckedChange={(e) => onToggle(e.checked)}
      flexShrink={0}
    >
      <Switch.HiddenInput />
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
    </Switch.Root>
  )

  const titleBlock = (
    <Flex direction="column" gap="2" flex="1" minW="0" alignItems="flex-end">
      <Flex align="center" gap="2" w="full" justify="flex-start">
        {/* عنوان FIRST = راست‌ترین (نزدیک آیکون)، برچسب دسته SECOND = چپ‌تر */}
        <Text fontSize="md" fontWeight="semibold" color="fg" textAlign="right">{title}</Text>
        <Badge colorPalette="gray" variant="subtle" size="md" flexShrink={0}>{category}</Badge>
      </Flex>
      <Text fontSize="sm" color="fg.muted" textAlign="right" w="full">{description}</Text>
    </Flex>
  )

  const badgesRow = (
    <Flex gap="2" align="center" wrap="wrap">
      {badges.map((label) => (
        <Badge key={label} colorPalette="green" variant="subtle" size="md">{label}</Badge>
      ))}
    </Flex>
  )

  const actionButton = (fullWidth: boolean) => (
    <Button
      variant="outline"
      colorPalette="brand"
      size="md"
      h="9"
      px="3.5"
      fontWeight="semibold"
      onClick={onAction}
      flexShrink={0}
      w={fullWidth ? 'full' : undefined}
    >
      {actionLabel}
    </Button>
  )

  return (
    <Box
      borderWidth="1px"
      borderColor="border"
      rounded="md"
      p="4"
      w="full"
      _hover={{ borderColor: 'brand.focusRing' }}
    >
      {/* دسکتاپ (md+، غیر-compact) — آیکون sibling کارت، Switch کنار عنوان */}
      <Flex display={isCompact ? 'none' : { base: 'none', md: 'flex' }} gap="4" w="full" align="flex-start">
        {iconBox}
        <Flex direction="column" gap="4" flex="1" minW="0" alignItems="flex-end">
          <Flex gap="4" w="full" align="flex-start">
            {titleBlock}
            {switchControl}
          </Flex>
          <Separator w="full" />
          <Flex justify="space-between" align="center" w="full">
            {badgesRow}
            {actionButton(false)}
          </Flex>
        </Flex>
      </Flex>

      {/* media<md (یا compact) — آیکون+Switch یک ردیف بالا، بقیه زیرش عمودی، دکمه تمام‌عرض */}
      <Flex display={isCompact ? 'flex' : { base: 'flex', md: 'none' }} direction="column" gap="4" w="full">
        <Flex justify="space-between" align="center" w="full">
          {iconBox}
          {switchControl}
        </Flex>
        {titleBlock}
        <Separator w="full" />
        {badgesRow}
        {actionButton(true)}
      </Flex>
    </Box>
  )
}
