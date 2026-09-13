import { useEffect, useState } from 'react'
import {
  Dialog, Portal, CloseButton, Text, Flex, Button, Box, Switch, Badge, chakra,
} from '@chakra-ui/react'
import { Link2, Link2Off } from 'lucide-react'
import { NumberField } from '@/components/ui/NumberField'
import { toPersianDigits, formatThousands } from '@/utils/numbers'
import { MediaThumb } from './MediaThumb'
import { focusInputWithin } from './focusField'
import type { VariantCombination } from './data'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface ModelSettingsDialogProps {
  combo: VariantCombination | null
  onClose: () => void
  unit: string
  /** مقادیر محصول اصلی — مبنای ارث‌بری */
  source: { price: string; inventory: string; image: string }
  onChange: (patch: Partial<VariantCombination>) => void
  onPickImage: () => void
}

// ─── InheritRow ─────────────────────────────────────────────────────────────────
/** یک ردیفِ «از محصول اصلی ارث می‌برد / مقدار مستقل دارد» */
function InheritRow({
  label, inherited, sourceText, onLink, onUnlink, children,
}: {
  label: string
  inherited: boolean
  sourceText: string
  onLink: () => void
  onUnlink: () => void
  children: React.ReactNode
}) {
  return (
    <Box>
      {/* FIRST = rightmost: عنوان … وضعیت ارث‌بری (چپ‌ترین) */}
      <Flex align="center" gap="2" mb="1.5">
        <Text fontSize="xs" color="fg.muted" flex="1" textAlign="start">{label}</Text>
        <Badge
          size="xs"
          rounded="l2"
          gap="1"
          colorPalette={inherited ? 'brand' : 'gray'}
          variant={inherited ? 'subtle' : 'outline'}
        >
          {inherited ? <Link2 size={10} /> : <Link2Off size={10} />}
          {inherited ? 'از محصول اصلی' : 'مقدار مستقل'}
        </Badge>
        <chakra.button
          type="button"
          onClick={inherited ? onUnlink : onLink}
          fontSize="2xs"
          color="brand.fg"
          bg="transparent"
          cursor="pointer"
          textDecoration="underline"
          textUnderlineOffset="2px"
          flexShrink={0}
        >
          {inherited ? 'مقدار جدا' : `برگرداندن به ${sourceText}`}
        </chakra.button>
      </Flex>
      {children}
    </Box>
  )
}

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * ModelSettingsDialog — تنظیمات یک مدل، پشت دکمهٔ ⋮ همان ردیف.
 *
 * چرا دیالوگ و نه ستون‌های بیشتر در جدول: جدول مدل‌ها همین حالا هفت ستون دارد و
 * افزودن «فروش تلفنی» و «موجودی نامحدود» به‌ازای هر ردیف، آن را غیرقابل خواندن
 * می‌کرد. این تنظیم‌ها هم کم‌استفاده‌اند — برای استثناها، نه برای هر مدل.
 *
 * ارث‌بری هم همین‌جا دیده و کنترل می‌شود: هر مقدار می‌گوید از محصول اصلی می‌آید یا
 * مستقل شده، و با یک کلیک به حالت ارث‌بری برمی‌گردد.
 */
