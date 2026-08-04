export interface BulkSmsStat {
  label: string
  value: string
  /** درصد رشد نسبت به دوره قبل — فقط «نرخ تحویل» دارد (Figma) */
  trend?: string
}

/** Figma node 2732:43608 «SKU» — سه آمار نمای کلی */
export const BULK_SMS_STATS: BulkSmsStat[] = [
  { label: 'نرخ تحویل', value: '۹۸٪', trend: '۲٪' },
  { label: 'پیامک ارسالی این ماه', value: '۳' },
  { label: 'کل مشتریان', value: '۲۳۴' },
]

export type BulkSmsStatus = 'sent' | 'pending'

export const BULK_SMS_STATUS_LABEL: Record<BulkSmsStatus, string> = {
  sent: 'ارسال شد',
  pending: 'در انتظار ارسال',
}

export const BULK_SMS_STATUS_COLOR: Record<BulkSmsStatus, string> = {
  sent: 'green',
  pending: 'gray',
}

export interface BulkSmsHistoryItem {
  id: string
  status: BulkSmsStatus
  audience: string
  recipientCount: string
  message: string
  startDate: string
  archived: boolean
}

/** Figma node 2732:43899 «Table» — تاریخچه ارسال‌های پیامک انبوه */
export const BULK_SMS_HISTORY: BulkSmsHistoryItem[] = [
  {
    id: 'sms-1',
    status: 'sent',
    audience: 'همه مشتریان',
    recipientCount: '۲۳۴',
    message: 'جشنواره بهاره ویترینا — ۲۰٪ تخفیف روی همه محصولات',
    startDate: '۱۴۰۵/۰۲/۱۷',
    archived: false,
  },
  {
    id: 'sms-2',
    status: 'pending',
    audience: 'خریداران قبلی',
    recipientCount: '۱۵۶',
    message: 'محصولات جدید اضافه شد! همین الان ببینید',
    startDate: '۱۴۰۴/۰۲/۱۵',
    archived: false,
  },
  {
    id: 'sms-3',
    status: 'sent',
    audience: 'مشتریان وفادار',
    recipientCount: '۸۹',
    message: 'کد تخفیف NOROOZ30 برای شما فعال شد',
    startDate: '۱۴۰۴/۰۳/۱۰',
    archived: false,
  },
]
