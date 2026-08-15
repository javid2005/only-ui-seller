'use client'

import { useMemo, useState } from 'react'
import {
  Alert, Box, Field, Flex, Grid, Input, RadioCard, SegmentGroup, Separator, Text,
} from '@chakra-ui/react'
import { EmptyState } from '@chakra-ui/react'
import { Percent, Snowflake } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { TitleBar } from '@/components/ui/TitleBar'
import { ButtonFooter } from '@/components/ui/ButtonFooter'
import { NumberField } from '@/components/ui/NumberField'
import { DatePicker } from '@/components/ui/DatePicker'
import { DiscountDomainAccordion, DiscountDomainListContent } from '@/components/marketing/promotions/DiscountDomainAccordion'
import type { DiscountDomainGroup } from '@/components/marketing/promotions/DiscountDomainAccordion'
import { DiscountProductPickerDialog } from '@/components/marketing/promotions/DiscountProductPickerDialog'
import { CAMPAIGN_PRODUCTS, type CampaignProduct } from '@/components/marketing/campaigns/data'
import { DiscountCategoryPickerDialog } from '@/components/marketing/promotions/DiscountCategoryPickerDialog'
import { buildCategoryGroups, groupsToCheckedValue } from '@/components/marketing/promotions/categories'
import { DiscountLocationPickerDialog } from '@/components/marketing/promotions/DiscountLocationPickerDialog'
import { buildLocationGroups, locationGroupsToCheckedValue } from '@/components/marketing/promotions/locations'
import { DiscountCustomerPickerDialog } from '@/components/marketing/promotions/DiscountCustomerPickerDialog'
import { MANUAL_CUSTOMERS, type ManualCustomer } from '@/components/orders/manual/manualOrderData'
import { toPersianDigits } from '@/utils/numbers'
import { useCompactMode } from '@/contexts/CompactModeContext'

type DiscountType = 'percentage' | 'fixed'
type CreationMode = 'auto' | 'manual'
type DomainScope = 'all' | 'specific'
type DomainKey = 'products' | 'categories' | 'customers' | 'locations' | 'cart'
interface DomainState { selected: boolean; open: boolean }

/** تعداد کل مقادیر یک دامنه برای بجِ هدر — `count` گروه (اگر باشد) بر items.length می‌چربد */
const countGroupItems = (groups: DiscountDomainGroup[]) =>
  groups.reduce((sum, g) => sum + (g.count ?? g.items.length), 0)
const hasGroupData = (groups: DiscountDomainGroup[]) => groups.some((g) => g.items.length > 0)

const DOMAIN_LABELS: Record<DomainKey, string> = {
  products: 'محصولات منتخب',
  categories: 'دسته بندی ها',
  customers: 'مشتری های منتخب',
  locations: 'موقعیت های جغرافیایی',
  cart: 'شرط سبد خرید',
}

// پیش‌فرض واقعی (بدون انتخاب) — الان موقتاً با mock seed جایگزین شده برای verify بصری،
// طبق تصمیم کاربر بعد از تأیید یا برمی‌گرده یا می‌مونه:
// const INITIAL_DOMAINS: Record<DomainKey, DomainState> = {
//   products: { selected: false, open: false }, categories: { selected: false, open: false },
//   customers: { selected: false, open: false }, locations: { selected: false, open: false },
//   cart: { selected: false, open: false },
// }

