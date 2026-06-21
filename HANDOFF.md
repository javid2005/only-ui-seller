# Vitrina — Handoff
> آخرین آپدیت: 2026-06-21

## الان
**صفحه فاکتور + دکمه مشاهده فاکتور + breadcrumb wrap** (commit `161f1ea` · branch `nextjs`):
- `OrderPrintInvoice`: باکس سرفصل مطابق Figma (لوگو ۲۰px، عنوان lg، متا stacked در دسکتاپ / ردیفی در < sm)؛ ستون «فی (قیمت واحد)» جای «جمع»؛ کارت موبایل (`ItemCard`) به‌جای جدول در < sm/compact؛ دکمه پرینت آیکنی در < sm؛ حذف خط زیر «هزینه ارسال»
- `OrderDetails`: دکمه «مشاهده فاکتور» (آیکن `ReceiptText`، آیکن‌first/راست) کنار دکمه وضعیت → ناوبری به `/orders/[orderId]/print-invoice`؛ آیکنی در < sm
- `Header`: breadcrumb حالا `flexWrap="wrap"` (نه overflow/scroll) — container-based، موبایل + compact
- `CLAUDE.md`: قانون «Breadcrumb — wrap نه overflow» اضافه شد

## بعدی
- merge `nextjs` → `main` (هنوز معوق)
- معوق قدیمی: Persian numbers utility + Persian calendar همه‌جا

## نکته
- دکمه‌های آیکن‌first (راست/leading) convention پروژه است — حتی اگر Figma آیکن را trailing نشان دهد (مثل «مشاهده فاکتور» و دکمه‌های پرینت)
