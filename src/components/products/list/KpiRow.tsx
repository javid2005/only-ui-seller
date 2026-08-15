import { Box, Flex, Grid, IconButton, Text } from '@chakra-ui/react'
import { Filter, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { toPersianDigits } from '@/utils/numbers'

export interface KpiItem {
  key: string
  label: string
  value: number
  icon: LucideIcon
  /** پالت رنگ container آیکون — 'neutral' = bg.subtle/fg.muted (بدون رنگ خاص) */
  palette: 'blue' | 'green' | 'orange' | 'red' | 'yellow' | 'brand' | 'neutral'
}

const PALETTE_TOKENS: Record<KpiItem['palette'], { bg: string; fg: string }> = {
  blue: { bg: 'blue.bg', fg: 'blue.solid' },
  green: { bg: 'green.bg', fg: 'green.solid' },
  orange: { bg: 'orange.bg', fg: 'orange.solid' },
  red: { bg: 'red.bg', fg: 'red.solid' },
  yellow: { bg: 'yellow.bg', fg: 'yellow.solid' },
  brand: { bg: 'brand.bg', fg: 'brand.solid' },
  neutral: { bg: 'bg.subtle', fg: 'fg' },
}

/**
 * کارت KPI آیکون‌دار — جایگزین Stat.Root قدیمی.
 * RTL DOM order: هر کارت داخلش icon-container FIRST=راست، متن(label+value) بعدش، دکمهٔ
 * فیلتر (روی hover/active) LAST=چپ‌ترین — تأیید شده با screenshot مجزای Figma (node
 * 5195:86673 — State=Default/Hover × Size=md/sm) + اندازه‌گیری pixel دقیق preview.
 * RTL align: متن باید چسبیده به آیکون بمونه (align="start"=راست) نه فاصله‌دار از آن.
 * DOM order کل ردیف از سمت caller (KPI_ITEMS در ProductList) میاد — اولین آیتم آرایه = راست‌ترین کارت.
 *
 * Hover/Active state (Figma node 5195:86674): border → brand.focusRing + دکمهٔ فیلتر
 * (چپ‌ترین) ظاهر می‌شه. کلیک روش جدول پایین صفحه رو بر اساس همون KPI فیلتر می‌کنه
 * (onFilterClick از ProductList میاد) — کلیک دوباره روی کارتِ فعال، فیلتر رو پاک می‌کنه.
 *
 * bgBlur: گلوی رنگی تزئینی گوشهٔ کارت (تأیید شده با pixel-sampling روی screenshot Figma،
 * node 5195:86524 — نمونهٔ نارنجی): همیشه فیزیکی «چپ» می‌مونه چون دکوراتیوه و جهت‌مستقل نیست
 * (مثل استثنای centering) — چون اپ همیشه RTLه، insetInlineEnd همون یک مقدار رو می‌ده.
 * رنگ = همون توکن semantic پالت (tokens.bg) به‌جای هاردکد.
 *
 * سایز کوچیک‌تر media<md (Figma node 5204:78700 — grid ۳ ستونه): همهٔ propهای اندازه‌ای
 * responsive-aware هستن (الگوی isCompact ? mobileVal : {base:mobileVal, md:desktopVal}) —
 * هم isCompact (شبیه‌سازی) هم موبایل واقعی رو پوشش می‌ده. آیکون با size="1em" + fontSize
 * responsive روی Box والدش مقیاس می‌گیره (چون prop عددی lucide مستقیماً CSS-responsive نیست).
 */
function KpiCard({ item, isActive, onFilterClick, isCompact }: { item: KpiItem; isActive: boolean; onFilterClick: (key: string) => void; isCompact: boolean }) {
  const tokens = PALETTE_TOKENS[item.palette]
  const Icon = item.icon
  const [isHovered, setIsHovered] = useState(false)
  const blurVar = `var(--chakra-colors-${tokens.bg.replace('.', '-')})`
  const showFilterBtn = isHovered || isActive
  const rv = <T,>(mobile: T, desktop: T) => (isCompact ? mobile : { base: mobile, md: desktop })

  return (
    <Flex
      position="relative"
      w="full"
      bg="bg.panel" borderWidth="1px"
      borderColor={isHovered || isActive ? 'brand.focusRing' : 'border'}
      rounded="2xl"
      p="4" gap={rv('2', '4')} align="center" justify="end" overflow="hidden"
      transition="border-color 0.15s"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box
        position="absolute"
        insetInlineEnd="-47px"
        bottom="-45px"
        w="149px" h="92px"
        rounded="full"
        pointerEvents="none"
        style={{ background: `radial-gradient(circle, ${blurVar} 0%, transparent 70%)` }}
      />

      <Flex align="center" justify="center" bg={tokens.bg} rounded="xl" p={rv('3', '4')} flexShrink={0}>
        <Box color={tokens.fg} fontSize={rv('16px', '24px')} lineHeight="1">
          <Icon size="1em" />
        </Box>
      </Flex>
      <Flex direction="column" gap={rv('1', '2')} align="start" flex="1" minW="0">
        <Text fontSize={rv('xs', 'sm')} color="fg.muted" whiteSpace="nowrap">{item.label}</Text>
        <Text fontSize={rv('xl', '2xl')} fontWeight="semibold" letterSpacing="tight" lineHeight={rv('1.5', '1.333')}>
          {toPersianDigits(item.value)}
        </Text>
      </Flex>
      {showFilterBtn && (
        <IconButton
          aria-label={isActive ? 'حذف فیلتر این وضعیت' : 'فیلتر بر اساس این وضعیت'}
          variant={isActive ? 'subtle' : 'ghost'}
          colorPalette={isActive ? 'brand' : 'gray'}
          size="xs" flexShrink={0}
          onClick={() => onFilterClick(item.key)}
        >
          <Filter size={16} />
        </IconButton>
      )}
    </Flex>
  )
}

interface KpiRowProps {
  items: KpiItem[]
  /** key آیتمی که الان جدول براساسش فیلتر شده — null یعنی فیلتری فعال نیست */
  activeKey?: string | null
  /** کلیک روی دکمهٔ فیلتر یک کارت — toggle: دوباره کلیک روی کارت فعال = پاک‌کردن فیلتر (تصمیم با caller) */
  onFilterClick?: (key: string) => void
  /** true = همیشه grid موبایل (isCompact واقعی)، false = responsive (موبایل واقعی خودش می‌گیره) */
  isCompact?: boolean
}

/**
 * ردیف KPI — والد فقط چیدمان می‌ده، کارت‌ها رو به همون ترتیب آرایه (اولی=راست‌ترین) رندر می‌کنه.
 * چیدمان ستون (نه Figma node، مستقیم از کاربر):
 * - media<sm (زیر ۴۸۰px): ۲ ستون
 * - sm..2xl (۴۸۰ تا ۱۵۳۶px) و isCompact: ۳ ستون ثابت = دو ردیفه (۶ آیتم)
 * - 2xl+ (۱۵۳۶px+): auto-fit (عرض متغیر، همه در یک ردیف جا می‌شن)
 * کارت‌های کوچیک‌تر (size sm) فقط زیر md — تأیید شده با متادیتای Figma (node 5204:78700).
 */
export function KpiRow({ items, activeKey = null, onFilterClick, isCompact = false }: KpiRowProps) {
  return (
    <Grid
      templateColumns={isCompact ? 'repeat(3, 1fr)' : { base: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', '2xl': 'repeat(auto-fit, minmax(150px, 1fr))' }}
      gap={isCompact ? '3' : { base: '3', md: '4' }}
    >
      {items.map((item) => (
        <KpiCard
          key={item.key}
          item={item}
          isActive={item.key === activeKey}
          onFilterClick={onFilterClick ?? (() => {})}
          isCompact={isCompact}
        />
      ))}
    </Grid>
  )
}
