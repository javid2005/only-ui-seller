import { Flex, Grid, Box, Text, Input, Textarea, Button, Badge, Progress, chakra } from '@chakra-ui/react'
import { RefreshCw, ArrowLeft, Globe } from 'lucide-react'
import { TitleBar } from '@/components/ui/TitleBar'
import { ButtonFooter } from '@/components/ui/ButtonFooter'
import { toPersianDigits } from '@/utils/numbers'
import { SectionCard, Panel } from './SectionCard'
import { NotchedField, bareControl } from './NotchedField'
import { SEO_CHECKS, seoScore, slugify, type ProductForm, type StepId } from './data'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface SeoTabProps {
  form: ProductForm
  onChange: (patch: Partial<ProductForm>) => void
  onBack: () => void
  onSave: () => void
  /** رفتن به مرحله‌ای که یک مورد سئو آنجا رفع می‌شود */
  onGoToStep: (step: StepId) => void
}

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * SeoTab — مرحلهٔ ۶: «سئو و انتشار».
 *
 * سه تکهٔ طرح تأییدشده:
 *   ۱. تنظیمات سئو — آدرس صفحه، عنوان، توضیح متا + دکمهٔ «دریافت سئو از اطلاعات محصول»
 *      که بدون تایپ دستی، این سه را از فیلدهای محصول پر می‌کند (بند ۱۳ دور «چاکرا طراح»).
 *   ۲. پیش‌نمایش نتیجهٔ جست‌وجو — همان چیزی که کاربر در گوگل می‌بیند.
 *   ۳. امتیاز سئو + موارد نیازمند تکمیل. کلیک روی هر مورد کاربر را **مستقیم** به
 *      مرحله‌ای می‌برد که آنجا رفع می‌شود (بند ۹ دور «چاکرا اصلاح»).
 *
 * امتیاز از دادهٔ واقعی همین فرم حساب می‌شود، نه یک عدد ثابت.
 */
