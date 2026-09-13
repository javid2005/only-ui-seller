import { useState } from 'react'
import {
  Box, Flex, Text, Table, Switch, Checkbox, Button, IconButton,
  Select, Portal, createListCollection, chakra, EmptyState,
} from '@chakra-ui/react'
import { ImagePlus, Package, EllipsisVertical } from 'lucide-react'
import { NumberField } from '@/components/ui/NumberField'
import { Tooltip } from '@/components/ui/Tooltip'
import { toPersianDigits } from '@/utils/numbers'
import { MediaThumb } from './MediaThumb'
import { rowTint, groupColorOf, type ProductVariant, type VariantCombination } from './data'
import { pressable } from './motion'
import { focusInputWithin } from './focusField'

// ─── نماها ───────────────────────────────────────────────────────────────────────


export type ModelFilter = 'all' | 'active' | 'inactive'

const FILTERS: { id: ModelFilter; label: string }[] = [
  { id: 'all', label: 'همه' },
  { id: 'active', label: 'فعال' },
  { id: 'inactive', label: 'غیرفعال' },
]

/** سگمنت فیلتر وضعیت — در سرتیتر بخش «مدل‌های قابل فروش» می‌نشیند */
export function ModelFilterSegment({
  value, onChange,
}: { value: ModelFilter; onChange: (f: ModelFilter) => void }) {
  return (
    <Flex gap="1" bg="bg.subtle" rounded="l2" p="1" flexShrink={0}>
      {FILTERS.map((f) => (
        <chakra.button
          key={f.id}
          type="button"
          aria-pressed={value === f.id}
          onClick={() => onChange(f.id)}
          px="3"
          h="7"
          rounded="l1"
          fontSize="xs"
          fontWeight={value === f.id ? 'semibold' : 'normal'}
          bg={value === f.id ? 'bg.panel' : 'transparent'}
          color={value === f.id ? 'brand.fg' : 'fg.muted'}
          boxShadow={value === f.id ? 'xs' : 'none'}
          {...pressable}
        >
          {f.label}
        </chakra.button>
      ))}
    </Flex>
  )
}

// ─── عملیات گروهی ────────────────────────────────────────────────────────────────
// همان فهرست نسخهٔ تأییدشده، با همان گروه‌بندی.
type BulkOp =
  | 'priceSet' | 'priceIncrease' | 'priceDecrease'
  | 'saleSet' | 'saleIncrease' | 'saleDecrease'
  | 'stockSet' | 'stockIncrease' | 'stockDecrease'
  | 'activate' | 'deactivate'

const BULK_OPS: { value: BulkOp; label: string; group: string }[] = [
  { value: 'priceSet',      label: 'جایگزینی قیمت اصلی',            group: 'قیمت اصلی' },
  { value: 'priceIncrease', label: 'افزایش قیمت اصلی',              group: 'قیمت اصلی' },
  { value: 'priceDecrease', label: 'کاهش قیمت اصلی',                group: 'قیمت اصلی' },
  { value: 'saleSet',       label: 'جایگزینی قیمت تخفیف',           group: 'قیمت تخفیف' },
  { value: 'saleIncrease',  label: 'افزایش قیمت تخفیف',             group: 'قیمت تخفیف' },
  { value: 'saleDecrease',  label: 'کاهش قیمت تخفیف',               group: 'قیمت تخفیف' },
  { value: 'stockSet',      label: 'جایگزینی موجودی',               group: 'موجودی' },
  { value: 'stockIncrease', label: 'افزایش موجودی',                 group: 'موجودی' },
  { value: 'stockDecrease', label: 'کاهش موجودی',                   group: 'موجودی' },
  { value: 'activate',      label: 'فعال‌کردن مدل‌های انتخاب‌شده',   group: 'وضعیت مدل' },
  { value: 'deactivate',    label: 'غیرفعال‌کردن مدل‌های انتخاب‌شده', group: 'وضعیت مدل' },
]

const bulkCollection = createListCollection({ items: BULK_OPS })

/** یک عملیات گروهی را روی یک مدل اعمال می‌کند و مدل تازه را برمی‌گرداند */
function applyBulk(combo: VariantCombination, op: BulkOp, raw: string): VariantCombination {
  const v = Number(raw) || 0
  const bump = (cur: string, dir: 1 | -1) => String(Math.max(0, (Number(cur) || 0) + dir * v))
  switch (op) {
    case 'priceSet':      return { ...combo, price: String(v) }
    case 'priceIncrease': return { ...combo, price: bump(combo.price, 1) }
    case 'priceDecrease': return { ...combo, price: bump(combo.price, -1) }
    case 'saleSet':       return { ...combo, salePrice: String(v) }
    case 'saleIncrease':  return { ...combo, salePrice: bump(combo.salePrice, 1) }
    case 'saleDecrease':  return { ...combo, salePrice: bump(combo.salePrice, -1) }
    case 'stockSet':      return { ...combo, inventory: String(v) }
    case 'stockIncrease': return { ...combo, inventory: bump(combo.inventory, 1) }
    case 'stockDecrease': return { ...combo, inventory: bump(combo.inventory, -1) }
    case 'activate':      return { ...combo, active: true }
    case 'deactivate':    return { ...combo, active: false }
  }
}

