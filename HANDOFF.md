# Vitrina — Session Handoff
> این فایل بعد از هر milestone آپدیت میشه
> آخرین آپدیت: 2026-05-17

---

## شروع session جدید — این سه کار رو اول انجام بده

```bash
# ۱. تاریخچه کار اخیر
git log --oneline -15

# ۲. چیزهای uncommitted
git status

# ۳. آخرین تغییرات
git diff HEAD~1 --name-only
```

بعد `CLAUDE.md` رو بخون. اون دو تا کافیه برای context — نیازی نیست کل codebase رو بخونی.

---

## الان کجاییم

**آخرین milestone:** Settings page کامل شد + Layout و RTL باگ‌ها fix شدن

**فایل‌های کلیدی که این session ساخته شدن:**
- `src/components/settings/SettingCard.tsx`
- `src/components/ui/TitleBar.tsx`
- `src/pages/Settings.tsx`
- تغییرات در `src/components/layout/Layout.tsx`

**قدم بعدی:** ساخت sub-pages تنظیمات (لیست در بخش بعد)

---

## صفحات باقی‌مانده

| Route | صفحه | وضعیت |
|-------|------|--------|
| `/settings/store-info` | اطلاعات فروشگاه | ⏳ |
| `/settings/shipping` | روش‌های ارسال | ⏳ |
| `/settings/badges` | نمادها و مجوزها | ⏳ |
| `/settings/themes` | پوسته‌ها | ⏳ |
| `/settings/categories` | دسته‌بندی‌ها | ⏳ |
| `/settings/sales` | تنظیمات فروش | ⏳ |

---

## تصمیم‌های معماری (چیزایی که git نمیدونه)

- **Window scroll** نه div scroll → scrollbar لبه چپ مرورگر در RTL
- **bg="bg"** روی Navbar و content box، **bg="bg.panel"** روی کارت‌های هر صفحه
- **TitleBar** با `divider` برای عنوان section‌ها در همه صفحات
- ساختار هر صفحه settings: `<Box bg="bg.panel" borderWidth="1px" rounded="2xl">`

## باگ‌های کشف‌شده این session (ثبت‌شده در dev-knowledge)

- `textAlign="end"` در RTL = چپ‌چین (باید `"right"` باشه)
- `alignItems="flex-end"` در column flex = سمت چپ در RTL
- `bg="bg.subtle"` و `bg="bg"` در dark mode تقریباً یه رنگن

---

## راهنمای آپدیت این فایل

بعد از هر milestone (صفحه جدید، feature بزرگ، یا fix مهم):
1. بخش «الان کجاییم» رو آپدیت کن
2. جدول صفحات رو به‌روز کن (⏳ → ✅)
3. تصمیم‌های معماری جدید رو اضافه کن
4. این فایل رو commit کن همراه بقیه تغییرات