export function SeoTab({ form, onChange, onBack, onSave, onGoToStep }: SeoTabProps) {
  const score = seoScore(form)
  const pending = SEO_CHECKS.filter((c) => !c.ok(form))

  /** پر کردن سئو از فیلدهای محصول — بدون بازنویسی چیزی که کاربر خودش نوشته */
  const generateFromProduct = () =>
    onChange({
      seoSlug: form.seoSlug.trim() || slugify(form.name),
      seoTitle: form.seoTitle.trim() || form.name,
      seoDescription:
        form.seoDescription.trim() ||
        form.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 165),
    })

  const previewTitle = form.seoTitle.trim() || form.name.trim() || 'عنوان محصول'
  const previewDesc =
    form.seoDescription.trim() || 'توضیح متا هنوز وارد نشده است.'

  return (
    <Flex direction="column" gap="5" w="full">

      <TitleBar
        title="سئو و انتشار"
        subtitle="تنظیمات جستجو، پیش‌نمایش و آمادگی انتشار"
        size="xl"
        divider
      />

      {/* ═══ ۱. تنظیمات سئو ═════════════════════════════════════════════════════ */}
      <SectionCard
        title="تنظیمات سئو"
        subtitle="نحوه نمایش محصول در نتایج جستجو"
        help="این مقادیر فقط در موتورهای جست‌وجو دیده می‌شوند و روی صفحهٔ محصول اثری ندارند."
        actions={
          <Button size="sm" variant="outline" colorPalette="brand" onClick={generateFromProduct}>
            {/* FIRST = rightmost: آیکن */}
            <RefreshCw size={15} />دریافت سئو از اطلاعات محصول
          </Button>
        }
      >
        <Flex direction="column" gap="4">
          <NotchedField
            label="آدرس صفحه محصول"
            required
            hint="برای لینک خواناتر، آدرس لاتین کوتاه پیشنهاد می‌شود؛ همیشه قابل ویرایش است."
          >
            <Input
              {...bareControl}
              dir="ltr"
              textAlign="start"
              placeholder="nova-x-smartphone"
              value={form.seoSlug}
              onChange={(e) => onChange({ seoSlug: e.target.value })}
            />
          </NotchedField>

          <NotchedField label="عنوان سئو" hint={`${toPersianDigits(form.seoTitle.trim().length)} کاراکتر — پیشنهاد: ۱۰ تا ۶۰`}>
            <Input
              {...bareControl}
              placeholder="گوشی هوشمند مدل Nova X"
              value={form.seoTitle}
              onChange={(e) => onChange({ seoTitle: e.target.value })}
            />
          </NotchedField>

          <NotchedField label="توضیح متا" hint={`${toPersianDigits(form.seoDescription.trim().length)} کاراکتر — پیشنهاد: ۵۰ تا ۱۶۵`}>
            <Textarea
              {...bareControl}
              h="auto"
              minH="20"
              rows={3}
              resize="vertical"
              placeholder="توضیح کوتاهی که در نتایج جستجو دیده می‌شود"
              value={form.seoDescription}
              onChange={(e) => onChange({ seoDescription: e.target.value })}
            />
          </NotchedField>
        </Flex>
      </SectionCard>

      {/* ═══ ۲. پیش‌نمایش و آمادگی انتشار ═══════════════════════════════════════ */}
      <SectionCard
        title="پیش‌نمایش و آمادگی انتشار"
        subtitle="نتیجه جستجو، موارد نیازمند تکمیل و خلاصه اطلاعات محصول"
        help="امتیاز از روی همین فرم حساب می‌شود؛ با پر کردن موارد پایین بالا می‌رود."
      >
        <Flex direction="column" gap="5">

          {/* پیش‌نمایش نتیجهٔ جست‌وجو */}
          <Panel tinted>
            <Flex align="center" gap="2" mb="2">
              {/* FIRST = rightmost: نشان سایت */}
              <Flex
                boxSize="6" rounded="full" align="center" justify="center"
                bg="brand.bg" color="brand.fg" flexShrink={0}
              >
                <Globe size={13} />
              </Flex>
              <Box minW="0" textAlign="start">
                <Text fontSize="xs" color="fg" lineHeight="1.4">ویترینا</Text>
                <Text fontSize="2xs" color="fg.muted" lineHeight="1.4" dir="ltr" textAlign="start">
                  vitrina.ir/{form.seoSlug.trim() || 'product'}
                </Text>
              </Box>
            </Flex>
            <Text fontSize="md" color="blue.fg" truncate textAlign="start">{previewTitle}</Text>
            <Text fontSize="xs" color="fg.muted" textAlign="start" mt="1" lineHeight="1.9">
              {previewDesc}
            </Text>
          </Panel>

          {/* امتیاز */}
          <Box>
            <Flex align="start" justify="space-between" gap="3" mb="2" wrap="wrap">
              <Box minW="0">
                <Text fontSize="sm" fontWeight="medium" color="fg" textAlign="start">
                  امتیاز سئوی محصول
                </Text>
                <Text fontSize="xs" color="fg.muted" textAlign="start">
                  براساس اطلاعات واقعی همین فرم
                </Text>
              </Box>
              <Badge
                colorPalette={pending.length === 0 ? 'green' : 'orange'}
                variant="subtle"
                size="sm"
                rounded="l2"
                flexShrink={0}
              >
                {pending.length === 0
                  ? 'همه موارد کامل است'
                  : `${toPersianDigits(pending.length)} مورد نیاز به تکمیل`}
              </Badge>
            </Flex>
            <Progress.Root
              value={score}
              colorPalette={pending.length === 0 ? 'green' : 'brand'}
              size="sm"
              rounded="full"
            >
              <Progress.Track rounded="full">
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
          </Box>

          {/* موارد نیازمند تکمیل — کلیک = رفتن به همان مرحله */}
          {pending.length > 0 && (
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="3">
              {pending.map((check) => (
                <chakra.button
                  key={check.id}
                  type="button"
                  onClick={() => onGoToStep(check.step)}
                  display="flex"
                  alignItems="center"
                  gap="3"
                  textAlign="start"
                  w="full"
                  p="3"
                  rounded="lg"
                  borderWidth="1px"
                  borderColor="orange.muted"
                  bg="orange.bg"
                  transition="border-color 0.15s, background 0.15s"
                  _hover={{ borderColor: 'orange.solid' }}
                  _focusVisible={{ outline: '2px solid', outlineColor: 'brand.focusRing', outlineOffset: '2px' }}
                >
                  {/* FIRST = rightmost: نقطهٔ وضعیت */}
                  <Box boxSize="2" rounded="full" bg="orange.solid" flexShrink={0} />
                  <Box flex="1" minW="0">
                    <Text fontSize="xs" fontWeight="medium" color="fg">{check.label}</Text>
                    <Text fontSize="2xs" color="fg.muted">{check.hint}</Text>
                  </Box>
                  {/* LAST = leftmost: پیکان رفتن — به سمت چپ چون «جلو رفتن» در RTL چپ است */}
                  <Box color="fg.muted" flexShrink={0}><ArrowLeft size={15} /></Box>
                </chakra.button>
              ))}
            </Grid>
          )}

        </Flex>
      </SectionCard>

      <ButtonFooter
        primary={{ label: 'ذخیره و ادامه', onClick: onSave }}
        back={{ label: 'بازگشت به لیست', onClick: onBack }}
      />

    </Flex>
  )
}
