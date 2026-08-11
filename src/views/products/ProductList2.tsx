import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Flex, Text } from '@chakra-ui/react'
import { CircleCheckBig, CircleX, Pencil, Phone, Plus, TriangleAlert, Upload } from 'lucide-react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { Header, HeaderCTA } from '@/components/layout/Header'
import { toLatinDigits, toPersianDigits } from '@/utils/numbers'
import {
  PRODUCTS, catCollection, statusCollection, currencyCollection, sortCollection,
} from '@/components/products/list/data'
import { FilterModal } from '@/components/products/list/FilterModal'
import { SelectionActionBar } from '@/components/products/list/SelectionActionBar'
import { ListPagination } from '@/components/ui/ListPagination'
import { KpiRow, type KpiItem } from '@/components/products/list2/KpiRow'
import { FilterBar } from '@/components/products/list2/FilterBar'
import { FilterResultBadges, type ActiveFilter } from '@/components/products/list2/FilterResultBadges'
import { ProductTable2 } from '@/components/products/list2/ProductTable2'

const PAGE_SIZE = 10
/** آستانهٔ «رو به اتمام» — موجودی بیشتر از صفر ولی کمتر یا مساوی این عدد */
const LOW_STOCK_THRESHOLD = 15

const FILTER_DEFAULTS = {
  category: 'all',
  status: 'all',
  currency: 'all',
  sort: 'newest',
}

/**
 * صفحهٔ لیست محصولات — طرح جدید (list2، Figma node 1133:12237).
 * صفحهٔ قدیم (`/products/list`) دست‌نخورده باقی می‌مونه؛ این یه route مستقل و موازیه.
 *
 * ⚠️ محدودیت شناخته‌شده (مثل نسخهٔ قدیمی): چون value selectها (مثلاً catCollection:
 * 'digital'/'fashion') با فیلد واقعی PRODUCTS (مثلاً category: 'الکترونیک'/'پوشاک') یک
 * دیکشنری ترجمه ندارن، فیلتر واقعیِ نتایج فقط با «جستجو» انجام می‌شه؛ بقیهٔ فیلترها state
 * واقعی دارن و بج نشون می‌دن ولی روی `filtered` اثر نمی‌ذارن — تا وصل‌شدن به API واقعی.
 *
 * فقط دسکتاپ (media > md) پیاده‌سازی شده — نمای card برای media < md بعداً با طرح Figma
 * جدید اضافه می‌شه؛ فعلاً همون جدول با اسکرول افقی روی موبایل هم نمایش داده می‌شه.
 */
