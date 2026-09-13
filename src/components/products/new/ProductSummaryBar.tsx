import type { ReactNode } from 'react'
import { Box, Flex, Grid, Text } from '@chakra-ui/react'
import {
  Images, Grid2x2Check, Grid2x2, ListChecks, Tags,
  Package, Weight, Folder, Truck, CircleHelp,
} from 'lucide-react'
import { toPersianDigits, formatThousands } from '@/utils/numbers'
import { SHIPPING_PROFILES, type ProductForm } from './data'

// ─── SummaryCard ────────────────────────────────────────────────────────────────
/** RTL DOM order (first = rightmost): آیکن ← عدد و برچسبش. */
function SummaryCard({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <Flex
      align="center"
      gap="2"
      p="2"
      h="56px"
      minW="0"
      rounded="10px"
      borderWidth="1px"
      borderColor="border.muted"
    >
      {/* FIRST = rightmost: آیکن در کادر ته‌رنگی */}
      <Flex
        boxSize="30px"
        flexShrink={0}
        rounded="lg"
        align="center"
        justify="center"
        bg="brand.bg"
        color="brand.fg"
      >
        {icon}
      </Flex>
      <Box minW="0">
        {/* مقدارهای متنی (دسته، روش ارسال) بلندند و در کاشیِ ۱۶۱px جا نمی‌شوند →
            ریزتر می‌شوند تا به‌جای بریده‌شدن، خوانده شوند */}
        <Text
          fontSize={value.length > 8 ? '2xs' : 'sm'}
          fontWeight="bold"
          color="fg"
          textAlign="start"
          truncate
          title={value}
        >
          {value}
        </Text>
        <Text fontSize="2xs" color="fg.muted" textAlign="start" truncate>{label}</Text>
      </Box>
    </Flex>
  )
}

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * ProductSummaryBar — «خلاصه محصول» در انتهای مرحلهٔ سئو.
 *
 * هر کاشی یک عدد از همین فرم است، نه یک آمار سرور. ارزشش این است که قبل از
 * انتشار، کاربر در یک نگاه ببیند چه چیزی واقعاً پر شده — بدون برگشتن به شش مرحله.
 *
 * یک انحراف عمدی از طرح: کاشی «فروش ثبت‌شده» طرح، دادهٔ صفحهٔ **ویرایش** یک محصول
 * فروخته‌شده است و در «محصول جدید» همیشه صفر می‌ماند. جایش «وزن» نشسته که در همین
 * فرم پر می‌شود. عدد ساختگی نمی‌سازیم.
 *
 * چیدمان و اندازه‌ها از طرح: قاب سفید radius ۱۳px، شبکهٔ ۵ ستونه با gap ۷px،
 * کاشی ۵۶px با قاب ۱۰px و آیکن ۳۰px.
 */
export function ProductSummaryBar({ form }: { form: ProductForm }) {
  const n = (v: number) => toPersianDigits(formatThousands(v))
  const withAlt = form.gallery.filter((img) => img.alt.trim() !== '').length
  const activeModels = form.combinations.filter((c) => c.active).length
  const shipping = SHIPPING_PROFILES.find((s) => s.value === form.shippingProfile)

  const inventory = form.hasVariants
    ? form.combinations.reduce((sum, c) => sum + (Number(c.inventory) || 0), 0)
    : Number(form.inventory) || 0

  return (
    <Box borderWidth="1px" borderColor="border" rounded="13px" bg="bg.panel" px="3.5" py="3" w="full">
      <Text fontSize="sm" fontWeight="semibold" color="fg" textAlign="start" mb="2.5">
        خلاصه محصول
      </Text>

      {/* FIRST = rightmost: تصاویر */}
      <Grid templateColumns={{ base: 'repeat(2, minmax(0, 1fr))', md: 'repeat(5, minmax(0, 1fr))' }} gap="1.5">
        <SummaryCard icon={<Images size={15} />}        value={n(form.gallery.length)}      label="تصاویر" />
        <SummaryCard icon={<Grid2x2Check size={15} />}  value={n(activeModels)}             label="مدل فعال" />
        <SummaryCard icon={<Grid2x2 size={15} />}       value={n(form.combinations.length)} label="کل مدل‌ها" />
        <SummaryCard icon={<ListChecks size={15} />}    value={n(form.attributes.length)}   label="مشخصه" />
        <SummaryCard icon={<Tags size={15} />}          value={n(form.tags.length)}         label="برچسب" />
        <SummaryCard icon={<Package size={15} />}       value={n(inventory)}                label="موجودی" />
        <SummaryCard icon={<Weight size={15} />}        value={form.weight ? `${toPersianDigits(formatThousands(Number(form.weight)))} گرم` : '—'} label="وزن" />
        <SummaryCard icon={<Folder size={15} />}        value={form.category || '—'}        label="دسته" />
        <SummaryCard icon={<Truck size={15} />}         value={shipping?.label ?? '—'}      label="روش ارسال" />
        <SummaryCard
          icon={<CircleHelp size={15} />}
          value={`${toPersianDigits(withAlt)}/${toPersianDigits(form.gallery.length)}`}
          label="ALT کامل"
        />
      </Grid>
    </Box>
  )
}