/** واحد انتهای فیلد داخل سلول */
function Unit({ children }: { children: string }) {
  return (
    <Text fontSize="2xs" color="fg.muted" bg="bg.subtle" rounded="sm" px="1" flexShrink={0}>
      {children}
    </Text>
  )
}

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface ModelsTableProps {
  options: ProductVariant[]
  combos: VariantCombination[]
  onChange: (next: VariantCombination[]) => void
  onPickImage: (comboId: string) => void
  /** باز کردن تنظیمات یک مدل (⋮ انتهای ردیف) */
  onOpenSettings: (comboId: string) => void
  /** فیلتر وضعیت — در طرح داخل سرتیتر بخش است، نه بالای جدول */
  filter: ModelFilter
  onFilterChange: (f: ModelFilter) => void
}

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * ModelsTable — «مدل‌های قابل فروش».
 *
 * جدول در لحظه از انتخاب‌های مشتری ساخته می‌شود؛ دکمهٔ «ایجاد ترکیب» وجود ندارد.
 *
 * ته‌رنگ هر ردیف از رنگِ مقدارِ **تنوع اول** می‌آید و داخل هر گروه بین دو شفافیت
 * متناوب می‌شود. نتیجه این است که ردیف‌های یک رنگ یک نوار پیوسته می‌سازند و
 * گروه‌بندی بدون هیچ خط‌کشی اضافه خوانده می‌شود — همان رفتار نسخهٔ تأییدشده.
 */
