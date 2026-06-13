// Single source of truth برای جدول محصولات — اگه جای دیگه استفاده شد، فقط همین‌جا عوض می‌شه.
import { createListCollection } from '@chakra-ui/react'
import img1 from '@/assets/Products/Image-1.png'
import img2 from '@/assets/Products/Image-2.png'
import img3 from '@/assets/Products/Image-3.png'
import img4 from '@/assets/Products/Image-4.png'
import img5 from '@/assets/Products/Image-5.png'
import img6 from '@/assets/Products/Image-6.png'
import img7 from '@/assets/Products/Image-7.png'
import img8 from '@/assets/Products/Image-8.png'
import img9 from '@/assets/Products/Image-9.png'
import img10 from '@/assets/Products/Image-10.png'

export type Status = 'منتشرشده' | 'پیش‌نویس' | 'ناموجود' | 'در انتظار' | 'آرشیو شده'

export interface Product {
  id: string
  name: string
  sku: string
  image: string
  category: string
  features: string[]
  /** قیمت اصلی (نمایش‌داده‌شده) — رشته‌ی فارسی آماده */
  priceMain: string
  /** قیمت قبل از تخفیف (struck-through) */
  priceOriginal?: string
  /** درصد تخفیف — مثل «۱۰٪» */
  discount?: string
  currency: 'تومان' | '$'
  inventory: number
  status: Status
  lastEdit: string
}

export const STATUS_COLOR: Record<Status, string> = {
  'منتشرشده': 'green',
  'پیش‌نویس': 'gray',
  'ناموجود': 'red',
  'در انتظار': 'orange',
  'آرشیو شده': 'blue',
}

export const PRODUCTS: Product[] = [
  { id: 'p1',  name: 'پیراهن مردانه آکسفورد سرمه‌ای',  sku: 'SKU-10089', image: img1.src,  category: 'پوشاک',     features: ['ویژه', 'پرفروش'],               priceMain: '۴۵٬۰۰۰٬۰۰۰', priceOriginal: '۵۲٬۰۰۰٬۰۰۰', discount: '۱۳٪', currency: 'تومان', inventory: 25, status: 'منتشرشده',  lastEdit: '۱۴۰۴/۰۱/۲۰' },
  { id: 'p2',  name: 'هدفون بی‌سیم سونی WH-1000XM5',    sku: 'SKU-10090', image: img2.src,  category: 'الکترونیک', features: ['ارسال رایگان', 'ویژه', 'جدید'], priceMain: '$ ۱۸۰', currency: '$',     inventory: 0,  status: 'ناموجود',   lastEdit: '۱۴۰۴/۰۲/۱۵' },
  { id: 'p3',  name: 'کفش ورزشی نایک ایر مکس',          sku: 'SKU-10091', image: img3.src,  category: 'پوشاک',     features: ['پرفروش'],                       priceMain: '۳۲٬۰۰۰٬۰۰۰', priceOriginal: '۳۴٬۵۰۰٬۰۰۰', discount: '۷٪',  currency: 'تومان', inventory: 40, status: 'پیش‌نویس',  lastEdit: '۱۴۰۴/۰۳/۱۰' },
  { id: 'p4',  name: 'ساعت هوشمند اپل واچ سری ۹',       sku: 'SKU-10092', image: img4.src,  category: 'الکترونیک', features: ['ویژه', 'پرفروش'],               priceMain: '۲۸٬۰۰۰٬۰۰۰', currency: 'تومان', inventory: 17, status: 'پیش‌نویس',  lastEdit: '۱۴۰۴/۰۴/۰۵' },
  { id: 'p5',  name: 'دوربین کانن EOS R50',              sku: 'SKU-10093', image: img5.src,  category: 'الکترونیک', features: ['ارسال رایگان', 'ویژه', 'جدید'], priceMain: 'از $ ۱۲۰', priceOriginal: 'از ۱۷٬۵۰۰٬۰۰۰ ت', discount: '۱۵٪', currency: '$', inventory: 12, status: 'منتشرشده', lastEdit: '۱۴۰۴/۰۵/۲۵' },
  { id: 'p6',  name: 'بلوتوث اسپیکر جی‌بی‌ال چارج ۵',  sku: 'SKU-10094', image: img6.src,  category: 'الکترونیک', features: ['ارسال رایگان', 'پرفروش', 'جدید'], priceMain: '$ ۱۳۵', priceOriginal: '$ ۱۴۰', discount: '۳٪', currency: '$', inventory: 68, status: 'منتشرشده',  lastEdit: '۱۴۰۴/۰۶/۳۰' },
  { id: 'p7',  name: 'کوله‌پشتی لپ‌تاپ سامسونیت',       sku: 'SKU-10095', image: img7.src,  category: 'پوشاک',     features: ['ویژه', 'پرفروش'],               priceMain: '۸۹٬۰۰۰٬۰۰۰', priceOriginal: '۱۰۵٬۰۰۰٬۰۰۰', discount: '۲۰٪', currency: 'تومان', inventory: 15, status: 'منتشرشده', lastEdit: '۱۴۰۴/۰۷/۱۵' },
  { id: 'p8',  name: 'تلویزیون ال‌جی OLED evo C3',       sku: 'SKU-10096', image: img8.src,  category: 'الکترونیک', features: ['پرفروش'],                       priceMain: 'از ۳۸٬۰۰۰٬۰۰۰', currency: 'تومان', inventory: 0,  status: 'آرشیو شده', lastEdit: '۱۴۰۴/۰۸/۲۵' },
  { id: 'p9',  name: 'پنکه هوشمند دایسون پیوریفایر',    sku: 'SKU-10097', image: img9.src,  category: 'الکترونیک', features: ['ارسال رایگان', 'ویژه', 'جدید'], priceMain: '$ ۸۰',  priceOriginal: '$ ۹۵', discount: '۱۶٪', currency: '$', inventory: 6, status: 'در انتظار', lastEdit: '۱۴۰۴/۰۹/۱۰' },
  { id: 'p10', name: 'میز ایستاده برقی فلکسی‌اسپات E7',  sku: 'SKU-10098', image: img10.src, category: 'الکترونیک', features: ['ویژه', 'پرفروش'],               priceMain: '۳۵٬۰۰۰٬۰۰۰', currency: 'تومان', inventory: 14, status: 'منتشرشده', lastEdit: '۱۴۰۴/۱۰/۲۰' },
]