/**
 * صفحه «کد تخفیف جدید» — Figma «Discount / New Amount» (node 2676:37884، دسکتاپ) +
 * «Discount / New Percent» (node 2808:94093، بخش نوع/مقدار برای حالت درصدی) +
 * موبایل/ریسپانسیو (node 3033:65427). قالب One Column Center (مثل FreeShipping.tsx).
 *
 * نحوهٔ ایجاد کد (خودکار/دستی) — Figma local prototype (node 2659:84478) — طبق خواستهٔ
 * کاربر بدون استخراج به کامپوننت جدا، همینجا inline (تابع CreationModeSection پایین).
 *
 * RTL DOM order — همه از get_metadata (x فرزندها) محاسبه شده، نه از ترتیب خام کد Figma
 * (که LTR است): در این صفحه هر container یک بار geometry-check شد چون چند مورد برخلاف
 * انتظار اول از آب درآمدن (مثلاً «مقداری» راست‌تر از «درصدی» در هر دو حالت، «نحوهٔ ایجاد
 * کد» راست‌تر از فیلد «کد تخفیف»).
 *   - Type row      → مقداری(راست/FIRST) → درصدی(چپ)                    [نود 2676:37893]
 *   - Fixed row     → مبلغ تخفیف(راست/FIRST) → حداقل مبلغ سفارش(چپ)      [نود 2676:37896]
 *   - Percent row   → درصد تخفیف(راست/FIRST) → سقف مبلغ تخفیف(چپ)       [نود 2808:94105]
 *   - Creation row  → نحوهٔ ایجاد کد(راست/FIRST) → فیلد کد تخفیف(چپ)     [نود 2659:83926]
 *     — داخل segment: خودکار(راست/FIRST) → دستی(چپ)                    [نود 2659:83955]
 *   - Usage/date grid (2×2) → ستون دسکتاپ(sm+) با order swap چون grid دسکتاپ
 *     2-ستونیه ولی موبایل 1-ستونی؛ ترتیب DOM ثابت [حداکثر,تعداد,پایان,شروع]
 *     (مطابق کد خام هر دو فریم) و با order به‌ازای breakpoint اصلاح می‌شه:
 *       دسکتاپ (raright→left): تعداد → حداکثر → شروع → پایان   [نود 2676:37903]
 *       موبایل (top→bottom):   حداکثر → تعداد → پایان → شروع   [نود 3033:65449]
 *   - Scope segment → کل فروشگاه(راست/FIRST) → انتخاب دامنه اعمال(چپ)   [نود 2806:88433]
 *   - Footer → ButtonFooter لوکال (انصراف=راست، ذخیره=چپ) — عیناً مطابق [نود 2676:37950]
 *
 * دامنهٔ اعمال تخفیف — تب «انتخاب دامنه اعمال» (Figma «Discount / Domain Empty» node
 * 5171:80420 + «Discount / Domain Selected» node 5171:81668 + لوکال کامپوننت
 * «DiscountDomain-Accordion» node 5171:81109 → `DiscountDomainAccordion.tsx`):
 *   - چک‌باکس یک دامنهٔ دیالوگ‌دار (محصول/دسته‌بندی/مشتری/موقعیت) وقتی بدون‌دیتاست →
 *     به‌جای auto-open آکاردئونِ خالی، مستقیم دیالوگ انتخابش باز می‌شود (تصمیم کاربر
 *     1404/05/۱۰: «هیچ‌وقت دامنهٔ انتخاب‌شدهٔ بدون‌داده نداشته باشیم»؛ پیاده‌سازی:
 *     `handleToggleProducts/Categories/Customers/Locations` در پایین). `domains` عمداً تا
 *     لحظهٔ تاییدِ دیالوگ دست‌نخورده می‌ماند — اگر کاربر چیزی انتخاب نکرد/انصراف داد، هیچ
 *     چیزی تغییر نمی‌کند (نه چک‌باکس یک لحظه تیک می‌خورد نه آکاردئون باز می‌شود).
 *   - چک‌باکس دامنهٔ دارای‌دیتا (چه انتخاب‌شده چه قبلاً deselect‌شده) → toggle سادهٔ
 *     `selected`/`open`؛ خودِ دیتا (`productGroups`/...) هرگز با این toggle پاک نمی‌شود —
 *     deselect فقط پنهانش می‌کند، reselect دوباره نشانش می‌دهد.
 *   - تاییدِ هر دیالوگ با ۰ آیتم (چه اولین انتخاب چه ویرایش بعدیِ یک دامنهٔ پرداده) دامنه را
 *     صریحاً unselected/بسته می‌کند (`handleConfirm*`) — همان قانون از مسیر معکوس هم برقرار می‌ماند.
 *   - بدون داده (و بسته) → دامنه اصلاً selected نیست، دیده نمی‌شود · با داده → بج تعداد + chevron
 *   - chevron همیشه در open نمایش داده می‌شود (تأیید کاربر — طرح خودِ حالت open+بدون‌داده
 *     هم chevron-up نشون می‌داد، برخلاف توضیح اولیهٔ «فقط دامنهٔ دارای‌داده»)
 *   - «شرط سبد خرید» تنها دامنهٔ استثناست: دیالوگ ندارد (به‌جای EmptyState+چیپ، مستقیم
 *     NumberField «حداقل تعداد اقلام سبد خرید» — عیناً طبق طرح node 5171:81702)، پس
 *     چک‌باکسش همیشه toggle سادهٔ `toggleDomainSelected('cart')` می‌ماند.
 *   - دکمهٔ دامنهٔ «موقعیت جغرافیایی» در طرح Selected (node 5171:81701) به‌اشتباه/کپی‌پیست
 *     برچسب «افزودن محصول» داشت؛ به‌جاش «افزودن موقعیت» گذاشته شد. بعداً (تصمیم کاربر)
 *     همهٔ ۴ دکمهٔ دامنه از «افزودن …» به «انتخاب …» تغییر کردن. عنوان accordion و عنوان
 *     دیالوگ عمداً یکی نیستن — accordion (`DOMAIN_LABELS`) اسم کامل دامنه‌ست («محصولات
 *     منتخب»)، دیالوگ کوتاه‌تره («محصولات») — طبق تصمیم بعدی کاربر.
 *
 * RTL DOM order آکاردئون دامنه (از get_metadata، x نزولی — جزئیات در DiscountDomainAccordion.tsx):
 *   header → [titleGroup(چک‌باکس+عنوان، راست) , statusGroup(بج+chevron، چپ)]
 *   titleGroup → [Checkbox(راست‌ترین) , عنوان]   statusGroup → [Badge(راست‌تر) , Chevron(چپ‌ترین)]
 *
 * نوع «درصدی»: فیلدهای «سقف مبلغ تخفیف» و «درصد تخفیف» طبق Figma هر دو required هستن
 * (برخلاف DiscountSettingsDialog.tsx که فقط مقدار تخفیف required بود، سقف اختیاری) —
 * این صفحه spec خودش رو داره، عیناً پیاده شد نه از الگوی دیالوگ کپی.
 */
