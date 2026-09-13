import { useEffect, useState } from 'react'
import { Dialog, Portal, Text, Flex, Grid, Button, Box, Icon, Checkbox, chakra } from '@chakra-ui/react'
import { Box as BoxIcon, LayoutGrid } from 'lucide-react'
import { PRODUCT_TYPES, type ProductTypeId } from './data'
import { ProductTypeArt } from './ProductTypeArt'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface ProductTypeDialogProps {
  open: boolean
  /** نوع فعلی — مقدار اولیهٔ انتخاب */
  value: ProductTypeId
  onConfirm: (type: ProductTypeId) => void
  /** بستن بدون تغییر — فقط وقتی قبلاً نوعی انتخاب شده باشد */
  onClose?: () => void
  /** «دیگر در ورود نشان نده» — تیکِ داخل دیالوگ */
  askOnEnter: boolean
  onAskOnEnterChange: (v: boolean) => void
}

const TYPE_ICON: Record<ProductTypeId, typeof BoxIcon> = {
  simple: BoxIcon,
  varied: LayoutGrid,
}

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * ProductTypeDialog — «نوع محصول را انتخاب کنید»، دروازهٔ ورود به ویرایشگر.
 *
 * حالت انتخاب‌شده border ضخیم‌تر + ring + پس‌زمینهٔ برند می‌گیرد. این دقیقاً همان
 * چیزی است که در دور «چاکرا اصلاح» خواسته شد: عملکرد درست بود ولی کاربر هیچ
 * نشانهٔ بصری‌ای از انتخاب‌شدن نمی‌دید.
 *
 * RTL DOM order هر کارت: [آیکن — راست] [عنوان + زیرعنوان]، و توضیح زیرشان.
 */
export function ProductTypeDialog({
  open, value, onConfirm, onClose, askOnEnter, onAskOnEnterChange,
}: ProductTypeDialogProps) {
  const [pick, setPick] = useState<ProductTypeId>(value)

  useEffect(() => {
    if (open) setPick(value)
  }, [open, value])

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => !e.open && onClose?.()}
      closeOnInteractOutside={Boolean(onClose)}
      closeOnEscape={Boolean(onClose)}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl" py="6">
          <Dialog.Content maxW="640px" w="full" mx="4">

            <Dialog.Header pt="6" px="6" pb="2">
              {/* FIRST = rightmost: آیکن سرتیتر */}
              <Flex gap="3" align="start" w="full">
                <Flex
                  boxSize="44px"
                  flexShrink={0}
                  rounded="xl"
                  align="center"
                  justify="center"
                  bg="brand.bg"
                  color="brand.fg"
                >
                  <LayoutGrid size={22} />
                </Flex>
                <Box minW="0">
                  <Dialog.Title fontSize="lg" fontWeight="semibold" textAlign="start">
                    نوع محصول را انتخاب کنید
                  </Dialog.Title>
                  <Text fontSize="sm" color="fg.muted" textAlign="start" mt="1">
                    این انتخاب فقط ساختار قیمت، موجودی و گزینه‌های خرید را تعیین می‌کند و
                    بعداً قابل تغییر است.
                  </Text>
                </Box>
              </Flex>
            </Dialog.Header>

            <Dialog.Body px="6" pt="4" pb="4">
              <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }} gap="3">
                {PRODUCT_TYPES.map((t) => {
                  const TypeIcon = TYPE_ICON[t.id]
                  const selected = pick === t.id
                  return (
                    <chakra.button
                      key={t.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setPick(t.id)}
                      display="flex"
                      flexDirection="column"
                      alignItems="stretch"
                      gap="2.5"
                      textAlign="start"
                      p="4"
                      rounded="xl"
                      bg={selected ? 'brand.bg' : 'bg.panel'}
                      // انتخاب‌شده: border ضخیم + ring — نشانهٔ بصری‌ای که قبلاً نبود
                      borderWidth={selected ? '2px' : '1px'}
                      borderColor={selected ? 'brand.solid' : 'border'}
                      boxShadow={selected ? '0 0 0 3px var(--chakra-colors-brand-subtle)' : 'none'}
                      transition="border-color 0.15s, background 0.15s, box-shadow 0.15s"
                      _hover={{ borderColor: selected ? 'brand.solid' : 'brand.border' }}
                      _focusVisible={{ outline: '2px solid', outlineColor: 'brand.focusRing', outlineOffset: '2px' }}
                    >
                      <Flex align="center" gap="2.5">
                        {/* FIRST = rightmost: آیکن نوع */}
                        <Flex
                          boxSize="38px"
                          flexShrink={0}
                          rounded="lg"
                          align="center"
                          justify="center"
                          bg={selected ? 'brand.solid' : 'bg.subtle'}
                          color={selected ? 'brand.contrast' : 'fg.muted'}
                        >
                          <TypeIcon size={19} />
                        </Flex>
                        <Box minW="0">
                          <Text fontSize="sm" fontWeight="semibold" color="fg">{t.label}</Text>
                          <Text fontSize="xs" color="fg.muted">{t.tagline}</Text>
                        </Box>
                      </Flex>
                      {/* تصویر انتزاعیِ نوع — طرح تأییدشده این را داشت و بدون آن
                          دو گزینه فقط دو بلوک متن‌اند */}
                      <ProductTypeArt
                        type={t.id}
                        rounded="14px"
                        borderWidth="1px"
                        borderColor={selected ? 'brand.muted' : 'border.muted'}
                      />
                      <Text fontSize="xs" color="fg.muted" lineHeight="1.9">
                        {t.description}
                      </Text>
                    </chakra.button>
                  )
                })}
              </Grid>
            </Dialog.Body>

            <Dialog.Footer px="6" pt="0" pb="5">
              {/* FIRST = rightmost: تیکِ «دیگر نپرس» · LAST = leftmost: اقدام اصلی */}
              <Flex align="center" justify="space-between" w="full" gap="3" wrap="wrap">
                <Checkbox.Root
                  size="sm"
                  checked={!askOnEnter}
                  onCheckedChange={(e) => onAskOnEnterChange(e.checked !== true)}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label fontSize="xs" color="fg.muted">
                    دیگر در ورود این پرسش را نشان نده
                  </Checkbox.Label>
                </Checkbox.Root>

                <Flex gap="3" flexShrink={0}>
                  {onClose && (
                    <Button variant="outline" onClick={onClose}>انصراف</Button>
                  )}
                  <Button colorPalette="brand" onClick={() => onConfirm(pick)}>
                    تأیید و شروع
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

