'use client'

import { createContext, useContext, type ReactNode } from 'react'

// ─── ProductContext ─────────────────────────────────────────────────────────────
/**
 * دسته‌بندیِ جاریِ فرم، برای مصرف‌کننده‌های عمیقِ درخت.
 *
 * چرا context و نه prop: راهنمای هر بخش باید «مثالِ همین دسته‌بندی» را نشان دهد،
 * ولی `HelpDialog` سه لایه پایین‌تر از فرم رندر می‌شود (SectionCard → HelpDialog).
 * رد کردن `category` از یازده جای صدازننده، یازده جای فراموش‌شدنی می‌سازد؛ اینجا
 * یک provider هست و یک hook.
 */
const CategoryContext = createContext<string>('')

export function ProductCategoryProvider({
  category, children,
}: { category: string; children: ReactNode }) {
  return <CategoryContext.Provider value={category}>{children}</CategoryContext.Provider>
}

export function useProductCategory(): string {
  return useContext(CategoryContext)
}
