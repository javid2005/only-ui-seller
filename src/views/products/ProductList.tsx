import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Flex, Text } from '@chakra-ui/react'
import { CircleCheckBig, CircleX, Pencil, Phone, Plus, TriangleAlert, Upload } from 'lucide-react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { Header, HeaderCTA } from '@/components/layout/Header'
import { toLatinDigits, toPersianDigits } from '@/utils/numbers'
import {
  PRODUCTS, catCollection, statusCollection, currencyCollection, sortCollection, stockCollection,
} from '@/components/products/list/data'
import { FilterModal } from '@/components/products/list/FilterModal'
import { ListPagination } from '@/components/ui/ListPagination'
import { PageSizeMenu } from '@/components/ui/PageSizeMenu'
import { KpiRow, type KpiItem } from '@/components/products/list/KpiRow'
import { FilterBar } from '@/components/products/list/FilterBar'
import { FilterResultBadges, type ActiveFilter } from '@/components/products/list/FilterResultBadges'
import { ProductTable } from '@/components/products/list/ProductTable'
import { MobileProductCard } from '@/components/products/list/MobileProductCard'
import { SelectionActionBar } from '@/components/products/list/SelectionActionBar'
import { ProductConfirmDialog, type ProductConfirmVariant } from '@/components/products/list/ProductConfirmDialog'
import { toaster } from '@/components/ui/toaster'

/** آستانهٔ «درحال اتمام» — موجودی بیشتر از صفر ولی کمتر یا مساوی این عدد */
const LOW_STOCK_THRESHOLD = 15

const FILTER_DEFAULTS = {
  category: 'all',
  status: 'all',
  currency: 'all',
  sort: 'newest',
  stock: 'all',
  minPrice: '',
  maxPrice: '',
}

/**
 * صفحهٔ لیست محصولات — Figma node 1133:12237.
 *
 * ⚠️ محدودیت شناخته‌شده: چون value selectها (مثلاً catCollection:
 * 'digital'/'fashion') با فیلد واقعی PRODUCTS (مثلاً category: 'الکترونیک'/'پوشاک') یک
 * دیکشنری ترجمه ندارن، فیلتر واقعیِ نتایج فقط با «جستجو» + «فیلتر KPI» (کلیک روی دکمهٔ
 * فیلتر کارت‌های بالای صفحه — matchesKpiFilter) انجام می‌شه؛ بقیهٔ فیلترها (دسته‌بندی/وضعیت/
 * ارز/موجودی/بازهٔ قیمت/سوییچ‌ها) state واقعی دارن و بج نشون می‌دن ولی روی `filtered` اثر
 * نمی‌ذارن — تا وصل‌شدن به API واقعی. «ترتیب نمایش» فقط در FilterBar هست، دیگه در
 * FilterModal تکراری نیست (طبق طرح جدید دیالوگ).
 *
 * media<lg → نمای card (`MobileProductCard`، Figma node 5204:78695) به‌جای جدول؛ سوییچ با
 * CSS responsive (نه فقط isCompact) تا هم شبیه‌سازی compact و هم موبایل واقعی درست کار کنه —
 * الگوی `isCompact ? mobileVal : {base:mobileVal, md:desktopVal}` طبق قرارداد پروژه.
 */
