# Vitrina — Handoff
> آخرین آپدیت: 2026-06-15

## الان
**مودال‌های صفحه جزئیات سفارش** (commit `11f0164` · branch `nextjs`):
- ۴ مودال نو در `OrderDialogs.tsx`: کد رهگیری، ویرایش گیرنده، ویرایش آدرس، انتخاب آدرس فرستنده
- `SenderCard.tsx` نو — کاملاً با Chakra `radio-card` (states از brand token)
- fix: footer آینه‌ای `ShipDialog`/`CancelOrderDialog` → انصراف راست / brand چپ (مطابق Figma)
- fix: Select داخل `EditAddressDialog` با `Portal` (dropdown دیگه داخل body اسکرول‌دار clip نمی‌شه)
- همه به trigger درست وصل (`ShippingAddressPanel` + `ContactInfoCard`) · type-check + `pnpm build` سبز

## بعدی
- **push ۶ commit unpushed** (branch `nextjs`)
- معوق: merge `nextjs` → `master`

## نکته
- gotchaهای DS این session ثبت شد در `dev-knowledge/.../chakra-ui-v3/known-bugs.md`: RadioCard border روی `Item` (نه `ItemControl`) · Select داخل Dialog باید `Portal` شه
- `persian-numerals` warning روی `OrderItemsPanel`/`OrderTable`/`OrderCard` = TODO قدیمی، false-positive (داده از قبل رشته‌ی فارسی)؛ `ORD-5621` انگلیسی **عمدیه** (شناسه، نه عدد نمایشی)

## صفحات
همه ✅ — `/products/*`، `/account/user-info`، `/settings/*`، `/orders/list`، `/orders/[orderId]` (+ مودال‌ها)

→ قوانین معماری + isCompact pattern: CLAUDE.md
