import { Box, Flex, Grid, Text, Badge, Field } from '@chakra-ui/react'
import { Sparkles } from 'lucide-react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { NumberField } from '@/components/ui/NumberField'
import { toPersianDigits, formatThousands } from '@/utils/numbers'
import { GOLD_GRAM_PRICE, type ProductForm } from './data'

interface GoldFieldProps {
  label: string
  placeholder: string
  hint: string
  value: string
  onChange: (v: string) => void
  allowDecimals?: boolean
  max?: number
}

function GoldField({ label, placeholder, hint, value, onChange, allowDecimals, max }: GoldFieldProps) {
  return (
    <Field.Root>
      <Field.Label fontSize="sm" fontWeight="semibold">{label}</Field.Label>
      <NumberField
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        showSteppers
        allowDecimals={allowDecimals}
        max={max}
        inputProps={{ bg: 'bg.panel' }}
      />
      <Field.HelperText>{hint}</Field.HelperText>
    </Field.Root>
  )
}

/**
 * GoldInfoCard — کارت «اطلاعات اختصاصی طلا» (فقط دستهٔ pricingMode='gold').
 * RTL DOM order: عنوان+آیکن FIRST=راست · Badge نرخ گرم LAST=چپ.
 * چهار فیلد: وزن طلا (راست‌ترین) ← اجرت ← سود ← مالیات (چپ‌ترین).
 */
export function GoldInfoCard({
  form, onChange,
}: { form: ProductForm; onChange: (patch: Partial<ProductForm>) => void }) {
  const isCompact = useCompactMode()

  return (
    <Box bg="bg.subtle" borderWidth="1px" borderColor="border" rounded="lg" p="4">
      {/* سرتیتر — عنوان+آیکن (راست) · badge نرخ گرم (چپ) */}
      <Flex justify="space-between" align="center" gap="3" mb="4" wrap="wrap">
        <Flex align="center" gap="2" color="yellow.fg">
          <Sparkles size={24} />
          <Text fontSize="md" fontWeight="medium" whiteSpace="nowrap">اطلاعات اختصاصی طلا</Text>
        </Flex>
        <Badge colorPalette="purple" variant="subtle" size="xs" rounded="l2">
          قیمت گرم طلا: {toPersianDigits(formatThousands(GOLD_GRAM_PRICE))} تومان
        </Badge>
      </Flex>

      {/* چهار فیلد — وزن طلا FIRST=راست ... مالیات LAST=چپ */}
      <Grid
        templateColumns={isCompact ? '1fr' : { base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
        gap="4"
      >
        <GoldField
          label="وزن طلا (گرم)" placeholder="وزن طلا" hint="وزن خالص"
          value={form.goldWeight} onChange={(v) => onChange({ goldWeight: v })} allowDecimals
        />
        <GoldField
          label="اجرت ساخت (%)" placeholder="اجرت ساخت" hint="درصد اجرت"
          value={form.goldWage} onChange={(v) => onChange({ goldWage: v })}
        />
        <GoldField
          label="سود فروشنده (%)" placeholder="سود فروشنده" hint="حداکثر ۱۰۰٪"
          value={form.goldProfit} onChange={(v) => onChange({ goldProfit: v })} max={100}
        />
        <GoldField
          label="مالیات (%)" placeholder="مالیات" hint="پیش‌فرض ۱۰٪"
          value={form.goldTax} onChange={(v) => onChange({ goldTax: v })}
        />
      </Grid>
    </Box>
  )
}
