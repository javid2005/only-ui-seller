import { createTreeCollection } from '@chakra-ui/react'
import { SIGNUP_CATEGORIES } from '@/components/auth/signupCategoriesData'
import type { DiscountDomainGroup } from './DiscountDomainAccordion'

export interface CategoryNode {
  value: string
  label: string
  children?: CategoryNode[]
}

/**
 * درخت دسته/زیردسته برای TreeView دیالوگ «انتخاب دسته بندی» — از catalog واقعیِ دسته‌بندی‌های
 * فروشگاه (`signupCategoriesData.ts`، همان دیتای مرحلهٔ ۲ ثبت‌نام) ساخته می‌شود؛ دیتاست جدا
 * تکرار نشده (Local first) — همان منبعی که نام دسته‌های mock این صفحه از اول ازش گرفته شده بود.
 */
export const CATEGORIES_ROOT: CategoryNode = {
  value: 'root',
  label: '',
  children: SIGNUP_CATEGORIES.map((cat) => ({
    value: cat.id,
    label: cat.name,
    children: cat.subcategories.map((sub, i) => ({ value: `${cat.id}-${i}`, label: sub })),
  })),
}

export const categoriesCollection = createTreeCollection<CategoryNode>({ rootNode: CATEGORIES_ROOT })

/** وضعیت چک‌شدگی یک دستهٔ والد بر اساس زیردسته‌های چک‌شدهٔ زیرش — عیناً locations.ts:getProvinceCheckedState */
export function getCategoryCheckedState(categoryValue: string, checkedValue: string[]): boolean | 'indeterminate' {
  const subValues = categoriesCollection.getDescendantValues(categoryValue)
  if (subValues.length === 0) return false
  const allChecked = subValues.every((v) => checkedValue.includes(v))
  if (allChecked) return true
  const someChecked = subValues.some((v) => checkedValue.includes(v))
  return someChecked ? 'indeterminate' : false
}

/** رشتهٔ چیپِ ویژهٔ «دستهٔ کامل انتخاب‌شده» — عیناً قرارداد «همه شهرها»ی locations.ts */
export const ALL_SUBCATEGORIES_LABEL = 'همه زیر دسته ها'

/** checkedValue (idهای زیردسته) → DiscountDomainGroup[] برای آکاردئون دامنهٔ «دسته‌بندی». */
export function buildCategoryGroups(checkedValue: string[]): DiscountDomainGroup[] {
  const categories = CATEGORIES_ROOT.children ?? []
  return categories
    .map((category) => ({ category, state: getCategoryCheckedState(category.value, checkedValue) }))
    .filter(({ state }) => state !== false)
    .map(({ category, state }) => ({
      id: category.value,
      title: category.label,
      items:
        state === true
          ? [ALL_SUBCATEGORIES_LABEL]
          : (category.children ?? []).filter((s) => checkedValue.includes(s.value)).map((s) => s.label),
    }))
}

/** جهت pre-check دوبارهٔ دیالوگ از روی DiscountDomainGroup[] فعلیِ صفحه (برعکسِ buildCategoryGroups). */
export function groupsToCheckedValue(groups: DiscountDomainGroup[]): string[] {
  const categories = CATEGORIES_ROOT.children ?? []
  const result: string[] = []
  for (const group of groups) {
    const category = categories.find((c) => c.value === group.id || c.label === group.title)
    if (!category) continue
    if (group.items.length === 1 && group.items[0] === ALL_SUBCATEGORIES_LABEL) {
      result.push(...(category.children ?? []).map((s) => s.value))
    } else {
      for (const label of group.items) {
        const sub = (category.children ?? []).find((s) => s.label === label)
        if (sub) result.push(sub.value)
      }
    }
  }
  return result
}
