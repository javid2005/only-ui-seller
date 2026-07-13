// ─── Signup Store Categories — types + mock data ──────────────────────────
// دسته‌بندی‌های سطح‌فروشگاه (نه دسته‌بندی محصولات) — انتخاب می‌شه در مرحلهٔ ۲ signup.
// زیردسته‌ها فعلاً mock کوتاه‌ان — بعداً از API واقعی می‌آد.

import appliance from '@/assets/signup/categories/appliance.png'
import baby from '@/assets/signup/categories/baby.png'
import car from '@/assets/signup/categories/car.png'
import cosmetics from '@/assets/signup/categories/cosmetics.png'
import education from '@/assets/signup/categories/education.png'
import fabric from '@/assets/signup/categories/fabric.png'
import fashion from '@/assets/signup/categories/fashion.png'
import food from '@/assets/signup/categories/food.png'
import gift from '@/assets/signup/categories/gift.png'
import jewellery from '@/assets/signup/categories/jewellery.png'
import kitchen from '@/assets/signup/categories/kitchen.png'
import medicine from '@/assets/signup/categories/medicine.png'
import pets from '@/assets/signup/categories/pets.png'
import services from '@/assets/signup/categories/services.png'
import shoeBag from '@/assets/signup/categories/shoe-bag.png'
import sports from '@/assets/signup/categories/sports.png'
import tools from '@/assets/signup/categories/tools.png'
import travel from '@/assets/signup/categories/travel.png'
import type { StaticImageData } from 'next/image'

export interface SignupCategory {
  id: string
  name: string
  icon: StaticImageData
  subcategories: string[]
}

export const SIGNUP_CATEGORIES: SignupCategory[] = [
  { id: 'digital', name: 'کالای دیجیتال و لوازم الکترونیکی', icon: appliance, subcategories: ['موبایل و تبلت', 'لپ‌تاپ', 'لوازم جانبی دیجیتال'] },
  { id: 'fashion', name: 'مد و پوشاک', icon: fashion, subcategories: ['پوشاک مردانه', 'پوشاک زنانه', 'پوشاک بچگانه'] },
  { id: 'shoe-bag', name: 'کیف و کفش', icon: shoeBag, subcategories: ['کفش', 'کیف', 'کمربند'] },
  { id: 'jewellery', name: 'طلا و جواهرات', icon: jewellery, subcategories: ['طلا', 'نقره', 'جواهرات'] },
  { id: 'cosmetics', name: 'لوازم آرایشی، بهداشتی و مراقبتی', icon: cosmetics, subcategories: ['آرایشی', 'بهداشتی', 'مراقبت پوست و مو'] },
  { id: 'kitchen', name: 'خانه و آشپزخانه', icon: kitchen, subcategories: ['لوازم آشپزخانه', 'دکوراسیون', 'لوازم برقی خانگی'] },
  { id: 'food', name: 'مواد غذایی و خوراکی', icon: food, subcategories: ['خشکبار', 'خوراکی بسته‌بندی', 'محصولات ارگانیک'] },
  { id: 'sports', name: 'ورزش و تناسب اندام', icon: sports, subcategories: ['پوشاک ورزشی', 'تجهیزات بدنسازی', 'ورزش‌های بیرونی'] },
  { id: 'tools', name: 'ابزارآلات', icon: tools, subcategories: ['ابزار دستی', 'ابزار برقی', 'تجهیزات ایمنی'] },
  { id: 'education', name: 'محصولات فرهنگی، هنری و آموزشی', icon: education, subcategories: ['کتاب', 'لوازم‌التحریر', 'ابزار هنری'] },
  { id: 'baby', name: 'کودک و نوزاد', icon: baby, subcategories: ['پوشاک نوزاد', 'اسباب‌بازی', 'لوازم مراقبت کودک'] },
  { id: 'pets', name: 'حیوانات خانگی', icon: pets, subcategories: ['غذای حیوانات', 'اکسسوری', 'لوازم بهداشتی'] },
  { id: 'services', name: 'خدمات', icon: services, subcategories: ['خدمات نصب و تعمیر', 'خدمات آموزشی', 'خدمات مشاوره'] },
  { id: 'gift', name: 'هدایا و محصولات مناسبتی', icon: gift, subcategories: ['هدایای تبلیغاتی', 'کارت هدیه', 'بسته‌بندی مناسبتی'] },
  { id: 'travel', name: 'سفر', icon: travel, subcategories: ['ساک و چمدان', 'لوازم کمپینگ', 'اکسسوری سفر'] },
  { id: 'medicine', name: 'کالای پزشکی', icon: medicine, subcategories: ['تجهیزات پزشکی', 'مکمل و ویتامین', 'لوازم پرستاری'] },
  { id: 'car', name: 'خودرو و موتورسیکلت', icon: car, subcategories: ['لوازم یدکی', 'لوازم جانبی خودرو', 'روغن و مواد مصرفی'] },
  { id: 'fabric', name: 'خرازی، پارچه و لوازم خیاطی', icon: fabric, subcategories: ['پارچه', 'نخ و دکمه', 'ابزار خیاطی'] },
]
