import { useEffect, useState } from 'react'
import { Button, CloseButton, Dialog, Flex, Image, Portal, Text } from '@chakra-ui/react'
import type { ManualProduct } from './manualOrderData'

/**
 * VariantSelectDialog — دیالوگ «انتخاب تنوع» (Figma node 2096:35636).
 * الگوی Dialog از AddCustomerDialog گرفته شده. با کلیک «افزودن تنوع» ترکیبِ انتخاب‌شده
 * به سبد اضافه و دیالوگ بسته می‌شود (طبق درخواست کاربر).
 *
 * RTL DOM order (اولین = راست‌ترین — طبق screenshot طرح، نه ترتیب خام Figma):
 *   ردیف محصول: تصویر (راست) → عنوان/SKU (چپ)
 *   هر گروه تنوع: مقادیر برعکسِ آرایه‌ی داده (چون علامت گذاریِ پیش‌فرض طرح روی
 *     اولین گزینهٔ آرایه است و آن باید راست‌ترین/انتخاب‌شده باشد؛ آرایهٔ options
 *     در manualOrderData.ts از قبل به همین ترتیب چیده شده — این کامپوننت آن را
 *     مستقیم map می‌کند بدون reverse اضافه).
 *   فوتر: «بستن» FIRST=راست · «افزودن تنوع» LAST=چپ (قرارداد Dialog Footer پروژه).
 */
interface VariantSelectDialogProps {
  open: boolean
  product: ManualProduct | null
  onClose: () => void
  /** یک برچسب به‌ازای هر گروه تنوع، به همان ترتیبِ product.variantGroups */
  onAddVariant: (variantLabels: string[]) => void
  /** موجودیِ باقی‌ماندهٔ کل محصول (صرف‌نظر از ترکیب تنوع) — برای غیرفعال‌کردن «افزودن تنوع» */
  remainingStock: number
}

