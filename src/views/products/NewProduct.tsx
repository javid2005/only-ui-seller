import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Flex } from '@chakra-ui/react'
import { Upload } from 'lucide-react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { Header, HeaderCTA } from '@/components/layout/Header'
import { StepNav, type StepStatus } from '@/components/products/new/StepNav'
import { ProductTypeDialog, ProductTypeSwitch } from '@/components/products/new/ProductTypeDialog'
import { InfoTab } from '@/components/products/new/InfoTab'
import { GalleryTab } from '@/components/products/new/GalleryTab'
import { WarehouseTab } from '@/components/products/new/WarehouseTab'
import { SpecsTab } from '@/components/products/new/SpecsTab'
import { VariantsTab } from '@/components/products/new/VariantsTab'
import { SeoTab } from '@/components/products/new/SeoTab'
import {
  EMPTY_FORM, STEPS, pricingModeOf, seoScore,
  type ProductForm, type ProductTypeId, type StepId,
} from '@/components/products/new/data'

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

  const [activeStep, setActiveStep] = useState<StepId>('basic')
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM)

  // دیالوگ نوع محصول: در ورود اول باز است و تا انتخاب نشدن بسته نمی‌شود
  const [typeChosen, setTypeChosen] = useState(false)
  const [typeDialogOpen, setTypeDialogOpen] = useState(true)

  const patch = (p: Partial<ProductForm>) => setForm((prev) => ({ ...prev, ...p }))

  // محصول ساده مرحلهٔ «تنوع ها» ندارد
  const isVaried = form.productType === 'varied'
  const steps = isVaried ? STEPS : STEPS.filter((s) => s.id !== 'models')

  const chooseType = (productType: ProductTypeId) => {
    setForm((prev) => ({
      ...prev,
      productType,
      // برگشت به ساده یعنی تنوع‌ها و ترکیب‌ها دیگر معنا ندارند
      ...(productType === 'simple'
        ? { hasVariants: false, variants: [], combinations: [] }
        : {}),
    }))
    if (productType === 'simple' && activeStep === 'models') setActiveStep('basic')
    setTypeChosen(true)
    setTypeDialogOpen(false)
  }

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

  // انبارداری: شناسه و — مگر نامحدود/تنوع — موجودی لازم است
  const warehouseComplete = Boolean(
    form.sku.trim() && (form.unlimitedInventory || form.hasVariants || form.inventory.trim()),
  )
  // مشخصات اختیاری است؛ نبودِ ویژگی هم معتبر است
  const specsComplete = true

  const statuses: Record<StepId, StepStatus> = {
    basic: infoComplete ? 'complete' : 'pending',
    gallery: galleryComplete ? 'complete' : 'pending',
    warehouse: warehouseComplete ? 'complete' : 'pending',
    specs: specsComplete ? 'complete' : 'pending',
    // تنوع اختیاری است: صفر ترکیب یعنی «کامل»، نه یک عددِ خام روی استپر
    models: form.combinations.length > 0 ? form.combinations.length : 'complete',
    seo: seoScore(form) === 100 ? 'complete' : 'pending',
  }

  // انتشار فقط وقتی اطلاعات اجباری هر سه تب کامل باشد
  const canPublish = infoComplete && galleryComplete && warehouseComplete && variantsComplete

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
        cta={
          /* FIRST = rightmost: سوییچ نوع محصول · LAST = leftmost: انتشار */
          <Flex align="center" gap="3" wrap="wrap" justify="end">
            <ProductTypeSwitch
              value={form.productType}
              onChange={(t) => t !== form.productType && chooseType(t)}
            />
            <HeaderCTA label="انتشار" icon={<Upload size={16} />} onClick={save} disabled={!canPublish} />
          </Flex>
        }
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
            steps={steps}
          />
        </Box>

        <Flex gap="10" align="start">

          {/* FIRST = rightmost در RTL: ستون Start — Vertical StepNav (lg+، non-compact) */}
          {!isCompact && (
            <Box
              display={{ base: 'none', lg: 'block' }}
              w="256px"
              flexShrink={0}
              position="sticky"
              top="20"
              alignSelf="start"
            >
              <StepNav
                orientation="vertical"
                active={activeStep}
                onSelect={setActiveStep}
                statuses={statuses}
                steps={steps}
              />
            </Box>
          )}

          {/* SECOND: ستون Middle (مرکز) — max 960 */}
          <Flex direction="column" gap="4" maxW="960px" flex="1" minW="0">
            {activeStep === 'basic' && (
              <InfoTab form={form} onChange={patch} onBack={goBack} onSave={save} />
            )}
            {activeStep === 'gallery' && (
              <GalleryTab form={form} onChange={patch} onBack={goBack} onSave={save} />
            )}
            {activeStep === 'warehouse' && (
              <WarehouseTab form={form} onChange={patch} onBack={goBack} onSave={save} />
            )}
            {activeStep === 'specs' && (
              <SpecsTab form={form} onChange={patch} onBack={goBack} onSave={save} />
            )}
            {activeStep === 'models' && isVaried && (
              <VariantsTab form={form} onChange={patch} onBack={goBack} onSave={save} />
            )}
            {activeStep === 'seo' && (
              <SeoTab
                form={form}
                onChange={patch}
                onBack={goBack}
                onSave={save}
                onGoToStep={setActiveStep}
              />
            )}
          </Flex>

        </Flex>
      </Box>

      {/* ═══ دروازهٔ ورود: انتخاب نوع محصول ════════════════════════════════════ */}
      <ProductTypeDialog
        open={typeDialogOpen}
        value={form.productType}
        onConfirm={chooseType}
        onClose={typeChosen ? () => setTypeDialogOpen(false) : undefined}
      />

    </Flex>
  )
}
