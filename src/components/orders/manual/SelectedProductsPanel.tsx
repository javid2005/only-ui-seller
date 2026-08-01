import { Badge, Flex, IconButton, Image, Text } from '@chakra-ui/react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { TitleBar } from '@/components/ui/TitleBar'
import { toPersianDigits } from '@/utils/numbers'
import type { ManualProduct, SelectedProductLine } from './manualOrderData'

/**
 * QtyStepper — کنترل تعداد در ردیفِ محصولِ انتخاب‌شده (Figma «Number»: سه بخشِ چسبیده).
 * عددِ وسط در طرح یک <button> غیرقابل‌تایپ است نه <input> — یعنی این یک stepper نمایشی
 * است نه فیلد ورودی عددی؛ به همین خاطر NumberField اینجا صدق نمی‌کند (آن قانون برای
 * ورودیِ قابل‌تایپ است). سه دکمهٔ مجزا با hit-area واقعی به‌جای addon داخل InputGroup —
 * addon های کوچک (۲۴px) کلیک واقعی موس را گاهی از دست می‌دادند.
 *
 * ترتیب DOM (اولین = راست‌ترین) طبق radius گوشه‌های Figma («Button» افزایش:
 * rounded-tr/br = گوشهٔ راست، «Button» کاهش/حذف: rounded-tl/bl = گوشهٔ چپ) —
 * این شواهدِ فیزیکی/geometry مستقل از فلیپ RTL هستند:
 *   افزایش (راست) → عدد (وسط) → کاهش/حذف (چپ)
 */
function QtyStepper({ quantity, max, onChange, onRemove }: {
  quantity: number
  max: number
  onChange: (q: number) => void
  onRemove: () => void
}) {
  const isRemoveState = quantity <= 1
  return (
    <Flex align="center" borderWidth="1px" borderColor="border" rounded="md" overflow="hidden" h="8">
      <IconButton
        aria-label="افزایش"
        variant="ghost"
        colorPalette="gray"
        size="sm"
        h="full"
        minW="8"
        rounded="none"
        disabled={quantity >= max}
        onClick={() => onChange(quantity + 1)}
      >
        <Plus size={16} />
      </IconButton>

      <Flex
        align="center"
        justify="center"
        minW="8"
        h="full"
        px="2"
        borderInlineWidth="1px"
        borderColor="border"
      >
        <Text fontSize="xs" fontWeight="medium" color="fg">{toPersianDigits(quantity)}</Text>
      </Flex>

      <IconButton
        aria-label={isRemoveState ? 'حذف' : 'کاهش'}
        variant="ghost"
        colorPalette="gray"
        size="sm"
        h="full"
        minW="8"
        rounded="none"
        onClick={() => (isRemoveState ? onRemove() : onChange(quantity - 1))}
      >
        {isRemoveState ? <Trash2 size={16} /> : <Minus size={16} />}
      </IconButton>
    </Flex>
  )
}

/**
 * SelectedProductRow — یک ردیف در پنل «اقلام انتخاب شده» (Figma «Manual-SelectedPrd-Card»).
 *
 * RTL DOM order (اولین child = راست‌ترین — بر اساس screenshot طرح):
 *   تصویر (راست) → عنوان/تنوع/قیمت (وسط) → QtyStepper (چپ)
 */