export function ProductList2() {
  const router = useRouter()
  const isCompact = useCompactMode()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(FILTER_DEFAULTS.category)
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [status, setStatus] = useState(FILTER_DEFAULTS.status)
  const [currency, setCurrency] = useState(FILTER_DEFAULTS.currency)
  const [sort, setSort] = useState(FILTER_DEFAULTS.sort)
  const [unlimitedStock, setUnlimitedStock] = useState(false)
  const [page, setPage] = useState(1)
  const [selection, setSelection] = useState<string[]>([])
  const [filterOpen, setFilterOpen] = useState(false)

  // ── Search — name یا SKU، اعداد فارسی→لاتین نرمالایز ──
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

  const clearAllFilters = () => {
    setSearch('')
    setCategory(FILTER_DEFAULTS.category)
    setFeaturedOnly(false)
    setStatus(FILTER_DEFAULTS.status)
    setCurrency(FILTER_DEFAULTS.currency)
    setSort(FILTER_DEFAULTS.sort)
    setUnlimitedStock(false)
  }

  // ── بج‌های فیلتر اعمال‌شده — فقط مقادیر غیر پیش‌فرض ──
  const activeFilters: ActiveFilter[] = useMemo(() => {
    const list: ActiveFilter[] = []
    if (search.trim()) list.push({ key: 'search', label: `جستجو: «${search.trim()}»` })
    if (category !== FILTER_DEFAULTS.category) {
      list.push({ key: 'category', label: catCollection.items.find((i) => i.value === category)?.label ?? category })
    }
    if (featuredOnly) list.push({ key: 'featuredOnly', label: 'محصولات ویژه (تخفیف دار)' })
    if (status !== FILTER_DEFAULTS.status) {
      list.push({ key: 'status', label: statusCollection.items.find((i) => i.value === status)?.label ?? status })
    }
    if (currency !== FILTER_DEFAULTS.currency) {
      list.push({ key: 'currency', label: currencyCollection.items.find((i) => i.value === currency)?.label ?? currency })
    }
    if (sort !== FILTER_DEFAULTS.sort) {
      list.push({ key: 'sort', label: sortCollection.items.find((i) => i.value === sort)?.label ?? sort })
    }
    if (unlimitedStock) list.push({ key: 'unlimitedStock', label: 'موجودی نامحدود' })
    return list
  }, [search, category, featuredOnly, status, currency, sort, unlimitedStock])

  const removeFilter = (key: string) => {
    switch (key) {
      case 'search': setSearch(''); break
      case 'category': setCategory(FILTER_DEFAULTS.category); break
      case 'featuredOnly': setFeaturedOnly(false); break
      case 'status': setStatus(FILTER_DEFAULTS.status); break
      case 'currency': setCurrency(FILTER_DEFAULTS.currency); break
      case 'sort': setSort(FILTER_DEFAULTS.sort); break
      case 'unlimitedStock': setUnlimitedStock(false); break
    }
  }

  // ── KPI — از PRODUCTS محاسبه می‌شه. RTL: ثبت‌شده راست‌ترین، پیش‌نویس چپ‌ترین ──
  const kpiItems: KpiItem[] = [
    { key: 'registered', label: 'ثبت شده', value: PRODUCTS.length, icon: CircleCheckBig, palette: 'blue' },
    { key: 'inStock', label: 'موجود', value: PRODUCTS.filter((p) => p.inventory > 0).length, icon: Phone, palette: 'green' },
    { key: 'lowStock', label: 'رو به اتمام', value: PRODUCTS.filter((p) => p.inventory > 0 && p.inventory <= LOW_STOCK_THRESHOLD).length, icon: TriangleAlert, palette: 'orange' },
    { key: 'outOfStock', label: 'ناموجود', value: PRODUCTS.filter((p) => p.status === 'ناموجود').length, icon: CircleX, palette: 'red' },
    { key: 'published', label: 'منتشر شده', value: PRODUCTS.filter((p) => p.status === 'منتشرشده').length, icon: Upload, palette: 'brand' },
    { key: 'draft', label: 'پیش‌نویس', value: PRODUCTS.filter((p) => p.status === 'پیش‌نویس').length, icon: Pencil, palette: 'neutral' },
  ]

  // ── نمایش X تا Y از Z محصول ──
  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(page * PAGE_SIZE, filtered.length)

  return (
    <Flex direction="column" gap="4">
      {/* ── Page Header ── */}
      <Header
        title="لیست محصولات"
        breadcrumbs={[{ label: 'داشبورد', href: '/' }, { label: 'لیست محصولات' }]}
        cta={<HeaderCTA label="افزودن محصول" icon={<Plus size={16} />} onClick={() => router.push('/products/new')} />}
      />

      {/* ── KPI ── */}
      <KpiRow items={kpiItems} />

      {/* ── Content Panel ── */}
      <Box bg="bg.panel" borderWidth="1px" borderColor="border" rounded="2xl" p={{ base: '4', md: isCompact ? '4' : '6' }}>

        <Flex direction="column" gap="3" mb="5">
          <FilterBar
            search={search} onSearchChange={setSearch}
            category={category} onCategoryChange={setCategory}
            featuredOnly={featuredOnly} onFeaturedOnlyChange={setFeaturedOnly}
            sort={sort} onSortChange={setSort}
            onOpenFilters={() => setFilterOpen(true)}
          />
          <FilterResultBadges filters={activeFilters} onRemove={removeFilter} onClearAll={clearAllFilters} />
        </Flex>

        {/* ── Selection Action Bar — وقتی ≥۱ انتخاب شد ── */}
        {selection.length > 0 && (
          <SelectionActionBar count={selection.length} isCompact={isCompact} onCancel={() => setSelection([])} />
        )}

        {/* ── جدول (فقط دسکتاپ پیاده‌سازی شده — TODO: نمای card موبایل با طرح بعدی) ── */}
        <ProductTable2
          products={filtered}
          selection={selection}
          allSelected={allSelected}
          indeterminate={indeterminate}
          onToggleAll={toggleAll}
          onToggleOne={toggleOne}
        />

        {/* ── Pagination ── */}
        <Flex align="center" justify="space-between" mt="5" flexWrap="wrap" gap="3">
          {/* RTL: متن راست (اول DOM)، pagination چپ — مطابق Figma */}
          <Text fontSize="sm" color="fg.muted">
            نمایش {toPersianDigits(rangeStart)} تا {toPersianDigits(rangeEnd)} از {toPersianDigits(filtered.length)} محصول
          </Text>

          <ListPagination count={filtered.length} pageSize={PAGE_SIZE} page={page} onPageChange={setPage} />
        </Flex>
      </Box>

      {/* ── Filter Dialog — دکمهٔ فیلتر در FilterBar بازش می‌کنه ── */}
      <FilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        category={category} onCategoryChange={setCategory}
        status={status} onStatusChange={setStatus}
        currency={currency} onCurrencyChange={setCurrency}
        sort={sort} onSortChange={setSort}
        unlimitedStock={unlimitedStock} onUnlimitedStockChange={setUnlimitedStock}
        discountOnly={featuredOnly} onDiscountOnlyChange={setFeaturedOnly}
        onClearAll={clearAllFilters}
      />
    </Flex>
  )
}
