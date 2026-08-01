# Vitrina — Handoff
> آخرین آپدیت: 2026-08-01

## الان
آخرین commit (`cca39cb`): ویزارد «ایجاد سفارش دستی» مرحلهٔ ۱ (انتخاب مشتری).
از اون‌موقع (uncommitted روی `main`):
- مرحلهٔ ۲ (انتخاب محصول) کامل شد: `ProductSelectPanel`, `SelectedProductsPanel`, `VariantSelectDialog` + دیتای mock در `manualOrderData.ts` + `src/assets/ManualProducts/`.
- مرحلهٔ ۳ (روش ارسال) این session کامل شد: `ShippingSelectPanel` (RadioCard، بج‌های بین‌شهری/درون‌شهری + پیش‌کرایه)، `ShippingAddressForm` (استان/شهر/کدپستی/آدرس/یادداشت)، `OrderDraftSummary` با ردیف‌های ارسال. اعتبارسنجی: دکمهٔ «ادامه» فقط با انتخاب روش ارسال فعال می‌شه؛ فرم آدرس با کلیکِ «ادامه» چک می‌شه (نه غیرفعال‌ماندن دکمه) و خطای «این فیلد الزامی است» رو per-field نشون می‌ده.
- verify شده: `npx tsc --noEmit` سبز + دسکتاپ در preview (customer→product→shipping→validation error) تست شد. موبایل (360/480) هنوز چک نشده.

## بعدی
تست ریسپانسیو موبایل مرحلهٔ ۳ (360/480px) → بعد commit مرحله‌های ۲+۳ → منتظر لینک Figma مرحلهٔ ۴ (اعمال تخفیف).
