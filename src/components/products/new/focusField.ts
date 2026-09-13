// ─── پرش به فیلد ────────────────────────────────────────────────────────────────
/**
 * کاربر را به یک فیلد می‌برد و برای دو ثانیه روی آن تأکید می‌کند.
 *
 * چرا فقط اسکرول کافی نیست: وقتی صفحه می‌لغزد، چشم کاربر جایی را که رسیده دنبال
 * نمی‌کند و باید فیلد را بین ده فیلد دیگر پیدا کند. یک چشمکِ کوتاه همان دو ثانیه‌ای
 * است که لازم است — و چون فقط رنگ و سایه است، چیزی را جابه‌جا نمی‌کند.
 *
 * چرا `data-field` و نه `id`: این کلیدها منطقی‌اند («price»)، و id سراسری باید
 * یکتا باشد؛ با تکرار یک فیلد (مثلاً در موبایل و دسکتاپ) id تکراری می‌شد.
 */

export const FIELD_FLASH_CLASS = 'vitrina-field-flash'

export function focusField(field: string, delay = 220): void {
  if (typeof document === 'undefined') return

  // تعویض مرحله همان لحظه رخ نمی‌دهد؛ کمی صبر تا عنصر در DOM باشد
  window.setTimeout(() => {
    const el = document.querySelector<HTMLElement>(`[data-field="${field}"]`)
    if (!el) return

    el.scrollIntoView({ behavior: 'smooth', block: 'center' })

    // فوکوس روی خودِ ورودی، نه کادر دور آن
    const input = el.matches('input, textarea, select')
      ? el
      : el.querySelector<HTMLElement>('input, textarea, select, button')
    input?.focus({ preventScroll: true })

    el.classList.remove(FIELD_FLASH_CLASS)
    // یک frame فاصله تا انیمیشن با کلیک دوباره از اول اجرا شود
    requestAnimationFrame(() => el.classList.add(FIELD_FLASH_CLASS))
    window.setTimeout(() => el.classList.remove(FIELD_FLASH_CLASS), 2000)
  }, delay)
}
