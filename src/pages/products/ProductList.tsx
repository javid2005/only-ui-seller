import { useMemo, useState } from 'react'
import {
  Badge, Box, ButtonGroup, Flex, IconButton, Input, InputGroup,
  Pagination, SegmentGroup, Select, Spacer, Stat, Switch, Text,
  type ListCollection,
} from '@chakra-ui/react'
import { LayoutGrid, List, ListFilter, Plus, Search } from 'lucide-react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { Header, HeaderCTA } from '@/components/layout/Header'
import { toLatinDigits, toPersianDigits } from '@/utils/numbers'
import {
  PRODUCTS, catCollection, statusCollection, currencyCollection, sortCollection,
  type FilterOption,
} from '@/components/products/list/data'
import { ProductTable } from '@/components/products/list/ProductTable'
import { SelectionActionBar } from '@/components/products/list/SelectionActionBar'
import { FilterModal } from '@/components/products/list/FilterModal'

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
    <Select.Root collection={collection} defaultValue={[defaultValue]} size="sm" flex="1 0 0" minW={minW} maxW={maxW}>
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

interface StatItem {
  label: string
  value: number
  color: string
  badge?: string
}

function StatCard({ stat, showBar }: { stat: StatItem; showBar: boolean }) {
  const ratio = Math.min(stat.value / PRODUCTS.length, 1)
  return (
    <Stat.Root
      flex="1 0 0" minW={{ base: '140px', sm: '180px' }}
      bg="bg.panel" borderWidth="1px" borderColor="border" rounded="md" p="4" gap="2"
    >
      <Stat.Label color="fg.muted" fontSize="sm">{stat.label}</Stat.Label>
      <Flex align="center" gap="3">
        <Stat.ValueText fontSize="2xl" fontWeight="semibold" letterSpacing="tight">
          {toPersianDigits(stat.value)}
        </Stat.ValueText>
        {stat.badge && (
          <Badge colorPalette="green" variant="subtle" size="sm">
            <Stat.UpIndicator />
            {stat.badge}
          </Badge>
        )}
      </Flex>
      {showBar && (
        <Box mt="1" h="1.5" w="full" bg="bg.muted" rounded="full" overflow="hidden">
          <Box h="full" w={`${Math.round(ratio * 100)}%`} bg={`${stat.color}.solid`} rounded="full" />
        </Box>
      )}
    </Stat.Root>
  )
}