export function DiscountCodeNew() {
  const router = useRouter()
  const isCompact = useCompactMode()

  const [discountType, setDiscountType] = useState<DiscountType>('fixed')
  const [creationMode, setCreationMode] = useState<CreationMode>('auto')
  const [manualCode, setManualCode] = useState('')

  const [percentValue, setPercentValue] = useState('')
  const [capAmount, setCapAmount] = useState('')
  const [amountValue, setAmountValue] = useState('')
  const [minOrderAmount, setMinOrderAmount] = useState('')

  const [maxUsePerUser, setMaxUsePerUser] = useState('')
  const [totalUseLimit, setTotalUseLimit] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // ⚠️ TEMP mock seed برای verify بصری با فریم Figma «Desktop / Selected» — بعد از تأیید
  // کاربر یا به حالت خالی برمی‌گرده (پیش‌فرض واقعی «کد تخفیف جدید») یا می‌مونه، بسته به نظرش.
  const [domainScope, setDomainScope] = useState<DomainScope>('specific')
  const [domains, setDomains] = useState<Record<DomainKey, DomainState>>({
    products: { selected: true, open: true },
    categories: { selected: true, open: true },
    customers: { selected: true, open: true },
    locations: { selected: true, open: true },
    cart: { selected: true, open: true },
  })
  const [productGroups, setProductGroups] = useState<DiscountDomainGroup[]>([
    { id: 'selected', title: 'انتخاب شده', items: ['هواوی پیکس ۷۰ پرو', 'گلکسی S24 اولترا', 'آیفون ۱۵ پرو مکس', 'شیائومی ۱۴ پرو'] },
  ])
  // آی‌دی و نام‌ها از catalog واقعی signupCategoriesData.ts (همون منبعِ categories.ts) —
  // تا pre-check دوبارهٔ دیالوگ (groupsToCheckedValue) بدون افتادن آیتم انجام بشه.
  const [categoryGroups, setCategoryGroups] = useState<DiscountDomainGroup[]>([
    { id: 'digital', title: 'کالای دیجیتال و لوازم الکترونیکی', items: ['موبایل و تبلت', 'لپ‌تاپ'] },
    { id: 'shoe-bag', title: 'کیف و کفش', items: ['همه زیر دسته ها'] },
    { id: 'jewellery', title: 'طلا و جواهرات', items: ['طلا', 'نقره'] },
  ])
  const [customerGroups, setCustomerGroups] = useState<DiscountDomainGroup[]>([
    { id: 'selected', title: 'انتخاب شده', items: ['مینا رضایی', 'علی اکبری', 'سارا حسینی', 'آرش نیکو', 'کامران امینی'] },
  ])
  const [locationGroups, setLocationGroups] = useState<DiscountDomainGroup[]>([
    { id: 'tehran', title: 'استان تهران', items: ['تهران', 'اسلامشهر', 'ری'] },
    // «همه شهرها» یک چیپ است ولی ۶ شهر استان فارس را نمایندگی می‌کند → بج کل «۹ شهر» (طبق طرح)
    { id: 'fars', title: 'استان فارس', items: ['همه شهرها'], count: 6 },
  ])
  const [minCartItems, setMinCartItems] = useState('3')

  const [productDialogOpen, setProductDialogOpen] = useState(false)
  // چیپ‌های دامنهٔ محصولات فقط نام محصول را نگه می‌دارند (مثل بقیهٔ دامنه‌ها) — برای
  // pre-check دوبارهٔ دیالوگ، نام‌ها را به id واقعی محصول در catalog مپ می‌کنیم.
  const selectedProductIds = useMemo(
    () =>
      productGroups
        .flatMap((g) => g.items)
        .map((name) => CAMPAIGN_PRODUCTS.find((p) => p.name === name)?.id)
        .filter((id): id is string => Boolean(id)),
    [productGroups],
  )
  const handleConfirmProducts = (products: CampaignProduct[]) => {
    const hasItems = products.length > 0
    setProductGroups(hasItems ? [{ id: 'selected', title: 'انتخاب شده', items: products.map((p) => p.name) }] : [])
    // تایید با ۰ آیتم (چه اولین انتخاب چه ویرایش بعدی) = دامنه دوباره unselected/بسته می‌شود —
    // هیچ‌وقت نباید «انتخاب‌شده بدون داده» بمانیم.
    setDomains((prev) => ({ ...prev, products: { selected: hasItems, open: hasItems } }))
    setProductDialogOpen(false)
  }

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const selectedCategoryCheckedValue = useMemo(() => groupsToCheckedValue(categoryGroups), [categoryGroups])
  const handleConfirmCategories = (checkedValue: string[]) => {
    const groups = buildCategoryGroups(checkedValue)
    const hasItems = groups.length > 0
    setCategoryGroups(groups)
    setDomains((prev) => ({ ...prev, categories: { selected: hasItems, open: hasItems } }))
    setCategoryDialogOpen(false)
  }

  const [locationDialogOpen, setLocationDialogOpen] = useState(false)
  const selectedLocationCheckedValue = useMemo(() => locationGroupsToCheckedValue(locationGroups), [locationGroups])
  const handleConfirmLocations = (checkedValue: string[]) => {
    const groups = buildLocationGroups(checkedValue)
    const hasItems = groups.length > 0
    setLocationGroups(groups)
    setDomains((prev) => ({ ...prev, locations: { selected: hasItems, open: hasItems } }))
    setLocationDialogOpen(false)
  }

  const [customerDialogOpen, setCustomerDialogOpen] = useState(false)
  // چیپ‌های دامنهٔ مشتریان فقط نام را نگه می‌دارند (مثل محصولات) — برای pre-check دوبارهٔ
  // دیالوگ، نام‌ها را به id واقعی مشتری در catalog مپ می‌کنیم.
  const selectedCustomerIds = useMemo(
    () =>
      customerGroups
        .flatMap((g) => g.items)
        .map((name) => MANUAL_CUSTOMERS.find((c) => c.name === name)?.id)
        .filter((id): id is string => Boolean(id)),
    [customerGroups],
  )
  const handleConfirmCustomers = (customers: ManualCustomer[]) => {
    const hasItems = customers.length > 0
    setCustomerGroups(hasItems ? [{ id: 'selected', title: 'انتخاب شده', items: customers.map((c) => c.name) }] : [])
    setDomains((prev) => ({ ...prev, customers: { selected: hasItems, open: hasItems } }))
    setCustomerDialogOpen(false)
  }

  const toggleDomainSelected = (key: DomainKey) => {
    setDomains((prev) => {
      const nextSelected = !prev[key].selected
      return { ...prev, [key]: { selected: nextSelected, open: nextSelected } }
    })
  }
  const toggleDomainOpen = (key: DomainKey) => {
    setDomains((prev) => ({ ...prev, [key]: { ...prev[key], open: !prev[key].open } }))
  }

  // چک‌باکس یک دامنهٔ دیالوگ‌دار (محصول/دسته‌بندی/مشتری/موقعیت) که هنوز انتخاب نشده و
  // داده‌ای هم ندارد → به‌جای باز کردن آکاردئون خالی، مستقیم دیالوگ انتخاب باز می‌شود؛
  // `domains` عمداً دست‌نخورده می‌ماند تا تاییدِ دیالوگ (handleConfirm*) — اگر کاربر چیزی
  // انتخاب نکرد/انصراف داد، دامنه دقیقاً همان unselected باقی می‌ماند (نه یک لحظه چک‌شده و
  // برگشته). دامنهٔ دارای‌داده (چه انتخاب‌شده چه قبلاً deselect‌شده با دیتای نگه‌داشته‌شده)
  // toggle معمولی می‌گیرد — دیتا با deselect پاک نمی‌شود، این تابع اصلاً آن را لمس نمی‌کند.
  const handleToggleProducts = () =>
    !domains.products.selected && !hasGroupData(productGroups) ? setProductDialogOpen(true) : toggleDomainSelected('products')
  const handleToggleCategories = () =>
    !domains.categories.selected && !hasGroupData(categoryGroups) ? setCategoryDialogOpen(true) : toggleDomainSelected('categories')
  const handleToggleCustomers = () =>
    !domains.customers.selected && !hasGroupData(customerGroups) ? setCustomerDialogOpen(true) : toggleDomainSelected('customers')
  const handleToggleLocations = () =>
    !domains.locations.selected && !hasGroupData(locationGroups) ? setLocationDialogOpen(true) : toggleDomainSelected('locations')

  // حذف یک چیپ → اگر گروه خالی شد خودِ گروه هم می‌رود (عنوانِ بی‌چیپ بی‌معناست). حذف مستقیم
  // (نه فقط از مسیر دیالوگ) هم می‌تواند دامنه را کاملاً خالی کند — پس همینجا هم همان قانون
  // «هیچ‌وقت انتخاب‌شدهٔ بدون‌داده» را با unselect/بستن خودکار دامنه برقرار نگه می‌داریم.
  // groups باید همیشه مقدار جاری‌ترین رندر باشد (از closure کامپوننت، نه prev داخل setState)
  // چون setDomains جدا و بیرون از updater صدا زده می‌شود.
  const makeRemoveItem =
    (key: DomainKey, groups: DiscountDomainGroup[], setter: React.Dispatch<React.SetStateAction<DiscountDomainGroup[]>>) =>
    (groupId: string, item: string) => {
      const next = groups
        .map((g) => (g.id === groupId ? { ...g, items: g.items.filter((i) => i !== item) } : g))
        .filter((g) => g.items.length > 0)
      setter(next)
      if (next.length === 0) setDomains((prev) => ({ ...prev, [key]: { selected: false, open: false } }))
    }
  const makeRemoveGroup =
    (key: DomainKey, groups: DiscountDomainGroup[], setter: React.Dispatch<React.SetStateAction<DiscountDomainGroup[]>>) =>
    (groupId: string) => {
      const next = groups.filter((g) => g.id !== groupId)
      setter(next)
      if (next.length === 0) setDomains((prev) => ({ ...prev, [key]: { selected: false, open: false } }))
    }

  const rowDirection = isCompact ? 'column' : { base: 'column', sm: 'row' }

  return (
    <Flex direction="column" gap="4" alignItems="end" w="full">
      <Header
        title="کد تخفیف جدید"
        breadcrumbs={[
          { label: 'داشبورد', href: '/' },
          { label: 'کدهای تخفیف', href: '/promotions/codes' },
          { label: 'کد تخفیف جدید' },
        ]}
      />

      <Box
        bg="bg.panel" borderWidth="1px" borderColor="border" rounded="2xl"
        p={isCompact ? '4' : { base: '4', sm: '6' }} w="full"
      >
        <Flex direction="column" gap="10" alignItems="end" maxW="960px" w="full" mx="auto">

          {/* ── Section 1 — نوع و مقدار تخفیف ───────────────────────────── */}
          <Flex direction="column" gap="4" alignItems="end" w="full">
            <TitleBar title="نوع و مقدار تخفیف" divider />

            {/* مقداری(راست/FIRST) → درصدی(چپ) — geometry: 2676:37893 */}
            <RadioCard.Root
              value={discountType}
              onValueChange={(e) => setDiscountType((e.value ?? 'fixed') as DiscountType)}
              w="full"
            >
              <Flex gap="4" w="full" direction="row">
                <DiscountTypeCard value="fixed" title="مقداری" description="مبلغ ثابتی از سفارش کسر می‌شود" />
                <DiscountTypeCard value="percentage" title="درصدی" description="درصدی از مبلغ سفارش کسر می‌شود" />
              </Flex>
            </RadioCard.Root>

            {discountType === 'fixed' ? (
              /* مبلغ تخفیف(راست/FIRST) → حداقل مبلغ سفارش(چپ) — geometry: 2676:37896 */
              <Flex gap="4" w="full" direction={rowDirection}>
                <Field.Root flex="1" minW="0" required>
                  <Field.Label fontSize="sm" fontWeight="semibold" color="fg">
                    مبلغ تخفیف<Field.RequiredIndicator />
                  </Field.Label>
                  <NumberField
                    value={amountValue}
                    onChange={setAmountValue}
                    placeholder="مثال: ۵۰٬۰۰۰"
                    endElement={<Text fontSize="sm" color="fg.muted" px="2">تومان</Text>}
                  />
                </Field.Root>
                <Field.Root flex="1" minW="0">
                  <Field.Label fontSize="sm" fontWeight="semibold" color="fg">حداقل مبلغ سفارش</Field.Label>
                  <NumberField
                    value={minOrderAmount}
                    onChange={setMinOrderAmount}
                    placeholder="مثال: ۱۰۰٬۰۰۰"
                    endElement={<Text fontSize="sm" color="fg.muted" px="2">تومان</Text>}
                  />
                </Field.Root>
              </Flex>
            ) : (
              <Flex direction="column" gap="4" w="full">
                {/* درصد تخفیف(راست/FIRST) → سقف مبلغ تخفیف(چپ) — geometry: 2808:94105 */}
                <Flex gap="4" w="full" direction={rowDirection}>
                  <Field.Root flex="1" minW="0" required>
                    <Field.Label fontSize="sm" fontWeight="semibold" color="fg">
                      درصد تخفیف<Field.RequiredIndicator />
                    </Field.Label>
                    <NumberField
                      value={percentValue}
                      onChange={setPercentValue}
                      placeholder="مثال: ۱۵"
                      max={100}
                      endElement={<Percent size={16} />}
                    />
                    <Field.HelperText>پیشنهاد پلتفرم: بین ۱۰ تا ۲۰ درصد</Field.HelperText>
                  </Field.Root>
                  <Field.Root flex="1" minW="0" required>
                    <Field.Label fontSize="sm" fontWeight="semibold" color="fg">
                      سقف مبلغ تخفیف<Field.RequiredIndicator />
                    </Field.Label>
                    <NumberField
                      value={capAmount}
                      onChange={setCapAmount}
                      placeholder="مثال: ۲۰۰٬۰۰۰"
                      endElement={<Text fontSize="sm" color="fg.muted" px="2">تومان</Text>}
                    />
                  </Field.Root>
                </Flex>

                {/* حداقل مبلغ سفارش — تک‌فیلد، راست‌چین: justify="start"=راست در RTL
                    (قبلاً end بود → به چپ می‌افتاد؛ همان باگِ فیلد سبد خرید) */}
                <Flex justify="start" w="full">
                  <Field.Root maxW={{ base: 'full', sm: '472px' }} w="full">
                    <Field.Label fontSize="sm" fontWeight="semibold" color="fg">حداقل مبلغ سفارش</Field.Label>
                    <NumberField
                      value={minOrderAmount}
                      onChange={setMinOrderAmount}
                      placeholder="مثال: ۱۰۰٬۰۰۰"
                      endElement={<Text fontSize="sm" color="fg.muted" px="2">تومان</Text>}
                    />
                  </Field.Root>
                </Flex>
              </Flex>
            )}
          </Flex>

          {/* ── Section 2 — تنظیمات عمومی ───────────────────────────────── */}
          <Flex direction="column" gap="4" alignItems="end" w="full">
            <TitleBar title="تنظیمات عمومی" divider />

            <CreationModeSection
              mode={creationMode}
              onModeChange={setCreationMode}
              manualCode={manualCode}
              onManualCodeChange={setManualCode}
              rowDirection={rowDirection}
            />

            {/* دسکتاپ (راست→چپ): تعداد کل استفاده → حداکثر استفاده → تاریخ شروع → تاریخ پایان
                موبایل (بالا→پایین): حداکثر استفاده → تعداد کل استفاده → تاریخ پایان → تاریخ شروع
                DOM ثابت مطابق کد خام Figma؛ ترتیبِ دیداری با order اصلاح می‌شه — geometry: 2676:37903 */}
            <Grid
              templateColumns={isCompact ? '1fr' : { base: '1fr', sm: 'repeat(2, 1fr)' }}
              gap="4" w="full"
            >
              <Field.Root order={isCompact ? 0 : { base: 0, sm: 1 }}>
                <Field.Label fontSize="sm" fontWeight="semibold" color="fg">حداکثر استفاده هر کاربر</Field.Label>
                <NumberField value={maxUsePerUser} onChange={setMaxUsePerUser} placeholder="مثال: ۱" showSteppers />
                <Field.HelperText>خالی = نامحدود</Field.HelperText>
              </Field.Root>

              <Field.Root order={isCompact ? 1 : { base: 1, sm: 0 }}>
                <Field.Label fontSize="sm" fontWeight="semibold" color="fg">تعداد کل استفاده</Field.Label>
                <NumberField value={totalUseLimit} onChange={setTotalUseLimit} placeholder="مثال: ۱۰۰" showSteppers />
                <Field.HelperText>خالی = نامحدود</Field.HelperText>
              </Field.Root>

              <Field.Root order={isCompact ? 2 : { base: 2, sm: 3 }}>
                <Field.Label fontSize="sm" fontWeight="semibold" color="fg">تاریخ پایان</Field.Label>
                <DatePicker value={endDate} onChange={setEndDate} placeholder="تاریخ پایان" />
              </Field.Root>

              <Field.Root order={isCompact ? 3 : { base: 3, sm: 2 }}>
                <Field.Label fontSize="sm" fontWeight="semibold" color="fg">تاریخ شروع</Field.Label>
                <DatePicker value={startDate} onChange={setStartDate} placeholder="تاریخ شروع" />
              </Field.Root>
            </Grid>

            <Alert.Root status="info" variant="subtle" w="full">
              <Alert.Indicator />
              <Alert.Content>
                <Text fontSize="xs">
                  اگر فقط <Text as="span" fontWeight="bold" textDecoration="underline">تاریخ شروع</Text> وارد شود،
                  تخفیف تا زمان غیرفعال شدن معتبر است. اگر فقط <Text as="span" fontWeight="bold" textDecoration="underline">تاریخ پایان</Text> وارد
                  شود، از همین لحظه تا آن تاریخ فعال خواهد بود.
                </Text>
              </Alert.Content>
            </Alert.Root>
          </Flex>

          {/* ── Section 3 — دامنه اعمال تخفیف ───────────────────────────── */}
          <Flex direction="column" gap="6" alignItems="end" w="full">
            <TitleBar title="دامنه اعمال تخفیف" divider />

            {/* کل فروشگاه(راست/FIRST) → انتخاب دامنه اعمال(چپ) — geometry: 2806:88433 */}
            <SegmentGroup.Root
              value={domainScope}
              onValueChange={(e) => setDomainScope((e.value ?? 'all') as DomainScope)}
              w="full"
              size="md"
            >
              <SegmentGroup.Indicator bg="bg.panel" />
              <SegmentGroup.Item value="all" flex="1" justifyContent="center">
                <SegmentGroup.ItemText>کل فروشگاه</SegmentGroup.ItemText>
                <SegmentGroup.ItemHiddenInput />
              </SegmentGroup.Item>
              <SegmentGroup.Item value="specific" flex="1" justifyContent="center">
                <SegmentGroup.ItemText>انتخاب دامنه اعمال</SegmentGroup.ItemText>
                <SegmentGroup.ItemHiddenInput />
              </SegmentGroup.Item>
            </SegmentGroup.Root>

            {domainScope === 'all' ? (
              <Box bg="bg.subtle" borderWidth="1px" borderColor="border.muted" rounded="lg" w="full">
                <EmptyState.Root size="sm" py="6" px="4">
                  <EmptyState.Content>
                    <EmptyState.Indicator><Snowflake size={32} /></EmptyState.Indicator>
                    <EmptyState.Title>کل فروشگاه</EmptyState.Title>
                    <EmptyState.Description>تخفیف برای همه محصولات اعمال می‌شود</EmptyState.Description>
                  </EmptyState.Content>
                </EmptyState.Root>
              </Box>
            ) : (
              <Flex direction="column" gap="4" alignItems="end" w="full">
                <Flex direction="column" gap="1" alignItems="end" w="full">
                  <Text fontSize="md" fontWeight="semibold" color="fg" textAlign="start" w="full">
                    انتخاب دامنه اعمال
                  </Text>
                  <Text fontSize="sm" color="fg.muted" textAlign="start" w="full">
                    جهت اعمال تخفیف دامنه مورد نظر را به همراه مقادیر دامنه انتخاب نمایید.
                  </Text>
                </Flex>
                <Separator w="full" />

                <DiscountDomainAccordion
                  title={DOMAIN_LABELS.products}
                  selected={domains.products.selected}
                  open={domains.products.open}
                  hasData={hasGroupData(productGroups)}
                  badgeText={`${toPersianDigits(countGroupItems(productGroups))} محصول`}
                  onToggleSelected={handleToggleProducts}
                  onToggleOpen={() => toggleDomainOpen('products')}
                >
                  <DiscountDomainListContent
                    groups={productGroups}
                    emptyText="تاکنون محصولی انتخاب نکرده‌اید."
                    addLabel="انتخاب محصول"
                    onRemoveItem={makeRemoveItem('products', productGroups, setProductGroups)}
                    onRemoveGroup={makeRemoveGroup('products', productGroups, setProductGroups)}
                    onAdd={() => setProductDialogOpen(true)}
                  />
                </DiscountDomainAccordion>

                {/* بج دسته‌بندی = تعداد دسته‌های والد (گروه‌ها)، نه تعداد زیرچیپ‌ها — طبق طرح «۳ دسته بندی» */}
                <DiscountDomainAccordion
                  title={DOMAIN_LABELS.categories}
                  selected={domains.categories.selected}
                  open={domains.categories.open}
                  hasData={hasGroupData(categoryGroups)}
                  badgeText={`${toPersianDigits(categoryGroups.length)} دسته بندی`}
                  onToggleSelected={handleToggleCategories}
                  onToggleOpen={() => toggleDomainOpen('categories')}
                >
                  <DiscountDomainListContent
                    groups={categoryGroups}
                    emptyText="تاکنون دسته‌بندی‌ای انتخاب نکرده‌اید."
                    addLabel="انتخاب دسته بندی"
                    onRemoveItem={makeRemoveItem('categories', categoryGroups, setCategoryGroups)}
                    onRemoveGroup={makeRemoveGroup('categories', categoryGroups, setCategoryGroups)}
                    onAdd={() => setCategoryDialogOpen(true)}
                  />
                </DiscountDomainAccordion>

                <DiscountDomainAccordion
                  title={DOMAIN_LABELS.customers}
                  selected={domains.customers.selected}
                  open={domains.customers.open}
                  hasData={hasGroupData(customerGroups)}
                  badgeText={`${toPersianDigits(countGroupItems(customerGroups))} مشتری`}
                  onToggleSelected={handleToggleCustomers}
                  onToggleOpen={() => toggleDomainOpen('customers')}
                >
                  <DiscountDomainListContent
                    groups={customerGroups}
                    emptyText="تاکنون مشتری‌ای انتخاب نکرده‌اید."
                    addLabel="انتخاب مشتری"
                    onRemoveItem={makeRemoveItem('customers', customerGroups, setCustomerGroups)}
                    onRemoveGroup={makeRemoveGroup('customers', customerGroups, setCustomerGroups)}
                    onAdd={() => setCustomerDialogOpen(true)}
                  />
                </DiscountDomainAccordion>

                <DiscountDomainAccordion
                  title={DOMAIN_LABELS.locations}
                  selected={domains.locations.selected}
                  open={domains.locations.open}
                  hasData={hasGroupData(locationGroups)}
                  badgeText={`${toPersianDigits(countGroupItems(locationGroups))} شهر`}
                  onToggleSelected={handleToggleLocations}
                  onToggleOpen={() => toggleDomainOpen('locations')}
                >
                  <DiscountDomainListContent
                    groups={locationGroups}
                    emptyText="تاکنون موقعیتی انتخاب نکرده‌اید."
                    addLabel="انتخاب موقعیت"
                    onRemoveItem={makeRemoveItem('locations', locationGroups, setLocationGroups)}
                    onRemoveGroup={makeRemoveGroup('locations', locationGroups, setLocationGroups)}
                    onAdd={() => setLocationDialogOpen(true)}
                  />
                </DiscountDomainAccordion>

                <DiscountDomainAccordion
                  title={DOMAIN_LABELS.cart}
                  selected={domains.cart.selected}
                  open={domains.cart.open}
                  hasData={minCartItems !== ''}
                  badgeText={`${toPersianDigits(minCartItems)} قلم`}
                  onToggleSelected={() => toggleDomainSelected('cart')}
                  onToggleOpen={() => toggleDomainOpen('cart')}
                >
                  {/* فیلد راست‌چین (justify="start"=راست در RTL) — قبلاً end بود و کل فیلد
                      به چپ می‌افتاد؛ با مقایسهٔ preview و طرح 1404/05/09 کشف شد */}
                  <Flex justify="start" w="full">
                    <Field.Root maxW={{ base: 'full', sm: '456px' }} w="full">
                      <Field.Label fontSize="sm" fontWeight="semibold" color="fg">حداقل تعداد اقلام سبد خرید</Field.Label>
                      <NumberField value={minCartItems} onChange={setMinCartItems} placeholder="مثال: ۳" showSteppers />
                      <Field.HelperText>تخفیف فقط زمانی اعمال می‌شود که سبد حداقل این تعداد کالا داشته باشد</Field.HelperText>
                    </Field.Root>
                  </Flex>
                </DiscountDomainAccordion>
              </Flex>
            )}
          </Flex>

          <ButtonFooter
            primary={{ label: 'ذخیره', onClick: () => {} }}
            back={{ label: 'انصراف', onClick: () => router.push('/promotions/codes'), hideIcon: true }}
          />
        </Flex>
      </Box>

      <DiscountProductPickerDialog
        open={productDialogOpen}
        onClose={() => setProductDialogOpen(false)}
        selectedProductIds={selectedProductIds}
        onConfirm={handleConfirmProducts}
      />

      <DiscountCategoryPickerDialog
        open={categoryDialogOpen}
        onClose={() => setCategoryDialogOpen(false)}
        checkedValue={selectedCategoryCheckedValue}
        onConfirm={handleConfirmCategories}
      />

      <DiscountLocationPickerDialog
        open={locationDialogOpen}
        onClose={() => setLocationDialogOpen(false)}
        checkedValue={selectedLocationCheckedValue}
        onConfirm={handleConfirmLocations}
      />

      <DiscountCustomerPickerDialog
        open={customerDialogOpen}
        onClose={() => setCustomerDialogOpen(false)}
        selectedCustomerIds={selectedCustomerIds}
        onConfirm={handleConfirmCustomers}
      />
    </Flex>
  )
}

