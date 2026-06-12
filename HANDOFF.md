# Vitrina — Handoff
> آخرین آپدیت: 2026-06-12

## الان
صفحات سفارشات (orders) اضافه شد: OrderList (جدول + کارت + فیلتر) و OrderDetails (جزئیات + وضعیت + مراحل).
ListPagination کامپوننت مشترک ساخته شد.

## بعدی
—

## صفحات

| Route | صفحه | وضعیت |
|-------|------|--------|
| `/products/list` | لیست محصولات | ✅ |
| `/products/categories` | دسته‌بندی محصولات | ✅ |
| `/account/user-info` | حساب کاربری | ✅ |
| `/settings/store-info` | اطلاعات فروشگاه | ✅ |
| `/settings/categories` | دسته‌بندی‌ها | ✅ |
| `/settings/sales` | تنظیمات فروش | ✅ |
| `/settings/shipping` | روش‌های ارسال | ✅ |
| `/settings/shipping/add` | افزودن روش ارسال | ✅ |
| `/settings/themes` | پوسته‌ها | ✅ |
| `/settings/themes/customize` | سفارشی‌سازی پوسته | ✅ |
| `/settings/badges` | نمادها و مجوزها | ✅ |
| `/orders/list` | لیست سفارشات | ✅ |
| `/orders/:orderId` | جزئیات سفارش | ✅ |

→ قوانین معماری + isCompact pattern: CLAUDE.md
