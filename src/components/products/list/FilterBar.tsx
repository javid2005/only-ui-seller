import { Box, Flex, IconButton, Input, InputGroup, Menu, Portal, Spacer, Switch, Text } from '@chakra-ui/react'
import { ArrowUpNarrowWide, Filter, Search } from 'lucide-react'
import { FilterSelect } from '@/components/products/list/FilterSelect'
import { catCollection, sortCollection } from '@/components/products/list/data'

interface FilterBarProps {
  search: string
  onSearchChange: (v: string) => void
  category: string
  onCategoryChange: (v: string) => void
  featuredOnly: boolean
  onFeaturedOnlyChange: (v: boolean) => void
  sort: string
  onSortChange: (v: string) => void
  onOpenFilters: () => void
  /** true = همیشه چیدمان موبایل (isCompact واقعی)، false = responsive (موبایل واقعی خودش می‌گیره) */
  isCompact?: boolean
}

/**
 * ردیف فیلترهای صفحهٔ لیست محصولات — فقط یک select (دسته‌بندی) + یک switch رو inline نگه
 * می‌داره؛ بقیهٔ فیلترها (وضعیت/ارز/موجودی/بازهٔ قیمت/سوییچ دوم) داخل دیالوگ «فیلترها»
 * (FilterModal) هستن.
 *
 * RTL DOM order (اولین = راست‌ترین، از مقایسهٔ screenshot با طرح، نه خروجی کد فیگما):
 * جستجو → select دسته‌بندی → switch → Spacer → دکمهٔ فیلتر → select ترتیب نمایش (چپ‌ترین)
 *
 * media<md (screenshot کاربر — نه Figma node، مستقیم از کاربر): ردیف به ۳ کنترل ساده می‌شه
 * (سوییچ/دسته‌بندی مخفی، فقط داخل دیالوگ فیلترها در دسترسن). جستجو fill می‌شه (بدون maxW).
 * ترتیب نمایش (breakpoint جدا، media<lg — مستقیم از کاربر) از select به IconButton+Menu
 * تبدیل می‌شه (چون یه select پهن جا نمی‌شه) — تابعش عوض نشده، فقط UI جمع‌تره. سوییچ
 * isCompact-aware طبق قرارداد پروژه (`isCompact ? mobileVal : {base:mobileVal, md/lg:desktopVal}`)
 * تا هم شبیه‌سازی هم موبایل واقعی درست کار کنه.
 */
export function FilterBar({
  search, onSearchChange, category, onCategoryChange,
  featuredOnly, onFeaturedOnlyChange, sort, onSortChange, onOpenFilters,
  isCompact = false,
}: FilterBarProps) {
  const rv = <T,>(mobile: T, desktop: T) => (isCompact ? mobile : { base: mobile, md: desktop })

  return (
    <Flex gap="3" align="center" overflowX={rv('visible', 'auto')}>
      {/* جستجو — راست‌ترین، fill در موبایل (بدون maxW) */}
      <InputGroup startElement={<Search size={14} color="var(--chakra-colors-fg-subtle)" />} flex="1 0 200px" maxW={rv('none', '320px')}>
        <Input
          placeholder="جستجو در نام یا SKU ..."
          size="sm"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </InputGroup>

      {/* دسته‌بندی — فقط md+، در موبایل داخل دیالوگ فیلترها */}
      <Box display={rv('none', 'block')}>
        <FilterSelect collection={catCollection} value={category} onValueChange={onCategoryChange} minW="140px" maxW="200px" />
      </Box>

      {/* switch — Control FIRST=راست، label بعدش — فقط md+ */}
      <Flex align="center" gap="2.5" flexShrink={0} display={rv('none', 'flex')}>
        <Switch.Root
          size="sm" colorPalette="teal"
          checked={featuredOnly}
          onCheckedChange={(e) => onFeaturedOnlyChange(e.checked)}
        >
          <Switch.HiddenInput />
          <Switch.Control><Switch.Thumb /></Switch.Control>
        </Switch.Root>
        <Text fontSize="xs" whiteSpace="nowrap">محصولات ویژه</Text>
      </Flex>

      <Spacer display={rv('none', 'block')} />

      {/* سمت چپ: دکمهٔ فیلتر + ترتیب نمایش (چپ‌ترین) */}
      <IconButton variant="outline" size="sm" aria-label="فیلترها" onClick={onOpenFilters} flexShrink={0}>
        <Filter size={16} />
      </IconButton>

      {/* ترتیب نمایش — select در lg+ (بقیهٔ ردیف در md+ ظاهر می‌شه، این یکی جداگانه lg — مستقیم از کاربر) */}
      <Box display={isCompact ? 'none' : { base: 'none', lg: 'block' }}>
        <FilterSelect collection={sortCollection} value={sort} onValueChange={onSortChange} minW="130px" maxW="170px" />
      </Box>

      {/* ترتیب نمایش — IconButton+Menu در media<lg، آیتم‌ها radioItems (chakra-ui.com/docs/components/menu#radio-items) */}
      <Box display={isCompact ? 'block' : { base: 'block', lg: 'none' }}>
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
