import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Flex } from '@chakra-ui/react'
import { Upload } from 'lucide-react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { Header, HeaderCTA } from '@/components/layout/Header'
import { StepNav, type StepStatus } from '@/components/products/new/StepNav'
import { InfoTab } from '@/components/products/new/InfoTab'
import { GalleryTab } from '@/components/products/new/GalleryTab'
import { VariantsTab } from '@/components/products/new/VariantsTab'
import { EMPTY_FORM, pricingModeOf, type ProductForm, type StepId } from '@/components/products/new/data'

/**
 * NewProduct — صفحه «محصول جدید»
 * Template: Two Columns Right Center (نویگیشن مرحله‌ای راست + فرم مرکز max 960)
 * Route: /products/new
 *
 * سه تب: اطلاعات محصول / گالری / تنوع‌ها (Accordion + ماتریس ترکیب‌ها) — UI + state محلی.
 */
export function NewProduct() {
  const router = useRouter()
  const isCompact = useCompactMode()

  const [activeStep, setActiveStep] = useState<StepId>('info')
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM)

  const patch = (p: Partial<ProductForm>) => setForm((prev) => ({ ...prev, ...p }))

  // ─── تکمیل هر تب ──────────────────────────────────────────────────────────────
  // اطلاعات محصول: نام + دسته + قیمت (مگر فروش تلفنی) + موجودی (مگر نامحدود/تنوع)
  const isGold = pricingModeOf(form.category) === 'gold'
  const priceFilled = isGold ? form.goldWeight.trim() : form.price.trim()
  const infoComplete = Boolean(
    form.name.trim() &&
    form.category &&
    (form.phoneSale || priceFilled) &&
    (form.unlimitedInventory || form.hasVariants || form.inventory.trim()),
  )
  // گالری: حداقل یک تصویر لازم است
  const galleryComplete = form.gallery.length > 0
  // تنوع اختیاری است؛ نبودِ تنوع هم معتبر است
  const variantsComplete = true

  const statuses: Record<StepId, StepStatus> = {
    info: infoComplete ? 'complete' : 'pending',
    gallery: galleryComplete ? 'complete' : 'pending',
    variants: form.combinations.length,
  }

  // انتشار فقط وقتی اطلاعات اجباری هر سه تب کامل باشد
  const canPublish = infoComplete && galleryComplete && variantsComplete

  const goBack = () => router.push('/products/list')
  const save = () => { /* TODO: persist (UI-only این پاس) */ }

  return (
    <Flex direction="column" gap="4" w="full">

      {/* ─── Page header ─────────────────────────────────────────────────────── */}
      <Header
        title="محصول جدید"
        breadcrumbs={[
          { label: 'داشبورد', href: '/' },
          { label: 'لیست محصولات', href: '/products/list' },
          { label: 'محصول جدید' },
        ]}
        cta={<HeaderCTA label="انتشار" icon={<Upload size={16} />} onClick={save} disabled={!canPublish} />}
      />

      {/* ─── Panel (Two Columns Right Center) ─────────────────────────────────── */}
      <Box
        bg="bg.panel"
        borderWidth="1px"
        borderColor="border"
        rounded="2xl"
        pt={isCompact ? '4' : { base: '4', sm: '6' }}
        pb="6"
        px={isCompact ? '4' : { base: '4', sm: '6' }}
        w="full"
      >
        {/* StepNav افقی — موبایل/compact (بالای فرم) */}
        <Box display={isCompact ? 'block' : { base: 'block', lg: 'none' }} mb="6">
          <StepNav
            orientation="horizontal"
            active={activeStep}
            onSelect={setActiveStep}
            statuses={statuses}
          />
        </Box>

        <Flex gap="10" align="flex-start">

          {/* FIRST = rightmost در RTL: ستون Start — Vertical StepNav (lg+، non-compact) */}
          {!isCompact && (
            <Box
              display={{ base: 'none', lg: 'block' }}
              w="256px"
              flexShrink={0}
              position="sticky"
              top="20"
              alignSelf="flex-start"
            >
              <StepNav
                orientation="vertical"
                active={activeStep}
                onSelect={setActiveStep}
                statuses={statuses}
              />
            </Box>
          )}

          {/* SECOND: ستون Middle (مرکز) — max 960 */}
          <Flex direction="column" gap="4" maxW="960px" flex="1" minW="0">
            {activeStep === 'info' && (
              <InfoTab form={form} onChange={patch} onBack={goBack} onSave={save} />
            )}
            {activeStep === 'gallery' && (
              <GalleryTab form={form} onChange={patch} onBack={goBack} onSave={save} />
            )}
            {activeStep === 'variants' && (
              <VariantsTab form={form} onChange={patch} onBack={goBack} onSave={save} />
            )}
          </Flex>

        </Flex>
      </Box>

    </Flex>
  )
}
