import { Box, Button, CloseButton, Dialog, Flex, Portal, SegmentGroup, Text } from '@chakra-ui/react'
import { statusCollection, shippingCollection, type OrderType } from './data'
import { FilterSelect } from './FilterSelect'
import { DatePicker } from '@/components/ui/DatePicker'
import { NumberField } from '@/components/ui/NumberField'

export type OrderTypeFilter = OrderType | 'all'

interface OrderFilterModalProps {
  open: boolean
  onClose: () => void
  orderType?: OrderTypeFilter
  onOrderTypeChange?: (v: OrderTypeFilter) => void
  status?: string
  onStatusChange?: (v: string) => void
  shipping?: string
  onShippingChange?: (v: string) => void
  dateFrom?: string
  onDateFromChange?: (v: string) => void
  dateTo?: string
  onDateToChange?: (v: string) => void
  minAmount?: string
  onMinAmountChange?: (v: string) => void
  maxAmount?: string
  onMaxAmountChange?: (v: string) => void
  onClearAll?: () => void
}

/**
 * مودال فیلترهای سفارش — Figma node 2169:28005 («Orders / Dialog / Filters»)، با دکمهٔ
 * فیلتر در OrderFilterBar باز می‌شه.
 *
 * جدول ترجمه (RTL، از screenshot طرح — نه خروجی کد فیگما):
 * ۱. نوع سفارش (SegmentGroup) — «همه» انتخاب‌شده و راست‌ترین، سیستمی وسط، دستی چپ‌ترین
 *    → اول DOM=«همه»، بعد «سیستمی»، بعد «دستی» (چپ‌ترین).
 * ۲. بازهٔ تاریخ — راست=«از تاریخ»، چپ=«تا تاریخ» → اول DOM=«از تاریخ».
 * ۳. بازهٔ مبلغ — راست=«از مبلغ» (لیبل «مبلغ سفارش» بالاش)، چپ=«تا مبلغ» (بدون لیبل،
 *    هم‌ردیف پایین با items="end") → اول DOM=«از مبلغ».
 * ۴. فوتر — راست‌ترین=«حذف فیلترها»(قرمز/ghost)، وسط=«انصراف»(outline)،
 *    چپ‌ترین=«اعمال فیلتر»(teal solid) → اول DOM=«حذف فیلترها»، بعدش گروه
 *    [«انصراف» اول=راستِ گروه، «اعمال فیلتر» دوم=چپِ گروه].
 * «ترتیب نمایش» اینجا نیست — در OrderFilterBar بالای صفحه هست (تکراری نمی‌شه).
 */
export function OrderFilterModal({
  open, onClose,
  orderType = 'all', onOrderTypeChange,
  status, onStatusChange,
  shipping, onShippingChange,
  dateFrom = '', onDateFromChange,
  dateTo = '', onDateToChange,
  minAmount = '', onMinAmountChange,
  maxAmount = '', onMaxAmountChange,
  onClearAll,
}: OrderFilterModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(e) => { if (!e.open) onClose() }} placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl">
          <Dialog.Content maxW="480px" w="full" mx="4">

            <Dialog.Header pb="4" pt="6" px="6" position="relative" pe="12">
              <Dialog.Title fontSize="lg" fontWeight="semibold" color="fg">فیلترها</Dialog.Title>
              <Dialog.CloseTrigger asChild position="absolute" top="4" insetEnd="4">
                <CloseButton size="sm" onClick={onClose} />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body px="6" pt="2" pb="4" display="flex" flexDirection="column" gap="4">
              {/* نوع سفارش — SegmentGroup، «همه» FIRST=راست‌ترین */}
              <Flex direction="column" gap="1.5" w="full">
                <Text fontSize="sm" fontWeight="semibold" color="fg">نوع سفارش</Text>
                <SegmentGroup.Root
                  value={orderType}
                  onValueChange={(e) => onOrderTypeChange?.((e.value ?? 'all') as OrderTypeFilter)}
                  w="full" size="md"
                >
                  <SegmentGroup.Indicator bg="bg.panel" />
                  <SegmentGroup.Item value="all" flex="1" justifyContent="center">
                    <SegmentGroup.ItemText>همه</SegmentGroup.ItemText>
                    <SegmentGroup.ItemHiddenInput />
                  </SegmentGroup.Item>
                  <SegmentGroup.Item value="سیستمی" flex="1" justifyContent="center">
                    <SegmentGroup.ItemText>سیستمی</SegmentGroup.ItemText>
                    <SegmentGroup.ItemHiddenInput />
                  </SegmentGroup.Item>
                  <SegmentGroup.Item value="دستی" flex="1" justifyContent="center">
                    <SegmentGroup.ItemText>دستی</SegmentGroup.ItemText>
                    <SegmentGroup.ItemHiddenInput />
                  </SegmentGroup.Item>
                </SegmentGroup.Root>
              </Flex>

              <Flex direction="column" gap="1.5" w="full">
                <Text fontSize="sm" fontWeight="semibold" color="fg">وضعیت سفارش</Text>
                <FilterSelect collection={statusCollection} value={status} defaultValue="all" onValueChange={onStatusChange} w="full" />
              </Flex>

              <Flex direction="column" gap="1.5" w="full">
                <Text fontSize="sm" fontWeight="semibold" color="fg">روش ارسال</Text>
                <FilterSelect collection={shippingCollection} value={shipping} defaultValue="all" onValueChange={onShippingChange} w="full" />
              </Flex>

              {/* بازهٔ تاریخ — «از تاریخ» راست‌ترین، «تا تاریخ» چپ‌ترین */}
              <Flex gap="4" align="start" w="full">
                <Box flex="1" minW="0">
                  <Text fontSize="sm" fontWeight="semibold" color="fg" mb="1.5">از تاریخ</Text>
                  <DatePicker value={dateFrom} onChange={(v) => onDateFromChange?.(v)} placeholder="از تاریخ" />
                </Box>
                <Box flex="1" minW="0">
                  <Text fontSize="sm" fontWeight="semibold" color="fg" mb="1.5">تا تاریخ</Text>
                  <DatePicker value={dateTo} onChange={(v) => onDateToChange?.(v)} placeholder="تا تاریخ" />
                </Box>
              </Flex>

              {/* بازهٔ مبلغ — «از مبلغ» (با لیبل «مبلغ سفارش») راست‌ترین، «تا مبلغ» چپ‌ترین */}
              <Flex direction="column" gap="1.5" w="full">
                <Text fontSize="sm" fontWeight="semibold" color="fg">مبلغ سفارش</Text>
                <Flex gap="2" align="start" w="full">
                  <Box flex="1" minW="0">
                    <NumberField
                      placeholder="از مبلغ"
                      value={minAmount}
                      onChange={(v) => onMinAmountChange?.(v)}
                      endElement={<Text fontSize="sm" color="fg.muted" px="2">تومان</Text>}
                    />
                  </Box>
                  <Box flex="1" minW="0">
                    <NumberField
                      placeholder="تا مبلغ"
                      value={maxAmount}
                      onChange={(v) => onMaxAmountChange?.(v)}
                      endElement={<Text fontSize="sm" color="fg.muted" px="2">تومان</Text>}
                    />
                  </Box>
                </Flex>
              </Flex>
            </Dialog.Body>

            {/* Footer — حذف فیلترها (راست‌ترین) · انصراف + اعمال فیلتر (چپ‌ترین) */}
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
