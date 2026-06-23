import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCompactMode } from '@/contexts/CompactModeContext'
import {
  Box, Flex, Text, Input, Button, Badge, chakra,
  Switch, Field, SegmentGroup, Select, createListCollection,
  Collapsible, IconButton, Grid, NativeSelect,
} from '@chakra-ui/react'
import { BarSegment, useChart, type BarSegmentData } from '@chakra-ui/charts'
import { Plus, Trash2 } from 'lucide-react'
import { Header }       from '@/components/layout/Header'
import { TitleBar }     from '@/components/ui/TitleBar'
import { ButtonFooter } from '@/components/ui/ButtonFooter'
import { NumberField }  from '@/components/ui/NumberField'

// ─── Types ────────────────────────────────────────────────────────────────────

type CostType     = 'fixed' | 'weight'
type PaymentType  = 'prepaid' | 'cod'
type DeliveryUnit = 'روز' | 'ساعت'
type WeightUnit   = 'kg' | 'g'

interface WeightRange {
  id:         string
  fromWeight: string
  fromUnit:   WeightUnit
  toWeight:   string
  toUnit:     WeightUnit
  isFree:     boolean
  amount:     string
}

interface SectionData {
  enabled:      boolean
  costType:     CostType
  paymentType:  PaymentType
  deliveryDays: string
  deliveryUnit: DeliveryUnit
  isFree:       boolean
  amount:       string
  weightRanges: WeightRange[]
}

// ─── Static data ──────────────────────────────────────────────────────────────

const PROVINCES = [
  'تهران', 'اصفهان', 'فارس', 'خراسان رضوی', 'آذربایجان شرقی',
  'مازندران', 'گیلان', 'کرمان', 'خوزستان', 'البرز', 'سایر استان‌ها',
]

const CITIES = [
  'تهران', 'کرج', 'اصفهان', 'مشهد', 'شیراز', 'تبریز',
  'اهواز', 'قم', 'کرمانشاه', 'رشت', 'ساری', 'ارومیه',
  'همدان', 'زاهدان', 'کرمان', 'بندرعباس', 'اردبیل',
  'خرم‌آباد', 'گرگان', 'سمنان', 'سایر شهرها',
]

const provinceCollection = createListCollection({
  items: PROVINCES.map((p) => ({ value: p, label: p })),
})

const cityCollection = createListCollection({
  items: CITIES.map((c) => ({ value: c, label: c })),
})

const costTypeItems = [
  { value: 'fixed',  label: 'ثابت' },
  { value: 'weight', label: 'براساس وزن' },
]

const paymentTypeItems = [
  { value: 'prepaid', label: 'پیش کرایه' },
  { value: 'cod',     label: 'پس کرایه'  },
]

function newSection(): SectionData {
  return {
    enabled:      false,
    costType:     'fixed',
    paymentType:  'prepaid',
    deliveryDays: '',
    deliveryUnit: 'روز',
    isFree:       false,
    amount:       '',
    weightRanges: [],
  }
}

function newRange(fromWeight = '', fromUnit: WeightUnit = 'kg'): WeightRange {
  return {
    id:         crypto.randomUUID(),
    fromWeight,
    fromUnit,
    toWeight:   '',
    toUnit:     'kg',
    isFree:     false,
    amount:     '',
  }
}

// ─── UnitSelect — NativeSelect embedded in InputGroup endElement ──────────────
// dev-engine-disable
// NativeSelect is correct here: inline addon inside InputGroup, not a standalone field.

interface UnitSelectProps {
  value:    string
  onChange: (v: string) => void
  options:  { value: string; label: string }[]
}

function UnitSelect({ value, onChange, options }: UnitSelectProps) {
  return (
    <NativeSelect.Root size="xs" variant="plain" width="auto">
      <NativeSelect.Field
        value={value}
        onChange={(e) => onChange(e.target.value)}
        fontSize="sm"
        color="fg"
        dir="rtl"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  )
}
// dev-engine-enable

const DELIVERY_UNITS: { value: string; label: string }[] = [
  { value: 'روز',  label: 'روز'  },
  { value: 'ساعت', label: 'ساعت' },
]

const WEIGHT_UNITS: { value: string; label: string }[] = [
  { value: 'kg', label: 'kg'  },
  { value: 'g',  label: 'گرم' },
]

// ─── PriceCard ────────────────────────────────────────────────────────────────

interface PriceCardProps {
  isFree:         boolean
  amount:         string
  onFreeChange:   (v: boolean) => void
  onAmountChange: (v: string)  => void
}

