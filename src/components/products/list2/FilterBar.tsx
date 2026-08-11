import { Flex, IconButton, Input, InputGroup, Spacer, Switch, Text } from '@chakra-ui/react'
import { ListFilter, Search } from 'lucide-react'
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
}

/**
 * ردیف فیلترهای صفحهٔ لیست جدید (list2) — نسخهٔ ساده‌شده نسبت به ProductList قدیمی.
 * فقط یک select (دسته‌بندی) + یک switch رو inline نگه می‌داره؛ بقیهٔ فیلترها (وضعیت/ارز/
 * مرتب‌سازی پیشرفته/سوییچ دوم) داخل دیالوگ «فیلترها» (FilterModal مشترک) هستن.
 *
 * RTL DOM order (اولین = راست‌ترین، از مقایسهٔ screenshot با طرح، نه خروجی کد فیگما):
 * جستجو → select دسته‌بندی → switch → Spacer → select ترتیب نمایش → دکمهٔ فیلتر (چپ‌ترین)
 */
export function FilterBar({
  search, onSearchChange, category, onCategoryChange,
  featuredOnly, onFeaturedOnlyChange, sort, onSortChange, onOpenFilters,
}: FilterBarProps) {
  return (
    <Flex gap="3" align="center" overflowX="auto">
      {/* جستجو — راست‌ترین */}
      <InputGroup startElement={<Search size={14} color="var(--chakra-colors-fg-subtle)" />} flex="1 0 200px" maxW="320px">
        <Input
          placeholder="جستجو در نام یا SKU ..."
          size="sm"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </InputGroup>

      <FilterSelect collection={catCollection} value={category} onValueChange={onCategoryChange} minW="140px" maxW="200px" />

      {/* switch — Control FIRST=راست، label بعدش */}
      <Flex align="center" gap="2.5" flexShrink={0}>
        <Switch.Root
          size="sm" colorPalette="teal"
          checked={featuredOnly}
          onCheckedChange={(e) => onFeaturedOnlyChange(e.checked)}
        >
          <Switch.HiddenInput />
          <Switch.Control><Switch.Thumb /></Switch.Control>
        </Switch.Root>
        <Text fontSize="xs" whiteSpace="nowrap">محصولات ویژه (تخفیف دار)</Text>
      </Flex>

      <Spacer />

      {/* سمت چپ: ترتیب نمایش + دکمهٔ فیلتر (چپ‌ترین) */}
      <FilterSelect collection={sortCollection} value={sort} onValueChange={onSortChange} minW="130px" maxW="170px" />
      <IconButton variant="outline" size="sm" aria-label="فیلترها" onClick={onOpenFilters} flexShrink={0}>
        <ListFilter size={16} />
      </IconButton>
    </Flex>
  )
}
