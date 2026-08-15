import { useMemo, useState } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { CircleX, CreditCard, Hourglass, ListCheck, Plus, Truck, Undo2 } from 'lucide-react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { Header, HeaderCTA } from '@/components/layout/Header'
import { toLatinDigits, toPersianDigits } from '@/utils/numbers'
import { formatJalaliDate } from '@/utils/dates'
import {
  ORDERS, statusCollection, sortCollection, shippingCollection,
  type OrderStatus,
} from '@/components/orders/list/data'
import { OrderTable } from '@/components/orders/list/OrderTable'
import { OrderGrid } from '@/components/orders/list/OrderGrid'
import { OrderFilterModal, type OrderTypeFilter } from '@/components/orders/list/OrderFilterModal'
import { FilterBar } from '@/components/orders/list/FilterBar'
import { ListPagination } from '@/components/ui/ListPagination'
import { PageSizeMenu } from '@/components/ui/PageSizeMenu'
import { KpiRow, type KpiItem } from '@/components/products/list/KpiRow'
import { FilterResultBadges, type ActiveFilter } from '@/components/products/list/FilterResultBadges'

const FILTER_DEFAULTS = {
  orderType: 'all' as OrderTypeFilter,
  status: 'all',
  sort: 'newest',
  shipping: 'all',
  dateFrom: '',
  dateTo: '',
  minAmount: '',
  maxAmount: '',
}

/** key کارت KPI → وضعیت واقعی سفارش، برای فیلتر کلیک روی کارت (matchesKpiFilter). */
const KPI_STATUS_MAP: Record<string, OrderStatus> = {
  pending: 'در انتظار پرداخت',
  paid: 'پرداخت شده',
  preparing: 'درحال آماده سازی',
  shipped: 'ارسال شده',
  returned: 'مرجوع شده',
  cancelled: 'لغو شده',
}

/**
 * صفحهٔ لیست سفارشات — Figma node 1923:21910 (لیست) + 2169:28005 (دیالوگ فیلترها).
 * ساختار (KPI/FilterBar/FilterResultBadges/Pagination) از الگوی `ProductList` کپی شده
 * (به‌درخواست کاربر)؛ محتوا/آیکون/رنگ/چیدمان ستون‌های جدول + فیلدهای دیالوگ فیلتر از
 * همون Figma nodeها گرفته شده.
 *
 * ⚠️ محدودیت شناخته‌شده (عیناً مثل ProductList): چون value selectهای وضعیت/روش‌ارسال
 * دیکشنری ترجمه به فیلد واقعی ORDERS ندارن، فیلتر واقعی نتایج فقط با «جستجو» + «فیلتر
 * KPI» + «نوع سفارش» (این یکی چون مقداردهی‌اش مستقیماً با `Order.type` یکیه) انجام
 * می‌شه؛ بقیهٔ فیلترها (وضعیت/روش‌ارسال/بازهٔ تاریخ/بازهٔ مبلغ/ترتیب) state واقعی دارن و بج
 * نشون می‌دن ولی روی `filtered` اثر نمی‌ذارن — تا وصل‌شدن به API واقعی.
 */
