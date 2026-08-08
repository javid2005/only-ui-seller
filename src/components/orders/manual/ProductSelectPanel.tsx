import { useMemo, useState } from 'react'
import { Badge, Box, Button, Flex, Image, Input, InputGroup, Select, Text } from '@chakra-ui/react'
import { Plus, Search } from 'lucide-react'
import { TitleBar } from '@/components/ui/TitleBar'
import { toLatinDigits, toPersianDigits } from '@/utils/numbers'
import { MANUAL_PRODUCT_CATEGORIES, type ManualProduct } from './manualOrderData'

/**
 * ProductCard — یک ردیف در لیست «انتخاب محصول» (Figma local component «Manual-Prd-Card»).
 *
 * RTL DOM order (اولین child = راست‌ترین — بر اساس x-metadata/screenshot طرح،
 * نه ترتیب خروجی خام Figma که LTR است):
 *   تصویر (راست) → عنوان/بج‌ها (وسط) → قیمت + دکمهٔ افزودن (چپ)
 */
function ProductCard({ product, onAdd, disabled }: { product: ManualProduct; onAdd: () => void; disabled?: boolean }) {
  return (
    <Flex
      direction={{ base: 'column', sm: 'row' }}
      align={{ base: 'stretch', sm: 'center' }}
      gap={{ base: '3', sm: '4' }}
      w="full"
      p="4"
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border.muted"
      rounded="lg"
    >
      {/* ردیف تصویر+محتوا — روی موبایل (base) ردیف اول؛ روی sm+ بخش راست/وسطِ همون ردیف اصلی */}
      <Flex align="center" gap="4" flex="1" minW="0">
        {/* تصویر — FIRST = راست‌ترین */}
        <Flex
          align="center"
          justify="center"
          boxSize="12"
          flexShrink={0}
          bg="bg.muted"
          borderWidth="1px"
          borderColor="border.muted"
          rounded="md"
          overflow="hidden"
        >
          <Image src={product.image} alt={product.name} boxSize="full" objectFit="cover" />
        </Flex>

        {/* عنوان + بج‌ها — SECOND */}
        <Flex direction="column" gap="2" flex="1" minW="0">
          <Text fontSize="sm" fontWeight="semibold" color="fg" w="full" textAlign="start" lineClamp={1}>
            {product.name}
          </Text>
          <Flex align="center" justify="start" gap="2" flexWrap="wrap" w="full">
            <Text fontSize="xs" color="fg.muted" whiteSpace="nowrap">{product.sku}</Text>
            <Badge size="xs" colorPalette="purple" variant="subtle">{`موجودی: ${toPersianDigits(product.inventory)}`}</Badge>
            {product.hasVariety && (
              <Badge size="xs" colorPalette="green" variant="subtle">دارای تنوع</Badge>
            )}
          </Flex>
        </Flex>
      </Flex>

      {/* قیمت + دکمهٔ افزودن — LAST = چپ‌ترین. ستونی در همه حالت‌ها؛ align="end" در RTL
          یعنی چپ (نه راست — طبق قاعدهٔ ستونِ RTL پروژه). روی موبایل (base) دکمه تمام‌عرض
          زیرِ ردیفِ قیمت می‌آید؛ روی sm+ دکمه به اندازهٔ محتوا (auto) مثل قبل */}
      <Flex
        direction="column"
        align="end"
        gap={{ base: '3', sm: '1.5' }}
        flexShrink={0}
        w={{ base: 'full', sm: 'auto' }}
      >
        <Flex align="center" gap="2">
          {product.priceToman && product.priceUsd && (
            <Badge size="xs" colorPalette="gray" variant="subtle">{`$ ${product.priceUsd}`}</Badge>
          )}
          <Text fontSize="md" fontWeight="medium" color="fg" whiteSpace="nowrap">
            {product.priceToman ? `${product.priceToman} ت` : `$ ${product.priceUsd}`}
          </Text>
        </Flex>
        <Button
          variant="outline"
          size="xs"
          h="6"
          px="2"
          rounded="sm"
          fontWeight="medium"
          fontSize="xs"
          color="brand.fg"
          borderColor="brand.solid"
          bg="bg.panel"
          _hover={{ bg: 'brand.bg' }}
          disabled={disabled}
          onClick={onAdd}
          w={{ base: 'full', sm: 'auto' }}
        >
          {/* RTL: آیکن FIRST = راستِ متن */}
          <Plus size={14} />
          افزودن
        </Button>
      </Flex>
    </Flex>
  )
}

interface ProductSelectPanelProps {
  products: ManualProduct[]
  /** موجودیِ باقی‌مانده برای هر محصول با احتساب مقدارِ همین حالا در سبد — برای غیرفعال‌کردن دکمهٔ افزودن */
  remainingStock: (productId: string) => number
  onAdd: (productId: string) => void
}

export function ProductSelectPanel({ products, remainingStock, onAdd }: ProductSelectPanelProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  const filtered = useMemo(() => {
    const q = toLatinDigits(search.trim()).toLowerCase()
    return products.filter((p) => {
      const matchesCategory = category === 'all' || p.category === category
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      return matchesCategory && matchesSearch
    })
  }, [products, search, category])

  return (
    <Flex
      direction="column"
      gap="6"
      w="full"
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border"
      rounded="2xl"
      p="6"
    >
      <TitleBar
        title="انتخاب محصول"
        subtitle="محصولات مورد نظر را جستجو و به سفارش اضافه کنید."
        divider
      />

      <Flex gap="2" w="full" align="start">
        <InputGroup flex="1" minW="200px" startElement={<Search size={16} color="var(--chakra-colors-fg-subtle)" />}>
          <Input
            placeholder="جستجوی نام یا SKU محصول..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>

        <Select.Root
          collection={MANUAL_PRODUCT_CATEGORIES}
          value={[category]}
          onValueChange={(e) => setCategory(e.value[0] ?? 'all')}
          size="md"
          maxW="160px"
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="همه دسته بندی ها" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Select.Positioner>
            <Select.Content>
              {MANUAL_PRODUCT_CATEGORIES.items.map((it) => (
                <Select.Item key={it.value} item={it}>
                  <Select.ItemText whiteSpace="nowrap">{it.label}</Select.ItemText>
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
      </Flex>

      {filtered.length === 0 ? (
        <Box py="10" textAlign="center">
          <Text fontSize="sm" color="fg.subtle">محصولی با این مشخصات پیدا نشد.</Text>
        </Box>
      ) : (
        <Flex
          direction="column"
          gap="2"
          maxH="400px"
          overflowY="auto"
          /* اسکرول‌بار سمت چپ می‌افتد (RTL) — فاصله تا کارت‌ها */
          pe="2"
        >
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAdd={() => onAdd(p.id)}
              disabled={remainingStock(p.id) <= 0}
            />
          ))}
        </Flex>
      )}
    </Flex>
  )
}
