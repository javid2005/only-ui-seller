import {
  Button, CloseButton, Dialog, Flex, Portal, Select, Switch, Text,
} from '@chakra-ui/react'
import { ratingCollection } from './data'

interface ReviewsFilterModalProps {
  open: boolean
  onClose: () => void
  /** فقط تب «تایید شده» — سوییچ «پاسخ داده شده» معنا داره (بقیهٔ تب‌ها vendorReply ندارن) */
  showRepliedFilter?: boolean
}

/** سوییچ ردیف — Switch FIRST (راست) · label LAST (چپ) */
function FilterSwitch({ label }: { label: string }) {
  return (
    <Flex align="center" gap="2.5" w="full">
      <Switch.Root size="sm" colorPalette="teal" flexShrink={0}>
        <Switch.HiddenInput />
        <Switch.Control><Switch.Thumb /></Switch.Control>
      </Switch.Root>
      <Text flex="1" fontSize="sm">{label}</Text>
    </Flex>
  )
}

/** مودال فیلتر نظرات — فقط در حالت mobile/compact باز می‌شود. */
export function ReviewsFilterModal({ open, onClose, showRepliedFilter = false }: ReviewsFilterModalProps) {
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
              <Select.Root collection={ratingCollection} defaultValue={['all']} size="md" w="full">
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
                    {ratingCollection.items.map((it) => (
                      <Select.Item key={it.value} item={it}>
                        <Select.ItemText whiteSpace="nowrap">{it.label}</Select.ItemText>
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Select.Root>

              {showRepliedFilter && <FilterSwitch label="پاسخ داده شده" />}
              <FilterSwitch label="شامل تصویر" />
            </Dialog.Body>

            <Dialog.Footer px="6" pb="6" pt="2" justifyContent="space-between">
              <Button variant="ghost" size="sm" colorPalette="red" color="fg.error">حذف فیلترها</Button>
              <Flex gap="2">
                <Button variant="outline" size="sm" onClick={onClose}>لغو</Button>
                <Button
                  size="sm" bg="brand.solid" color="brand.contrast"
                  _hover={{ bg: 'brand.emphasized', color: 'brand.fg' }} onClick={onClose}
                >
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
