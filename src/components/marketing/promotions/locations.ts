import { createTreeCollection } from '@chakra-ui/react'
import type { DiscountDomainGroup } from './DiscountDomainAccordion'

export interface LocationNode {
  value: string
  label: string
  children?: LocationNode[]
}

/** دادهٔ نمونهٔ استان/شهر — ۱۰ استان با ۵-۶ شهر هرکدام (طبق تصمیم کاربر، نه دیتاست کامل کشور) */
export const LOCATIONS_ROOT: LocationNode = {
  value: 'root',
  label: '',
  children: [
    {
      value: 'tehran', label: 'تهران', children: [
        { value: 'tehran-tehran', label: 'تهران' },
        { value: 'tehran-eslamshahr', label: 'اسلامشهر' },
        { value: 'tehran-rey', label: 'ری' },
        { value: 'tehran-pakdasht', label: 'پاکدشت' },
        { value: 'tehran-varamin', label: 'ورامین' },
        { value: 'tehran-shahriar', label: 'شهریار' },
      ],
    },
    {
      value: 'isfahan', label: 'اصفهان', children: [
        { value: 'isfahan-isfahan', label: 'اصفهان' },
        { value: 'isfahan-kashan', label: 'کاشان' },
        { value: 'isfahan-najafabad', label: 'نجف‌آباد' },
        { value: 'isfahan-khomeinishahr', label: 'خمینی‌شهر' },
        { value: 'isfahan-shahinshahr', label: 'شاهین‌شهر' },
      ],
    },
    {
      value: 'fars', label: 'فارس', children: [
        { value: 'fars-shiraz', label: 'شیراز' },
        { value: 'fars-marvdasht', label: 'مرودشت' },
        { value: 'fars-jahrom', label: 'جهرم' },
        { value: 'fars-kazerun', label: 'کازرون' },
        { value: 'fars-lar', label: 'لار' },
      ],
    },
    {
      value: 'khorasan-razavi', label: 'خراسان رضوی', children: [
        { value: 'khorasan-razavi-mashhad', label: 'مشهد' },
        { value: 'khorasan-razavi-neyshabur', label: 'نیشابور' },
        { value: 'khorasan-razavi-sabzevar', label: 'سبزوار' },
        { value: 'khorasan-razavi-torbat-heydarieh', label: 'تربت حیدریه' },
        { value: 'khorasan-razavi-quchan', label: 'قوچان' },
      ],
    },
    {
      value: 'east-azerbaijan', label: 'آذربایجان شرقی', children: [
        { value: 'east-azerbaijan-tabriz', label: 'تبریز' },
        { value: 'east-azerbaijan-marand', label: 'مرند' },
        { value: 'east-azerbaijan-mianeh', label: 'میانه' },
        { value: 'east-azerbaijan-ahar', label: 'اهر' },
        { value: 'east-azerbaijan-bonab', label: 'بناب' },
      ],
    },
    {
      value: 'mazandaran', label: 'مازندران', children: [
        { value: 'mazandaran-sari', label: 'ساری' },
        { value: 'mazandaran-babol', label: 'بابل' },
        { value: 'mazandaran-amol', label: 'آمل' },
        { value: 'mazandaran-qaemshahr', label: 'قائم‌شهر' },
        { value: 'mazandaran-nowshahr', label: 'نوشهر' },
      ],
    },
    {
      value: 'gilan', label: 'گیلان', children: [
        { value: 'gilan-rasht', label: 'رشت' },
        { value: 'gilan-anzali', label: 'بندر انزلی' },
        { value: 'gilan-lahijan', label: 'لاهیجان' },
        { value: 'gilan-langarud', label: 'لنگرود' },
        { value: 'gilan-rudsar', label: 'رودسر' },
      ],
    },
    {
      value: 'kerman', label: 'کرمان', children: [
        { value: 'kerman-kerman', label: 'کرمان' },
        { value: 'kerman-sirjan', label: 'سیرجان' },
        { value: 'kerman-rafsanjan', label: 'رفسنجان' },
        { value: 'kerman-bam', label: 'بم' },
        { value: 'kerman-zarand', label: 'زرند' },
      ],
    },
    {
      value: 'khuzestan', label: 'خوزستان', children: [
        { value: 'khuzestan-ahvaz', label: 'اهواز' },
        { value: 'khuzestan-dezful', label: 'دزفول' },
        { value: 'khuzestan-abadan', label: 'آبادان' },
        { value: 'khuzestan-mahshahr', label: 'بندر ماهشهر' },
        { value: 'khuzestan-shushtar', label: 'شوشتر' },
      ],
    },
    {
      value: 'alborz', label: 'البرز', children: [
        { value: 'alborz-karaj', label: 'کرج' },
        { value: 'alborz-nazarabad', label: 'نظرآباد' },
        { value: 'alborz-eshtehard', label: 'اشتهارد' },
        { value: 'alborz-taleqan', label: 'طالقان' },
        { value: 'alborz-fardis', label: 'فردیس' },
      ],
    },
  ],
}

