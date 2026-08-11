import { Badge, Checkbox, Flex, Image, Table, Text } from '@chakra-ui/react'
import { toPersianDigits } from '@/utils/numbers'
import { STATUS_COLOR, type Product } from '@/components/products/list/data'
import { RowActionButtons } from './RowActionButtons'

interface ProductTable2Props {
  products: Product[]
  selection: string[]
  allSelected: boolean
  indeterminate: boolean
  onToggleAll: () => void
  onToggleOne: (id: string) => void
}

/**
 * جدول محصولات — نسخهٔ list2 (طرح جدید). نسبت به ProductTable قدیمی:
 * - ستون «ویژگی‌ها» حذف شده
 * - «موجودی» به‌صورت Badge خنثی (نه متن ساده)
 * - عنوان محصول تا ۲ خط (lineClamp=2، قبلاً ۱ خط)
 * - ستون آخر = ۴ دکمهٔ عملیات (RowActionButtons) به‌جای منوی ⋮
 *
 * RTL DOM order (اولین cell = راست‌ترین): checkbox → محصول → موجودی → قیمت →
 * دسته‌بندی → وضعیت → آخرین ویرایش → actions (چپ‌ترین)
 */
export function ProductTable2({
  products, selection, allSelected, indeterminate, onToggleAll, onToggleOne,
}: ProductTable2Props) {
  return (
    <Table.ScrollArea overflowX="auto" borderWidth="0">
      <Table.Root size="md" minW="900px">
        <Table.Header>
          <Table.Row bg="bg.subtle">
            {/* checkbox (select-all) — FIRST = rightmost */}
            <Table.ColumnHeader w="12">
              <Checkbox.Root
                size="sm"
                colorPalette="brand"
                checked={indeterminate ? 'indeterminate' : allSelected}
                onCheckedChange={onToggleAll}
                aria-label="انتخاب همه"
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
              </Checkbox.Root>
            </Table.ColumnHeader>
            <Table.ColumnHeader w="320px" textAlign="start">عنوان محصول</Table.ColumnHeader>
            <Table.ColumnHeader w="130px">موجودی</Table.ColumnHeader>
            <Table.ColumnHeader w="200px">قیمت</Table.ColumnHeader>
            <Table.ColumnHeader w="160px">دسته‌بندی</Table.ColumnHeader>
            <Table.ColumnHeader w="140px">وضعیت</Table.ColumnHeader>
            <Table.ColumnHeader w="140px">آخرین ویرایش</Table.ColumnHeader>
            {/* actions — LAST = leftmost، بدون عنوان */}
            <Table.ColumnHeader w="180px" />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {products.map((p, i) => {
            const isSel = selection.includes(p.id)
            return (
              <Table.Row
                key={p.id}
                bg={isSel ? 'brand.bg' : i % 2 === 1 ? 'bg.subtle' : 'bg'}
                _hover={{ bg: isSel ? 'brand.subtle' : 'bg.muted' }}
                transition="background 0.15s"
              >
                {/* checkbox — rightmost */}
                <Table.Cell>
                  <Checkbox.Root
                    size="sm"
                    colorPalette="brand"
                    checked={isSel}
                    onCheckedChange={() => onToggleOne(p.id)}
                    aria-label={`انتخاب ${p.name}`}
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                  </Checkbox.Root>
                </Table.Cell>

                {/* محصول — عکس FIRST (راست) + نام(۲ خط)/SKU badge */}
                <Table.Cell>
                  <Flex align="center" gap="3">
                    <Image
                      src={p.image}
                      alt={p.name}
                      w="12" h="12"
                      rounded="md"
                      objectFit="cover"
                      flexShrink={0}
                    />
                    <Flex direction="column" gap="1" align="end" minW="0" flex="1">
                      <Text fontSize="sm" fontWeight="semibold" lineClamp={2} textAlign="end">{p.name}</Text>
                      <Badge size="xs" variant="subtle">{p.sku}</Badge>
                    </Flex>
                  </Flex>
                </Table.Cell>

                {/* موجودی — Badge خنثی */}
                <Table.Cell>
                  <Badge size="sm" variant="subtle" color={p.inventory === 0 ? 'fg.error' : 'gray.fg'}>
                    {toPersianDigits(p.inventory)} عدد
                  </Badge>
                </Table.Cell>

                {/* قیمت */}
                <Table.Cell>
                  <Flex direction="column" gap="1" align="end">
                    <Text fontSize="sm" fontWeight="semibold">
                      {p.priceMain}{p.currency === 'تومان' ? ' ت' : ''}
                    </Text>
                    {p.priceOriginal && (
                      <Flex align="center" gap="2">
                        {/* RTL (تأیید شده با screenshot مجزای Figma node 1246:17101): قیمت خط‌خورده FIRST=راست، بج تخفیف بعدش=چپ */}
                        <Text fontSize="xs" color="fg.subtle" textDecoration="line-through">
                          {p.priceOriginal}{p.currency === 'تومان' ? ' ت' : ''}
                        </Text>
                        {p.discount && (
                          <Badge size="xs" colorPalette="orange" variant="solid">{p.discount}</Badge>
                        )}
                      </Flex>
                    )}
                  </Flex>
                </Table.Cell>

                {/* دسته‌بندی */}
                <Table.Cell>
                  <Text fontSize="sm" color="fg.muted">{p.category}</Text>
                </Table.Cell>

                {/* وضعیت */}
                <Table.Cell>
                  <Badge size="sm" colorPalette={STATUS_COLOR[p.status]} variant="subtle">
                    {p.status}
                  </Badge>
                </Table.Cell>

                {/* آخرین ویرایش */}
                <Table.Cell>
                  <Text fontSize="sm" color="fg.muted">{p.lastEdit}</Text>
                </Table.Cell>

                {/* actions — leftmost، ۴ دکمهٔ صریح */}
                <Table.Cell>
                  <RowActionButtons />
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  )
}
