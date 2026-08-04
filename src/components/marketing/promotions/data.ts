export interface PromotionData {
  id: string
  iconColor: 'orange' | 'red' | 'pink' | 'purple'
  category: string
  title: string
  description: string
  enabled: boolean
  actionLabel: string
  badges: string[]
}

export const PROMOTIONS: PromotionData[] = [
  {
    id: 'first-purchase',
    iconColor: 'orange',
    category: 'جذب مشتری جدید',
    title: 'تخفیف خرید اول',
    description: 'برای اولین خرید هر مشتری به صورت خودکار اعمال می‌شود. نیازی به وارد کردن کد نیست و هدف آن تسهیل اولین تجربه خرید است.',
    enabled: true,
    actionLabel: 'تنظیمات',
    badges: ['تخفیف ۱۵٪', 'اعتبار ۷ روزه', 'حداقل سبد ۳۰۰,۰۰۰ تومان'],
  },
  {
    id: 'repeat-purchase',
    iconColor: 'red',
    category: 'بازگشت مشتری',
    title: 'تخفیف خرید بعدی',
    description: '۳ ساعت پس از ارسال هر سفارش، سیستم به صورت خودکار یک کد تخفیف اختصاصی برای مشتری پیامک می‌کند تا به خرید مجدد ترغیب شود.',
    enabled: true,
    actionLabel: 'سیاست های تخفیف',
    badges: ['تخفیف ۲۰٪', 'سقف ۱۵۰,۰۰۰ تومان', 'حداقل سبد ۲۰۰,۰۰۰ تومان'],
  },
  {
    id: 'free-shipping',
    iconColor: 'pink',
    category: 'کاهش اصطکاک خرید',
    title: 'ارسال رایگان',
    description: 'هزینه ارسال برای سفارش‌های واجد شرایط به صورت خودکار صفر می‌شود. مشتری نیازی به کد ندارد و این مزیت در تجربه خرید کاملاً شفاف است.',
    enabled: true,
    actionLabel: 'شرایط ارسال رایگان',
    badges: ['۴ استان', 'حداقل سبد ۵۰۰,۰۰۰ تومان'],
  },
  {
    id: 'bulk-sms',
    iconColor: 'purple',
    category: 'ارتباط مستقیم با مشتریان',
    title: 'ارسال پیامک انبوه',
    description: 'به مشتریان فروشگاه خود پیامک تبلیغاتی، اطلاع‌رسانی یا کد تخفیف ارسال کنید. گروه‌بندی مخاطبان بر اساس سابقه خرید.',
    enabled: true,
    actionLabel: 'تنظیمات',
    badges: ['آخرین ارسال: ۱۴۰۴/۰۲/۱۵', '۲۳۴ نفر'],
  },
]
