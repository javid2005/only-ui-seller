import { useState } from 'react'
import { Box, Flex, Text, Button, Icon, Code, Collapsible } from '@chakra-ui/react'
import { Check, Minus, Braces, ChevronDown, Copy } from 'lucide-react'
import { toaster } from '@/components/ui/toaster'
import { productSchemaJson, schemaHighlights } from './productSchema'
import { pressable } from './motion'
import type { ProductForm } from './data'

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * SchemaCard — «دادهٔ ساختاریافته» در مرحلهٔ سئو.
 *
 * پیش‌نمایش گوگل می‌گوید صفحه **چطور دیده می‌شود**؛ این کارت می‌گوید گوگل **چه
 * چیزی می‌فهمد**. تفاوتش این است که قیمت، موجودی، برند و مشخصات فقط وقتی در
 * نتیجهٔ جست‌وجو ظاهر می‌شوند که اسکیما داشته باشیم.
 *
 * فروشنده کاری برای انجام ندارد — اسکیما از همین فرم ساخته می‌شود. فهرست بالا
 * فقط می‌گوید کدام قابلیت همین حالا فعال است و کدام هنوز داده ندارد.
 *
 * RTL DOM order هر ردیف (first = rightmost): نشانه ← عنوان ← توضیح.
 */
export function SchemaCard({ form }: { form: ProductForm }) {
  const [open, setOpen] = useState(false)
  const rows = schemaHighlights(form)
  const active = rows.filter((r) => r.ok).length

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(productSchemaJson(form))
      toaster.create({ id: 'schema-copy', title: 'کد اسکیما کپی شد', type: 'success', duration: 2000 })
    } catch {
      toaster.create({ id: 'schema-copy', title: 'کپی نشد — دسترسی کلیپ‌بورد نداریم', type: 'error', duration: 2500 })
    }
  }

  return (
    <Box borderWidth="1px" borderColor="border" rounded="xl" bg="bg.panel" p="3.5" w="full">
      {/* FIRST = rightmost: عنوان · LAST = leftmost: شمارش */}
      <Flex align="center" gap="2" mb="2.5">
        <Icon size="sm" color="brand.fg" flexShrink={0}><Braces /></Icon>
        <Box flex="1" minW="0">
          <Text fontSize="sm" fontWeight="semibold" color="fg" textAlign="start">
            دادهٔ ساختاریافته برای گوگل
          </Text>
          <Text fontSize="2xs" color="fg.muted" textAlign="start">
            خودکار از همین فرم ساخته می‌شود؛ کاری لازم نیست انجام دهید.
          </Text>
        </Box>
        <Text fontSize="xs" color="fg.muted" flexShrink={0}>
          {active}/{rows.length}
        </Text>
      </Flex>

      <Flex direction="column" gap="1">
        {rows.map((r) => (
          <Flex key={r.label} align="center" gap="2">
            {/* FIRST = rightmost: نشانهٔ فعال/غیرفعال */}
            <Icon size="xs" flexShrink={0} color={r.ok ? 'green.fg' : 'fg.muted'}>
              {r.ok ? <Check /> : <Minus />}
            </Icon>
            <Text fontSize="xs" color={r.ok ? 'fg' : 'fg.muted'} textAlign="start">{r.label}</Text>
            <Text fontSize="2xs" color="fg.muted" textAlign="start" flex="1" truncate>{r.hint}</Text>
          </Flex>
        ))}
      </Flex>

      <Collapsible.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Flex gap="2" mt="3">
          {/* FIRST = rightmost: دیدن کد · LAST = leftmost: کپی */}
          <Collapsible.Trigger asChild>
            <Button size="xs" variant="outline" rounded="l2" gap="1.5" {...pressable}>
              <ChevronDown
                size={13}
                style={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'transform .18s' }}
              />
              {open ? 'بستن کد' : 'دیدن کد'}
            </Button>
          </Collapsible.Trigger>
          <Button size="xs" variant="ghost" colorPalette="brand" rounded="l2" gap="1.5" onClick={copy} {...pressable}>
            <Copy size={13} />
            کپی
          </Button>
        </Flex>

        <Collapsible.Content>
          <Box
            mt="2.5"
            maxH="260px"
            overflow="auto"
            rounded="lg"
            borderWidth="1px"
            borderColor="border.muted"
            bg="bg.subtle"
            p="2.5"
          >
            <Code
              dir="ltr"
              display="block"
              whiteSpace="pre"
              fontSize="2xs"
              lineHeight="1.8"
              bg="transparent"
              px="0"
            >
              {productSchemaJson(form)}
            </Code>
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  )
}
