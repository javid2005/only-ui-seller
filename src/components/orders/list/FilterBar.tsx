import { Box, Flex, IconButton, Input, InputGroup, Menu, Portal, Spacer } from '@chakra-ui/react'
import { ArrowUpNarrowWide, Filter, Search } from 'lucide-react'
import { FilterSelect } from '@/components/orders/list/FilterSelect'
import { statusCollection, sortCollection } from '@/components/orders/list/data'

interface FilterBarProps {
  search: string
  onSearchChange: (v: string) => void
  status: string
  onStatusChange: (v: string) => void
  sort: string
  onSortChange: (v: string) => void
  onOpenFilters: () => void
  /** true = همیشه چیدمان موبایل (isCompact واقعی)، false = responsive (موبایل واقعی خودش می‌گیره) */
  isCompact?: boolean
}

/**
 * ردیف فیلترهای صفحهٔ لیست سفارشات — Figma node 5251:85872. الگو عیناً از
 * `products/list/FilterBar.tsx` (کاربر خواسته ساختار desktop/responsive/mobile مثل
 * محصولات باشه)، فقط select دسته‌بندی/سوییچ‌ها با select وضعیت سفارش عوض شده — سفارش
 * ندارن.
 *
 * RTL DOM order (اولین = راست‌ترین، از اندازه‌گیری screenshot طرح نه خروجی کد فیگما):
 * جستجو → select وضعیت سفارش → Spacer → دکمهٔ فیلتر → select ترتیب نمایش (چپ‌ترین)
 *
 * media<md: فقط جستجو (fill) + دکمهٔ فیلتر — بقیهٔ فیلترها (وضعیت/روش ارسال/تاریخ) داخل
 * OrderFilterModal. ترتیب نمایش از select به IconButton+Menu هم همین‌جا (`md`) تبدیل می‌شه
 * — چون OrderTable/OrderGrid هم دقیقاً همون‌جا (`md`) از جدول به کارت سوییچ می‌کنن.
 */
export function FilterBar({
  search, onSearchChange,
  status, onStatusChange,
  sort, onSortChange, onOpenFilters,
  isCompact = false,
}: FilterBarProps) {
  const rv = <T,>(mobile: T, desktop: T) => (isCompact ? mobile : { base: mobile, md: desktop })

  return (
    <Flex gap="3" align="center" overflowX={rv('visible', 'auto')}>
      {/* جستجو — راست‌ترین، fill در موبایل (بدون maxW) */}
      <InputGroup startElement={<Search size={14} color="var(--chakra-colors-fg-subtle)" />} flex="1 0 200px" maxW={rv('none', '320px')}>
        <Input
          placeholder="جستجو در سفارش، نام، کد رهگیری و ..."
          size="sm"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </InputGroup>

      {/* وضعیت سفارش — فقط md+، در موبایل داخل دیالوگ فیلترها */}
      <Box display={rv('none', 'block')}>
        <FilterSelect collection={statusCollection} value={status} onValueChange={onStatusChange} minW="140px" maxW="160px" />
      </Box>

      <Spacer display={rv('none', 'block')} />

      {/* سمت چپ: دکمهٔ فیلتر + ترتیب نمایش (چپ‌ترین) */}
      <IconButton variant="outline" size="sm" aria-label="فیلترها" onClick={onOpenFilters} flexShrink={0}>
        <Filter size={16} />
      </IconButton>

      {/* ترتیب نمایش — select در md+ */}
      <Box display={isCompact ? 'none' : { base: 'none', md: 'block' }}>
        <FilterSelect collection={sortCollection} value={sort} onValueChange={onSortChange} minW="110px" maxW="150px" />
      </Box>

      {/* ترتیب نمایش — IconButton+Menu در media<md، آیتم‌ها radioItems */}
      <Box display={isCompact ? 'block' : { base: 'block', md: 'none' }}>
        <Menu.Root>
          <Menu.Trigger asChild>
            <IconButton variant="outline" size="sm" aria-label="ترتیب نمایش" flexShrink={0}>
              <ArrowUpNarrowWide size={16} />
            </IconButton>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner dir="rtl">
              <Menu.Content minW="180px" p="1">
                <Menu.RadioItemGroup value={sort} onValueChange={(e) => onSortChange(e.value)}>
                  {sortCollection.items.map((item) => (
                    <Menu.RadioItem key={item.value} value={item.value}>
                      <Menu.ItemText>{item.label}</Menu.ItemText>
                      <Menu.ItemIndicator />
                    </Menu.RadioItem>
                  ))}
                </Menu.RadioItemGroup>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Box>
    </Flex>
  )
}
