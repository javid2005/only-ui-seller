import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Flex, IconButton } from '@chakra-ui/react'
import { Upload, Save, Eye } from 'lucide-react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { Header, HeaderCTA } from '@/components/layout/Header'
import { Tooltip } from '@/components/ui/Tooltip'
import { StepNav, type StepStatus } from '@/components/products/new/StepNav'
import { ProductTypeDialog, ProductTypeSwitch } from '@/components/products/new/ProductTypeDialog'
import { InfoTab } from '@/components/products/new/InfoTab'
import { GalleryTab } from '@/components/products/new/GalleryTab'
import { WarehouseTab } from '@/components/products/new/WarehouseTab'
import { SpecsTab } from '@/components/products/new/SpecsTab'
import { VariantsTab } from '@/components/products/new/VariantsTab'
import { SeoTab } from '@/components/products/new/SeoTab'
import { ProductPreviewCard } from '@/components/products/new/ProductPreviewCard'
import { SaveStatus } from '@/components/products/new/SaveStatus'
import { ProductCategoryProvider } from '@/components/products/new/ProductContext'
import { ValidationToast } from '@/components/products/new/ValidationToast'
import { validateProduct, type FieldIssue } from '@/components/products/new/validation'
import { focusField } from '@/components/products/new/focusField'
import { enterPanel } from '@/components/products/new/motion'
import {
  EMPTY_FORM, STEPS, pricingModeOf, seoScore,
  type ProductForm, type ProductTypeId, type StepId,
} from '@/components/products/new/data'

/** ترجیح «دیالوگ نوع محصول در ورود پرسیده شود یا نه» */
const ASK_TYPE_KEY = 'vitrina-product-type-ask'

/**
 * NewProduct — صفحه «محصول جدید»
 * Template: Two Columns Right Center (نویگیشن مرحله‌ای راست + فرم مرکز max 960)
 * Route: /products/new
 *
 * سه تب: اطلاعات محصول / گالری / تنوع‌ها (Accordion + ماتریس ترکیب‌ها) — UI + state محلی.
 */
