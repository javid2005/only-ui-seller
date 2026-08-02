# Vitrina — Handoff
> آخرین آپدیت: 2026-08-02

## الان
دو تکه کار uncommitted روی `main`:

**۱. کانال‌های تبلیغاتی (`/marketing/channels`)** — این session، کامل و verify شده:
- `AdChannelCard` (`src/components/marketing/channels/AdChannelCard.tsx`) — کارت ردیفی با سه سطح ریسپانسیو: `media≥lg` (آیکون کنار محتوا، دکمه sibling هم‌عرض متن در چپ)، `sm..lg` (دکمه wrap‌شده زیر محتوا، hug، چپ‌چین)، `media<sm` (آیکون بالای محتوا، دکمه fill). state=Hover از Figma (`bg="brand.bg"` + `borderColor="brand.focusRing"`).
- `AdChannels` (`src/views/marketing/AdChannels.tsx`) — قالب **One Column Center** (پنل full-width، محتوا `maxW="960px" mx="auto"` داخلش — نه پنل خودش capped، طبق الگوی `Reviews.tsx`/`ThemeSettings.tsx`). ۴ کانال mock (ترب فعال، ایمالز قابل‌فعال‌سازی محلی، کمپینو با پیش‌نیاز/Alert، دیوار به‌زودی).
- assets: `src/assets/Marketing/{torob,emalls,campaingo,divar}.png` (دانلود واقعی از Figma).
- `.claude/context/figma-layout.json` — cache جدید `layout-diff` init و برای `AdChannelCard`/`AdChannels` پر شد (با caveat مستند‌شده داخل فایل دربارهٔ محدودیت childOrder وقتی سیبلینگ‌ها همه `Flex` عمومی‌ان).
- دو باگ real پیدا و فیکس شد که ابزار خودکار نگرفت (جزئیات چرا در تاریخچهٔ همین session): `justify="flex-end"` به‌جای `flex-start` عنوان+بج رو چپ می‌کشید؛ و ساختار پنل که باید full-width می‌بود نه خودش `maxW=960`.
- verify: `npx tsc --noEmit` سبز، `dev-engine` (از repo root، `node .../dist/cli.js . --report-only`) صفر یافته روی این فایل‌ها.

**۲. پیام تکمیل سفارش (`OrderCompletePanel`)** — از session قبل، هنوز commit نشده:
- `src/components/orders/manual/OrderCompletePanel.tsx` + تغییرات مرتبط در `ManualOrderNew.tsx` (جزئیات کامل در commit history نیست چون خودش uncommitted — قبلاً در همین فایل مستند بود، جزئیات: EmptyState «سفارش با موفقیت ثبت شد!» + لینک پرداخت mock `ORD-####`).
- verify شده بود: تایپ‌چک سبز، ویزارد کامل دستی تست شده (دسکتاپ+موبایل).

## بعدی
commit کردن هر دو تکهٔ بالا (به‌ترتیب یا با هم — کاربر تصمیم گرفت).

## نکات محیطی مهم این session
- `dev-engine` CLI global لینک نشده؛ باینری واقعی و gotcha اجرای صحیحش → مستند شد در `CLAUDE.md` (بخش جدید «dev-engine CLI — اجرای صحیح»).
