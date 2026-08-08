'use client'

import { useMemo, useState } from 'react'
import { Badge, Box, Flex, Input, InputGroup, Select, Spacer, Stat, Text, type ListCollection } from '@chakra-ui/react'
import { ArrowUp, Search } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { TitleBar } from '@/components/ui/TitleBar'
import { toLatinDigits } from '@/utils/numbers'
import { useCompactMode } from '@/contexts/CompactModeContext'
import {
  ABANDONED_CARTS, ABANDONED_CART_STATS, statusFilterCollection, dateRangeFilterCollection,
  type AbandonedCartStat, type AbandonedCart,
} from '@/components/marketing/promotions/abandonedCartsData'
import { AbandonedCartTable } from '@/components/marketing/promotions/AbandonedCartTable'
import { AbandonedCartCard } from '@/components/marketing/promotions/AbandonedCartCard'
import { AbandonedCartDetailsDrawer } from '@/components/marketing/promotions/AbandonedCartDetailsDrawer'

interface FilterOption { label: string; value: string }

// Select (نه NativeSelect — قانون پروژه). collectionها از abandonedCartsData.ts (single source).
function FilterSelect({
  collection, defaultValue, minW, maxW, onValueChange,
}: {
  collection: ListCollection<FilterOption>
  defaultValue: string
  minW: string
  maxW: string
  onValueChange?: (value: string) => void
}) {
  return (
    <Select.Root
      collection={collection} defaultValue={[defaultValue]} size="sm" flex="1 0 0" minW={minW} maxW={maxW}
      onValueChange={(e) => onValueChange?.(e.value[0] ?? defaultValue)}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        <Select.Content minW="max-content" maxW="220px">
          {collection.items.map((it) => (
            <Select.Item key={it.value} item={it}>
              <Select.ItemText whiteSpace="nowrap">{it.label}</Select.ItemText>
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  )
}

function CartStatCard({ stat }: { stat: AbandonedCartStat }) {
  return (
    <Stat.Root
      flex="1 0 0" minW="200px"
      bg="bg.panel" borderWidth="1px" borderColor="border" rounded="md" p="4" gap="2"
    >
      <Stat.Label color="fg.muted" fontSize="sm">{stat.label}</Stat.Label>
      <Flex align="center" gap="3">
        <Stat.ValueText fontSize="2xl" fontWeight="semibold" letterSpacing="tight" color={stat.valueColor}>
          {stat.value}
        </Stat.ValueText>
        {stat.trend && (
          <Badge colorPalette={stat.trend.colorPalette} variant="subtle" size="xs" display="inline-flex" alignItems="center" gap="1">
            <ArrowUp size={12} />
            {stat.trend.value}
          </Badge>
        )}
      </Flex>
    </Stat.Root>
  )
}

/**
 * صفحه «سبدهای خرید رها شده» — Figma «Abandoned-Cart / List»
 * دسکتاپ: node 2735:62474 · موبایل/ریسپانسیو: node 3033:66293 · کارت لوکال: node 3126:80768
 * فیلترها: وضعیت (node 2748:63892) · بازه زمانی (node 2748:63864)
 *
 * RTL DOM order (با x نزولی از Figma metadata، نه ترتیب خام JSX که LTR canvas است):
 *  Stats row  → سبد رها شده(راست‌ترین) FIRST ← تبدیل شده به سفارش ← ارزش سبدهای رها شده(چپ‌ترین) LAST
 *  Filters row (دسکتاپ) → جستجو(راست‌ترین) FIRST ← بازه زمانی ← وضعیت ← spacer(چپ‌ترین) LAST
 *  Filters (موبایل) → جستجو ردیف مستقل بالا، ردیف دوم: بازه زمانی(راست‌ترین) FIRST ← وضعیت(چپ‌ترین)
 *
 * تاریخ سبدها در داده‌ی نمونه‌ی فیگما وجود نداره، پس فیلتر «بازه زمانی» فقط state رو نگه می‌داره
 * (منتظر فیلد createdAt واقعی از API).
 */
export function AbandonedCarts() {
  const isCompact = useCompactMode()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  // dateRange فقط state رو نگه می‌داره — بدون فیلد createdAt در داده‌ی نمونه، فیلتر واقعی نداره
  const [, setDateRange] = useState('none')
  const [selectedCart, setSelectedCart] = useState<AbandonedCart | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = toLatinDigits(search.trim()).toLowerCase()
    return ABANDONED_CARTS.filter((c) => {
      const matchesStatus = status === 'all' || c.status === status
      const matchesSearch =
        !q ||
        c.customerName.toLowerCase().includes(q) ||
        toLatinDigits(c.customerPhone).includes(q) ||
        toLatinDigits(c.id).toLowerCase().includes(q)
      return matchesStatus && matchesSearch
    })
  }, [search, status])

  const handleView = (id: string) => {
    const cart = ABANDONED_CARTS.find((c) => c.id === id) ?? null
    setSelectedCart(cart)
    setDrawerOpen(true)
  }

  // تابع (نه JSX ثابت) — چون flex/maxW بسته به context فرق می‌کنه: در ردیف افقی(دسکتاپ)
  // flex-basis روی عرضه، ولی همون element اگه مستقیم زیر Flex ستونی(compact) قرار بگیره
  // flex-basis روی ارتفاع اعمال می‌شه (main-axis ستون = عمودی) و یه جعبهٔ ۲۰۰px بلند نامرئی می‌سازه.
  const renderSearch = (props: { flex?: string; w?: string; maxW?: string | { base: string; md: string } }) => (
    <InputGroup startElement={<Search size={14} color="var(--chakra-colors-fg-subtle)" />} {...props}>
      <Input
        placeholder="جستجو..."
        size="sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </InputGroup>
  )

  return (
    <Flex direction="column" gap="4" alignItems="end" w="full">
      <Header
        title="سبدهای خرید رها شده"
        breadcrumbs={[
          { label: 'داشبورد', href: '/' },
          { label: 'پروموشن ها', href: '/promotions/ads' },
          { label: 'سبدهای خرید رها شده' },
        ]}
      />

      <Box
        bg="bg.panel" borderWidth="1px" borderColor="border" rounded="2xl"
        p={{ base: '4', md: isCompact ? '4' : '6' }} w="full"
      >
        <Flex direction="column" gap="6" alignItems="end" maxW="960px" w="full" mx="auto">

          {/* نمای کلی */}
          <Flex direction="column" gap="6" alignItems="end" w="full">
            <TitleBar
              title="مدیریت سبدها"
              subtitle="کاربرانی که تا آستانه خرید پیش رفته‌اند اما سفارش نهایی ثبت نکرده‌اند."
              size="xl"
              divider
            />
            <Flex gap="4" w="full" flexWrap="wrap">
              {ABANDONED_CART_STATS.map((stat) => (
                <CartStatCard key={stat.label} stat={stat} />
              ))}
            </Flex>
          </Flex>

          {/* فیلترها — compact bar: جستجو ردیف مستقل بالا + ردیف دوم دو Select */}
          <Flex
            display={isCompact ? 'flex' : { base: 'flex', md: 'none' }}
            direction="column" gap="4" w="full"
          >
            {renderSearch({ w: 'full' })}
            <Flex gap="4" w="full">
              <FilterSelect collection={dateRangeFilterCollection} defaultValue="none" minW="0" maxW="none" onValueChange={setDateRange} />
              <FilterSelect collection={statusFilterCollection} defaultValue="all" minW="0" maxW="none" onValueChange={setStatus} />
            </Flex>
          </Flex>

          {/* فیلترها — desktop bar: جستجو + دو Select در یک ردیف */}
          <Flex
            display={isCompact ? 'none' : { base: 'none', md: 'flex' }}
            gap="4" align="center" w="full"
          >
            {renderSearch({ flex: '1 0 200px', maxW: '320px' })}
            <FilterSelect collection={dateRangeFilterCollection} defaultValue="none" minW="120px" maxW="160px" onValueChange={setDateRange} />
            <FilterSelect collection={statusFilterCollection} defaultValue="all" minW="120px" maxW="160px" onValueChange={setStatus} />
            <Spacer />
          </Flex>

          {/* لیست — جدول در دسکتاپ، کارت در موبایل/compact */}
          {filtered.length === 0 ? (
            <Flex w="full" py="10" justify="center">
              <Text fontSize="sm" color="fg.muted">موردی برای نمایش وجود ندارد</Text>
            </Flex>
          ) : (
            <>
              <Box display={isCompact ? 'none' : { base: 'none', md: 'block' }} w="full">
                <AbandonedCartTable carts={filtered} onView={handleView} />
              </Box>
              <Flex display={isCompact ? 'flex' : { base: 'flex', md: 'none' }} direction="column" gap="4" w="full">
                {filtered.map((cart) => (
                  <AbandonedCartCard key={cart.id} cart={cart} onView={handleView} />
                ))}
              </Flex>
            </>
          )}

        </Flex>
      </Box>

      <AbandonedCartDetailsDrawer
        cart={selectedCart}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </Flex>
  )
}
