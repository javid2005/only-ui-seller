import { Box, Flex, Text, Icon } from '@chakra-ui/react'
import { Check, Minus, Sparkles } from 'lucide-react'
import { schemaHighlights } from './productSchema'
import type { ProductForm } from './data'

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * SchemaCard — «در نتیجهٔ گوگل چه چیزی دیده می‌شود».
 *
 * ⚠️ نسخهٔ قبل نامش «دادهٔ ساختاریافته» بود و دکمه‌های «دیدن کد» و «کپی» داشت.
 * برای فروشندهٔ آماتور یا متوسط نه معنایی داشت و نه کاری با آن کد می‌کرد — فقط
 * پیچیده به نظر می‌رسید. اسکیما همچنان ساخته و در صفحهٔ محصول قرار می‌گیرد
 * (`productSchema.ts`)، ولی اینجا فقط **نتیجه‌اش** به زبان فروشنده گفته می‌شود:
 * کدام قابلیت در نتیجهٔ جست‌وجو فعال شده و برای فعال‌شدن بقیه چه چیزی کم است.
 *
 * RTL DOM order هر ردیف (first = rightmost): نشانه ← عنوان ← توضیح.
 */
export function SchemaCard({ form }: { form: ProductForm }) {
  const rows = schemaHighlights(form)
  const active = rows.filter((r) => r.ok).length

  return (
    <Box borderWidth="1px" borderColor="border" rounded="xl" bg="bg.panel" p="3.5" w="full">
      {/* FIRST = rightmost: آیکن و عنوان … شمارش (چپ‌ترین) */}
      <Flex align="center" gap="2" mb="1">
        <Icon size="sm" color="brand.fg" flexShrink={0}><Sparkles /></Icon>
        <Text fontSize="sm" fontWeight="semibold" color="fg" flex="1" textAlign="start">
          نمایش در نتیجهٔ گوگل
        </Text>
        <Text fontSize="xs" color="fg.muted" flexShrink={0}>
          {active} از {rows.length}
        </Text>
      </Flex>

      <Text fontSize="xs" color="fg.muted" textAlign="start" lineHeight="1.9" mb="2.5">
        وقتی این اطلاعات کامل باشد، گوگل می‌تواند قیمت و موجودی محصول را مستقیم در
        نتیجهٔ جست‌وجو نشان بدهد — نه فقط عنوان و توضیح. کاری لازم نیست انجام دهید؛
        همین‌که فیلدهای زیر پر شوند خودکار فعال می‌شود.
      </Text>

      <Flex direction="column" gap="1.5">
        {rows.map((r) => (
          <Flex key={r.label} align="center" gap="2">
            {/* FIRST = rightmost: نشانهٔ فعال/غیرفعال */}
            <Icon size="xs" flexShrink={0} color={r.ok ? 'green.fg' : 'fg.subtle'}>
              {r.ok ? <Check /> : <Minus />}
            </Icon>
            <Text fontSize="xs" color={r.ok ? 'fg' : 'fg.muted'} textAlign="start" flexShrink={0}>
              {r.label}
            </Text>
            <Text fontSize="2xs" color="fg.muted" textAlign="start" flex="1" truncate>
              {r.ok ? 'فعال' : r.hint}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Box>
  )
}
