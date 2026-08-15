# Vitrina — Handoff
> 2026-08-15

## الان
آخرین commit (`7ead0f9`) discount toggle/outline icons/domain relabel بود. از اونجا
تا الان uncommitted (۱۵ فایل):
- بازسازی کامل لیست سفارشات (KPI/فیلتر/جدول/pagination مطابق لیست محصولات) + دیالوگ
  فیلترها (`OrderFilterModal`) طبق Figma node 2169:28005 + لیبل منوی ترتیب.
- فیکس سراسری فاصلهٔ زیاد ارقام فارسی در Table/Badge (`src/theme/index.ts` — override
  `fontVariantNumeric` روی recipe، نه globalCss).
- فیکس alignment ستون action در ۴ جدول (OrderTable، ProductTable/RowActionButtons،
  CampaignTable، AbandonedCartTable) — `justify="end"` گم/غلط بود.
- striped=true روی ۴ جدولی که نداشتنش (DiscountCodesTable، BulkSmsHistoryTable،
  AbandonedCartTable، CampaignTable) — مطابق قرارداد محصولات/سفارشات.
- OrderCard (کارت موبایل سفارشات) بازسازی طبق Figma node 5253:87246 —
  فوتر/هدر جدا شد (فوتر همیشه bg.subtle)، hover فقط border کارت + bg فوتر رو
  عوض می‌کنه (نه کل کارت)، Separator حذف شد.

## بعدی
OrderCard موبایل هم طبق Figma node 5253:87246 بازسازی و commit شد (فوتر همیشه
bg.subtle + hover→brand.bg روی فوتر تنها با role="group"، border کارت hover→
brand.focusRing، بدون Separator، IconButton فوتر variant="outline"). چیز
open دیگه‌ای از این session نمونده.

## باگ‌های open
(چیزی گزارش نشده)