function PriceCard({ isFree, amount, onFreeChange, onAmountChange }: PriceCardProps) {
  const isCompact = useCompactMode()
  return (
    <Box
      bg="bg.subtle"
      borderWidth="1px"
      borderColor="border"
      rounded="lg"
      p="4"
    >
      <Flex
        gap="4"
        direction={isCompact ? 'row' : { base: 'column', sm: 'row' }}
        align={isCompact ? 'end' : { base: 'stretch', sm: 'end' }}
      >
        {/* مبلغ — flex-1 in row, full-width in column */}
        <Field.Root flex={isCompact ? '1' : { base: 'none', sm: '1' }}>
          <Field.Label fontSize="sm" fontWeight="semibold" color="fg">مبلغ</Field.Label>
          <NumberField
            placeholder="هزینه"
            value={isFree ? '' : amount}
            disabled={isFree}
            onChange={onAmountChange}
            inputProps={{ bg: 'bg.panel' }}
            endElement={
              <Text fontSize="sm" color="fg.muted" px="2" flexShrink={0}>تومان</Text>
            }
          />
        </Field.Root>

        {/* ارسال رایگان — RTL: Switch FIRST=right, Text LAST=left */}
        <Flex
          align="center"
          gap="2.5"
          pb={isCompact ? '1' : { base: '0', sm: '1' }}
          flexShrink={0}
        >
          <Switch.Root
            colorPalette="brand"
            checked={isFree}
            onCheckedChange={(e) => onFreeChange(e.checked)}
          >
            <Switch.HiddenInput />
            <Switch.Control><Switch.Thumb /></Switch.Control>
          </Switch.Root>
          <Text fontSize="sm" color="fg" whiteSpace="nowrap">ارسال رایگان</Text>
        </Flex>
      </Flex>
    </Box>
  )
}

// ─── WeightRangeChart ─────────────────────────────────────────────────────────

const CHART_COLORS = ['teal.emphasized', 'blue.emphasized', 'purple.emphasized', 'orange.emphasized', 'pink.emphasized']

function toKgValue(val: string, unit: WeightUnit): number {
  const n = parseFloat(val) || 0
  return unit === 'g' ? n / 1000 : n
}

const toPersian = (s: string) => s.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d])

function WeightRangeChart({ ranges }: { ranges: WeightRange[] }) {
  let paidIdx = 0
  const segments: BarSegmentData[] = ranges.map((r) => {
    const from = toKgValue(r.fromWeight, r.fromUnit)
    const to   = toKgValue(r.toWeight,   r.toUnit)
    const width = Math.max(to - from, 0.1)
    return {
      name:  r.id,
      value: width,
      color: r.isFree ? 'green.emphasized' : CHART_COLORS[paidIdx++ % CHART_COLORS.length],
    }
  })

  const chart = useChart<BarSegmentData>({ data: segments })

  if (ranges.length === 0) return null

  return (
    <Box bg="bg.subtle" borderWidth="1px" borderColor="border" rounded="lg" p="4" mt="4">
      <Text fontSize="sm" fontWeight="semibold" color="fg" mb="3">نمودار توزیع بازه‌های وزنی</Text>
      <BarSegment.Root chart={chart} barSize="6">
        <BarSegment.Content>
          <BarSegment.Bar />
        </BarSegment.Content>
      </BarSegment.Root>

      {/* Legend: range label + price below */}
      <Flex gap="4" flexWrap="wrap" mt="3">
        {ranges.map((r, i) => {
          const rangeLabel = `${toPersian(r.fromWeight || '0')}-${toPersian(r.toWeight || '؟')} ${r.fromUnit}`
          const priceLabel = r.isFree
            ? 'رایگان'
            : r.amount ? `${Number(r.amount).toLocaleString('fa-IR')} تومان` : '—'
          return (
            <Flex key={r.id} direction="column" gap="0.5">
              <Flex align="center" gap="1.5">
                <Box w="2.5" h="2.5" rounded="sm" bg={segments[i]?.color} flexShrink={0} />
                <Text fontSize="xs" color="fg.muted">{rangeLabel}</Text>
              </Flex>
              <Text fontSize="xs" fontWeight="semibold" color="fg" ps="4">
                {priceLabel}
              </Text>
            </Flex>
          )
        })}
      </Flex>
    </Box>
  )
}

// ─── WeightTable ──────────────────────────────────────────────────────────────

