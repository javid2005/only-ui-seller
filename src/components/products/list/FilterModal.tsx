import {
  Box, Button, CloseButton, Dialog, Flex, Portal,
  Switch, Text,
} from '@chakra-ui/react'
import {
  catCollection, statusCollection, currencyCollection, stockCollection,
} from './data'
import { FilterSelect } from './FilterSelect'
import { NumberField } from '@/components/ui/NumberField'

interface FilterModalProps {
  open: boolean
  onClose: () => void
  /** ── controlled state (اختیاری — ProductList برای بج‌های فیلتر پاس می‌ده) ── */
  category?: string
  onCategoryChange?: (v: string) => void
  status?: string
  onStatusChange?: (v: string) => void
  currency?: string
  onCurrencyChange?: (v: string) => void
  stock?: string
  onStockChange?: (v: string) => void
  minPrice?: string
  onMinPriceChange?: (v: string) => void
  maxPrice?: string
  onMaxPriceChange?: (v: string) => void
  featuredOnly?: boolean
  onFeaturedOnlyChange?: (v: boolean) => void
  discountOnly?: boolean
  onDiscountOnlyChange?: (v: boolean) => void
  onClearAll?: () => void
}

/**
 * مودال فیلترها — با دکمهٔ فیلتر در ردیف بالای جدول باز می‌شه.
 * فیلدها طبق screenshot طرح (مستقیم از کاربر، بدون Figma node): دسته‌بندی → نوع ارز →
 * وضعیت → موجودی → بازه قیمت (نو) → سوییچ «محصولات ویژه» → سوییچ «دارای تخفیف» (زیرش، جدا).
 * «ترتیب نمایش» دیگه اینجا نیست (تکراری بود — همون ردیف فیلترهای بالای صفحه/FilterBar داره).
 */
export function FilterModal({
  open, onClose,
  category, onCategoryChange,
  status, onStatusChange,
  currency, onCurrencyChange,
  stock, onStockChange,
  minPrice, onMinPriceChange,
  maxPrice, onMaxPriceChange,
  featuredOnly, onFeaturedOnlyChange,
  discountOnly, onDiscountOnlyChange,
  onClearAll,
}: FilterModalProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => { if (!e.open) onClose() }}
      placement="center"
      closeOnInteractOutside={false}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl">
          <Dialog.Content maxW="480px" w="full" mx="4">

            <Dialog.Header pb="4" pt="6" px="6" position="relative">
              <Dialog.Title fontSize="lg" fontWeight="semibold" color="fg">فیلترها</Dialog.Title>
              <Dialog.CloseTrigger asChild position="absolute" top="4" insetEnd="4">
                <CloseButton size="sm" onClick={onClose} />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body px="6" pt="2" pb="4" display="flex" flexDirection="column" gap="4">
              <Flex direction="column" gap="2">
                <Text fontSize="sm" fontWeight="semibold" color="fg">دسته بندی</Text>
                <FilterSelect collection={catCollection} value={category} defaultValue="all" onValueChange={onCategoryChange} w="full" />
              </Flex>

              <Flex direction="column" gap="2">
                <Text fontSize="sm" fontWeight="semibold" color="fg">نوع ارز</Text>
                <FilterSelect collection={currencyCollection} value={currency} defaultValue="all" onValueChange={onCurrencyChange} w="full" />
              </Flex>

              <Flex direction="column" gap="2">
                <Text fontSize="sm" fontWeight="semibold" color="fg">وضعیت</Text>
                <FilterSelect collection={statusCollection} value={status} defaultValue="all" onValueChange={onStatusChange} w="full" />
              </Flex>

              <Flex direction="column" gap="2">
                <Text fontSize="sm" fontWeight="semibold" color="fg">موجودی</Text>
                <FilterSelect collection={stockCollection} value={stock} defaultValue="all" onValueChange={onStockChange} w="full" />
              </Flex>

              {/* بازه قیمت — «از قیمت» راست‌ترین، «تا قیمت» چپ‌ترین */}
              <Flex direction="column" gap="2">
                <Text fontSize="sm" fontWeight="semibold" color="fg">بازه قیمت</Text>
                <Flex gap="3">
                  <Box flex="1">
                    <NumberField
                      placeholder="از قیمت"
                      value={minPrice ?? ''}
                      onChange={(v) => onMinPriceChange?.(v)}
                      endElement={<Text fontSize="sm" color="fg.muted" px="2">تومان</Text>}
                    />
                  </Box>
                  <Box flex="1">
                    <NumberField
                      placeholder="تا قیمت"
                      value={maxPrice ?? ''}
                      onChange={(v) => onMaxPriceChange?.(v)}
                      endElement={<Text fontSize="sm" color="fg.muted" px="2">تومان</Text>}
                    />
                  </Box>
                </Flex>
              </Flex>

              <Flex align="center" gap="2.5" w="full">
                {/* dev-engine-ignore: Switch IS first child — RTL correct */}
                <Switch.Root
                  size="sm" colorPalette="teal" flexShrink={0}
                  checked={featuredOnly} onCheckedChange={(e) => onFeaturedOnlyChange?.(e.checked)}
                >
                  <Switch.HiddenInput />
                  <Switch.Control><Switch.Thumb /></Switch.Control>
                </Switch.Root>
                <Text flex="1" fontSize="sm">محصولات ویژه</Text>
              </Flex>

              <Flex align="center" gap="2.5" w="full">
                {/* dev-engine-ignore: Switch IS first child — RTL correct */}
                <Switch.Root
                  size="sm" colorPalette="teal" flexShrink={0}
                  checked={discountOnly} onCheckedChange={(e) => onDiscountOnlyChange?.(e.checked)}
                >
                  <Switch.HiddenInput />
                  <Switch.Control><Switch.Thumb /></Switch.Control>
                </Switch.Root>
                <Text flex="1" fontSize="sm">دارای تخفیف</Text>
              </Flex>
            </Dialog.Body>

            {/* Footer — حذف فیلترها (راست) · انصراف + اعمال فیلتر (چپ) */}
            <Dialog.Footer px="6" pb="6" pt="2" justifyContent="space-between">
              <Button variant="ghost" size="sm" colorPalette="red" color="fg.error" onClick={onClearAll}>
                حذف فیلترها
              </Button>
              <Flex gap="2">
                <Button variant="outline" size="sm" onClick={onClose}>انصراف</Button>
                <Button size="sm" bg="brand.solid" color="brand.contrast" _hover={{ bg: 'brand.emphasized', color: 'brand.fg' }} onClick={onClose}>
                  اعمال فیلتر
                </Button>
              </Flex>
            </Dialog.Footer>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
