import {
  Button, CloseButton, Dialog, Flex, Portal,
  Select, Switch, Text, type ListCollection,
} from '@chakra-ui/react'
import {
  catCollection, statusCollection, currencyCollection, sortCollection,
  type FilterOption,
} from './data'

function ModalSelect({ collection, defaultValue }: { collection: ListCollection<FilterOption>; defaultValue: string }) {
  return (
    <Select.Root collection={collection} defaultValue={[defaultValue]} size="md" w="full">
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        <Select.Content minW="max-content" maxW="360px">
          {collection.items.map((it) => (
            <Select.Item key={it.value} item={it}>
              <Select.ItemText whiteSpace="nowrap">{it.label}</Select.ItemText>
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  )
}

interface FilterModalProps {
  open: boolean
  onClose: () => void
}

/** مودال فیلترها — فقط در حالت mobile/compact باز می‌شود. */
export function FilterModal({ open, onClose }: FilterModalProps) {
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
              <ModalSelect collection={catCollection}      defaultValue="all" />
              <ModalSelect collection={statusCollection}   defaultValue="all" />
              <ModalSelect collection={currencyCollection} defaultValue="all" />
              <ModalSelect collection={sortCollection}     defaultValue="newest" />

              {/* Switch FIRST = راست · label LAST = چپ */}
              <Flex align="center" gap="2.5" w="full">
                <Switch.Root size="sm" colorPalette="teal" flexShrink={0}>
                  <Switch.HiddenInput />
                  <Switch.Control><Switch.Thumb /></Switch.Control>
                </Switch.Root>
                <Text flex="1" fontSize="sm">موجودی نامحدود</Text>
              </Flex>
              <Flex align="center" gap="2.5" w="full">
                <Switch.Root size="sm" colorPalette="teal" flexShrink={0}>
                  <Switch.HiddenInput />
                  <Switch.Control><Switch.Thumb /></Switch.Control>
                </Switch.Root>
                <Text flex="1" fontSize="sm">تخفیف دارد</Text>
              </Flex>
            </Dialog.Body>

            {/* Footer — حذف فیلترها (راست) · لغو + فیلترکن (چپ) */}
            <Dialog.Footer px="6" pb="6" pt="2" justifyContent="space-between">
              <Button variant="ghost" size="sm" colorPalette="red" color="fg.error">
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
