import { Box, Flex, Text } from '@chakra-ui/react'
import type { LucideIcon } from 'lucide-react'
import { toPersianDigits } from '@/utils/numbers'

export interface KpiItem {
  key: string
  label: string
  value: number
  icon: LucideIcon
  /** پالت رنگ container آیکون — 'neutral' = bg.subtle/fg.muted (بدون رنگ خاص) */
  palette: 'blue' | 'green' | 'orange' | 'red' | 'brand' | 'neutral'
}

const PALETTE_TOKENS: Record<KpiItem['palette'], { bg: string; fg: string }> = {
  blue: { bg: 'blue.bg', fg: 'blue.solid' },
  green: { bg: 'green.bg', fg: 'green.solid' },
  orange: { bg: 'orange.bg', fg: 'orange.solid' },
  red: { bg: 'red.bg', fg: 'red.solid' },
  brand: { bg: 'brand.bg', fg: 'brand.solid' },
  neutral: { bg: 'bg.subtle', fg: 'fg' },
}

/**
 * کارت KPI آیکون‌دار — جایگزین Stat.Root قدیمی.
 * RTL: هر کارت داخلش متن(label+value) FIRST=راست، icon-container بعدش=چپ — تأیید شده
 * با screenshot مجزای Figma هر کارت (node 5195:86485)، نه حدس از روی الگوی «icon FIRST».
 * DOM order کل ردیف از سمت caller (KPI_ITEMS در ProductList2) میاد — اولین آیتم آرایه = راست‌ترین کارت.
 */
function KpiCard({ item }: { item: KpiItem }) {
  const tokens = PALETTE_TOKENS[item.palette]
  const Icon = item.icon
  return (
    <Flex
      flex="1 0 0" minW="150px"
      bg="bg.panel" borderWidth="1px" borderColor="border" rounded="2xl"
      p="4" gap="4" align="center" justify="end" overflow="hidden"
    >
      <Flex align="center" justify="center" bg={tokens.bg} rounded="xl" p="4" flexShrink={0}>
        <Box color={tokens.fg}>
          <Icon size={24} />
        </Box>
      </Flex>
      <Flex direction="column" gap="2" align="end" flex="1" minW="0">
        <Text fontSize="sm" color="fg.muted" whiteSpace="nowrap">{item.label}</Text>
        <Text fontSize="2xl" fontWeight="semibold" letterSpacing="tight" lineHeight="1.333">
          {toPersianDigits(item.value)}
        </Text>
      </Flex>
    </Flex>
  )
}

/** ردیف KPI — والد فقط چیدمان می‌ده، کارت‌ها رو به همون ترتیب آرایه (اولی=راست‌ترین) رندر می‌کنه. */
export function KpiRow({ items }: { items: KpiItem[] }) {
  return (
    <Flex gap="4" flexWrap="wrap">
      {items.map((item) => (
        <KpiCard key={item.key} item={item} />
      ))}
    </Flex>
  )
}
