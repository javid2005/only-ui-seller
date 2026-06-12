import { Badge, Checkbox, Flex, Image, Table, Text } from '@chakra-ui/react'
import { toPersianDigits } from '@/utils/numbers'
import { STATUS_COLOR, type Product } from './data'
import { RowActionsMenu } from './RowActionsMenu'

interface ProductTableProps {
  products: Product[]
  selection: string[]
  allSelected: boolean
  indeterminate: boolean
  onToggleAll: () => void
  onToggleOne: (id: string) => void
}

/**
 * جدول محصولات — reusable. RTL DOM order (اولین cell = راست‌ترین):
 * checkbox → محصول(عکس+نام+SKU) → ویژگی‌ها → دسته‌بندی → قیمت → موجودی → وضعیت → آخرین ویرایش → actions
 */
export function ProductTable({
  products, selection, allSelected, indeterminate, onToggleAll, onToggleOne,
}: ProductTableProps) {
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
            <Table.ColumnHeader w="320px" textAlign="start">محصول</Table.ColumnHeader>
            <Table.ColumnHeader w="200px">ویژگی‌ها</Table.ColumnHeader>
            <Table.ColumnHeader w="160px">دسته‌بندی</Table.ColumnHeader>
            <Table.ColumnHeader w="200px">قیمت</Table.ColumnHeader>
            <Table.ColumnHeader w="130px">موجودی</Table.ColumnHeader>
            <Table.ColumnHeader w="140px">وضعیت</Table.ColumnHeader>
            <Table.ColumnHeader w="140px">آخرین ویرایش</Table.ColumnHeader>
            {/* actions — LAST = leftmost */}
            <Table.ColumnHeader w="12" />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {products.map((p, i) => {
            const isSel = selection.includes(p.id)
            return (
              <Table.Row
                key={p.id}
                h="20"
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

                {/* محصول — عکس FIRST (راست) + نام/SKU */}
                <Table.Cell>
                  <Flex align="center" gap="3">
                    <Image
                      src={p.image}
                      alt={p.name}
                      w="11" h="11"
                      rounded="md"
                      objectFit="cover"
                      flexShrink={0}
                    />
                    <Flex direction="column" gap="0.5" minW="0">
                      <Text fontSize="sm" fontWeight="medium" lineClamp={1}>{p.name}</Text>
                      <Text fontSize="xs" color="fg.subtle">{p.sku}</Text>
                    </Flex>
                  </Flex>
                </Table.Cell>

                {/* ویژگی‌ها */}
                <Table.Cell>
                  <Flex gap="1" flexWrap="wrap">
                    {p.features.map(f => (
                      <Badge key={f} size="sm" colorPalette="purple" variant="subtle">{f}</Badge>
                    ))}
                  </Flex>
                </Table.Cell>

                {/* دسته‌بندی */}
                <Table.Cell>
                  <Text fontSize="sm" color="fg.muted">{p.category}</Text>
                </Table.Cell>

                {/* قیمت */}
                <Table.Cell>
                  <Flex direction="column" gap="0.5">
                    {p.priceOriginal && (
                      <Flex align="center" gap="1.5">
                        {p.discount && (
                          <Badge size="xs" colorPalette="orange" variant="subtle">{p.discount}</Badge> // dev-engine-ignore
                        )}
                        <Text fontSize="xs" color="fg.subtle" textDecoration="line-through">
                          {p.priceOriginal}{p.currency === 'تومان' ? ' ت' : ''}
                        </Text>
                      </Flex>
                    )}
                    <Text fontSize="sm" fontWeight="medium">
                      {p.priceMain}{p.currency === 'تومان' ? ' ت' : ''}
                    </Text>
                  </Flex>
                </Table.Cell>

                {/* موجودی */}
                <Table.Cell>
                  <Text fontSize="sm" color={p.inventory === 0 ? 'fg.error' : 'fg'}>
                    {toPersianDigits(p.inventory)} عدد
                  </Text>
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

                {/* actions — leftmost */}
                <Table.Cell>
                  <RowActionsMenu />
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  )
}