/**
 * کارت انتخاب نوع تخفیف — Left-Radio-Card (Figma local, node 2676:37894/37895 و
 * 2808:94103/94104). Content FIRST=راست‌ترین، RadioMark(ItemIndicator) SECOND=چپ‌ترین —
 * الگوی عیناً مثل FreeShipping.tsx («طبق طرح Left-Radio-Card»)، نه CampaignTypeCard
 * (اون آیکون هم داشت و indicator رو آخر می‌ذاشت — این یکی آیکون نداره).
 */
function DiscountTypeCard({ value, title, description }: { value: DiscountType; title: string; description: string }) {
  return (
    <RadioCard.Item
      value={value}
      flex="1"
      rounded="lg"
      p="4"
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border"
      boxShadow="none"
      cursor="pointer"
      _checked={{ bg: 'brand.bg', borderColor: 'brand.focusRing' }}
    >
      <RadioCard.ItemHiddenInput />
      <RadioCard.ItemControl gap="4" p="0" border="none" bg="transparent" boxShadow="none" w="full" alignItems="start">
        <RadioCard.ItemContent gap="1" minW="0" alignItems="start" flex="1">
          <RadioCard.ItemText fontSize="sm" fontWeight="semibold" color="fg">{title}</RadioCard.ItemText>
          <Text fontSize="xs" color="fg.muted" textAlign="start" w="full">{description}</Text>
        </RadioCard.ItemContent>
        <RadioCard.ItemIndicator colorPalette="brand" flexShrink={0} />
      </RadioCard.ItemControl>
    </RadioCard.Item>
  )
}