export function NewProduct({ isEdit = false }: { isEdit?: boolean } = {}) {
  const router = useRouter()
  const isCompact = useCompactMode()

  const [activeStep, setActiveStep] = useState<StepId>('basic')
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM)

  /**
   * دیالوگ نوع محصول.
   *
   * قاعده‌ای که مالک محصول خواست:
   *  • «محصول جدید» + کاربر قبلاً تیک «دیگر نپرس» را نزده → در ورود باز می‌شود.
   *  • «محصول جدید» + تیک زده → باز نمی‌شود؛ نوع پیش‌فرض می‌ماند و کاربر هر وقت
   *    خواست از سوییچ بالای فرم بازش می‌کند (همان‌جا هم می‌تواند تیک را بردارد).
   *  • «ویرایش محصول» → هرگز در ورود باز نمی‌شود، چون نوع قبلاً تعیین شده است.
   * ترجیح در `localStorage` می‌ماند تا بین نشست‌ها پایدار باشد.
   */
  const [askOnEnter, setAskOnEnter] = useState(true)
  const [typeChosen, setTypeChosen] = useState(false)
  const [typeDialogOpen, setTypeDialogOpen] = useState(false)

  useEffect(() => {
    let remembered = true
    try { remembered = localStorage.getItem(ASK_TYPE_KEY) !== 'never' } catch { /* حالت خصوصی */ }
    setAskOnEnter(remembered)
    if (isEdit) return
    if (remembered) setTypeDialogOpen(true)
    else setTypeChosen(true)
  }, [isEdit])

  const changeAskOnEnter = (v: boolean) => {
    setAskOnEnter(v)
    try { localStorage.setItem(ASK_TYPE_KEY, v ? 'always' : 'never') } catch { /* حالت خصوصی */ }
  }

  const patch = (p: Partial<ProductForm>) => setForm((prev) => ({ ...prev, ...p }))

  // محصول ساده مرحلهٔ «تنوع ها» ندارد
  const isVaried = form.productType === 'varied'
  // مرحلهٔ مدل‌ها همیشه در استپر هست؛ در حالت ساده خودش بنر توضیح نشان می‌دهد —
  // همان رفتار طرح. پنهان‌کردن مرحله باعث می‌شد کاربر نفهمد چه چیزی را از دست می‌دهد.
  const steps = STEPS

  const chooseType = (productType: ProductTypeId) => {
    setForm((prev) => ({
      ...prev,
      productType,
      // برگشت به ساده یعنی تنوع‌ها و ترکیب‌ها دیگر معنا ندارند
      ...(productType === 'simple'
        ? { hasVariants: false, variants: [], combinations: [] }
        : {}),
    }))
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
    models: isVaried && form.combinations.length > 0 ? form.combinations.length : 'complete',
    seo: seoScore(form) === 100 ? 'complete' : 'pending',
  }

  // انتشار فقط وقتی اطلاعات اجباری هر سه تب کامل باشد
  const canPublish = infoComplete && galleryComplete && warehouseComplete && variantsComplete

  const goBack = () => router.push('/products/list')

  /**
   * ذخیره/انتشار — اول اعتبارسنجی.
   *
   * خطاها به‌جای یک پیامِ کلی، فهرستی از کنش‌ها می‌شوند: هر مورد کاربر را به همان
   * مرحله و همان فیلد می‌برد و دو ثانیه رویش تأکید می‌کند. بدون این، کاربر باید
   * شش مرحله را دستی بگردد تا بفهمد کدام فیلد مقصر است.
   */
  const [issues, setIssues] = useState<FieldIssue[]>([])
  const [showIssues, setShowIssues] = useState(false)

  const goToIssue = (issue: FieldIssue) => {
    setActiveStep(issue.step)
    focusField(issue.field)
  }

  const save = () => {
    const found = validateProduct(form)
    setIssues(found)
    setShowIssues(found.length > 0)
    if (found.length > 0) return
    // TODO: persist (این پاس UI-only)
  }

  // فهرست باز، با رفعِ خطاها خودش کوچک و در پایان بسته می‌شود — نه اینکه کهنه بماند
  useEffect(() => {
    if (!showIssues) return
    const fresh = validateProduct(form)
    setIssues(fresh)
    if (fresh.length === 0) setShowIssues(false)
  }, [form, showIssues])

  return (
    <ProductCategoryProvider category={form.category}>
    <Flex direction="column" gap="4" w="full">

      {/* ─── نوار ابزار — در طرح یک کارت مستقل است، نه سرتیتر لخت ─────────────── */}
      <Box
        bg="bg.panel"
        borderWidth="1px"
        borderColor="border"
        rounded="2xl"
        px={isCompact ? '4' : { base: '4', sm: '6' }}
        py={isCompact ? '3' : '4'}
        w="full"
      >
      <Header
        title="محصول جدید"
        breadcrumbs={[
          { label: 'داشبورد', href: '/' },
          { label: 'لیست محصولات', href: '/products/list' },
          { label: 'محصول جدید' },
        ]}
        cta={
          /* FIRST = rightmost: سوییچ نوع محصول · LAST = leftmost: انتشار */
          <Flex align="center" gap="2" wrap="wrap" justify="end" minW="0" maxW="full">
            {/* FIRST = rightmost: کنش‌های آیکنی · سپس سوییچ نوع · LAST: انتشار */}
            <Tooltip content="ذخیره تغییرات">
              <IconButton size="sm" variant="ghost" rounded="l2" aria-label="ذخیره تغییرات" onClick={save}>
                <Save size={17} />
              </IconButton>
            </Tooltip>
            <Tooltip content="نمایش صفحه محصول">
              <IconButton size="sm" variant="ghost" rounded="l2" aria-label="نمایش صفحه محصول">
                <Eye size={17} />
              </IconButton>
            </Tooltip>
            {/* کلیک روی سوییچ، دیالوگ را باز می‌کند — تغییر نوع بی‌صدا نیست */}
            <ProductTypeSwitch
              value={form.productType}
              onChange={() => setTypeDialogOpen(true)}
            />
            <HeaderCTA label="انتشار" icon={<Upload size={16} />} onClick={save} disabled={!canPublish} />
          </Flex>
        }
      />
      </Box>

      {/*
        ─── ناحیهٔ فرم ────────────────────────────────────────────────────────────
        اینجا عمداً **کادر و پس‌زمینه ندارد**. در پوستهٔ ادمین ویترینا یک بدنهٔ
        خاکستری داریم و کارت‌های سفید روی آن شناورند؛ یک کارت سفیدِ بزرگ که
        کارت‌های سفید دیگر را در خود بگیرد، همان تفکیک را از بین می‌برد (کارت روی
        کارت = بدون تضاد). پس استپر، پیش‌نمایش و کارت‌های فرم هر کدام مستقیم روی
        خاکستری می‌نشینند — مثل پروتوتایپ.
      */}
      <Box w="full">
        {/* StepNav افقی — موبایل/compact.
            **چسبان** است: در موبایل تنها راه پرش بین مراحل همین نوار است، و اگر
            با اسکرول از دید خارج شود کاربر باید تا بالای صفحه برگردد. کارت سفید
            + سایه تا وقتی روی محتوا می‌لغزد مرزش پیدا باشد. */}
        <Box
          display={isCompact ? 'block' : { base: 'block', lg: 'none' }}
          mb="4"
          position="sticky"
          top="2"
          zIndex="docked"
          bg="bg.panel"
          borderWidth="1px"
          borderColor="border"
          rounded="2xl"
          p="2"
          boxShadow="sm"
        >
          <StepNav
            orientation="horizontal"
            active={activeStep}
            onSelect={setActiveStep}
            statuses={statuses}
            steps={steps}
          />
        </Box>

        <Flex gap="4" align="start">

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
              <Flex direction="column" gap="4">
                {/* استپر خودش یک کارت سفید شناور است، نه بخشی از یک کادر بزرگ‌تر */}
                <Box bg="bg.panel" borderWidth="1px" borderColor="border" rounded="2xl" p="3" boxShadow="xs">
                  <StepNav
                    orientation="vertical"
                    active={activeStep}
                    onSelect={setActiveStep}
                    statuses={statuses}
                    steps={steps}
                  />
                </Box>
                {/* پیش‌نمایش زندهٔ محصول — زیر استپر، مثل طرح */}
                <ProductPreviewCard form={form} variant="rail" />
                {/* نشانگر ذخیرهٔ خودکار — زیر ریل، مثل طرح */}
                <SaveStatus watch={form} />
              </Flex>
            </Box>
          )}

          {/* SECOND: ستون Middle (مرکز) — max 960 */}
          {/* کلیدِ activeStep باعث می‌شود انیمیشن با هر تعویض مرحله دوباره اجرا شود.
              مدت کوتاه و فقط fade+slide کوچک — جابه‌جایی را روشن می‌کند بدون کند کردن کار.
              `prefers-reduced-motion` را خودِ Chakra در این توکن‌ها رعایت می‌کند. */}
          <Flex
            key={activeStep}
            direction="column"
            gap="4"
            maxW="960px"
            flex="1"
            minW="0"
            {...enterPanel}
          >
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
            {activeStep === 'models' && (
              <VariantsTab
                form={form}
                onChange={patch}
                onBack={goBack}
                onSave={save}
                onMakeVaried={() => chooseType('varied')}
                onLeave={() => setActiveStep('specs')}
              />
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

      {/* پیش‌نمایش موبایل — نوار فشردهٔ چسبیده به پایین، با ماکسیمایز */}
      <Box display={isCompact ? 'block' : { base: 'block', lg: 'none' }}>
        <ProductPreviewCard form={form} variant="dock" />
      </Box>

      {/* ═══ فهرست موارد ناقص ═══════════════════════════════════════════════════ */}
      {showIssues && (
        <ValidationToast
          issues={issues}
          onClose={() => setShowIssues(false)}
          onGoTo={goToIssue}
        />
      )}

      {/* ═══ دروازهٔ ورود: انتخاب نوع محصول ════════════════════════════════════ */}
      <ProductTypeDialog
        open={typeDialogOpen}
        value={form.productType}
        onConfirm={chooseType}
        onClose={typeChosen ? () => setTypeDialogOpen(false) : undefined}
        askOnEnter={askOnEnter}
        onAskOnEnterChange={changeAskOnEnter}
      />

    </Flex>
    </ProductCategoryProvider>
  )
}