export function ProductList() {
  const router = useRouter()
  const isCompact = useCompactMode()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(FILTER_DEFAULTS.category)
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [discountOnly, setDiscountOnly] = useState(false)
  const [status, setStatus] = useState(FILTER_DEFAULTS.status)
  const [currency, setCurrency] = useState(FILTER_DEFAULTS.currency)
  const [sort, setSort] = useState(FILTER_DEFAULTS.sort)
  const [stock, setStock] = useState(FILTER_DEFAULTS.stock)
  const [minPrice, setMinPrice] = useState(FILTER_DEFAULTS.minPrice)
  const [maxPrice, setMaxPrice] = useState(FILTER_DEFAULTS.maxPrice)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selection, setSelection] = useState<string[]>([])
  const [filterOpen, setFilterOpen] = useState(false)
  /** کلیک روی دکمهٔ فیلتر یک کارت KPI — key همون KpiItem.key هست، null = فیلتری فعال نیست */
  const [kpiFilter, setKpiFilter] = useState<string | null>(null)
  /** دیالوگ کپی/حذف محصول — Figma node 5198:89891 / 5198:89897. targets = آیدی محصول‌های
   * هدف؛ از جدول/کارت (تک‌آیتمی) یا دکمهٔ حذف گروهی در SelectionActionBar (چندآیتمی) باز می‌شه */
  const [confirmDialog, setConfirmDialog] = useState<{ variant: ProductConfirmVariant; targets: string[] } | null>(null)

  // ── فیلتر KPI — هر key معادل همون شرطیه که مقدار کارت رو محاسبه کرده (پایین، kpiItems) ──
  const matchesKpiFilter = (p: (typeof PRODUCTS)[number]) => {
    switch (kpiFilter) {
      case 'inStock': return p.inventory > 0
      case 'lowStock': return p.inventory > 0 && p.inventory <= LOW_STOCK_THRESHOLD
      case 'outOfStock': return p.status === 'ناموجود'
      case 'published': return p.status === 'منتشرشده'
      case 'draft': return p.status === 'پیش‌نویس'
      case 'registered': // «ثبت شده» = همهٔ محصولات، شرط فیلترکننده‌ای نداره
      case null: default: return true
    }
  }

  // ── Search — name یا SKU، اعداد فارسی→لاتین نرمالایز — + فیلتر KPI فعال ──
  const filtered = useMemo(() => {
    const q = toLatinDigits(search.trim()).toLowerCase()
    return PRODUCTS.filter((p) => {
      if (!matchesKpiFilter(p)) return false
      if (!q) return true
      return p.name.toLowerCase().includes(q) || toLatinDigits(p.sku).toLowerCase().includes(q)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, kpiFilter])

  const allSelected = filtered.length > 0 && filtered.every((p) => selection.includes(p.id))
  const indeterminate = selection.length > 0 && !allSelected
  const toggleAll = () => setSelection(allSelected ? [] : filtered.map((p) => p.id))
  const toggleOne = (id: string) =>
    setSelection((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const clearAllFilters = () => {
    setSearch('')
    setCategory(FILTER_DEFAULTS.category)
    setFeaturedOnly(false)
    setDiscountOnly(false)
    setStatus(FILTER_DEFAULTS.status)
    setCurrency(FILTER_DEFAULTS.currency)
    setSort(FILTER_DEFAULTS.sort)
    setStock(FILTER_DEFAULTS.stock)
    setMinPrice(FILTER_DEFAULTS.minPrice)
    setMaxPrice(FILTER_DEFAULTS.maxPrice)
    setKpiFilter(null)
  }

  /** کلیک روی دکمهٔ فیلتر یک کارت KPI — دوباره کلیک روی کارت فعال = پاک‌کردن فیلتر (toggle) */
  const handleKpiFilterClick = (key: string) => {
    setKpiFilter((prev) => (prev === key ? null : key))
  }

  // ── KPI — از PRODUCTS محاسبه می‌شه. RTL: ثبت‌شده راست‌ترین، پیش‌نویس چپ‌ترین ──
  const kpiItems: KpiItem[] = [
    { key: 'registered', label: 'ثبت شده', value: PRODUCTS.length, icon: CircleCheckBig, palette: 'blue' },
    { key: 'inStock', label: 'موجود', value: PRODUCTS.filter((p) => p.inventory > 0).length, icon: Phone, palette: 'green' },
    { key: 'lowStock', label: 'درحال اتمام', value: PRODUCTS.filter((p) => p.inventory > 0 && p.inventory <= LOW_STOCK_THRESHOLD).length, icon: TriangleAlert, palette: 'orange' },
    { key: 'outOfStock', label: 'ناموجود', value: PRODUCTS.filter((p) => p.status === 'ناموجود').length, icon: CircleX, palette: 'red' },
    { key: 'published', label: 'منتشر شده', value: PRODUCTS.filter((p) => p.status === 'منتشرشده').length, icon: Upload, palette: 'brand' },
    { key: 'draft', label: 'پیش‌نویس', value: PRODUCTS.filter((p) => p.status === 'پیش‌نویس').length, icon: Pencil, palette: 'neutral' },
  ]

  // ── بج‌های فیلتر اعمال‌شده — فقط مقادیر غیر پیش‌فرض ──
  const activeFilters: ActiveFilter[] = useMemo(() => {
    const list: ActiveFilter[] = []
    if (search.trim()) list.push({ key: 'search', label: `جستجو: «${search.trim()}»` })
    if (category !== FILTER_DEFAULTS.category) {
      list.push({ key: 'category', label: catCollection.items.find((i) => i.value === category)?.label ?? category })
    }
    if (featuredOnly) list.push({ key: 'featuredOnly', label: 'محصولات ویژه' })
    if (discountOnly) list.push({ key: 'discountOnly', label: 'دارای تخفیف' })
    if (status !== FILTER_DEFAULTS.status) {
      list.push({ key: 'status', label: statusCollection.items.find((i) => i.value === status)?.label ?? status })
    }
    if (currency !== FILTER_DEFAULTS.currency) {
      list.push({ key: 'currency', label: currencyCollection.items.find((i) => i.value === currency)?.label ?? currency })
    }
    if (sort !== FILTER_DEFAULTS.sort) {
      list.push({ key: 'sort', label: sortCollection.items.find((i) => i.value === sort)?.label ?? sort })
    }
    if (stock !== FILTER_DEFAULTS.stock) {
      list.push({ key: 'stock', label: stockCollection.items.find((i) => i.value === stock)?.label ?? stock })
    }
    if (minPrice || maxPrice) {
      const from = minPrice ? `از ${toPersianDigits(minPrice)}` : ''
      const to = maxPrice ? `تا ${toPersianDigits(maxPrice)}` : ''
      list.push({ key: 'priceRange', label: `${[from, to].filter(Boolean).join(' ')} تومان` })
    }
    if (kpiFilter) {
      list.push({ key: 'kpiFilter', label: kpiItems.find((i) => i.key === kpiFilter)?.label ?? kpiFilter })
    }
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, featuredOnly, discountOnly, status, currency, sort, stock, minPrice, maxPrice, kpiFilter])

  const removeFilter = (key: string) => {
    switch (key) {
      case 'search': setSearch(''); break
      case 'category': setCategory(FILTER_DEFAULTS.category); break
      case 'featuredOnly': setFeaturedOnly(false); break
      case 'discountOnly': setDiscountOnly(false); break
      case 'status': setStatus(FILTER_DEFAULTS.status); break
      case 'currency': setCurrency(FILTER_DEFAULTS.currency); break
      case 'sort': setSort(FILTER_DEFAULTS.sort); break
      case 'stock': setStock(FILTER_DEFAULTS.stock); break
      case 'priceRange': setMinPrice(FILTER_DEFAULTS.minPrice); setMaxPrice(FILTER_DEFAULTS.maxPrice); break
      case 'kpiFilter': setKpiFilter(null); break
    }
  }

  // ── نمایش X تا Y از Z محصول ──
  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeEnd = Math.min(page * pageSize, filtered.length)

  const handlePageSizeChange = (v: number) => {
    setPageSize(v)
    setPage(1)
  }

  // ── کپی/حذف محصول (تک یا گروهی) — mock، بدون API واقعی (delay مصنوعی مطابق قرارداد mock پروژه) ──
  const handleConfirmDialog = async () => {
    if (!confirmDialog) return
    const { variant, targets } = confirmDialog
    await new Promise((resolve) => setTimeout(resolve, 600))
    if (variant === 'copy') {
      toaster.create({ id: `product-copy-${targets[0]}`, title: 'نسخهٔ کپی ایجاد شد', type: 'success', duration: 2500 })
    } else {
      toaster.create({
        id: `product-delete-${targets.join('-')}`,
        title: targets.length > 1 ? `${toPersianDigits(targets.length)} محصول حذف شد` : 'محصول حذف شد',
        type: 'success',
        duration: 2500,
      })
      setSelection((prev) => prev.filter((id) => !targets.includes(id)))
    }
    setConfirmDialog(null)
  }

  return (
    <Flex direction="column" gap="4">
      {/* ── Page Header ── */}
      <Header
        title="لیست محصولات"
        breadcrumbs={[{ label: 'داشبورد', href: '/' }, { label: 'لیست محصولات' }]}
        cta={<HeaderCTA label="افزودن محصول" icon={<Plus size={16} />} onClick={() => router.push('/products/new')} />}
      />

      {/* ── KPI ── */}
      <KpiRow items={kpiItems} activeKey={kpiFilter} onFilterClick={handleKpiFilterClick} isCompact={isCompact} />

      {/* ── Content Panel ── */}
      <Box bg="bg.panel" borderWidth="1px" borderColor="border" rounded="2xl" p={{ base: '4', md: isCompact ? '4' : '6' }}>

        <Flex direction="column" gap="3" mb="5">
          <FilterBar
            search={search} onSearchChange={setSearch}
            category={category} onCategoryChange={setCategory}
            featuredOnly={featuredOnly} onFeaturedOnlyChange={setFeaturedOnly}
            discountOnly={discountOnly} onDiscountOnlyChange={setDiscountOnly}
            sort={sort} onSortChange={setSort}
            onOpenFilters={() => setFilterOpen(true)}
            isCompact={isCompact}
          />
          <FilterResultBadges filters={activeFilters} onRemove={removeFilter} onClearAll={clearAllFilters} />
        </Flex>

        {/* ── Selection Action Bar — Chakra ActionBar، همیشه mount (برای انیمیشن ورود/خروج)،
            open={count>0} خودش نمایش/انیمیشن رو کنترل می‌کنه (نه conditional render) ── */}
        <SelectionActionBar
          count={selection.length}
          onCancel={() => setSelection([])}
          onDelete={() => setConfirmDialog({ variant: 'delete', targets: selection })}
        />

        {/* ── جدول — فقط lg+ (سوییچ CSS responsive، نه فقط isCompact) ── */}
        <Box display={isCompact ? 'none' : { base: 'none', lg: 'block' }}>
          <ProductTable
            products={filtered}
            selection={selection}
            allSelected={allSelected}
            indeterminate={indeterminate}
            onToggleAll={toggleAll}
            onToggleOne={toggleOne}
            onDuplicate={(product) => setConfirmDialog({ variant: 'copy', targets: [product.id] })}
            onDelete={(product) => setConfirmDialog({ variant: 'delete', targets: [product.id] })}
          />
        </Box>

        {/* ── نمای کارت — media<lg (Figma node 5204:78695) ── */}
        <Flex direction="column" gap="4" display={isCompact ? 'flex' : { base: 'flex', lg: 'none' }}>
          {filtered.map((p) => (
            <MobileProductCard
              key={p.id}
              product={p}
              isSelected={selection.includes(p.id)}
              onToggle={() => toggleOne(p.id)}
              onDuplicate={() => setConfirmDialog({ variant: 'copy', targets: [p.id] })}
              onDelete={() => setConfirmDialog({ variant: 'delete', targets: [p.id] })}
            />
          ))}
        </Flex>

        {/* ── Pagination ── */}
        <Flex align="center" justify="space-between" mt="5" flexWrap="wrap" gap="3">
          {/* RTL: متن راست‌ترین (اول DOM)، بعدش انتخاب تعداد ردیف، pagination چپ‌ترین — مطابق Figma */}
          <Flex align="center" gap="3" flexWrap="wrap">
            <Text fontSize="sm" color="fg.muted">
              نمایش {toPersianDigits(rangeStart)} تا {toPersianDigits(rangeEnd)} از {toPersianDigits(filtered.length)} محصول
            </Text>
            <PageSizeMenu value={pageSize} onValueChange={handlePageSizeChange} />
          </Flex>

          <ListPagination count={filtered.length} pageSize={pageSize} page={page} onPageChange={setPage} />
        </Flex>
      </Box>

      {/* ── Filter Dialog — دکمهٔ فیلتر در FilterBar بازش می‌کنه ── */}
      <FilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        category={category} onCategoryChange={setCategory}
        status={status} onStatusChange={setStatus}
        currency={currency} onCurrencyChange={setCurrency}
        stock={stock} onStockChange={setStock}
        minPrice={minPrice} onMinPriceChange={setMinPrice}
        maxPrice={maxPrice} onMaxPriceChange={setMaxPrice}
        featuredOnly={featuredOnly} onFeaturedOnlyChange={setFeaturedOnly}
        discountOnly={discountOnly} onDiscountOnlyChange={setDiscountOnly}
        onClearAll={clearAllFilters}
      />

      {/* ── دیالوگ کپی/حذف محصول (تک یا گروهی) ── */}
      <ProductConfirmDialog
        open={confirmDialog !== null}
        variant={confirmDialog?.variant ?? null}
        count={confirmDialog?.targets.length ?? 1}
        onConfirm={handleConfirmDialog}
        onCancel={() => setConfirmDialog(null)}
      />
    </Flex>
  )
}
