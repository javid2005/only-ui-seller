// ─── Product Categories — types + mock data ──────────────────────────────────
// منبع داده‌ی صفحه‌ی «مدیریت دسته‌بندی محصولات». فعلاً mock — بعداً از API.

export interface SubCategory {
  id: string
  name: string
}

export interface ProductCategory {
  id: string
  name: string
  /** آیکن دسته — emoji (placeholder تا آیکن واقعی) */
  icon: string
  subcategories: SubCategory[]
}

export interface CategorySection {
  id: string
  title: string
  categories: ProductCategory[]
}

let _sid = 0
const sub = (name: string): SubCategory => ({ id: `s${++_sid}`, name })

export const INITIAL_SECTIONS: CategorySection[] = [
  {
    id: 'digital',
    title: 'کالای دیجیتال و لوازم الکترونیکی',
    categories: [
      { id: 'c1', name: 'موبایل و تبلت', icon: '📱', subcategories: [] },
      { id: 'c2', name: 'لپ‌تاپ', icon: '💻', subcategories: [] },
      { id: 'c3', name: 'دوربین', icon: '📷', subcategories: [] },
      { id: 'c4', name: 'تجهیزات گیمینگ', icon: '🎮', subcategories: [] },
      {
        id: 'c5', name: 'قطعات کامپیوتر', icon: '🖥️',
        subcategories: ['مادربرد', 'پردازنده', 'کارت گرافیک', 'رم', 'هارد', 'پاور', 'کیس', 'خنک‌کننده'].map(sub),
      },
      { id: 'c6', name: 'ساعت هوشمند', icon: '⌚', subcategories: [] },
      {
        id: 'c7', name: 'ماشین‌های اداری', icon: '🖨️',
        subcategories: ['پرینتر', 'اسکنر', 'دستگاه کپی'].map(sub),
      },
      { id: 'c8', name: 'تجهیزات شبکه و ارتباطات', icon: '🌐', subcategories: [] },
      { id: 'c9', name: 'صوتی و تصویری', icon: '🎬', subcategories: [] },
      { id: 'c10', name: 'لوازم جانبی دیجیتال (هندزفری، شارژر، کارت حافظه...)', icon: '🎧', subcategories: [] },
    ],
  },
  {
    id: 'bag-shoe',
    title: 'کیف و کفش',
    categories: [
      {
        id: 'c11', name: 'کیف و کفش مردانه', icon: '👞',
        subcategories: ['کفش رسمی', 'کفش اسپرت', 'کیف چرم', 'کمربند'].map(sub),
      },
      { id: 'c12', name: 'کیف و کفش زنانه', icon: '👜', subcategories: [] },
      {
        id: 'c13', name: 'کیف و کفش بچگانه', icon: '🧸',
        subcategories: ['کفش بچگانه', 'کوله‌پشتی'].map(sub),
      },
    ],
  },
  {
    id: 'jewelry',
    title: 'طلا و جواهرات',
    categories: [
      {
        id: 'c14', name: 'طلا', icon: '🪙',
        subcategories: ['انگشتر', 'گردنبند', 'دستبند', 'گوشواره'].map(sub),
      },
      {
        id: 'c15', name: 'نقره', icon: '🥈',
        subcategories: ['انگشتر نقره', 'سرویس نقره'].map(sub),
      },
      { id: 'c16', name: 'جواهرات و سنگ‌های گران‌بها', icon: '💎', subcategories: [] },
    ],
  },
]