// ─── Compact switch (نوار بالای فرم) ────────────────────────────────────────────
/**
 * ProductTypeSwitch — سوییچ فشردهٔ «ساده / متنوع» برای تغییر بعدی نوع محصول.
 * همان دو گزینه، در قالب یک SegmentGroup دستی؛ گزینهٔ فعال سطح سفید می‌گیرد.
 */
export function ProductTypeSwitch({
  value, onChange,
}: { value: ProductTypeId; onChange: (t: ProductTypeId) => void }) {
  // کلیک روی هر گزینه **دیالوگ را باز می‌کند**، نه اینکه بی‌صدا نوع را عوض کند:
  // تغییر نوع محصول ساختار قیمت و تنوع را عوض می‌کند و کاربر باید همان تصویر و
  // توضیحِ ورود را دوباره ببیند (خواستهٔ صریح مالک محصول).
  return (
    <Flex
      role="group"
      aria-label="نوع محصول"
      bg="bg.subtle"
      borderWidth="1px"
      borderColor="border"
      rounded="l2"
      p="1"
      gap="1"
      flexShrink={0}
    >
      {PRODUCT_TYPES.map((t) => {
        const TypeIcon = TYPE_ICON[t.id]
        const active = value === t.id
        return (
          <chakra.button
            key={t.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(t.id)}
            display="flex"
            alignItems="center"
            gap="1.5"
            px="3"
            h="8"
            rounded="l1"
            fontSize="xs"
            fontWeight={active ? 'semibold' : 'normal'}
            bg={active ? 'bg.panel' : 'transparent'}
            color={active ? 'brand.fg' : 'fg.muted'}
            boxShadow={active ? 'xs' : 'none'}
            transition="background 0.15s, color 0.15s"
            _focusVisible={{ outline: '2px solid', outlineColor: 'brand.focusRing', outlineOffset: '1px' }}
          >
            {/* FIRST = rightmost: آیکن */}
            <Icon size="sm"><TypeIcon /></Icon>
            {t.shortLabel}
          </chakra.button>
        )
      })}
    </Flex>
  )
}
