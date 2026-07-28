# Vitrina — Handoff
> آخرین آپدیت: 2026-07-28

## الان
آخرین commit (`4303695`): مرحلهٔ «شماره موبایل» به استپر ثبت‌نام اضافه شد.
از اون‌موقع (uncommitted روی `main`) — صفحهٔ تنظیمات «دامنه» (`/settings/domain`) ساخته شده:
- `src/views/settings/Domain.tsx` + کارت‌ها/دیالوگ‌های `src/components/settings/domain/` (افزودن دامنه، تایید دامنه، نتیجهٔ بررسی دامنه، ویرایش آدرس ویترینا، کارت لینک ویترینا)
- `src/services/domain.ts` (mock service)
- `Toaster` سراسری اضافه شد (`src/components/ui/toaster.tsx`) و در `providers.tsx` وایر شد — الان در کل اپ در دسترسه
- `TitleBar.tsx` و `Settings.tsx` هم تغییر کردن (احتمالاً برای پشتیبانی از کارت/صفحهٔ دامنه)
- `README.md` صفحات پیاده‌شده sync شد: ردیف `/settings/domain` اضافه شد

## بعدی
commit همین تغییرات Domain.
