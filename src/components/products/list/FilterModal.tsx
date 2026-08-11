import {
  Button, CloseButton, Dialog, Flex, Portal,
  Switch, Text,
} from '@chakra-ui/react'
import {
  catCollection, statusCollection, currencyCollection, sortCollection,
} from './data'
import { FilterSelect } from './FilterSelect'

interface FilterModalProps {
  open: boolean
  onClose: () => void
  /** ── controlled state (اختیاری — ProductList2 برای بج‌های فیلتر پاس می‌ده) ── */
  category?: string
  onCategoryChange?: (v: string) => void
  status?: string
  onStatusChange?: (v: string) => void
  currency?: string
  onCurrencyChange?: (v: string) => void
  sort?: string
  onSortChange?: (v: string) => void
  unlimitedStock?: boolean
  onUnlimitedStockChange?: (v: boolean) => void
  discountOnly?: boolean
  onDiscountOnlyChange?: (v: boolean) => void
  onClearAll?: () => void
}

/** مودال فیلترها — در ProductList فقط در حالت mobile/compact باز می‌شود؛ در ProductList2 با دکمهٔ فیلتر در همه‌جا. */
export function FilterModal({
  open, onClose,
  category, onCategoryChange,
  status, onStatusChange,
  currency, onCurrencyChange,
  sort, onSortChange,
  unlimitedStock, onUnlimitedStockChange,
  discountOnly, onDiscountOnlyChange,
  onClearAll,
}: FilterModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(e) => { if (!e.open) onClose() }} placement="center">
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
              <FilterSelect collection={catCollection} value={category} defaultValue="all" onValueChange={onCategoryChange} w="full" />
              <FilterSelect collection={statusCollection} value={status} defaultValue="all" onValueChange={onStatusChange} w="full" />
              <FilterSelect collection={currencyCollection} value={currency} defaultValue="all" onValueChange={onCurrencyChange} w="full" />
              <FilterSelect collection={sortCollection} value={sort} defaultValue="newest" onValueChange={onSortChange} w="full" />

              {/* Switch FIRST = راست · label LAST = چپ */}
              <Flex align="center" gap="2.5" w="full">
                <Switch.Root
                  size="sm" colorPalette="teal" flexShrink={0}
                  checked={unlimitedStock} onCheckedChange={(e) => onUnlimitedStockChange?.(e.checked)}
                >
                  <Switch.HiddenInput />
                  <Switch.Control><Switch.Thumb /></Switch.Control>
                </Switch.Root>
                <Text flex="1" fontSize="sm">موجودی نامحدود</Text>
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
                <Text flex="1" fontSize="sm">تخفیف دارد</Text>
              </Flex>
            </Dialog.Body>

            {/* Footer — حذف فیلترها (راست) · لغو + فیلترکن (چپ) */}
            <Dialog.Footer px="6" pb="6" pt="2" justifyContent="space-between">
              <Button variant="ghost" size="sm" colorPalette="red" color="fg.error" onClick={onClearAll}>
                حذف فیلترها
              </Button>
              <Flex gap="2">
                <Button variant="outline" size="sm" onClick={onClose}>لغو</Button>
                <Button size="sm" bg="brand.solid" color="brand.contrast" _hover={{ bg: 'brand.emphasized', color: 'brand.fg' }} onClick={onClose}>
                  فیلترکن
                </Button>
              </Flex>
            </Dialog.Footer>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