export function ModelSettingsDialog({
  combo, onClose, unit, source, onChange, onPickImage,
}: ModelSettingsDialogProps) {
  const [draft, setDraft] = useState<VariantCombination | null>(combo)
  useEffect(() => { setDraft(combo) }, [combo])

  if (!draft) {
    return <Dialog.Root open={false} onOpenChange={() => {}}><Portal /></Dialog.Root>
  }

  const set = (patch: Partial<VariantCombination>) =>
    setDraft((d) => (d ? { ...d, ...patch } : d))

  const setInherit = (key: 'price' | 'inventory' | 'image', on: boolean) =>
    setDraft((d) => {
      if (!d) return d
      const inherits = { ...d.inherits, [key]: on }
      // برگشت به ارث‌بری یعنی همان لحظه مقدار محصول اصلی بنشیند
      const value = on
        ? key === 'price' ? { price: source.price }
          : key === 'inventory' ? { inventory: source.inventory }
            : { image: source.image }
        : {}
      return { ...d, inherits, ...value }
    })

  const save = () => {
    onChange({
      price: draft.price,
      inventory: draft.inventory,
      image: draft.image,
      phoneSale: draft.phoneSale,
      unlimitedInventory: draft.unlimitedInventory,
      inherits: draft.inherits,
    })
    onClose()
  }

  return (
    <Dialog.Root open onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl" py="6">
          <Dialog.Content maxW="520px" w="full" mx="4">

            <Dialog.Header pt="5" px="6" pb="2" position="relative">
              <Dialog.Title fontSize="md" fontWeight="semibold" textAlign="start" w="full">
                تنظیمات مدل
              </Dialog.Title>
              <Text fontSize="xs" color="fg.muted" textAlign="start" mt="1" dir="auto">
                {draft.values.join(' / ')} · <chakra.span dir="ltr">{draft.sku}</chakra.span>
              </Text>
              <Dialog.CloseTrigger asChild position="absolute" top="3" insetEnd="3">
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body px="6" pt="3" pb="4">
              <Flex direction="column" gap="4">

                {/* تصویر */}
                <InheritRow
                  label="تصویر مدل"
                  inherited={draft.inherits.image}
                  sourceText="تصویر اصلی"
                  onLink={() => setInherit('image', true)}
                  onUnlink={() => setInherit('image', false)}
                >
                  <Flex gap="2.5" align="center">
                    {/* FIRST = rightmost: بندانگشتی */}
                    <MediaThumb
                      src={draft.image}
                      boxSize="56px"
                      flexShrink={0}
                      rounded="lg"
                      borderWidth="1px"
                      borderColor="border"
                    />
                    <Button size="xs" variant="outline" rounded="l2" onClick={onPickImage}>
                      انتخاب از گالری
                    </Button>
                    {draft.image && (
                      <Button
                        size="xs"
                        variant="ghost"
                        colorPalette="red"
                        rounded="l2"
                        onClick={() => setInherit('image', true)}
                      >
                        حذف
                      </Button>
                    )}
                  </Flex>
                </InheritRow>

                {/* قیمت */}
                <InheritRow
                  label="قیمت"
                  inherited={draft.inherits.price}
                  sourceText={`${toPersianDigits(formatThousands(Number(source.price) || 0))} ${unit}`}
                  onLink={() => setInherit('price', true)}
                  onUnlink={() => setInherit('price', false)}
                >
                  <Box onClick={focusInputWithin} cursor="text">
                    <NumberField
                      value={draft.price}
                      onChange={(v) => set({ price: v, inherits: { ...draft.inherits, price: false } })}
                      disabled={draft.phoneSale}
                      endElement={<Text fontSize="xs" color="fg.muted">{unit}</Text>}
                    />
                  </Box>
                </InheritRow>

                {/* موجودی */}
                <InheritRow
                  label="موجودی"
                  inherited={draft.inherits.inventory}
                  sourceText={`${toPersianDigits(source.inventory || '0')} عدد`}
                  onLink={() => setInherit('inventory', true)}
                  onUnlink={() => setInherit('inventory', false)}
                >
                  <Flex gap="2.5" align="center">
                    <Box flex="1" minW="0" onClick={focusInputWithin} cursor="text">
                      <NumberField
                        value={draft.inventory}
                        onChange={(v) => set({ inventory: v, inherits: { ...draft.inherits, inventory: false } })}
                        disabled={draft.unlimitedInventory}
                        showSteppers
                        endElement={<Text fontSize="xs" color="fg.muted">عدد</Text>}
                      />
                    </Box>
                    <Flex direction="column" align="center" gap="1" flexShrink={0}>
                      <Switch.Root
                        size="sm"
                        colorPalette="brand"
                        checked={draft.unlimitedInventory}
                        onCheckedChange={(e) => set({ unlimitedInventory: e.checked })}
                      >
                        <Switch.HiddenInput />
                        <Switch.Control><Switch.Thumb /></Switch.Control>
                      </Switch.Root>
                      <Text fontSize="2xs" color="fg.muted" whiteSpace="nowrap">نامحدود</Text>
                    </Flex>
                  </Flex>
                </InheritRow>

                {/* فروش تلفنی — استثنای این مدل */}
                <Flex
                  align="center"
                  gap="2.5"
                  px="2.5"
                  py="2"
                  rounded="lg"
                  borderWidth="1px"
                  borderColor={draft.phoneSale ? 'orange.muted' : 'border.muted'}
                  bg={draft.phoneSale ? 'orange.bg' : 'bg.subtle'}
                >
                  <Box flex="1" minW="0">
                    <Text fontSize="sm" fontWeight="medium" color="fg" textAlign="start">فروش تلفنی این مدل</Text>
                    <Text fontSize="2xs" color="fg.muted" textAlign="start" lineHeight="1.9">
                      قیمت این مدل پنهان می‌شود و خریدار به‌جای خرید، دکمهٔ تماس می‌بیند.
                    </Text>
                  </Box>
                  <Switch.Root
                    size="sm"
                    colorPalette="orange"
                    checked={draft.phoneSale}
                    onCheckedChange={(e) => set({ phoneSale: e.checked })}
                    flexShrink={0}
                  >
                    <Switch.HiddenInput />
                    <Switch.Control><Switch.Thumb /></Switch.Control>
                  </Switch.Root>
                </Flex>

              </Flex>
            </Dialog.Body>

            <Dialog.Footer px="6" pt="0" pb="5">
              {/* LAST = leftmost: ذخیره */}
              <Flex justify="end" w="full" gap="3">
                <Button variant="outline" onClick={onClose}>انصراف</Button>
                <Button colorPalette="brand" onClick={save}>ذخیره</Button>
              </Flex>
            </Dialog.Footer>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