export const locationsCollection = createTreeCollection<LocationNode>({ rootNode: LOCATIONS_ROOT })

/** وضعیت چک‌شدگی یک استان بر اساس شهرهای چک‌شدهٔ زیرش — همون منطق داخلی TreeView (getDescendantValues) */
export function getProvinceCheckedState(
  provinceValue: string,
  checkedValue: string[],
): boolean | 'indeterminate' {
  const cityValues = locationsCollection.getDescendantValues(provinceValue)
  if (cityValues.length === 0) return false
  const allChecked = cityValues.every((v) => checkedValue.includes(v))
  if (allChecked) return true
  const someChecked = cityValues.some((v) => checkedValue.includes(v))
  return someChecked ? 'indeterminate' : false
}

/** رشتهٔ چیپِ ویژهٔ «استان کامل انتخاب‌شده» — عیناً قرارداد SelectedLocationsPanel.tsx */
export const ALL_CITIES_LABEL = 'همه شهرها'

/** checkedValue (idهای شهر) → DiscountDomainGroup[] برای آکاردئون دامنهٔ «موقعیت جغرافیایی»
 * (عیناً categories.ts:buildCategoryGroups). count صریح روی گروه wildcard ست می‌شود چون بجِ
 * این دامنه (برخلاف دسته‌بندی) از countGroupItems (مجموع count) نه groups.length ساخته می‌شود. */
export function buildLocationGroups(checkedValue: string[]): DiscountDomainGroup[] {
  const provinces = LOCATIONS_ROOT.children ?? []
  return provinces
    .map((province) => ({ province, state: getProvinceCheckedState(province.value, checkedValue) }))
    .filter(({ state }) => state !== false)
    .map(({ province, state }) => ({
      id: province.value,
      title: province.label,
      items:
        state === true
          ? [ALL_CITIES_LABEL]
          : (province.children ?? []).filter((c) => checkedValue.includes(c.value)).map((c) => c.label),
      count: state === true ? (province.children?.length ?? 0) : undefined,
    }))
}

/** جهت pre-check دوبارهٔ دیالوگ از روی DiscountDomainGroup[] فعلیِ صفحه (برعکسِ buildLocationGroups). */
export function locationGroupsToCheckedValue(groups: DiscountDomainGroup[]): string[] {
  const provinces = LOCATIONS_ROOT.children ?? []
  const result: string[] = []
  for (const group of groups) {
    const province = provinces.find((p) => p.value === group.id || p.label === group.title)
    if (!province) continue
    if (group.items.length === 1 && group.items[0] === ALL_CITIES_LABEL) {
      result.push(...(province.children ?? []).map((c) => c.value))
    } else {
      for (const label of group.items) {
        const city = (province.children ?? []).find((c) => c.label === label)
        if (city) result.push(city.value)
      }
    }
  }
  return result
}