/**
 * بخش «نحوهٔ ایجاد کد تخفیف» — Figma local prototype (node 2659:84478، خودکار/دستی) —
 * طبق خواستهٔ کاربر بدون کامپوننت جدا، همینجا inline.
 * نحوهٔ ایجاد(راست/FIRST) → فیلد کد تخفیف(چپ) — geometry: 2659:83926
 * داخل segment: خودکار(راست/FIRST) → دستی(چپ) — geometry: 2659:83955
 * زیر sm ستونی می‌شود (نحوهٔ ایجاد بالا → کد تخفیف پایین، طبق DOM order بالا — کاربر
 * تأیید کرد که زیر sm باید stack بشه، نسخهٔ اول همیشه-row اشتباه بود).
 * متن راهنما («کد باید یکتا باشد» / «کد خودکار تولید می‌شود») مال فیلد «کد تخفیف» است، نه
 * کل ردیف — قبلاً یک Text مشترک زیر هر دو فیلد بود که غلط بود؛ کاربر گزارش کرد و به
 * `Field.HelperText` داخل همان Field.Root منتقل شد (الگوی بقیهٔ فیلدهای این صفحه).
 */
function CreationModeSection({
  mode, onModeChange, manualCode, onManualCodeChange, rowDirection,
}: {
  mode: CreationMode
  onModeChange: (m: CreationMode) => void
  manualCode: string
  onManualCodeChange: (v: string) => void
  rowDirection: string | { base: string; sm: string }
}) {
  const isManual = mode === 'manual'
  return (
    <Flex gap="4" alignItems="start" w="full" direction={rowDirection as any}>
      <Field.Root flex="1" minW="0">
        <Field.Label fontSize="sm" fontWeight="semibold" color="fg">نحوه ایجاد کد تخفیف</Field.Label>
        <SegmentGroup.Root
          value={mode}
          onValueChange={(e) => onModeChange((e.value ?? 'auto') as CreationMode)}
          w="full"
        >
          <SegmentGroup.Indicator bg="bg.panel" />
          <SegmentGroup.Item value="auto" flex="1" justifyContent="center">
            <SegmentGroup.ItemText>خودکار</SegmentGroup.ItemText>
            <SegmentGroup.ItemHiddenInput />
          </SegmentGroup.Item>
          <SegmentGroup.Item value="manual" flex="1" justifyContent="center">
            <SegmentGroup.ItemText>دستی</SegmentGroup.ItemText>
            <SegmentGroup.ItemHiddenInput />
          </SegmentGroup.Item>
        </SegmentGroup.Root>
      </Field.Root>

      <Field.Root flex="1" minW="0" opacity={isManual ? 1 : 0.5}>
        <Field.Label fontSize="sm" fontWeight="semibold" color="fg">کد تخفیف</Field.Label>
        <Input
          value={isManual ? manualCode : ''}
          onChange={(e) => onManualCodeChange(e.target.value)}
          placeholder={isManual ? 'مثال: SUMMER20' : 'ایجاد کد بصورت خودکار'}
          textAlign="start"
          bg="bg.panel"
          disabled={!isManual}
        />
        <Field.HelperText>
          {isManual ? 'کد باید در سطح فروشگاه یکتا باشد' : 'کد به صورت خودکار توسط سیستم تولید می‌شود'}
        </Field.HelperText>
      </Field.Root>
    </Flex>
  )
}
