# Vitrina — Handoff
> آخرین آپدیت: 2026-07-31

## الان
آخرین commit (`b0dc906`): فیکس stepper دامنه + تصحیح breakpoint doc.
از اون‌موقع (uncommitted روی `main`) — ویزارد «ایجاد سفارش دستی» (`/orders/new`) شروع شد، مرحله ۱ کامل:
- `src/views/orders/ManualOrderNew.tsx` + `src/app/orders/new/page.tsx`
- `src/components/orders/manual/`: `ManualOrderStepper` (الگوی `OrderSteps`)، `CustomerSelectPanel` (RadioCard، جستجوی زنده)، `OrderDraftSummary`، `ManualOrderFooter` (fixed در `<=md`، درون‌جریان در `>md`)، `AddCustomerDialog` (Figma node 2096:27044 + اعتبارسنجی موبایل هم‌الگو با `PhoneInput`/`LoginMobileView`)
- `src/components/products/list/ProductTable.tsx` uncommitted از قبل این session مونده — بی‌ربط به ویزارد، هنوز commit نشده

## بعدی
مرحله ۲ ویزارد سفارش دستی (انتخاب محصول) — منتظر لینک Figma.