interface WeightTableProps {
  ranges:   WeightRange[]
  onAdd:    ()                                    => void
  onDelete: (id: string)                          => void
  onUpdate: (id: string, p: Partial<WeightRange>) => void
}

function WeightTable({ ranges, onAdd, onDelete, onUpdate }: WeightTableProps) {
  const isCompact = useCompactMode()
  const colTemplate = '1fr 1fr 1fr minmax(140px,auto) 36px'

  return (
    <Flex direction="column" gap="2" w="full">

      {/* Column headers — desktop only */}
      {ranges.length > 0 && (
        <Grid
          display={isCompact ? 'none' : { base: 'none', md: 'grid' }}
          templateColumns={colTemplate}
          gap="3"
          px="1"
        >
          <Text fontSize="sm" fontWeight="semibold" color="fg">از وزن</Text>
          <Text fontSize="sm" fontWeight="semibold" color="fg">تا وزن</Text>
          <Text fontSize="sm" fontWeight="semibold" color="fg">مبلغ</Text>
          <Text fontSize="sm" fontWeight="semibold" color="fg">ارسال رایگان</Text>
          <Box />
        </Grid>
      )}

      <Flex direction="column" gap="2">
        {ranges.map((row) => (
          <Box
            key={row.id}
            bg="bg.subtle"
            borderWidth="1px"
            borderColor="border"
            rounded="lg"
          >

            {/* Desktop: 5-column flat grid */}
            <Grid
              display={isCompact ? 'none' : { base: 'none', md: 'grid' }}
              templateColumns={colTemplate}
              gap="3"
              alignItems="center"
              px="3"
              py="2.5"
            >

              {/* FIRST = rightmost = از وزن */}
              <NumberField
                size="sm"
                allowDecimals
                placeholder="۰"
                value={row.fromWeight}
                onChange={(v) => onUpdate(row.id, { fromWeight: v })}
                inputProps={{ bg: 'bg.panel', pe: '0' }}
                endElement={
                  <UnitSelect
                    value={row.fromUnit}
                    onChange={(v) => onUpdate(row.id, { fromUnit: v as WeightUnit })}
                    options={WEIGHT_UNITS}
                  />
                }
              />

              {/* تا وزن */}
              <NumberField
                size="sm"
                allowDecimals
                placeholder="۰"
                value={row.toWeight}
                onChange={(v) => onUpdate(row.id, { toWeight: v })}
                inputProps={{ bg: 'bg.panel', pe: '0' }}
                endElement={
                  <UnitSelect
                    value={row.toUnit}
                    onChange={(v) => onUpdate(row.id, { toUnit: v as WeightUnit })}
                    options={WEIGHT_UNITS}
                  />
                }
              />

              {/* مبلغ */}
              <NumberField
                size="sm"
                placeholder="هزینه"
                value={row.isFree ? '' : row.amount}
                disabled={row.isFree}
                onChange={(v) => onUpdate(row.id, { amount: v })}
                inputProps={{ bg: 'bg.panel' }}
                endElement={
                  <Text fontSize="xs" color="fg.muted" px="2" flexShrink={0}>تومان</Text>
                }
              />

              {/* ارسال رایگان — RTL: Switch FIRST=right, Text LAST=left */}
              <Flex align="center" gap="2">
                <Switch.Root
                  colorPalette="brand"
                  size="sm"
                  checked={row.isFree}
                  onCheckedChange={(e) => onUpdate(row.id, { isFree: e.checked })}
                >
                  <Switch.HiddenInput />
                  <Switch.Control><Switch.Thumb /></Switch.Control>
                </Switch.Root>
                <Text fontSize="sm" color="fg" whiteSpace="nowrap">ارسال رایگان</Text>
              </Flex>

              {/* LAST = leftmost = delete */}
              <IconButton
                variant="ghost"
                colorPalette="red"
                size="sm"
                aria-label="حذف بازه وزنی"
                onClick={() => onDelete(row.id)}
              >
                <Trash2 size={16} />
              </IconButton>

            </Grid>

            {/* Mobile: stacked card layout */}
            <Flex
              display={isCompact ? 'flex' : { base: 'flex', md: 'none' }}
              direction="column"
              gap="3"
              p="3"
            >

              {/* Weight inputs — 2 columns */}
              <Grid templateColumns="1fr 1fr" gap="3">

                {/* FIRST = rightmost = از وزن */}
                <Field.Root>
                  <Field.Label fontSize="xs" fontWeight="semibold" color="fg">از وزن</Field.Label>
                  <NumberField
                    size="sm"
                    allowDecimals
                    placeholder="۰"
                    value={row.fromWeight}
                    onChange={(v) => onUpdate(row.id, { fromWeight: v })}
                    inputProps={{ bg: 'bg.panel', pe: '0' }}
                    endElement={
                      <UnitSelect
                        value={row.fromUnit}
                        onChange={(v) => onUpdate(row.id, { fromUnit: v as WeightUnit })}
                        options={WEIGHT_UNITS}
                      />
                    }
                  />
                </Field.Root>

                {/* تا وزن */}
                <Field.Root>
                  <Field.Label fontSize="xs" fontWeight="semibold" color="fg">تا وزن</Field.Label>
                  <NumberField
                    size="sm"
                    allowDecimals
                    placeholder="۰"
                    value={row.toWeight}
                    onChange={(v) => onUpdate(row.id, { toWeight: v })}
                    inputProps={{ bg: 'bg.panel', pe: '0' }}
                    endElement={
                      <UnitSelect
                        value={row.toUnit}
                        onChange={(v) => onUpdate(row.id, { toUnit: v as WeightUnit })}
                        options={WEIGHT_UNITS}
                      />
                    }
                  />
                </Field.Root>

              </Grid>

              {/* مبلغ — standalone Field.Root (isolated from Switch to prevent disabled propagation) */}
              <Field.Root>
                <Field.Label fontSize="xs" fontWeight="semibold" color="fg">مبلغ</Field.Label>
                <NumberField
                  size="sm"
                  placeholder="هزینه"
                  value={row.isFree ? '' : row.amount}
                  disabled={row.isFree}
                  onChange={(v) => onUpdate(row.id, { amount: v })}
                  inputProps={{ bg: 'bg.panel' }}
                  endElement={
                    <Text fontSize="xs" color="fg.muted" px="1" flexShrink={0}>تومان</Text>
                  }
                />
              </Field.Root>

              {/* ارسال رایگان + delete — outside Field.Root, fills width */}
              <Flex align="center" gap="2" w="full" justifyContent="space-between">
                {/* FIRST = rightmost in RTL = ارسال رایگان — Switch FIRST=right, Text LAST=left */}
                <Flex align="center" gap="2">
                  <Switch.Root
                    colorPalette="brand"
                    size="sm"
                    checked={row.isFree}
                    onCheckedChange={(e) => onUpdate(row.id, { isFree: e.checked })}
                  >
                    <Switch.HiddenInput />
                    <Switch.Control><Switch.Thumb /></Switch.Control>
                  </Switch.Root>
                  <Text fontSize="sm" color="fg" whiteSpace="nowrap">ارسال رایگان</Text>
                </Flex>
                {/* LAST = leftmost = delete */}
                <IconButton
                  variant="ghost"
                  colorPalette="red"
                  size="sm"
                  aria-label="حذف بازه وزنی"
                  onClick={() => onDelete(row.id)}
                >
                  <Trash2 size={16} />
                </IconButton>
              </Flex>

            </Flex>

          </Box>
        ))}
      </Flex>

      <Box>
        <Button
          variant="outline"
          colorPalette="brand"
          size="sm"
          onClick={onAdd}
        >
          <Plus size={16} />
          افزودن بازه وزنی
        </Button>
      </Box>

      <WeightRangeChart ranges={ranges} />
    </Flex>
  )
}