export function VariantSelectDialog({ open, product, onClose, onAddVariant, remainingStock }: VariantSelectDialogProps) {
  // «آخرین محصولِ معتبر» جدا از prop خام نگه داشته می‌شود: وقتی onClose صدا زده می‌شود،
  // parent بلافاصله product را null می‌کند — اگر Dialog.Content بر همان prop خام شرط
  // می‌شد، کل محتوا (و زیردرخت Portal/Positioner) در همان تیک که open هم false می‌شود
  // از درخت React کنده می‌شد، قبل از اینکه چرخهٔ بسته‌شدنِ خودِ Dialog (پاک‌سازی
  // aria-hidden/scroll-lock روی بقیهٔ صفحه) کامل شود — نتیجه‌اش قفل‌شدن صفحه بعد از
  // بستن دیالوگ بود. با نگه‌داشتن آخرین محصولِ معتبر، محتوا حین انیمیشنِ بسته‌شدن هم
  // در دسترس می‌ماند و فقط خودِ prop «open» تعیین‌کنندهٔ باز/بسته بودن است.
  const [lastProduct, setLastProduct] = useState<ManualProduct | null>(null)
  useEffect(() => {
    if (product) setLastProduct(product)
  }, [product])

  const displayProduct = product ?? lastProduct
  const groups = displayProduct?.variantGroups ?? []

  // انتخاب هر گروه — پیش‌فرض اولین گزینه (هم‌راستا با pre-selected در طرح)
  const [selection, setSelection] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open || !product) return
    const initial: Record<string, string> = {}
    ;(product.variantGroups ?? []).forEach((g) => { initial[g.label] = g.options[0] })
    setSelection(initial)
    // فقط وقتی دیالوگ برای محصول جدید باز می‌شود مقداردهی می‌کنیم
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, product?.id])

  // ایمنیِ اضافه: بعد از بسته‌شدنِ این دیالوگ، استایل‌های inline‌ای که Chakra/Ark روی
  // <body> برای قفلِ اسکرول + مسدودکردنِ pointer-events پس‌زمینه می‌گذارد گاهی پاک
  // نمی‌شوند (مشاهده‌شده در این پروژه: هم overflow:hidden هم pointer-events:none باقی
  // می‌ماندند و کل صفحه را غیرقابل‌کلیک می‌کردند). پاک‌سازیِ خودِ Chakra ظاهراً async
  // است — با تأخیرِ کوتاه صبر می‌کنیم تا بعد از آن اجرا شویم، بعد اگر دیالوگ دیگری باز
  // نبود کلِ style را پاک می‌کنیم (نه فقط یک property خاص، چون بیش از یکی گیر می‌کنند).
  useEffect(() => {
    if (open) return
    const id = setTimeout(() => {
      const stillHasOpenDialog = document.querySelector('[data-state="open"].chakra-dialog__content') !== null
      if (!stillHasOpenDialog) document.body.removeAttribute('style')
    }, 100)
    return () => clearTimeout(id)
  }, [open])

  if (!displayProduct) return null

  const outOfStock = remainingStock <= 0

  function handleAdd() {
    if (outOfStock) return
    onAddVariant(groups.map((g) => selection[g.label]))
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => { if (!e.open) onClose() }} placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl">
          <Dialog.Content maxW="420px" w="full" mx="4">

            <Dialog.Header pb="4" pt="6" px="6" position="relative">
              <Dialog.Title fontSize="lg" fontWeight="semibold" color="fg">انتخاب تنوع</Dialog.Title>
              <Dialog.CloseTrigger asChild position="absolute" top="4" insetEnd="4">
                <CloseButton size="sm" onClick={onClose} />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body px="6" pt="2" pb="6" display="flex" flexDirection="column" gap="4">
              {/* ردیف محصول */}
              <Flex align="center" gap="4" w="full" p="2" borderWidth="1px" borderColor="border" rounded="sm">
                {/* تصویر — FIRST = راست‌ترین */}
                <Flex
                  align="center" justify="center" boxSize="12" flexShrink={0}
                  bg="bg.muted" borderWidth="1px" borderColor="border.muted" rounded="md" overflow="hidden"
                >
                  <Image src={displayProduct.image} alt={displayProduct.name} boxSize="full" objectFit="cover" />
                </Flex>
                {/* عنوان + SKU — SECOND */}
                <Flex direction="column" gap="2" flex="1" minW="0">
                  <Text fontSize="sm" fontWeight="semibold" color="fg" w="full" textAlign="right" lineClamp={1}>
                    {displayProduct.name}
                  </Text>
                  <Text fontSize="xs" color="fg.muted" w="full" textAlign="right">{displayProduct.sku}</Text>
                </Flex>
              </Flex>

              {/* گروه‌های تنوع */}
              {groups.map((group) => (
                <Flex key={group.label} direction="column" gap="4" w="full" align="flex-end">
                  <Text fontSize="sm" fontWeight="semibold" color="fg.muted" w="full" textAlign="right">
                    {group.label}
                  </Text>
                  <Flex gap="2" wrap="wrap" justify="flex-start" w="full">
                    {group.options.map((opt) => {
                      const active = selection[group.label] === opt
                      return (
                        <Button
                          key={opt}
                          size="sm"
                          h="8"
                          px="2.5"
                          rounded="sm"
                          fontWeight="medium"
                          fontSize="xs"
                          variant={active ? 'subtle' : 'outline'}
                          colorPalette={active ? 'brand' : 'gray'}
                          borderColor={active ? 'transparent' : 'border.muted'}
                          onClick={() => setSelection((prev) => ({ ...prev, [group.label]: opt }))}
                        >
                          {opt}
                        </Button>
                      )
                    })}
                  </Flex>
                </Flex>
              ))}
            </Dialog.Body>

            <Dialog.Footer px="6" pt="2" pb="4" gap="3">
              <Button variant="outline" colorPalette="gray" onClick={onClose}>بستن</Button>
              <Button colorPalette="brand" disabled={outOfStock} onClick={handleAdd}>افزودن تنوع</Button>
            </Dialog.Footer>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