export function ProductList() {
  const isCompact = useCompactMode()
  const [search, setSearch] = useState('')
  const [view, setView] = useState('list')
  const [page, setPage] = useState(1)
  const [selection, setSelection] = useState<string[]>([])
  const [filterOpen, setFilterOpen] = useState(false)

  // ── Search (#8) — name یا SKU، اعداد فارسی→لاتین نرمالایز ──
  const filtered = useMemo(() => {
    const q = toLatinDigits(search.trim()).toLowerCase()
    if (!q) return PRODUCTS
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        toLatinDigits(p.sku).toLowerCase().includes(q),
    )
  }, [search])

  const allSelected = filtered.length > 0 && filtered.every((p) => selection.includes(p.id))
  const indeterminate = selection.length > 0 && !allSelected
  const toggleAll = () => setSelection(allSelected ? [] : filtered.map((p) => p.id))
  const toggleOne = (id: string) =>
    setSelection((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  // ── Stats (از کل PRODUCTS) — RTL: کل محصولات راست‌ترین، قیمت دلاری چپ‌ترین ──
  const stats: StatItem[] = [
    { label: 'کل محصولات', value: PRODUCTS.length, color: 'teal' },
    { label: 'منتشرشده', value: PRODUCTS.filter((p) => p.status === 'منتشرشده').length, color: 'green' },
    { label: 'پیش‌نویس', value: PRODUCTS.filter((p) => p.status === 'پیش‌نویس').length, color: 'gray' },
    { label: 'ناموجود', value: PRODUCTS.filter((p) => p.status === 'ناموجود').length, color: 'red' },
    { label: 'قیمت دلاری', value: PRODUCTS.filter((p) => p.currency === '$').length, color: 'blue', badge: `${toPersianDigits('۱۶۱٬۲۰۰')} ت` },
  ]

  const searchInput = (
    <InputGroup startElement={<Search size={14} color="var(--chakra-colors-fg-subtle)" />} flex="1 0 200px" maxW={isCompact ? 'full' : '280px'}>
      <Input
        placeholder="جستجو در نام یا SKU ..."
        size="sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </InputGroup>
  )

  const viewToggle = (
    <SegmentGroup.Root value={view} onValueChange={(e) => setView(e.value)} size="sm" flexShrink={0}>
      <SegmentGroup.Indicator bg="bg.panel" />
      <SegmentGroup.Item value="list">
        <SegmentGroup.ItemText><List size={15} /></SegmentGroup.ItemText>
        <SegmentGroup.ItemHiddenInput />
      </SegmentGroup.Item>
      <SegmentGroup.Item value="grid">
        <SegmentGroup.ItemText><LayoutGrid size={15} /></SegmentGroup.ItemText>
        <SegmentGroup.ItemHiddenInput />
      </SegmentGroup.Item>
    </SegmentGroup.Root>
  )

  return (
    <Flex direction="column" gap="4">
      {/* ── Page Header ── */}
      <Header
        title="لیست محصولات"
        breadcrumbs={[{ label: 'داشبورد', href: '/' }, { label: 'لیست محصولات' }]}
        cta={<HeaderCTA label="افزودن محصول" icon={<Plus size={16} />} />}
      />

      {/* ── Stats ── */}
      <Flex gap="4" flexWrap="wrap">
        {stats.map((s) => (
          <StatCard key={s.label} stat={s} showBar={isCompact} />
        ))}
      </Flex>

      {/* ── Content Panel ── */}
      <Box bg="bg.panel" borderWidth="1px" borderColor="border" rounded="2xl" p={isCompact ? '4' : '6'}>

        {/* ── Filter Bar ── */}
        {isCompact ? (
          // Mobile: search + filter-icon (→modal) + view toggle
          <Flex gap="2" align="center" mb="5">
            {searchInput}
            <IconButton variant="outline" size="sm" aria-label="فیلترها" onClick={() => setFilterOpen(true)} flexShrink={0}>
              <ListFilter size={16} />
            </IconButton>
            {viewToggle}
          </Flex>
        ) : (
          // Desktop: search + selects + switches + spacer + view toggle (RTL: search راست‌ترین)
          <Flex gap="3" align="center" mb="5" overflowX="auto">
            {searchInput}
            <FilterSelect collection={catCollection}      defaultValue="all"    minW="120px" maxW="160px" />
            <FilterSelect collection={statusCollection}   defaultValue="all"    minW="120px" maxW="160px" />
            <FilterSelect collection={currencyCollection} defaultValue="all"    minW="100px" maxW="140px" />
            <FilterSelect collection={sortCollection}     defaultValue="newest" minW="130px" maxW="170px" />

            <Flex align="center" gap="2" flexShrink={0}>
              <Switch.Root size="sm" colorPalette="teal">
                <Switch.HiddenInput />
                <Switch.Control><Switch.Thumb /></Switch.Control>
              </Switch.Root>
              <Text fontSize="xs" whiteSpace="nowrap">تخفیف دارد</Text>
            </Flex>
            <Flex align="center" gap="2" flexShrink={0}>
              <Switch.Root size="sm" colorPalette="teal">
                <Switch.HiddenInput />
                <Switch.Control><Switch.Thumb /></Switch.Control>
              </Switch.Root>
              <Text fontSize="xs" whiteSpace="nowrap">موجودی نامحدود</Text>
            </Flex>

            <Spacer />
            {viewToggle}
          </Flex>
        )}

        {/* ── Selection Action Bar (#4) — وقتی ≥۱ انتخاب شد ── */}
        {selection.length > 0 && (
          <SelectionActionBar count={selection.length} isCompact={isCompact} onCancel={() => setSelection([])} />
        )}

        {/* ── Table ── */}
        <ProductTable
          products={filtered}
          selection={selection}
          allSelected={allSelected}
          indeterminate={indeterminate}
          onToggleAll={toggleAll}
          onToggleOne={toggleOne}
        />

        {/* ── Pagination ── */}
        <Flex align="center" justify="space-between" mt="5" flexWrap="wrap" gap="3">
          <Pagination.Root count={filtered.length} pageSize={PAGE_SIZE} page={page} onPageChange={(e) => setPage(e.page)}>
            <ButtonGroup variant="ghost" size="sm" gap="1">
              <Pagination.PrevTrigger asChild>
                <IconButton aria-label="صفحه قبل"><span style={{ fontSize: '12px' }}>›</span></IconButton>
              </Pagination.PrevTrigger>
              <Pagination.Items
                render={(pg) => (
                  <IconButton key={pg.value} variant={{ base: 'ghost', _selected: 'outline' }} aria-label={`صفحه ${pg.value}`}>
                    {toPersianDigits(pg.value)}
                  </IconButton>
                )}
              />
              <Pagination.NextTrigger asChild>
                <IconButton aria-label="صفحه بعد"><span style={{ fontSize: '12px' }}>‹</span></IconButton>
              </Pagination.NextTrigger>
            </ButtonGroup>
          </Pagination.Root>

          <Text fontSize="sm" color="fg.muted">
            نمایش {toPersianDigits(filtered.length)} محصول از {toPersianDigits(PRODUCTS.length)} مورد
          </Text>
        </Flex>
      </Box>

      {/* ── Mobile Filter Modal (#6) ── */}
      <FilterModal open={filterOpen} onClose={() => setFilterOpen(false)} />
    </Flex>
  )
}
