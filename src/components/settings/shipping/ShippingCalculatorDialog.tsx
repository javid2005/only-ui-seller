import { useState } from 'react'
import {
  Dialog, Portal, CloseButton, Button, Field,
  SegmentGroup, Flex, Box, Text, Badge, Grid, Separator, Table,
} from '@chakra-ui/react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { NumberField } from '@/components/ui/NumberField'

// ─── Types (exported — used by ShippingSettings & AddShippingMethod) ──────────

type WeightUnit = 'kg' | 'g'
type CostType   = 'fixed' | 'weight'
type PriceType  = 'free' | 'fixed' | 'weight' | 'out_of_range' | 'disabled'

export interface WeightRangeCalc {
  fromWeight: string
  fromUnit:   WeightUnit
  toWeight:   string
  toUnit:     WeightUnit
  isFree:     boolean
  amount:     string
}

export interface SectionCalcData {
  enabled:      boolean
  costType:     CostType
  isFree:       boolean
  amount:       string
  weightRanges: WeightRangeCalc[]
}

export interface MethodForCalc {
  id:        string
  name:      string
  intraCity: SectionCalcData
  interCity: SectionCalcData
}

interface CalcResult {
  price: string
  type:  PriceType
}

export interface ShippingCalculatorDialogProps {
  open:    boolean
  onClose: () => void
  methods: MethodForCalc[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toKg(val: string, unit: WeightUnit): number {
  const n = parseFloat(val.replace(/,/g, '')) || 0
  return unit === 'g' ? n / 1000 : n
}

function calcSection(section: SectionCalcData, weightKg: number): CalcResult {
  if (!section.enabled) return { price: '', type: 'disabled' }

  if (section.costType === 'fixed') {
    if (section.isFree) return { price: '0', type: 'free' }
    return { price: section.amount, type: 'fixed' }
  }

  // weight-based: find matching range (inclusive on both ends)
  const range = section.weightRanges.find((r) => {
    const from = toKg(r.fromWeight, r.fromUnit)
    const to   = toKg(r.toWeight,   r.toUnit)
    return weightKg >= from && weightKg <= to
  })

  if (!range) return { price: '', type: 'out_of_range' }
  if (range.isFree) return { price: '0', type: 'free' }
  return { price: range.amount, type: 'weight' }
}

function formatPrice(price: string): string {
  const n = Number(price.replace(/,/g, ''))
  if (!price || isNaN(n)) return '—'
  return `${n.toLocaleString('fa-IR')} تومان`
}

// ─── Price display helpers ─────────────────────────────────────────────────

function priceDisplay(result: CalcResult) {
  const text =
    result.type === 'free'         ? '۰ تومان'       :
    result.type === 'disabled'     ? 'غیر فعال'      :
    result.type === 'out_of_range' ? 'خارج از بازه'  :
    formatPrice(result.price)
  const subdued = result.type === 'disabled' || result.type === 'out_of_range'
  return { text, subdued }
}

function PriceBadge({ type }: { type: PriceType }) {
  if (type === 'free')   return <Badge colorPalette="green"  variant="subtle" size="sm">رایگان</Badge>
  if (type === 'fixed')  return <Badge colorPalette="purple" variant="subtle" size="sm">ثابت</Badge>
  if (type === 'weight') return <Badge colorPalette="blue"   variant="subtle" size="sm">براساس وزن</Badge>
  return null
}

// ─── PriceCell — table cell content: badge (label) above price (value) ──────

function PriceCell({ result }: { result: CalcResult }) {
  const { text, subdued } = priceDisplay(result)
  return (
    <Flex direction="column" align="start" gap="1">
      <PriceBadge type={result.type} />
      <Text fontSize="sm" fontWeight="semibold" color={subdued ? 'fg.muted' : 'fg'}>{text}</Text>
    </Flex>
  )
}

// ─── PriceItem — mobile boxed variant ────────────────────────────────────────

function PriceItem({ result }: { result: CalcResult }) {
  const { text, subdued } = priceDisplay(result)
  return (
    <Flex bg="bg.subtle" rounded="md" p="2" direction="column" align="start" gap="1" minH="9">
      <PriceBadge type={result.type} />
      <Text fontSize="sm" color={subdued ? 'fg.muted' : 'fg'}>{text}</Text>
    </Flex>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ShippingCalculatorDialog({
  open,
  onClose,
  methods,
}: ShippingCalculatorDialogProps) {
  const isCompact = useCompactMode()

  const [weight,  setWeight]  = useState('')
  const [unit,    setUnit]    = useState<'kg' | 'g'>('kg')
  const [results, setResults] = useState<CalcResult[][] | null>(null)   // [methodIdx][0=intra, 1=inter]
  const [error,   setError]   = useState('')

  function handleCalculate() {
    if (!weight.trim()) { setError('وزن مرسوله را وارد کنید'); return }
    const kg = toKg(weight, unit)
    if (kg <= 0) { setError('وزن باید بزرگ‌تر از صفر باشد'); return }
    setError('')
    setResults(methods.map(m => [
      calcSection(m.intraCity, kg),
      calcSection(m.interCity, kg),
    ]))
  }

  function handleClose() {
    setWeight('')
    setUnit('kg')
    setResults(null)
    setError('')
    onClose()
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => { if (!e.open) handleClose() }}
      placement="center"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl">
          <Dialog.Content
            maxW={isCompact ? '480px' : '560px'}
            w="full"
            mx="4"
          >

            {/* Header */}
            <Dialog.Header pb="4" pt="6" px="6" position="relative">
              <Dialog.Title fontSize="lg" fontWeight="semibold" color="fg">
                محاسبه هزینه ارسال
              </Dialog.Title>
              <Dialog.CloseTrigger asChild position="absolute" top="4" insetEnd="4">
                <CloseButton size="sm" onClick={handleClose} />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            {/* Body */}
            <Dialog.Body px="6" pt="2" pb="4" display="flex" flexDirection="column" gap="4">

              {/* Description */}
              <Text fontSize="sm" color="fg.muted">
                برای محاسبه هزینه ارسال، وزن مرسوله مورد نظر خود را وارد نمایید:
              </Text>

              {/* Input row — < sm: column (Input+Seg | Button below); ≥ sm: single row */}
              <Flex
                direction={isCompact ? 'column' : { base: 'column', sm: 'row' }}
                gap="3"
                align="start"
              >
                {/* Inner row: Input + SegmentGroup always side-by-side */}
                <Flex gap="3" align="start" flex="1" minW="0">
                  {/* FIRST = rightmost = weight input */}
                  <Field.Root flex="1" invalid={!!error}>
                    <NumberField
                      allowDecimals
                      placeholder="وزن مرسوله را وارد کنید"
                      value={weight}
                      onChange={(v) => { setWeight(v); setError('') }}
                      inputProps={{ onKeyDown: (e) => e.key === 'Enter' && handleCalculate() }}
                    />
                    {error && <Field.ErrorText fontSize="xs">{error}</Field.ErrorText>}
                  </Field.Root>

                  {/* SegmentGroup — RTL: کیلوگرم FIRST = rightmost */}
                  <SegmentGroup.Root
                    value={unit}
                    onValueChange={(e) => setUnit(e.value as 'kg' | 'g')}
                    size="md"
                    flexShrink={0}
                  >
                    <SegmentGroup.Indicator bg="bg.panel" />
                    <SegmentGroup.Item value="kg">
                      <SegmentGroup.ItemText fontSize="sm">کیلوگرم</SegmentGroup.ItemText>
                      <SegmentGroup.ItemHiddenInput />
                    </SegmentGroup.Item>
                    <SegmentGroup.Item value="g">
                      <SegmentGroup.ItemText fontSize="sm">گرم</SegmentGroup.ItemText>
                      <SegmentGroup.ItemHiddenInput />
                    </SegmentGroup.Item>
                  </SegmentGroup.Root>
                </Flex>

                {/* محاسبه button — full-width on mobile/compact, auto on ≥ sm */}
                <Button
                  bg="brand.solid"
                  color="brand.contrast"
                  _hover={{ bg: 'brand.emphasized', color: 'brand.fg' }}
                  flexShrink={0}
                  w={isCompact ? 'full' : { base: 'full', sm: 'auto' }}
                  onClick={handleCalculate}
                >
                  محاسبه
                </Button>
              </Flex>

              {/* Results — shown after first calculation */}
              {results && (
                <>
                  <Separator />

                  {/* ── Desktop (≥ sm, non-compact): striped Table ── */}
                  <Table.ScrollArea
                    display={isCompact ? 'none' : { base: 'none', sm: 'block' }}
                    overflowX="auto"
                    borderWidth="0"
                  >
                    <Table.Root size="md">
                      <Table.Header>
                        {/* RTL col order: روش ارسال (right) | درون شهری | بین شهری (left) */}
                        <Table.Row bg="bg.subtle">
                          <Table.ColumnHeader textAlign="start">روش ارسال</Table.ColumnHeader>
                          <Table.ColumnHeader>درون شهری</Table.ColumnHeader>
                          <Table.ColumnHeader>بین شهری</Table.ColumnHeader>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {methods.map((m, i) => (
                          <Table.Row key={m.id} bg={i % 2 === 1 ? 'bg.subtle' : 'bg'}>
                            <Table.Cell>
                              <Text fontSize="sm" color="fg">{m.name}</Text>
                            </Table.Cell>
                            <Table.Cell>
                              <PriceCell result={results[i][0]} />
                            </Table.Cell>
                            <Table.Cell>
                              <PriceCell result={results[i][1]} />
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Root>
                  </Table.ScrollArea>

                  {/* ── Mobile (< sm or compact): 2-col per method with inline labels ── */}
                  <Flex
                    display={isCompact ? 'flex' : { base: 'flex', sm: 'none' }}
                    direction="column"
                    gap="3"
                  >
                    {methods.map((m, i) => (
                      <Box key={m.id}>
                        <Text fontSize="xs" color="fg.muted" mb="1.5">{m.name}</Text>
                        {/* RTL: درون شهری (right col) | بین شهری (left col) */}
                        <Grid templateColumns="1fr 1fr" gap="2">
                          <Flex direction="column" gap="1">
                            <Text fontSize="xs" fontWeight="semibold" color="fg">درون شهری</Text>
                            <PriceItem result={results[i][0]} />
                          </Flex>
                          <Flex direction="column" gap="1">
                            <Text fontSize="xs" fontWeight="semibold" color="fg">بین شهری</Text>
                            <PriceItem result={results[i][1]} />
                          </Flex>
                        </Grid>
                      </Box>
                    ))}
                  </Flex>
                </>
              )}

            </Dialog.Body>

            {/* Footer */}
            <Dialog.Footer px="6" pt="2" pb="4">
              <Button variant="outline" colorPalette="gray" onClick={handleClose}>
                بستن
              </Button>
            </Dialog.Footer>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