function SelectedProductRow({ product, line, max, onQtyChange, onRemove }: {
  product: ManualProduct
  line: SelectedProductLine
  /** موجودیِ باقی‌مانده برای این ردیف (سهم این ترکیب تنوع + مقدارِ فعلی‌اش) */
  max: number
  onQtyChange: (q: number) => void
  onRemove: () => void
}) {
  return (
    <Flex
      direction={{ base: 'column', sm: 'row' }}
      align={{ base: 'stretch', sm: 'center' }}
      gap={{ base: '3', sm: '4' }}
      w="full"
      p="4"
      bg="bg.subtle"
      borderWidth="1px"
      borderColor="border.muted"
      rounded="lg"
    >
      {/* ردیف تصویر+محتوا — روی موبایل (base) ردیف اول */}
      <Flex align="center" gap="4" flex="1" minW="0">
        {/* تصویر — FIRST = راست‌ترین */}
        <Flex
          align="center"
          justify="center"
          boxSize="12"
          flexShrink={0}
          bg="bg.muted"
          borderWidth="1px"
          borderColor="border.muted"
          rounded="md"
          overflow="hidden"
        >
          <Image src={product.image} alt={product.name} boxSize="full" objectFit="cover" />
        </Flex>

        {/* عنوان + تنوع + قیمت — SECOND */}
        <Flex direction="column" gap="1" flex="1" minW="0">
          <Text fontSize="sm" fontWeight="semibold" color="fg" w="full" textAlign="right" lineClamp={1}>
            {product.name}
          </Text>
          {line.variantLabels && line.variantLabels.length > 0 && (
            <Flex justify="flex-start" gap="1.5" wrap="wrap" w="full">
              {line.variantLabels.map((label) => (
                <Badge key={label} size="xs" colorPalette="green" variant="subtle">{label}</Badge>
              ))}
            </Flex>
          )}
          <Flex align="center" justify="flex-start" gap="2" w="full">
            {/* برخلاف لیست محصولات، اینجا بج $ نمایش داده نمی‌شود — فقط قیمت (طبق درخواست کاربر) */}
            <Text fontSize="xs" fontWeight="medium" color="fg.muted" whiteSpace="nowrap">
              {product.priceToman ? `${product.priceToman} ت` : `$ ${product.priceUsd}`}
            </Text>
          </Flex>
        </Flex>
      </Flex>

      {/* QtyStepper — LAST = چپ‌ترین. روی موبایل (base) ردیفِ جدا، جمع‌شده به چپ (justify="flex-end" در RTL = چپ) */}
      <Flex flexShrink={0} justify={{ base: 'flex-end', sm: 'flex-start' }} w={{ base: 'full', sm: 'auto' }}>
        <QtyStepper
          quantity={line.quantity}
          max={max}
          onChange={onQtyChange}
          onRemove={onRemove}
        />
      </Flex>
    </Flex>
  )
}

interface SelectedProductsPanelProps {
  lines: SelectedProductLine[]
  products: ManualProduct[]
  onQtyChange: (lineId: string, quantity: number) => void
  onRemove: (lineId: string) => void
}

export function SelectedProductsPanel({ lines, products, onQtyChange, onRemove }: SelectedProductsPanelProps) {
  // «۲ محصول» = تعداد محصولِ متمایز، نه تعداد ردیف — چند ترکیب تنوع از یک محصول باز هم ۱ محصول است
  const distinctProductCount = new Set(lines.map((l) => l.productId)).size

  return (
    <Flex
      direction="column"
      gap="6"
      w="full"
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border"
      rounded="2xl"
      p="6"
    >
      <TitleBar
        title="اقلام انتخاب شده"
        divider
        cta={
          <Badge colorPalette="purple" variant="subtle" size="md">
            {`${toPersianDigits(distinctProductCount)} محصول`}
          </Badge>
        }
      />

      <Flex direction="column" gap="2" w="full">
        {lines.map((line) => {
          const product = products.find((p) => p.id === line.productId)
          if (!product) return null
          // موجودیِ باقی‌مانده مشترک بین همهٔ ردیف‌های همین محصول (صرف‌نظر از تنوع) + سهمِ خودِ این ردیف
          const usedByOtherLines = lines
            .filter((l) => l.productId === product.id && l.id !== line.id)
            .reduce((sum, l) => sum + l.quantity, 0)
          const max = product.inventory - usedByOtherLines
          return (
            <SelectedProductRow
              key={line.id}
              product={product}
              line={line}
              max={max}
              onQtyChange={(q) => onQtyChange(line.id, q)}
              onRemove={() => onRemove(line.id)}
            />
          )
        })}
      </Flex>
    </Flex>
  )
}