// ─── SectionContent ───────────────────────────────────────────────────────────

interface SectionContentProps {
  data:     SectionData
  onChange: (patch: Partial<SectionData>) => void
}

function SectionContent({ data, onChange }: SectionContentProps) {
  const isCompact = useCompactMode()

  function updateRange(id: string, patch: Partial<WeightRange>) {
    onChange({
      weightRanges: data.weightRanges.map((r) => r.id === id ? { ...r, ...patch } : r),
    })
  }

  function addRange() {
    const last = data.weightRanges[data.weightRanges.length - 1]
    onChange({
      weightRanges: [
        ...data.weightRanges,
        newRange(last?.toWeight ?? '', last?.toUnit ?? 'kg'),
      ],
    })
  }

  function deleteRange(id: string) {
    onChange({ weightRanges: data.weightRanges.filter((r) => r.id !== id) })
  }

  return (
    <Flex
      direction="column"
      gap="6"
      pt="4"
      pb="6"
      px="4"
      borderTopWidth="1px"
      borderColor="border"
    >
      {/* Controls: desktop=3-col | mobile=2-col (row1) + هزینه ارسال full-width (row2) */}
      <Grid
        templateColumns={
          isCompact
            ? 'repeat(2, 1fr)'
            : { base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }
        }
        gap="4"
      >

        {/* FIRST in DOM = rightmost in desktop 3-col */}
        {/* < sm: row 3 (1-col stack), sm: full-width row 2, md+: auto 3-col */}
        <Box
          gridColumn={isCompact ? '1 / -1' : { base: 'auto', sm: '1 / -1', md: 'auto' }}
          gridRow={isCompact ? '2' : { base: '3', sm: '2', md: 'auto' }}
        >
          <Field.Root w="full">
            <Field.Label fontSize="sm" fontWeight="semibold" color="fg">هزینه ارسال</Field.Label>
            <SegmentGroup.Root
              value={data.costType}
              onValueChange={(e) => onChange({ costType: e.value as CostType })}
              w="full"
            >
              <SegmentGroup.Indicator bg="bg.panel" />
              {costTypeItems.map((item) => (
                <SegmentGroup.Item key={item.value} value={item.value} flex="1">
                  <SegmentGroup.ItemText fontSize="sm">{item.label}</SegmentGroup.ItemText>
                  <SegmentGroup.ItemHiddenInput />
                </SegmentGroup.Item>
              ))}
            </SegmentGroup.Root>
          </Field.Root>
        </Box>

        {/* نوع ارسال — row 1 right in mobile */}
        <Field.Root>
          <Field.Label fontSize="sm" fontWeight="semibold" color="fg">نوع ارسال</Field.Label>
          <SegmentGroup.Root
            value={data.paymentType}
            onValueChange={(e) => onChange({ paymentType: e.value as PaymentType })}
            w="full"
          >
            <SegmentGroup.Indicator bg="bg.panel" />
            {paymentTypeItems.map((item) => (
              <SegmentGroup.Item key={item.value} value={item.value} flex="1">
                <SegmentGroup.ItemText fontSize="sm">{item.label}</SegmentGroup.ItemText>
                <SegmentGroup.ItemHiddenInput />
              </SegmentGroup.Item>
            ))}
          </SegmentGroup.Root>
        </Field.Root>

        {/* LAST = leftmost = زمان مورد نیاز — row 1 left in mobile */}
        <Field.Root>
          <Field.Label fontSize="sm" fontWeight="semibold" color="fg">زمان مورد نیاز تا ارسال</Field.Label>
          <NumberField
            placeholder="زمان تا ارسال"
            value={data.deliveryDays}
            onChange={(v) => onChange({ deliveryDays: v })}
            inputProps={{ pe: '0' }}
            endElement={
              <UnitSelect
                value={data.deliveryUnit}
                onChange={(v) => onChange({ deliveryUnit: v as DeliveryUnit })}
                options={DELIVERY_UNITS}
              />
            }
          />
        </Field.Root>

      </Grid>

      {data.costType === 'fixed' && (
        <PriceCard
          isFree={data.isFree}
          amount={data.amount}
          onFreeChange={(v) => onChange({ isFree: v })}
          onAmountChange={(v) => onChange({ amount: v })}
        />
      )}

      {data.costType === 'weight' && (
        <WeightTable
          ranges={data.weightRanges}
          onAdd={addRange}
          onDelete={deleteRange}
          onUpdate={updateRange}
        />
      )}
    </Flex>
  )
}

