import { useEffect, useState } from 'react'
import { Dialog, Portal, CloseButton, Text, Flex, Listbox, Button, createListCollection } from '@chakra-ui/react'
import { VARIANT_GROUPS } from './data'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface VariantSelectDialogProps {
  open: boolean
  onClose: () => void
  /** تنوع‌های فعلیِ تصویر (label) — برای مقداردهی اولیهٔ انتخاب‌ها */
  selectedTags: string[]
  onConfirm: (tags: string[]) => void
}

const GROUP_COLLECTIONS = VARIANT_GROUPS.map((group) => ({
  group,
  collection: createListCollection({ items: group.options }),
}))

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * VariantSelectDialog — انتخاب تنوع (رنگ/رم و ...) مربوط به یک تصویر گالری.
 *
 * هر گروه (رنگ، رم) یک `Listbox.Root` جداست با `selectionMode="multiple"`.
 * DOM order فوتر (rightmost-first در RTL): «پاک کردن همه» → گروه [انصراف, تایید]
 * (تایید LAST = چپ‌ترین، طبق قرارداد پروژه در ButtonFooter).
 *
 * Figma: New Product / gallery — Dialog «انتخاب تنوع» (node 3923:73650)
 */
export function VariantSelectDialog({ open, onClose, selectedTags, onConfirm }: VariantSelectDialogProps) {
  const [selections, setSelections] = useState<Record<string, string[]>>({})

  // با هر بار باز شدن دیالوگ، تنوع‌های فعلیِ تصویر (label) به value هر گروه map می‌شود
  useEffect(() => {
    if (!open) return
    const next: Record<string, string[]> = {}
    for (const { group } of GROUP_COLLECTIONS) {
      next[group.id] = group.options.filter((o) => selectedTags.includes(o.label)).map((o) => o.value)
    }
    setSelections(next)
  }, [open, selectedTags])

  const clearAll = () => {
    const next: Record<string, string[]> = {}
    for (const { group } of GROUP_COLLECTIONS) next[group.id] = []
    setSelections(next)
  }

  const confirm = () => {
    const tags = GROUP_COLLECTIONS.flatMap(({ group }) =>
      group.options.filter((o) => selections[group.id]?.includes(o.value)).map((o) => o.label),
    )
    onConfirm(tags)
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl" py="6">
          <Dialog.Content maxW="384px" w="full" mx="4">
            <Dialog.Header pb="4" pt="6" px="6" position="relative">
              <Dialog.Title fontSize="lg" fontWeight="semibold" textAlign="right" w="full">
                انتخاب تنوع مربوط به تصویر
              </Dialog.Title>
              <Dialog.CloseTrigger asChild position="absolute" top="3" insetEnd="3">
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body px="6" pt="0" pb="4">
              <Flex direction="column" gap="4">
                <Text fontSize="sm" color="fg.muted">
                  تنوع های مربوط به این تصویر را انتخاب نمایید.
                </Text>

                {GROUP_COLLECTIONS.map(({ group, collection }) => (
                  <Listbox.Root
                    key={group.id}
                    collection={collection}
                    selectionMode="multiple"
                    value={selections[group.id] ?? []}
                    onValueChange={(d) => setSelections((prev) => ({ ...prev, [group.id]: d.value }))}
                  >
                    <Listbox.Label fontWeight="normal">{group.label}</Listbox.Label>
                    <Listbox.Content>
                      {group.options.map((opt) => (
                        <Listbox.Item key={opt.value} item={opt}>
                          <Listbox.ItemText>{opt.label}</Listbox.ItemText>
                          <Listbox.ItemIndicator />
                        </Listbox.Item>
                      ))}
                    </Listbox.Content>
                  </Listbox.Root>
                ))}
              </Flex>
            </Dialog.Body>

            <Dialog.Footer px="6" pt="2" pb="4">
              <Flex justify="space-between" align="center" w="full">
                {/* FIRST = rightmost */}
                <Button variant="plain" color="red.fg" px="0" onClick={clearAll}>
                  پاک کردن همه
                </Button>
                {/* LAST = leftmost subgroup: انصراف (راست‌تر) → تایید (چپ‌ترین) */}
                <Flex gap="3">
                  <Button variant="outline" onClick={onClose}>
                    انصراف
                  </Button>
                  <Button colorPalette="brand" onClick={confirm}>
                    تایید
                  </Button>
                </Flex>
              </Flex>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
