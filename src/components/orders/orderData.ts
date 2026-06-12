// ─── Order domain types + mock data ────────────────────────────────────────────
// Display strings are Persian (user-facing). Identifiers/codes stay Latin.

export type OrderStatus =
  | 'pending'      // در انتظار پرداخت
  | 'paid'         // پرداخت شده
  | 'processing'   // درحال آماده سازی
  | 'sent'         // ارسال شده
  | 'canceled'     // لغو شده
  | 'returned'     // مرجوع شده

export type OrderAction =
  | 'markPaid'        // پرداخت شد
  | 'confirmPayment'  // تایید پرداخت
  | 'ship'            // ارسال → ثبت ارسال dialog
  | 'requestReturn'   // درخواست مرجوعی
  | 'cancel'          // لغو سفارش → لغو سفارش dialog

export interface MenuAction {
  label: string
  action: OrderAction
  /** Destructive — rendered in error color */
  danger?: boolean
}

export interface OrderItem {
  id: string
  name: string
  /** "رنگ مشکی، ۱ ترابایت" */
  attrs: string
  /** "۱ عدد" */
  qty: string
  /** خط کل قلم — "۴۵,۰۰۰,۰۰۰" */
  total: string
  /** فی واحد — "۴۵,۰۰۰,۰۰۰" */
  unit: string
  image?: string
}

export interface OrderStep {
  title: string
  description: string
}

export interface ContactInfo {
  name: string
  phone: string
}

// ─── Status label + per-status menu (CTmenu) ────────────────────────────────────

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending:    'در انتظار پرداخت',
  paid:       'پرداخت شده',
  processing: 'درحال آماده سازی',
  sent:       'ارسال شده',
  canceled:   'لغو شده',
  returned:   'مرجوع شده',
}

export const STATUS_ACTIONS: Record<OrderStatus, MenuAction[]> = {
  pending:    [{ label: 'پرداخت شد', action: 'markPaid' },       { label: 'لغو سفارش', action: 'cancel', danger: true }],
  paid:       [{ label: 'تایید پرداخت', action: 'confirmPayment' }, { label: 'لغو سفارش', action: 'cancel', danger: true }],
  processing: [{ label: 'ارسال', action: 'ship' },               { label: 'لغو سفارش', action: 'cancel', danger: true }],
  sent:       [{ label: 'درخواست مرجوعی', action: 'requestReturn' }],
  canceled:   [],
  returned:   [],
}

// ─── Mock order (Figma: Order / Details — ORD-5621) ─────────────────────────────

export const MOCK_ORDER = {
  code: 'ORD-5621',
  status: 'processing' as OrderStatus,
  itemsCount: '۳ قلم',
  customer:  { name: 'مهسا اکبری', phone: '۰۹۱۲۳۴۵۶۷۸۹' } as ContactInfo,
  receiver:  { name: 'احمد گنجی',  phone: '۰۹۱۲۳۴۵۶۰۰۸۹' } as ContactInfo,
  shipMethod: 'پست پیشتاز',
  totals: {
    sum:          '۹۹,۰۰۰,۰۰۰',
    discount:     '۳۰۰,۰۰۰',
    discountCode: 'SPRING20',
    payable:      '۸۹,۷۰۰,۰۰۰',
  },
  shipping: {
    method:   'پست پیشتاز',
    kind:     'درون شهری',
    fare:     'پیش کرایه',
    tracking: 'هنوز وارد نشده',
    province: 'تهران',
    city:     'تهران',
    postal:   '۱۴۵۶۷۸۹۰۱۲',
    address:  'خیابان ولیعصر، کوچه گلستان، پلاک ۱۲، واحد ۳',
  },
}

export const ORDER_ITEMS: OrderItem[] = [
  { id: '1', name: 'گلکسی S24 اولترا', attrs: 'رنگ مشکی، ۱ ترابایت', qty: '۱ عدد', total: '۴۵,۰۰۰,۰۰۰', unit: '۴۵,۰۰۰,۰۰۰' },
  { id: '2', name: 'آنر ۱۲۰ پرو',     attrs: 'رنگ رز گلد، ۵۱۲ گیگ',  qty: '۲ عدد', total: '۵۴,۰۰۰,۰۰۰', unit: '۲۷,۰۰۰,۰۰۰' },
]

export const ORDER_STEPS: OrderStep[] = [
  { title: 'در انتظار پرداخت', description: '۱۴۰۴/۰۱/۱۵ ۱۴:۳۲' },
  { title: 'پرداخت شده',       description: '۱۴۰۴/۰۱/۱۵ ۱۴:۴۵' },
  { title: 'درحال آماده سازی', description: 'درحال انجام' },
  { title: 'ارسال شده',        description: 'توضیحات' },
]

/** Completed-step count (0-based current index = این مقدار). */
export const ORDER_ACTIVE_STEP = 2

/** واحد پول نمایش (Vitrina String Variable: Products/Currency). */
export const CURRENCY = 'ت'