// ── Filter collections (single source — ProductList + FilterModal از همین می‌خونن) ──
export type FilterOption = { label: string; value: string }

export const catCollection = createListCollection<FilterOption>({
  items: [
    { label: 'همه دسته‌بندی‌ها', value: 'all' },
    { label: 'کالای دیجیتال و لوازم الکترونیکی', value: 'digital' },
    { label: 'مد و پوشاک', value: 'fashion' },
    { label: 'کیف و کفش', value: 'bags-shoes' },
    { label: 'طلا و جواهرات', value: 'jewelry' },
    { label: 'لوازم آرایشی، بهداشتی و مراقبتی', value: 'beauty' },
    { label: 'خانه و آشپزخانه', value: 'home' },
    { label: 'مواد غذایی و خوراکی', value: 'food' },
    { label: 'ورزش و تناسب اندام', value: 'sport' },
  ],
})

export const statusCollection = createListCollection<FilterOption>({
  items: [
    { label: 'همه وضعیت‌ها', value: 'all' },
    { label: 'منتشر شده', value: 'published' },
    { label: 'غیرفعال', value: 'inactive' },
    { label: 'پیش نویس', value: 'draft' },
    { label: 'آرشیو شده', value: 'archived' },
  ],
})

export const currencyCollection = createListCollection<FilterOption>({
  items: [
    { label: 'همه ارزها', value: 'all' },
    { label: 'تومان', value: 'toman' },
    { label: 'دلار', value: 'usd' },
  ],
})

export const sortCollection = createListCollection<FilterOption>({
  items: [
    { label: 'جدیدترین', value: 'newest' },
    { label: 'قدیمی ترین', value: 'oldest' },
    { label: 'ارزانترین', value: 'cheapest' },
    { label: 'گرانترین', value: 'expensive' },
    { label: 'کمترین موجودی', value: 'stock-asc' },
    { label: 'بیشترین موجودی', value: 'stock-desc' },
    { label: 'الفبا (الف تا ی)', value: 'az' },
    { label: 'الفبا (ی تا الف)', value: 'za' },
  ],
})

// ── منوی عملیات هر ردیف (ellipsis) ──
export interface RowAction {
  value: string
  label: string
  danger?: boolean
}

export const ROW_ACTIONS: RowAction[] = [
  { value: 'edit', label: 'ویرایش' },
  { value: 'copy', label: 'کپی محصول' },
  { value: 'preview', label: 'پیش نمایش' },
  { value: 'sale', label: 'فروش ویژه' },
  { value: 'archive', label: 'آرشیو' },
  { value: 'delete', label: 'حذف', danger: true },
]
