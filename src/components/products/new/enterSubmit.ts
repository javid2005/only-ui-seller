import type { KeyboardEvent } from 'react'

// ─── Enter در دیالوگ‌ها ─────────────────────────────────────────────────────────
/**
 * قرارداد کلید Enter در فرم محصول (بازخورد کاربر، مورد ۷):
 *
 *   • داخل **هر دیالوگ**، Enter همان دیالوگ را تأیید می‌کند.
 *   • در فیلد برچسب و مشخصه، Enter آیتم را اضافه می‌کند (این دو `<form>` واقعی
 *     با دکمهٔ submit دارند، پس خودِ مرورگر این کار را می‌کند).
 *   • Enter **هرگز** کل فرم محصول را ذخیره نمی‌کند — ذخیره فقط با دکمه‌های
 *     «ذخیره و ادامه» و «انتشار». به همین دلیل صفحهٔ محصول اصلاً `<form>` نیست
 *     و هر `<form>` داخلی‌اش `preventDefault` می‌کند.
 *
 * این helper همان قاعدهٔ اول است. روی `Dialog.Content` اسپرد می‌شود، نه روی
 * تک‌تک ورودی‌ها: یک جا ست می‌شود و هر فیلدی که بعداً اضافه شود خودکار پوشش
 * می‌گیرد.
 */
export function dialogEnterSubmit(
  onConfirm: (() => void) | undefined,
  enabled = true,
) {
  return {
    onKeyDown(e: KeyboardEvent<HTMLElement>) {
      if (!onConfirm || !enabled) return
      if (e.key !== 'Enter' || e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return
      // در حال تایپِ IME (مثلاً تبدیل فارسی) — Enter متعلق به خودِ IME است
      if ((e.nativeEvent as unknown as { isComposing?: boolean }).isComposing) return
      // کسی قبلاً جواب داده (فرمِ داخلی، Combobox، منو…)
      if (e.defaultPrevented) return

      const el = e.target as HTMLElement | null
      if (!el) return
      const tag = el.tagName.toLowerCase()

      // textarea: Enter یعنی خط تازه · button/a: Enter خودش کلیک است
      if (tag === 'textarea' || tag === 'button' || tag === 'a') return
      if (el.isContentEditable) return
      if (el.getAttribute('role') === 'button') return

      // ورودی‌ای که فهرست پیشنهاد/گزینه‌اش باز است، Enter را برای «انتخاب» لازم دارد
      if (el.getAttribute('aria-expanded') === 'true') return
      if (el.closest('[data-state="open"][role="combobox"], [aria-expanded="true"]')) return

      // ورودی‌ای که خودش داخل یک <form> است (برچسب، مشخصه) — submit خودش را دارد
      if (tag === 'input' && (el as HTMLInputElement).form) return

      e.preventDefault()
      onConfirm()
    },
  }
}