// ─── ShippingSection ──────────────────────────────────────────────────────────

interface ShippingSectionProps {
  title:    string
  data:     SectionData
  onChange: (patch: Partial<SectionData>) => void
}

function ShippingSection({ title, data, onChange }: ShippingSectionProps) {
  return (
    <Box
      borderWidth="1px"
      borderColor="border"
      rounded="lg"
      overflow="hidden"
    >
      <Flex
        gap="4"
        align="center"
        p="4"
        bg={data.enabled ? 'bg.emphasized' : 'bg.subtle'}
      >
        {/* FIRST = rightmost = switch + title */}
        {/* RTL: Switch FIRST=right, Text LAST=left */}
        <chakra.button
          type="button"
          display="flex"
          alignItems="center"
          gap="2.5"
          cursor="pointer"
          onClick={() => onChange({ enabled: !data.enabled })}
          bg="transparent"
          border="none"
          p="0"
        >
          <Switch.Root
            colorPalette="brand"
            checked={data.enabled}
            onCheckedChange={(e) => onChange({ enabled: e.checked })}
            pointerEvents="none"
          >
            <Switch.HiddenInput />
            <Switch.Control><Switch.Thumb /></Switch.Control>
          </Switch.Root>
          <Text fontSize="md" fontWeight="semibold" color="fg">{title}</Text>
        </chakra.button>

        {/* LAST = leftmost = badge */}
        <Badge
          variant="subtle"
          colorPalette={data.enabled ? 'green' : 'gray'}
          size="sm"
        >
          {data.enabled ? 'فعال' : 'غیر فعال'}
        </Badge>
      </Flex>

      <Collapsible.Root open={data.enabled}>
        <Collapsible.Content>
          <SectionContent data={data} onChange={onChange} />
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AddShippingMethod() {
  const router  = useRouter()
  const isCompact = useCompactMode()

  const [title,    setTitle]    = useState('')
  const [province, setProvince] = useState('')
  const [city,     setCity]     = useState('')

  const [localSection,     setLocalSection]     = useState<SectionData>(newSection())
  const [intercitySection, setIntercitySection] = useState<SectionData>(newSection())

  function handleSave() {
    router.push('/settings/shipping')
  }

  return (
    <Flex direction="column" gap="4" w="full">

      <Header
        title="افزودن ارسال شخصی"
        breadcrumbs={[
          { label: 'داشبورد',          href: '/'                  },
          { label: 'تنظیمات فروشگاه', href: '/settings'           },
          { label: 'روش‌های ارسال',    href: '/settings/shipping'  },
        ]}
      />

      <Box
        bg="bg.panel"
        borderWidth="1px"
        borderColor="border"
        rounded="2xl"
        pt={isCompact ? '4' : { base: '4', sm: '6' }}
        pb="6"
        px={isCompact ? '4' : { base: '4', sm: '6' }}
        w="full"
        overflow="clip"
      >
        <Flex direction="column" gap="6" maxW="960px" w="full" mx="auto">

          <TitleBar
            title="جزئیات ارسال"
            size="xl"
            subtitle="در این قسمت می‌توانید روش‌های ارسال را مطابق سلیقه خود ایجاد نمایید."
            divider
          />

          {/* ── Form fields ─────────────────────────────────────────────────── */}
          <Flex direction="column" gap="4">

            <Field.Root>
              <Field.Label fontSize="sm" fontWeight="semibold" color="fg">عنوان</Field.Label>
              <Input
                placeholder="عنوان روش ارسال را وارد نمایید"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Field.Root>

            <Grid templateColumns={isCompact ? '1fr' : { base: '1fr', sm: '1fr 1fr' }} gap="4">

              {/* FIRST = rightmost = استان مبدا */}
              <Field.Root>
                <Field.Label fontSize="sm" fontWeight="semibold" color="fg">استان مبدا</Field.Label>
                <Select.Root
                  collection={provinceCollection}
                  value={province ? [province] : []}
                  onValueChange={(e) => setProvince(e.value[0] ?? '')}
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="استان را انتخاب کنید" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Select.Positioner>
                    <Select.Content>
                      {provinceCollection.items.map((item) => (
                        <Select.Item key={item.value} item={item}>
                          <Select.ItemText>{item.label}</Select.ItemText>
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>
              </Field.Root>

              {/* شهر مبدا */}
              <Field.Root>
                <Field.Label fontSize="sm" fontWeight="semibold" color="fg">شهر مبدا</Field.Label>
                <Select.Root
                  collection={cityCollection}
                  value={city ? [city] : []}
                  onValueChange={(e) => setCity(e.value[0] ?? '')}
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="شهر را انتخاب کنید" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Select.Positioner>
                    <Select.Content>
                      {cityCollection.items.map((item) => (
                        <Select.Item key={item.value} item={item}>
                          <Select.ItemText>{item.label}</Select.ItemText>
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>
              </Field.Root>

            </Grid>
          </Flex>

          {/* ── Shipping sections ────────────────────────────────────────────── */}
          <Flex direction="column" gap="4">
            <ShippingSection
              title="ارسال درون شهری"
              data={localSection}
              onChange={(patch) => setLocalSection((prev) => ({ ...prev, ...patch }))}
            />
            <ShippingSection
              title="ارسال بین شهری"
              data={intercitySection}
              onChange={(patch) => setIntercitySection((prev) => ({ ...prev, ...patch }))}
            />
          </Flex>

          <ButtonFooter
            back={{ label: 'بازگشت به روش‌های ارسال', onClick: () => router.push('/settings/shipping') }}
            primary={{ label: 'ذخیره', onClick: handleSave }}
          />

        </Flex>
      </Box>

    </Flex>
  )
}