export function OrderList() {
  const isCompact = useCompactMode()

  const [search, setSearch] = useState('')
  const [orderType, setOrderType] = useState<OrderTypeFilter>(FILTER_DEFAULTS.orderType)
  const [status, setStatus] = useState(FILTER_DEFAULTS.status)
  const [sort, setSort] = useState(FILTER_DEFAULTS.sort)
  const [shipping, setShipping] = useState(FILTER_DEFAULTS.shipping)
  const [dateFrom, setDateFrom] = useState(FILTER_DEFAULTS.dateFrom)
  const [dateTo, setDateTo] = useState(FILTER_DEFAULTS.dateTo)
  const [minAmount, setMinAmount] = useState(FILTER_DEFAULTS.minAmount)
  const [maxAmount, setMaxAmount] = useState(FILTER_DEFAULTS.maxAmount)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filterOpen, setFilterOpen] = useState(false)
  /** کلیک روی دکمهٔ فیلتر یک کارت KPI — key همون KpiItem.key هست، null = فیلتری فعال نیست */
  const [kpiFilter, setKpiFilter] = useState<string | null>(null)

  // ── فیلتر KPI ──
  const matchesKpiFilter = (o: (typeof ORDERS)[number]) => {
    if (!kpiFilter) return true
    return o.status === KPI_STATUS_MAP[kpiFilter]
  }

  // ── Search + فیلتر KPI + نوع سفارش (این سه واقعاً روی filtered اثر می‌ذارن) ──
  const filtered = useMemo(() => {
    const q = toLatinDigits(search.trim()).toLowerCase()
    return ORDERS.filter((o) => {
      if (!matchesKpiFilter(o)) return false
      if (orderType !== 'all' && o.type !== orderType) return false
      if (!q) return true
      return o.customer.toLowerCase().includes(q) || toLatinDigits(o.orderNo).toLowerCase().includes(q)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, kpiFilter, orderType])

  const clearAllFilters = () => {
    setSearch('')
    setOrderType(FILTER_DEFAULTS.orderType)
    setStatus(FILTER_DEFAULTS.status)
    setSort(FILTER_DEFAULTS.sort)
    setShipping(FILTER_DEFAULTS.shipping)
    setDateFrom(FILTER_DEFAULTS.dateFrom)
    setDateTo(FILTER_DEFAULTS.dateTo)
    setMinAmount(FILTER_DEFAULTS.minAmount)
    setMaxAmount(FILTER_DEFAULTS.maxAmount)
    setKpiFilter(null)
  }

  /** کلیک روی دکمهٔ فیلتر یک کارت KPI — دوباره کلیک روی کارت فعال = پاک‌کردن فیلتر (toggle) */
  const handleKpiFilterClick = (key: string) => {
    setKpiFilter((prev) => (prev === key ? null : key))
  }

  // ── KPI — مقادیر مستقیم از Figma (node 5284:78481). RTL: در انتظار پرداخت راست‌ترین،
  // لغو شده چپ‌ترین ──
  const kpiItems: KpiItem[] = [
    { key: 'pending', label: 'در انتظار پرداخت', value: 84, icon: Hourglass, palette: 'neutral' },
    { key: 'paid', label: 'پرداخت شده', value: 65, icon: CreditCard, palette: 'green' },
    { key: 'preparing', label: 'درحال آماده سازی', value: 5, icon: ListCheck, palette: 'orange' },
    { key: 'shipped', label: 'ارسال شده', value: 60, icon: Truck, palette: 'blue' },
    { key: 'returned', label: 'مرجوع شده', value: 7, icon: Undo2, palette: 'yellow' },
    { key: 'cancelled', label: 'لغو شده', value: 12, icon: CircleX, palette: 'red' },
  ]

  // ── بج‌های فیلتر اعمال‌شده — فقط مقادیر غیر پیش‌فرض ──
  const activeFilters: ActiveFilter[] = useMemo(() => {
    const list: ActiveFilter[] = []
    if (search.trim()) list.push({ key: 'search', label: `جستجو: «${search.trim()}»` })
    if (orderType !== FILTER_DEFAULTS.orderType) list.push({ key: 'orderType', label: orderType })
    if (status !== FILTER_DEFAULTS.status) {
      list.push({ key: 'status', label: statusCollection.items.find((i) => i.value === status)?.label ?? status })
    }
    if (shipping !== FILTER_DEFAULTS.shipping) {
      list.push({ key: 'shipping', label: shippingCollection.items.find((i) => i.value === shipping)?.label ?? shipping })
    }
    if (dateFrom || dateTo) {
      const from = dateFrom ? `از ${formatJalaliDate(new Date(dateFrom))}` : ''
      const to = dateTo ? `تا ${formatJalaliDate(new Date(dateTo))}` : ''
      list.push({ key: 'dateRange', label: [from, to].filter(Boolean).join(' ') })
    }
    if (minAmount || maxAmount) {
      const from = minAmount ? `از ${toPersianDigits(minAmount)}` : ''
      const to = maxAmount ? `تا ${toPersianDigits(maxAmount)}` : ''
      list.push({ key: 'amountRange', label: `${[from, to].filter(Boolean).join(' ')} تومان` })
    }
    if (sort !== FILTER_DEFAULTS.sort) {
      list.push({ key: 'sort', label: sortCollection.items.find((i) => i.value === sort)?.label ?? sort })
    }
    if (kpiFilter) {
      list.push({ key: 'kpiFilter', label: kpiItems.find((i) => i.key === kpiFilter)?.label ?? kpiFilter })
    }
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, orderType, status, shipping, dateFrom, dateTo, minAmount, maxAmount, sort, kpiFilter])

  const removeFilter = (key: string) => {
    switch (key) {
      case 'search': setSearch(''); break
      case 'orderType': setOrderType(FILTER_DEFAULTS.orderType); break
      case 'status': setStatus(FILTER_DEFAULTS.status); break
      case 'shipping': setShipping(FILTER_DEFAULTS.shipping); break
      case 'dateRange': setDateFrom(FILTER_DEFAULTS.dateFrom); setDateTo(FILTER_DEFAULTS.dateTo); break
      case 'amountRange': setMinAmount(FILTER_DEFAULTS.minAmount); setMaxAmount(FILTER_DEFAULTS.maxAmount); break
      case 'sort': setSort(FILTER_DEFAULTS.sort); break
      case 'kpiFilter': setKpiFilter(null); break
    }
  }

  // ── نمایش X تا Y از Z سفارش ──
  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeEnd = Math.min(page * pageSize, filtered.length)

  const handlePageSizeChange = (v: number) => {
    setPageSize(v)
    setPage(1)
  }

  return (
    <Flex direction="column" gap="4">
      {/* ── Page Header ── */}
      <Header
        title="لیست سفارشات"
        breadcrumbs={[{ label: 'داشبورد', href: '/' }, { label: 'لیست سفارشات' }]}
        cta={<HeaderCTA label="ایجاد سفارش دستی" icon={<Plus size={16} />} />}
      />

      {/* ── KPI ── */}
      <KpiRow items={kpiItems} activeKey={kpiFilter} onFilterClick={handleKpiFilterClick} isCompact={isCompact} />

      {/* ── Content Panel ── */}
      <Box bg="bg.panel" borderWidth="1px" borderColor="border" rounded="2xl" p={{ base: '4', md: isCompact ? '4' : '6' }}>

        <Flex direction="column" gap="3" mb="5">
          <FilterBar
            search={search} onSearchChange={setSearch}
            status={status} onStatusChange={setStatus}
            sort={sort} onSortChange={setSort}
            onOpenFilters={() => setFilterOpen(true)}
            isCompact={isCompact}
          />
          <FilterResultBadges filters={activeFilters} onRemove={removeFilter} onClearAll={clearAllFilters} />
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
          {/* RTL: متن راست‌ترین، بعدش انتخاب تعداد ردیف، pagination چپ‌ترین — مطابق Figma */}
          <Flex align="center" gap="3" flexWrap="wrap">
            <Text fontSize="sm" color="fg.muted">
              نمایش {toPersianDigits(rangeStart)} تا {toPersianDigits(rangeEnd)} از {toPersianDigits(filtered.length)} سفارش
            </Text>
            <PageSizeMenu value={pageSize} onValueChange={handlePageSizeChange} />
          </Flex>

          <ListPagination count={filtered.length} pageSize={pageSize} page={page} onPageChange={setPage} />
        </Flex>
      </Box>

      {/* ── Mobile Filter Modal ── */}
      <OrderFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        orderType={orderType} onOrderTypeChange={setOrderType}
        status={status} onStatusChange={setStatus}
        shipping={shipping} onShippingChange={setShipping}
        dateFrom={dateFrom} onDateFromChange={setDateFrom}
        dateTo={dateTo} onDateToChange={setDateTo}
        minAmount={minAmount} onMinAmountChange={setMinAmount}
        maxAmount={maxAmount} onMaxAmountChange={setMaxAmount}
        onClearAll={clearAllFilters}
      />
    </Flex>
  )
}