export function ModelsTable({
  options, combos, onChange, onPickImage, onOpenSettings, filter,
}: ModelsTableProps) {
  const [selected, setSelected] = useState<string[]>([])
  const [bulkOp, setBulkOp] = useState<BulkOp>('priceSet')
  const [bulkValue, setBulkValue] = useState('')
  const visible = combos.filter((c) =>
    filter === 'all' ? true : filter === 'active' ? c.active : !c.active)

  const patch = (id: string, p: Partial<VariantCombination>) =>
    onChange(combos.map((c) => (c.id === id ? { ...c, ...p } : c)))

  const allActive = combos.length > 0 && combos.every((c) => c.active)
  const allSelected = visible.length > 0 && visible.every((c) => selected.includes(c.id))

  const runBulk = () => {
    if (selected.length === 0) return
    onChange(combos.map((c) => (selected.includes(c.id) ? applyBulk(c, bulkOp, bulkValue) : c)))
    setBulkValue('')
  }

  /** ته‌رنگ ردیف: گروه از مقدار تنوع اول، تناوب از جایگاه داخل گروه */
  /**
   * گروه‌بندی بصری ردیف‌ها.
   *
   * گروه = مقدارِ تنوع اول. رنگش از تنوعِ رنگی می‌آید — **هر جای فهرست که باشد** —
   * و اگر تنوعی رنگی نبود، یک رنگ خنثی به هر گروه می‌رسد. علاوه بر ته‌رنگ، یک
   * نوارِ باریک در لبهٔ راستِ ردیف می‌آید: ته‌رنگ در رنگ‌های روشن (سفید، کرم) کم‌رنگ
   * است و به‌تنهایی گروه را نشان نمی‌دهد، ولی نوارِ توپر همیشه دیده می‌شود.
   */
  const optionTitles = options.map((o) => o.title)
  const groupLabels = [...new Set(combos.map((c) => c.values[0]))]

  const groupColorFor = (combo: VariantCombination) =>
    groupColorOf(combo.values, optionTitles, groupLabels.indexOf(combo.values[0]))

  const tintOf = (combo: VariantCombination) => {
    if (combos.length === 0) return undefined
    const group = combos.filter((c) => c.values[0] === combo.values[0])
    return rowTint(groupColorFor(combo), group.indexOf(combo))
  }

  const toggleSelect = (id: string, checked: boolean) =>
    setSelected((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)))

  if (combos.length === 0) {
    return (
      <EmptyState.Root size="sm">
        <EmptyState.Content>
          <EmptyState.Indicator><Package /></EmptyState.Indicator>
          <EmptyState.Title>هنوز مدلی ساخته نشده است</EmptyState.Title>
          <EmptyState.Description>
            برای هر انتخاب مشتری حداقل یک مقدار اضافه کنید؛ مدل‌ها همان لحظه ساخته می‌شوند.
          </EmptyState.Description>
        </EmptyState.Content>
      </EmptyState.Root>
    )
  }

  return (
    <Flex direction="column" gap="3" w="full" minW="0">

      {/* نوار عملیات گروهی */}
      <Flex
        align="center"
        gap="2.5"
        wrap="wrap"
        px="2"
        py="1.5"
        rounded="10px"
        borderWidth="1px"
        borderColor="border.muted"
        bg="bg.subtle"
      >
        {/* FIRST = rightmost: انتخاب همه */}
        <Checkbox.Root
          size="sm"
          checked={allSelected}
          onCheckedChange={(e) =>
            setSelected(e.checked === true ? visible.map((c) => c.id) : [])}
          flexShrink={0}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label fontSize="xs">انتخاب همه</Checkbox.Label>
        </Checkbox.Root>

        <Text fontSize="xs" color="fg.muted" flexShrink={0}>
          {selected.length === 0
            ? 'مدلی انتخاب نشده'
            : `${toPersianDigits(selected.length)} مدل انتخاب شده`}
        </Text>

        <Box flex="1" minW="2" />

        <Select.Root
          collection={bulkCollection}
          value={[bulkOp]}
          onValueChange={(e) => setBulkOp((e.value[0] as BulkOp) ?? 'priceSet')}
          size="sm"
          w="220px"
          flexShrink={0}
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger bg="bg.panel">
              <Select.ValueText placeholder="عملیات" />
            </Select.Trigger>
            <Select.IndicatorGroup><Select.Indicator /></Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content dir="rtl">
                {[...new Set(BULK_OPS.map((o) => o.group))].map((group) => (
                  <Select.ItemGroup key={group}>
                    <Select.ItemGroupLabel>{group}</Select.ItemGroupLabel>
                    {BULK_OPS.filter((o) => o.group === group).map((o) => (
                      <Select.Item key={o.value} item={o}>
                        <Select.ItemText>{o.label}</Select.ItemText>
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.ItemGroup>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>

        <Box w="110px" flexShrink={0}>
          <NumberField
            value={bulkValue}
            onChange={setBulkValue}
            placeholder="مقدار"
            inputProps={{ bg: 'bg.panel', size: 'sm' }}
            disabled={bulkOp === 'activate' || bulkOp === 'deactivate'}
          />
        </Box>

        {/* LAST = leftmost: اجرا */}
        <Button
          size="sm"
          colorPalette="brand"
          variant="subtle"
          onClick={runBulk}
          disabled={selected.length === 0}
          flexShrink={0}
        >
          اعمال روی انتخاب‌ها
        </Button>
      </Flex>

      {/* ── نمای جدول (سریع / فشرده) ─────────────────────────────────────────── */}
      {(
        /* اندازه‌ها از طرح تأییدشده: قاب ۱۰px، سقف ارتفاع ۵۶۰px با اسکرول عمودی،
           سرستون ۳۹px، سلول‌ها padding ۵px — جدول طرح متراکم است نه گشاد. */
        <Box
          data-field="modelsTable"
          overflowX="auto"
          overflowY="auto"
          maxH="560px"
          w="full"
          borderWidth="1px"
          borderColor="border"
          rounded="10px"
          css={{
            '& th': { height: '39px', paddingInline: '5px' },
            '& td': { paddingBlock: '5px', paddingInline: '5px' },
          }}
        >
          <Table.Root size="sm" variant="line" minW="720px">
            <Table.Header>
              {/* FIRST = rightmost: چک‌باکس ← وضعیت ← تصویر ← مدل ← قیمت ← تخفیف ← موجودی */}
              <Table.Row bg="bg.subtle">
                <Table.ColumnHeader w="36px">
                  <Checkbox.Root
                    size="sm"
                    checked={allSelected}
                    onCheckedChange={(e) =>
                      setSelected(e.checked === true ? visible.map((c) => c.id) : [])}
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                  </Checkbox.Root>
                </Table.ColumnHeader>
                <Table.ColumnHeader w="64px">
                  <Tooltip content="فعال یا غیرفعال کردن همه">
                    <Switch.Root
                      size="sm"
                      colorPalette="brand"
                      checked={allActive}
                      onCheckedChange={(e) =>
                        onChange(combos.map((c) => ({ ...c, active: e.checked })))}
                    >
                      <Switch.HiddenInput />
                      <Switch.Control><Switch.Thumb /></Switch.Control>
                    </Switch.Root>
                  </Tooltip>
                </Table.ColumnHeader>
                <Table.ColumnHeader w="52px">تصویر</Table.ColumnHeader>
                <Table.ColumnHeader>مدل</Table.ColumnHeader>
                <Table.ColumnHeader w="112px">
                  قیمت اصلی<chakra.span color="red.fg" ms="1" aria-hidden>*</chakra.span>
                </Table.ColumnHeader>
                <Table.ColumnHeader w="112px">تخفیف</Table.ColumnHeader>
                <Table.ColumnHeader w="82px">
                  موجودی<chakra.span color="red.fg" ms="1" aria-hidden>*</chakra.span>
                </Table.ColumnHeader>
                <Table.ColumnHeader w="40px" />
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {visible.map((c) => (
                <Table.Row
                  key={c.id}
                  bg={tintOf(c)}
                  opacity={c.active ? 1 : 0.55}
                  css={{
                    // نوارِ گروه در لبهٔ راست (شروع) ردیف — همیشه دیده می‌شود
                    '& > td:first-of-type': {
                      boxShadow: `inset -3px 0 0 0 ${groupColorFor(c)}`,
                    },
                  }}
                >
                  <Table.Cell>
                    <Checkbox.Root
                      size="sm"
                      checked={selected.includes(c.id)}
                      onCheckedChange={(e) => toggleSelect(c.id, e.checked === true)}
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                    </Checkbox.Root>
                  </Table.Cell>
                  <Table.Cell>
                    <Switch.Root
                      size="sm"
                      colorPalette="brand"
                      checked={c.active}
                      onCheckedChange={(e) => patch(c.id, { active: e.checked })}
                    >
                      <Switch.HiddenInput />
                      <Switch.Control><Switch.Thumb /></Switch.Control>
                    </Switch.Root>
                  </Table.Cell>
                  {(
                    <Table.Cell>
                      <chakra.button
                        type="button"
                        aria-label={`تصویر ${c.values.join(' / ')}`}
                        onClick={() => onPickImage(c.id)}
                        boxSize="9"
                        rounded="lg"
                        overflow="hidden"
                        borderWidth="1px"
                        borderColor="border"
                        bg={c.image ? undefined : 'bg.subtle'}
                        display="grid"
                        placeItems="center"
                        color="fg.muted"
                      >
                        {c.image ? <MediaThumb src={c.image} boxSize="full" /> : <ImagePlus size={15} />}
                      </chakra.button>
                    </Table.Cell>
                  )}
                  <Table.Cell>
                    <Text fontSize="10.5px" fontWeight="medium" color="fg" textAlign="start" whiteSpace="nowrap">
                      {c.values.join(' / ')}
                    </Text>
                    <Text fontSize="8.5px" color="fg.muted" textAlign="start" dir="ltr">{c.sku}</Text>
                  </Table.Cell>
                  <Table.Cell onClick={focusInputWithin} cursor="text">
                    <NumberField
                      value={c.price}
                      // ویرایش دستی، ارث‌بریِ همین مقدار را قطع می‌کند
                      onChange={(v) => patch(c.id, { price: v, inherits: { ...c.inherits, price: v.trim() === '' } })}
                      disabled={!c.active}
                      endElement={<Unit>تومان</Unit>}
                      inputProps={{ size: 'sm', bg: 'bg.panel', h: '31px', px: '1.5', fontSize: '11px' }}
                    />
                  </Table.Cell>
                  {(
                    <Table.Cell onClick={focusInputWithin} cursor="text">
                      <NumberField
                        value={c.salePrice}
                        onChange={(v) => patch(c.id, { salePrice: v })}
                        disabled={!c.active}
                        endElement={<Unit>تومان</Unit>}
                        inputProps={{ size: 'sm', bg: 'bg.panel', h: '31px', px: '1.5', fontSize: '11px' }}
                      />
                    </Table.Cell>
                  )}
                  <Table.Cell onClick={focusInputWithin} cursor="text">
                    <NumberField
                      value={c.inventory}
                      onChange={(v) => patch(c.id, { inventory: v, inherits: { ...c.inherits, inventory: v.trim() === '' } })}
                      disabled={!c.active}
                      endElement={<Unit>عدد</Unit>}
                      inputProps={{ size: 'sm', bg: 'bg.panel', h: '31px', px: '1.5', fontSize: '11px' }}
                    />
                  </Table.Cell>
                  {/* LAST = leftmost: تنظیمات این مدل — جدول را شلوغ نمی‌کند */}
                  <Table.Cell>
                    <Tooltip content="تنظیمات این مدل">
                      <IconButton
                        size="2xs"
                        variant="ghost"
                        color="fg.muted"
                        rounded="md"
                        aria-label={`تنظیمات ${c.values.join(' / ')}`}
                        onClick={() => onOpenSettings(c.id)}
                      >
                        <EllipsisVertical size={14} />
                      </IconButton>
                    </Tooltip>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}

    </Flex>
  )
}
