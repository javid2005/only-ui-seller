import { ActionBar, Button, IconButton, Portal } from '@chakra-ui/react'
import { SquareCheckBig, Trash2, X } from 'lucide-react'
import { Fragment } from 'react'
import type { LucideIcon } from 'lucide-react'
import { toPersianDigits } from '@/utils/numbers'

interface SelectionActionBarProps {
  count: number
  onCancel: () => void
  onPublish?: () => void
  onDelete?: () => void
}

interface ActionDef {
  key: string
  label: string
  icon: LucideIcon
  onClick?: () => void
  danger?: boolean
}

/**
 * نوار عملیات گروهی — Chakra ActionBar (chakra-ui.com/docs/components/action-bar)، طبق
 * Figma node 5232:84929. با انتخاب ≥۱ آیتم از bottom-center صفحه بالا میاد (اسلاید —
 * مکانیزم خودِ ActionBar.Positioner، چیزی دستی پیاده نشده). جایگزین ردیف قدیمیِ بالای
 * جدول/کارت (نسخهٔ قدیمی‌تر با ردیف ثابت بالای صفحه بود، حذف شد).
 *
 * RTL DOM order (اولین=راست‌ترین، از متادیتای Figma — canvas LTR: X چپ‌ترین، حذف، انتشار،
 * جداکننده، «N انتخاب شده» راست‌ترین):
 * SelectionTrigger(شمارنده) → Separator → دکمه‌های عملیات → CloseTrigger(چپ‌ترین)
 * داخل هر دکمه: آیکون FIRST=راست، متن بعدش=چپ (از کد Figma: متن اول در LTR=چپ، آیکون
 * دوم=راست؛ هم‌راستا با الگوی قبلیِ همین پروژه در SelectionActionBar قدیم).
 *
 * media<sm (مستقیم از کاربر): دکمه‌های عملیات به IconButton بدون متن تبدیل می‌شن — دو نسخه
 * (IconButton/Button) هم‌زمان رندر و با display سوییچ می‌شن، چون ساختارشون فرق داره.
 * دکمه‌ها فقط ۲ تا طبق طرح: انتشار + حذف (+ close trigger).
 *
 * ⚠️ عمداً onOpenChange نداره: Popover زیرینِ ActionBar به‌صورت پیش‌فرض روی
 * closeInteractOutside بسته می‌شه، و اگه onOpenChange رو به onCancel وصل کنیم، کلیک روی
 * چک‌باکسِ آیتم بعدی (که «بیرون» پاپاور حساب می‌شه) بلافاصله انتخاب رو پاک می‌کنه — دقیقاً
 * باگی که «فقط یک آیتم انتخاب می‌شه» رو ایجاد کرده بود. open فقط از count>0 میاد؛ بستن
 * واقعی فقط از کلیک صریح روی CloseTrigger.
 */
export function SelectionActionBar({
  count, onCancel, onPublish, onDelete,
}: SelectionActionBarProps) {
  const actions: ActionDef[] = [
    { key: 'publish', label: 'انتشار', icon: SquareCheckBig, onClick: onPublish },
    { key: 'delete', label: 'حذف', icon: Trash2, onClick: onDelete, danger: true },
  ]

  return (
    <ActionBar.Root open={count > 0}>
      <Portal>
        <ActionBar.Positioner dir="rtl">
          <ActionBar.Content>
            <ActionBar.SelectionTrigger>
              {toPersianDigits(count)} انتخاب شده
            </ActionBar.SelectionTrigger>
            <ActionBar.Separator />

            {actions.map((a) => {
              const Icon = a.icon
              return (
                <Fragment key={a.key}>
                  {/* media<sm — icon-only */}
                  <IconButton
                    display={{ base: 'inline-flex', sm: 'none' }}
                    variant="outline" size="sm"
                    borderColor={a.danger ? 'red.solid' : 'border'}
                    color={a.danger ? 'red.fg' : 'fg'}
                    _hover={{ bg: a.danger ? 'red.subtle' : 'bg.muted' }}
                    aria-label={a.label}
                    onClick={a.onClick}
                  >
                    <Icon size={16} />
                  </IconButton>
                  {/* sm+ — آیکون + متن */}
                  <Button
                    display={{ base: 'none', sm: 'inline-flex' }}
                    variant="outline" size="sm"
                    borderColor={a.danger ? 'red.solid' : 'border'}
                    color={a.danger ? 'red.fg' : 'fg'}
                    _hover={{ bg: a.danger ? 'red.subtle' : 'bg.muted' }}
                    onClick={a.onClick}
                  >
                    <Icon size={16} />
                    {a.label}
                  </Button>
                </Fragment>
              )
            })}

            <ActionBar.CloseTrigger asChild>
              <IconButton variant="ghost" size="sm" aria-label="انصراف" onClick={onCancel}>
                <X size={16} />
              </IconButton>
            </ActionBar.CloseTrigger>
          </ActionBar.Content>
        </ActionBar.Positioner>
      </Portal>
    </ActionBar.Root>
  )
}
