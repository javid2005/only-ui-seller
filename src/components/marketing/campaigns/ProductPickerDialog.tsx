'use client'

import { useMemo, useState, useEffect } from 'react'
import { Button, CloseButton, Dialog, Flex, Input, InputGroup, Portal, Select, Text, createListCollection } from '@chakra-ui/react'
import { Search } from 'lucide-react'
import { toLatinDigits } from '@/utils/numbers'
import { CAMPAIGN_CATEGORY_OPTIONS, CAMPAIGN_PRODUCTS, type CampaignProduct } from './data'
import { ProductPickerItem } from './ProductPickerItem'

const CATEGORY_COLLECTION = createListCollection({
  items: [{ value: 'all', label: 'همه دسته بندی ها' }, ...CAMPAIGN_CATEGORY_OPTIONS],
})

interface ProductPickerDialogProps {
  open: boolean
  onClose: () => void
  selectedProductId: string | null
  onConfirm: (product: CampaignProduct) => void
}

/**
 * ProductPickerDialog — «انتخاب محصول» (Figma: Dialog, node 2645:78420).
 * فیلترهای search/category عیناً از الگوی موجود ProductSelectPanel.tsx کپی شده
 * (Search icon → startElement، Select.Root + createListCollection).
 */
export function ProductPickerDialog({ open, onClose, selectedProductId, onConfirm }: ProductPickerDialogProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [pendingId, setPendingId] = useState<string | null>(selectedProductId)

  useEffect(() => {
    if (open) setPendingId(selectedProductId)
  }, [open, selectedProductId])

  const filtered = useMemo(() => {
    const q = toLatinDigits(search.trim()).toLowerCase()
    return CAMPAIGN_PRODUCTS.filter((p) => {
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      return matchesSearch
    })
  }, [search])

  const handleConfirm = () => {
    const product = CAMPAIGN_PRODUCTS.find((p) => p.id === pendingId)
    if (product) onConfirm(product)
  }

  return (
    <Dialog.Root open={open} onOpenChange={({ open: o }) => !o && onClose()} placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl">
          <Dialog.Content maxW="600px" w="full" mx="4">
            <Dialog.Header pt="6" pb="4" px="6">
              <Dialog.Title fontSize="lg" fontWeight="semibold" color="fg">انتخاب محصول</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body pt="2" pb="6" px="6">
              <Flex direction="column" gap="4" alignItems="flex-start" w="full">
                {/* زیر sm: ستونی (جستجو بالا، دسته‌بندی زیرش، هر دو تمام‌عرض) — sm به بالا: هم‌ردیف */}
                <Flex direction={{ base: 'column', sm: 'row' }} gap="2" w="full" align={{ base: 'stretch', sm: 'flex-start' }}>
                  <InputGroup flex="1" minW="200px" w="full" startElement={<Search size={16} color="var(--chakra-colors-fg-subtle)" />}>
                    <Input
                      placeholder="جستجوی نام یا SKU محصول..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </InputGroup>

                  <Select.Root
                    collection={CATEGORY_COLLECTION}
                    value={[category]}
                    onValueChange={(e) => setCategory(e.value[0] ?? 'all')}
                    size="md"
                    w="full"
                    maxW={{ base: 'full', sm: '160px' }}
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
                        {CATEGORY_COLLECTION.items.map((it) => (
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
                  <Flex justify="center" w="full" py="10">
                    <Text fontSize="sm" color="fg.subtle">محصولی با این مشخصات پیدا نشد.</Text>
                  </Flex>
                ) : (
                  <Flex direction="column" gap="2" maxH="400px" overflowY="auto" w="full" pe="2">
                    {filtered.map((p) => (
                      <ProductPickerItem
                        key={p.id}
                        product={p}
                        selected={pendingId === p.id}
                        onSelect={() => setPendingId(p.id)}
                      />
                    ))}
                  </Flex>
                )}
              </Flex>
            </Dialog.Body>

            {/* دو دکمه — طبق قرارداد پروژه: انصراف FIRST (راست) · برند LAST (چپ) */}
            <Dialog.Footer pt="2" pb="4" px="6">
              <Flex justify="flex-end" gap="3" w="full">
                <Button variant="outline" colorPalette="gray" onClick={onClose}>انصراف</Button>
                <Button colorPalette="brand" disabled={!pendingId} onClick={handleConfirm}>تایید</Button>
              </Flex>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild position="absolute" top="3" insetEnd="3">
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
