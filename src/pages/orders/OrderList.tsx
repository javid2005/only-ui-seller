import { useMemo, useState } from 'react'
import {
  Box, Button, Flex, IconButton, Input, InputGroup,
  Select, Spacer, Stat, Text, type ListCollection,
} from '@chakra-ui/react'
import { FileDown, ListFilter, Plus, Search } from 'lucide-react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { Header, HeaderCTA } from '@/components/layout/Header'
import { toLatinDigits, toPersianDigits } from '@/utils/numbers'
import {
  ORDERS, ORDER_STATS, statusCollection, dateCollection, shippingCollection, sortCollection,
  type FilterOption, type OrderStat,
} from '@/components/orders/list/data'
import { OrderTable } from '@/components/orders/list/OrderTable'
import { OrderGrid } from '@/components/orders/list/OrderGrid'
import { OrderFilterModal } from '@/components/orders/list/OrderFilterModal'
import { ListPagination } from '@/components/ui/ListPagination'

const PAGE_SIZE = 10

// Select (نه NativeSelect — قانون پروژه). collectionها از data.ts (single source).
function FilterSelect({
  collection, defaultValue, minW, maxW,
}: {
  collection: ListCollection<FilterOption>
  defaultValue: string
  minW: string
  maxW: string
}) {
  return (
    <Select.Root
      collection={collection}
      defaultValue={[defaultValue]}
      size="sm"
      /* الگوی لیست محصولات: flex 1 0 0 (بدون shrink) + minW اندازه‌ی متن کامل.
         نوار overflowX="auto" → تک‌خط، اسکرول می‌خوره (نه wrap)، نوشته truncate نمی‌شه */
      flex="1 0 0"
      minW={minW}
      maxW={maxW}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText whiteSpace="nowrap" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        {/* عرض منو > عرض trigger تا متن‌ها تک‌خطی بمونن */}
        <Select.Content minW="max-content" maxW="360px">
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

function StatCard({ stat }: { stat: OrderStat }) {
  return (
    <Stat.Root
      flex="1 0 0" minW={{ base: '140px', sm: '200px' }}
      bg="bg.panel" borderWidth="1px" borderColor="border" rounded="md" p="4" gap="2"
    >
      <Stat.Label color="fg.muted" fontSize="sm">{stat.label}</Stat.Label>
      <Stat.ValueText fontSize="2xl" fontWeight="semibold" letterSpacing="tight">
        {stat.value}
      </Stat.ValueText>
    </Stat.Root>
  )
}

export function OrderList() {
  const isCompact = useCompactMode()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [filterOpen, setFilterOpen] = useState(false)

  // ── Search — شماره سفارش یا نام مشتری، اعداد فارسی→لاتین نرمالایز ──
  const filtered = useMemo(() => {
    const q = toLatinDigits(search.trim()).toLowerCase()
    if (!q) return ORDERS
    return ORDERS.filter(
      (o) =>
        o.customer.toLowerCase().includes(q) ||
        toLatinDigits(o.orderNo).toLowerCase().includes(q),
    )
  }, [search])

  // searchInput — inline در هر bar (flex/maxW متفاوته)
  const makeSearch = (flex: string, maxW: string) => (
    <InputGroup startElement={<Search size={14} color="var(--chakra-colors-fg-subtle)" />} flex={flex} maxW={maxW}>
      <Input
        placeholder="جستجو"
        size="sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </InputGroup>
  )

  return (
    <Flex direction="column" gap="4">
      {/* ── Page Header ── */}
      <Header
        title="لیست سفارشات"
        breadcrumbs={[{ label: 'داشبورد', href: '/' }, { label: 'لیست سفارشات' }]}
        cta={<HeaderCTA label="ایجاد سفارش دستی" icon={<Plus size={16} />} />}
      />

      {/* ── Stats ── */}
      <Flex gap="4" flexWrap="wrap">
        {ORDER_STATS.map((s) => (
          <StatCard key={s.label} stat={s} />
        ))}
      </Flex>

      {/* ── Content Panel ── */}
      <Box bg="bg.panel" borderWidth="1px" borderColor="border" rounded="2xl" p={{ base: '4', md: isCompact ? '4' : '6' }}>

        {/* ── Filter Bar — CSS display یکی رو مخفی می‌کنه ── */}

        {/* compact bar: search (راست) + filter-icon (→modal) + export-icon (چپ) */}
        <Flex
          display={{ base: 'flex', md: isCompact ? 'flex' : 'none' }}
          gap="2" align="center" mb="5"
        >
          {makeSearch('1', 'full')}
          <IconButton variant="outline" size="sm" aria-label="فیلترها" onClick={() => setFilterOpen(true)} flexShrink={0}>
            <ListFilter size={16} />
          </IconButton>
          {/* خروجی اکسل — موبایل فقط آیکون، teal outline (مثل دسکتاپ) */}
          <IconButton
            variant="outline" size="sm" aria-label="خروجی اکسل" flexShrink={0}
            borderColor="teal.solid" color="teal.fg" _hover={{ bg: 'teal.subtle' }}
          >
            <FileDown size={16} />
          </IconButton>
        </Flex>

        {/* desktop bar: search + selects + spacer + export */}
        <Flex
          display={{ base: 'none', md: isCompact ? 'none' : 'flex' }}
          gap="3" align="center" mb="5" overflowX="auto"
        >
          {makeSearch('1 0 200px', '320px')}
          <FilterSelect collection={dateCollection}     defaultValue="all"    minW="140px" maxW="160px" />
          <FilterSelect collection={statusCollection}   defaultValue="all"    minW="140px" maxW="160px" />
          <FilterSelect collection={shippingCollection} defaultValue="all"    minW="190px" maxW="200px" />
          <FilterSelect collection={sortCollection}     defaultValue="newest" minW="110px" maxW="150px" />

          <Spacer />

          {/* خروجی اکسل — teal outline، آیکون انتهایی (download) */}
          <Button
            variant="outline" size="sm" flexShrink={0}
            borderColor="teal.solid" color="teal.fg" _hover={{ bg: 'teal.subtle' }}
          >
            خروجی اکسل
            <FileDown size={16} />
          </Button>
        </Flex>

        {/* ── جدول (desktop) / کارت (mobile/compact) ── */}
        <Box display={{ base: 'none', md: isCompact ? 'none' : 'block' }}>
          <OrderTable orders={filtered} />
        </Box>
        <Box display={{ base: 'block', md: isCompact ? 'block' : 'none' }}>
          <OrderGrid orders={filtered} />
        </Box>

        {/* ── Pagination ── */}
        <Flex align="center" justify="space-between" mt="5" flexWrap="wrap" gap="3">
          <ListPagination count={filtered.length} pageSize={PAGE_SIZE} page={page} onPageChange={setPage} />

          <Text fontSize="sm" color="fg.muted">
            نمایش {toPersianDigits(filtered.length)} سفارش از {toPersianDigits(ORDERS.length)} مورد
          </Text>
        </Flex>
      </Box>

      {/* ── Mobile Filter Modal ── */}
      <OrderFilterModal open={filterOpen} onClose={() => setFilterOpen(false)} />
    </Flex>
  )
}
