'use client'

import { useState, type ReactNode } from 'react'
import { Box, Flex, Grid, Text, Separator, IconButton } from '@chakra-ui/react'
import { ChevronUp } from 'lucide-react'
import { MOCK_ORDER, CURRENCY } from './orderData'

function Row({ label, value, valueColor = 'fg', strong = false }: {
  label: string; value: string; valueColor?: string; strong?: boolean
}) {
  return (
    <Flex align="center" justify="space-between" gap="3" w="full">
      <Text fontSize="sm" color="fg.muted">{label}</Text>
      <Text fontSize="sm" fontWeight={strong ? 'bold' : 'semibold'} color={valueColor}>
        {value}
      </Text>
    </Flex>
  )
}

/** ستون خلاصه (collapsed) — label بالا (muted)، value پایین */
function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <Box minW="0">
      <Text fontSize="xs" color="fg.muted" mb="1" textAlign="start" truncate>{label}</Text>
      <Text fontSize="sm" fontWeight="semibold" color="fg" textAlign="start" truncate>{value}</Text>
    </Box>
  )
}

/**
 * Collapse — انیمیشن باز/بسته با grid-template-rows (0fr→1fr) و ease-in-out.
 * بدون وابستگی، height خودکار smooth.
 */
function Collapse({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <Box
      display="grid"
      gridTemplateRows={open ? '1fr' : '0fr'}
      transition="grid-template-rows 0.28s ease-in-out"
    >
      <Box overflow="hidden" minH="0">{children}</Box>
    </Box>
  )
}

/**
 * OrderSummaryAccordion — نسخه‌ی موبایل «خلاصه سفارش».
 * sticky پایین صفحه (position روی wrapper در OrderDetails). دو حالت:
 *  collapsed → ۳ آیتم خلاصه + chevron بالا (بزن باز شه)
 *  expanded  → همه‌ی ردیف‌ها + chevron چرخیده (بزن بسته شه)
 */
export function OrderSummaryAccordion() {
  const [open, setOpen] = useState(false)
  const { code, itemsCount, totals, customer, shipMethod } = MOCK_ORDER
  const money = (v: string) => `${v} ${CURRENCY}`

  return (
    <Box
      bg="brand.bg"
      borderWidth="1px"
      borderColor="brand.emphasized"
      rounded="2xl"
      shadow="md"
      overflow="clip"
    >
      {/* Header — toggle. RTL: عنوان راست (اول DOM)، chevron چپ (آخر DOM) */}
      <Flex
        align="center"
        justify="space-between"
        w="full"
        px="4"
        py="2"
        cursor="pointer"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen((o) => !o) } }}
      >
        <Text fontSize="md" fontWeight="semibold" color="fg">خلاصه سفارش</Text>
        <IconButton
          as="span"
          size="sm"
          variant="ghost"
          colorPalette="brand"
          aria-label={open ? 'بستن خلاصه' : 'باز کردن خلاصه'}
          // chevron up؛ وقتی باز شد ۱۸۰° می‌چرخه (می‌شود down) — هماهنگ با انیمیشن
          transform={open ? 'rotate(180deg)' : 'none'}
          transition="transform 0.28s ease-in-out"
        >
          <ChevronUp size={20} />
        </IconButton>
      </Flex>

      <Separator borderColor="brand.subtle" />

      {/* Collapsed — ۳ آیتم. RTL: شماره سفارش راست (اول DOM) → مبلغ پرداختی چپ */}
      <Collapse open={!open}>
        <Grid templateColumns="repeat(3, 1fr)" gap="3" px="4" py="4">
          <MiniStat label="شماره سفارش" value={code} />
          <MiniStat label="تعداد اقلام" value={itemsCount} />
          <MiniStat label="مبلغ پرداختی" value={money(totals.payable)} />
        </Grid>
      </Collapse>

      {/* Expanded — همه ردیف‌ها */}
      <Collapse open={open}>
        <Flex direction="column" gap="3" px="4" py="4" maxH="60dvh" overflowY="auto">
          <Row label="شماره سفارش" value={code} />
          <Row label="تعداد اقلام" value={itemsCount} />
          <Separator borderColor="brand.subtle" />
          <Row label="جمع کل"    value={money(totals.sum)} />
          <Row label="تخفیف"     value={money(totals.discount)} valueColor="green.fg" />
          <Row label="مبلغ پرداختی" value={money(totals.payable)} strong />
          <Separator borderColor="brand.subtle" />
          <Row label="مشتری"     value={customer.name} />
          <Row label="روش ارسال" value={shipMethod} />
        </Flex>
      </Collapse>
    </Box>
  )
}
