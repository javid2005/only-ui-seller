# Vitrina — Handoff
> 2026-08-16

## الان
آخرین commit (`134d632`) بازسازی لیست سفارشات + OrderCard موبایل بود. از اونجا تا
الان uncommitted (۴ فایل) — صفحهٔ «نظرات کاربران» بازسازی شد:
- `Comment` component طبق Figma بازسازی شد: ۴ وضعیت (`pending`/`verified`/
  `archived`/`deleted`) به‌جای boolean `archived`، فوتر بدون شمارندهٔ لایک/دیسلایک،
  دکمه‌های فوتر solid/outline/متن‌قرمز طبق طرح، آیکون‌های پاسخ فروشنده `ghost`.
- تب‌ها از `SegmentGroup` به `Tabs variant="enclosed"` تغییر کرد (الگو:
  `SecuritySection.tsx`)؛ ترتیب: در انتظار تایید → تایید شده → آرشیو شده → حذف شده.
- بج شمارنده فقط رو تب «در انتظار تایید» موند؛ رنگ بج pending=orange،
  archived=blue.
- زیر `md`: `Tabs.List` به‌جای wrap کردن متن، افقی اسکرول می‌خوره.
- فیکس: وقتی «پاسخ» کلیک می‌شه، انصراف/ثبت جای همون ۳ دکمهٔ فوتر می‌شینن (نه یه
  بلوک جدا)؛ فیکس: Avatar موبایل align=start (نه center) وقتی نام/بج به ۲ خط می‌شکنن.

## بعدی
همین ۴ فایل commit بشه:
`data.ts`, `CommentCard.tsx`, `ReviewsFilterModal.tsx`, `views/products/Reviews.tsx`.
آخرین fix (Avatar alignment موبایل) هنوز preview نشده.

## باگ‌های open
(چیزی گزارش نشده)
