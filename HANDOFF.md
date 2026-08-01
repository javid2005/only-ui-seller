# Vitrina — Handoff
> آخرین آپدیت: 2026-08-01

## الان
مرحلهٔ ۴ ویزارد «ایجاد سفارش دستی» (اعمال تخفیف) این session تکمیل شد — uncommitted روی `main`:
- `DiscountSelectPanel` (لیست تخفیف‌های از پیش تعریف‌شده، RadioCard) + `DiscountCodeForm` (ورود دستی کد) + دیتای mock در `manualOrderData.ts`.
- `OrderDraftSummary` بازطراحی شد: بخش مشتری حذف شد، ردیف «روش ارسال» حذف شد (فقط «هزینه ارسال» می‌مونه)، رنگ‌بندی یکدست (fg.muted برای همه به‌جز تخفیف=fg.success و مبلغ‌قابل‌پرداخت=fg)، تخفیف+مبلغ‌قابل‌پرداخت بدون فاصله/separator بینشون گروه شدن.
- منطق ویزارد: انتخاب از لیست یا کد دستی mutually-exclusive (انتخاب یکی، دیگری رو disable/clear می‌کنه)، «حذف تخفیف» در فوتر فقط وقتی تخفیفی اعمال شده نشون داده می‌شه، اسکرول به بالای صفحه با هر «ادامه»/«بازگشت».
- دو باگ Chakra v3 کشف و مستند شد (`CLAUDE.md` + `dev-knowledge/.../known-bugs.md`): `RadioCard.Root value={x ?? undefined}` دیزلکت نمی‌کنه (باید `null` مستقیم بدی)، `direction` prop روی غیر از Flex/Stack بی‌صدا drop می‌شه (باید `flexDirection` بنویسی).
- verify شده: `npx tsc --noEmit` سبز، در preview (۳۷۵px و ۱۴۴۰px) دستی تست شد.

## بعدی
commit کردن مرحلهٔ ۴ (این session) → بعدش منتظر لینک Figma مرحلهٔ ۵ («تایید و لینک»، آخرین مرحلهٔ ویزارد).
