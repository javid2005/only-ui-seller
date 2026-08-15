'use client'

import { useMemo, useState, useEffect } from 'react'
import { Button, CloseButton, Dialog, Flex, Input, InputGroup, Portal, Select, Text, createListCollection } from '@chakra-ui/react'
import { Search } from 'lucide-react'
import { toLatinDigits } from '@/utils/numbers'
import { CAMPAIGN_CATEGORY_OPTIONS, CAMPAIGN_PRODUCTS, type CampaignProduct } from '@/components/marketing/campaigns/data'
import { DiscountProductPickerItem } from './DiscountProductPickerItem'

const CATEGORY_COLLECTION = createListCollection({
  items: [{ value: 'all', label: 'همه دسته بندی ها' }, ...CAMPAIGN_CATEGORY_OPTIONS],
})

interface DiscountProductPickerDialogProps {
  open: boolean
  onClose: () => void
  selectedProductIds: string[]
  onConfirm: (products: CampaignProduct[]) => void
}

/**
 * DiscountProductPickerDialog — «محصولات» چندانتخابی برای دامنهٔ «محصولات منتخب»
 * (Figma: Dialog, node 5171:85832). ساختار (فیلتر جستجو+دسته‌بندی، لیست اسکرول‌پذیر، فوتر)
 * عیناً از ProductPickerDialog.tsx (دیالوگ تک‌انتخابیِ کمپین، node 2645:78420) کپی شده —
 * get_metadata دو نود را کاملاً هم‌ساختار نشان داد؛ تنها فرقِ واقعی چک‌باکس به‌جای رادیو است
 * (DiscountProductPickerItem به‌جای ProductPickerItem) و انتخاب چندتایی (pendingIds آرایه).
 * دادهٔ محصولات از همان catalog مشترک کمپین‌ها (`CAMPAIGN_PRODUCTS`) می‌آید — تکرار داده ممنوع.
 *
 * دکمهٔ «تایید» برخلاف نسخهٔ تک‌انتخابی هیچ‌وقت disabled نمی‌شود — پاک‌کردن کل انتخاب
 * (۰ محصول) هم یک تایید معتبر است (یعنی کاربر می‌تواند از این دیالوگ همه را هم حذف کند).
 */
export function DiscountProductPickerDialog({ open, onClose, selectedProductIds, onConfirm }: DiscountProductPickerDialogProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [pendingIds, setPendingIds] = useState<string[]>(selectedProductIds)

  useEffect(() => {
    if (open) setPendingIds(selectedProductIds)
  }, [open, selectedProductIds])

  const filtered = useMemo(() => {
    const q = toLatinDigits(search.trim()).toLowerCase()
    return CAMPAIGN_PRODUCTS.filter((p) => {
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      return matchesSearch
    })
  }, [search])

  const toggleProduct = (id: string) => {
    setPendingIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const handleConfirm = () => {
    onConfirm(CAMPAIGN_PRODUCTS.filter((p) => pendingIds.includes(p.id)))
  }

  return (
    <Dialog.Root open={open} onOpenChange={({ open: o }) => !o && onClose()} placement="center" size="md">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl">
          <Dialog.Content w="full" mx="4">
            <Dialog.Header pt="6" pb="4" px="6">
              <Dialog.Title fontSize="lg" fontWeight="semibold" color="fg">محصولات</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body pt="2" pb="6" px="6">
              <Flex direction="column" gap="4" alignItems="start" w="full">
                {/* زیر sm: ستونی (جستجو بالا، دسته‌بندی زیرش) — sm به بالا: هم‌ردیف */}
                <Flex direction={{ base: 'column', sm: 'row' }} gap="2" w="full" align={{ base: 'stretch', sm: 'start' }}>
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
                      <DiscountProductPickerItem
                        key={p.id}
                        product={p}
                        selected={pendingIds.includes(p.id)}
                        onToggle={() => toggleProduct(p.id)}
                      />
                    ))}
                  </Flex>
                )}
              </Flex>
            </Dialog.Body>

            {/* دو دکمه — طبق قرارداد پروژه: انصراف FIRST (راست) · برند LAST (چپ) —
                تأیید screenshot: node 5171:85832 هم به همین ترتیب دیداری رندر شده */}
            <Dialog.Footer pt="2" pb="4" px="6">
              <Flex justify="end" gap="3" w="full">
                <Button variant="outline" colorPalette="gray" onClick={onClose}>انصراف</Button>
                <Button colorPalette="brand" onClick={handleConfirm}>تایید</Button>
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
