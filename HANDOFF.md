# Vitrina — Handoff
> آخرین آپدیت: 2026-07-21

## الان
آخرین commit: صفحهٔ Signup Done + OTP auto-submit + rules dialog. از اون‌موقع (uncommitted روی `main`):
- کد ملی: `NationalIdInput` (`src/components/ui/NationalIdInput.tsx`) + validator (`src/utils/validation.ts`) — استفاده‌شده در `UserInfo.tsx`
- «اطلاعات فروشگاه» (`GeneralInfo.tsx`): فیلد "نام فروشگاه به انگلیسی" → "آدرسی اختصاصی" (disabled) + تب بالای صفحه از `enclosed` به `subtle` تبدیل شد — vertical sidebar در `lg`+ (مطابق Figma node 843:9951)، horizontal fill-width زیر `lg` — دقیقاً همون الگوی `UserInfo.tsx`. تب‌های افقی هر دو صفحه (`GeneralInfo` + `UserInfo`) حالا fill (flex="1") هستن، نه راست‌چین با فضای خالی.
- `AddAddressDialog.tsx`: لیبل «آدرس» → «آدرس دقیق پستی»
- `ShippingCalculatorDialog.tsx`: نتیجهٔ محاسبه در دسکتاپ از Grid دستی به `Table` واقعی چاکرا با ردیف‌های زوج/فرد رنگی (striped، طبق قرارداد پروژه) تبدیل شد؛ داخل هر سلول badge بالا/قیمت پایین (stacked)

## بعدی
- commit تغییرات فعلی (لیست بالا)
- ثبت‌نام مرحله ۳ («پلن انتخابی») — هنوز صفحه نداره؛ کاربر گفت طرح Figma‌ش رو بعداً می‌ده. تا اون‌موقع `/signup/plan` عمداً ۴۰۴ می‌ده
- صفحهٔ «دامنه اختصاصی» وجود نداره — فقط کارت disabled زیر «به زودی...» در `Settings.tsx` و یه لینک به `/settings/store-info` در `Badges.tsx` (که فعلاً صرفاً یه فیلد disabled‌ه، نه فرم واقعی ثبت دامنه)

## نکته
- تست signup flow با شمارهٔ تکراری (رقم آخر فرد) که قبلاً تا مرحله ۲ رفته → روی OTP verify مستقیم می‌ره `/signup/plan` و ۴۰۴ می‌ده (resume feature درسته، فقط مقصد صفحه نداره). برای تست دوباره از اول: `localStorage` کلید `vitrina-signup-progress:<phone>` رو پاک کن یا شمارهٔ فرد جدید بزن.
