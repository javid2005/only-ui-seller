import { useEffect, useState } from 'react'
import {
  Box, Flex, Text, Table, Switch, Checkbox, Button,
  Select, Portal, createListCollection, chakra, EmptyState,
} from '@chakra-ui/react'
import { ImagePlus, Package } from 'lucide-react'
import { NumberField } from '@/components/ui/NumberField'
import { Tooltip } from '@/components/ui/Tooltip'
import { toPersianDigits } from '@/utils/numbers'
import { MediaThumb } from './MediaThumb'
import { rowTint, type ProductVariant, type VariantCombination } from './data'

// ─── نماها ───────────────────────────────────────────────────────────────────────
export type ModelView = 'quick' | 'matrix' | 'cards' | 'compact'


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
  options, combos, onChange, onPickImage, filter,
}: ModelsTableProps) {
  /**
   * نما **دکمه ندارد** — در طرح تأییدشده نوار `model-view-tabs` با
   * `display:none!important` حذف شده و به‌جایش زیر ۷۶۰px جدول جای خود را به
   * کارت می‌دهد (`.table-scroll{display:none}` + `.quick-mobile{display:flex}`).
   * پس نما از عرضِ واقعیِ پنجره می‌آید، نه از یک سوییچرِ اضافه.
   */
  const [view, setView] = useState<ModelView>('quick')
  useEffect(() => {
    const apply = () => setView(window.innerWidth < 760 ? 'cards' : 'quick')
    apply()
    window.addEventListener('resize', apply)
    return () => window.removeEventListener('resize', apply)
  }, [])
  const [selected, setSelected] = useState<string[]>([])
  const [bulkOp, setBulkOp] = useState<BulkOp>('priceSet')
  const [bulkValue, setBulkValue] = useState('')

  const firstOption = options[0]
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
  const tintOf = (combo: VariantCombination) => {
    if (!firstOption) return undefined
    const groupLabel = combo.values[0]
    const value = firstOption.values.find((v) => v.label === groupLabel)
    const group = combos.filter((c) => c.values[0] === groupLabel)
    return rowTint(value?.color, group.indexOf(combo))
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
      {(view === 'quick' || view === 'compact') && (
        /* اندازه‌ها از طرح تأییدشده: قاب ۱۰px، سقف ارتفاع ۵۶۰px با اسکرول عمودی،
           سرستون ۳۹px، سلول‌ها padding ۵px — جدول طرح متراکم است نه گشاد. */
        <Box
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
                {view === 'quick' && <Table.ColumnHeader w="52px">تصویر</Table.ColumnHeader>}
                <Table.ColumnHeader>مدل</Table.ColumnHeader>
                <Table.ColumnHeader w="112px">
                  قیمت اصلی<chakra.span color="red.fg" ms="1" aria-hidden>*</chakra.span>
                </Table.ColumnHeader>
                {view === 'quick' && <Table.ColumnHeader w="112px">تخفیف</Table.ColumnHeader>}
                <Table.ColumnHeader w="82px">
                  موجودی<chakra.span color="red.fg" ms="1" aria-hidden>*</chakra.span>
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {visible.map((c) => (
                <Table.Row key={c.id} bg={tintOf(c)} opacity={c.active ? 1 : 0.55}>
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
                  {view === 'quick' && (
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
                  <Table.Cell>
                    <NumberField
                      value={c.price}
                      onChange={(v) => patch(c.id, { price: v })}
                      disabled={!c.active}
                      endElement={<Unit>تومان</Unit>}
                      inputProps={{ size: 'sm', bg: 'bg.panel', h: '31px', px: '1.5', fontSize: '11px' }}
                    />
                  </Table.Cell>
                  {view === 'quick' && (
                    <Table.Cell>
                      <NumberField
                        value={c.salePrice}
                        onChange={(v) => patch(c.id, { salePrice: v })}
                        disabled={!c.active}
                        endElement={<Unit>تومان</Unit>}
                        inputProps={{ size: 'sm', bg: 'bg.panel', h: '31px', px: '1.5', fontSize: '11px' }}
                      />
                    </Table.Cell>
                  )}
                  <Table.Cell>
                    <NumberField
                      value={c.inventory}
                      onChange={(v) => patch(c.id, { inventory: v })}
                      disabled={!c.active}
                      endElement={<Unit>عدد</Unit>}
                      inputProps={{ size: 'sm', bg: 'bg.panel', h: '31px', px: '1.5', fontSize: '11px' }}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}

      {/* ── نمای ماتریس: تنوع اول در ردیف، تنوع دوم در ستون ───────────────────── */}
      {view === 'matrix' && (
        <MatrixView options={options} combos={visible} onPatch={patch} />
      )}

      {/* ── نمای کارتی ────────────────────────────────────────────────────────── */}
      {view === 'cards' && (
        <Flex direction="column" gap="3" w="full">
          {visible.map((c) => (
            <Flex
              key={c.id}
              direction="column"
              gap="3"
              p="3"
              rounded="lg"
              borderWidth="1px"
              borderColor={c.active ? 'brand.focusRing' : 'border.muted'}
              bg={tintOf(c)}
            >
              <Flex align="center" gap="2.5" wrap="wrap">
                <chakra.button
                  type="button"
                  aria-label={`تصویر ${c.values.join(' / ')}`}
                  onClick={() => onPickImage(c.id)}
                  boxSize="10"
                  rounded="xl"
                  overflow="hidden"
                  borderWidth="1px"
                  borderColor="border"
                  bg={c.image ? undefined : 'bg.subtle'}
                  display="grid"
                  placeItems="center"
                  color="fg.muted"
                  flexShrink={0}
                >
                  {c.image ? <MediaThumb src={c.image} boxSize="full" /> : <ImagePlus size={16} />}
                </chakra.button>
                <Box flex="1" minW="0">
                  <Text fontSize="sm" fontWeight="medium" color="fg" textAlign="start">
                    {c.values.join(' / ')}
                  </Text>
                  <Text fontSize="2xs" color="fg.muted" textAlign="start" dir="ltr">{c.sku}</Text>
                </Box>
                <Switch.Root
                  size="sm"
                  colorPalette="brand"
                  checked={c.active}
                  onCheckedChange={(e) => patch(c.id, { active: e.checked })}
                  flexShrink={0}
                >
                  <Switch.HiddenInput />
                  <Switch.Control><Switch.Thumb /></Switch.Control>
                </Switch.Root>
              </Flex>
              <Flex gap="2" wrap="wrap">
                <Box flex="1" minW="120px">
                  <NumberField
                    value={c.price} onChange={(v) => patch(c.id, { price: v })}
                    disabled={!c.active} endElement={<Unit>تومان</Unit>}
                    inputProps={{ size: 'sm', bg: 'bg.panel', h: '31px', px: '1.5', fontSize: '11px' }}
                  />
                </Box>
                <Box flex="1" minW="120px">
                  <NumberField
                    value={c.salePrice} onChange={(v) => patch(c.id, { salePrice: v })}
                    disabled={!c.active} endElement={<Unit>تومان</Unit>}
                    inputProps={{ size: 'sm', bg: 'bg.panel', h: '31px', px: '1.5', fontSize: '11px' }}
                  />
                </Box>
                <Box flex="1" minW="110px">
                  <NumberField
                    value={c.inventory} onChange={(v) => patch(c.id, { inventory: v })}
                    disabled={!c.active} endElement={<Unit>عدد</Unit>}
                    inputProps={{ size: 'sm', bg: 'bg.panel', h: '31px', px: '1.5', fontSize: '11px' }}
                  />
                </Box>
              </Flex>
            </Flex>
          ))}
        </Flex>
      )}

    </Flex>
  )
}

// ─── نمای ماتریس ─────────────────────────────────────────────────────────────────
/**
 * وقتی دو تنوع داریم، ماتریس سریع‌ترین راه پرکردن موجودی است: یک نگاه نشان می‌دهد
 * کدام ترکیب خالی مانده. با یک تنوع، یک ستون ساده می‌شود.
 */
function MatrixView({
  options, combos, onPatch,
}: {
  options: ProductVariant[]
  combos: VariantCombination[]
  onPatch: (id: string, p: Partial<VariantCombination>) => void
}) {
  const rows = options[0]?.values ?? []
  const cols = options[1]?.values ?? []
  const find = (rowLabel: string, colLabel?: string) =>
    combos.find((c) => c.values[0] === rowLabel && (colLabel === undefined || c.values[1] === colLabel))

  return (
    <Box overflowX="auto" w="full" borderWidth="1px" borderColor="border" rounded="lg">
      <Table.Root size="sm" variant="line" minW="560px">
        <Table.Header>
          <Table.Row bg="bg.subtle">
            {/* FIRST = rightmost: ستون عنوان ردیف‌ها */}
            <Table.ColumnHeader>{options[0]?.title || 'تنوع'}</Table.ColumnHeader>
            {cols.length > 0
              ? cols.map((c) => <Table.ColumnHeader key={c.id}>{c.label}</Table.ColumnHeader>)
              : <Table.ColumnHeader>موجودی</Table.ColumnHeader>}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((r) => (
            <Table.Row key={r.id} bg={rowTint(r.color, 0)}>
              <Table.Cell>
                <Flex align="center" gap="2">
                  {/* FIRST = rightmost: سواچ رنگ */}
                  {r.color && <Box boxSize="3" rounded="sm" bg={r.color} flexShrink={0} />}
                  <Text fontSize="xs" fontWeight="medium" whiteSpace="nowrap">{r.label}</Text>
                </Flex>
              </Table.Cell>
              {(cols.length > 0 ? cols : [undefined]).map((c, i) => {
                const combo = find(r.label, c?.label)
                return (
                  <Table.Cell key={c?.id ?? i}>
                    {combo ? (
                      <NumberField
                        value={combo.inventory}
                        onChange={(v) => onPatch(combo.id, { inventory: v })}
                        disabled={!combo.active}
                        placeholder="موجودی"
                        inputProps={{ size: 'sm', bg: 'bg.panel', h: '31px', px: '1.5', fontSize: '11px' }}
                      />
                    ) : (
                      <Text fontSize="2xs" color="fg.muted">—</Text>
                    )}
                  </Table.Cell>
                )
              })}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  )
}
