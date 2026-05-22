# Vitrina — Session Handoff
> این فایل بعد از هر milestone آپدیت میشه
> آخرین آپدیت: 2026-05-22

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

**آخرین milestone:** General-Info section کامل شد
- route `/settings/store-info` → `GeneralInfo.tsx`
- ۳ tab: عمومی / ارتباطی / آدرس‌ها

**فایل‌های ساخته‌شده این session:**
- `src/pages/settings/GeneralInfo.tsx` — صفحه اصلی با tabs
- `src/components/settings/info/PhoneCard.tsx`
- `src/components/settings/info/SocialCard.tsx`
- `src/components/settings/info/AddressCard.tsx`
- `src/components/settings/info/AddPhoneDialog.tsx`
- `src/components/settings/info/AddSocialDialog.tsx`
- `src/components/settings/info/AddAddressDialog.tsx`
- `src/App.tsx` — route جدید اضافه شد

**قدم بعدی:** debug runtime (صفحه بالا نمیاد — احتمال Switch/Tabs API issue)

---

## صفحات باقی‌مانده

| Route | صفحه | وضعیت |
|-------|------|--------|
| `/settings/store-info` | اطلاعات فروشگاه | ⚠️ debug |
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
- **Switch.Control** نه ~~Switch.Track~~ (Chakra v3 API)

## باگ‌های کشف‌شده (ثبت‌شده در CLAUDE.md)

- `textAlign="end"` در RTL = چپ‌چین (باید `"right"` باشه)
- `alignItems="flex-end"` در column flex = سمت چپ در RTL
- `bg="bg.subtle"` و `bg="bg"` در dark mode تقریباً یه رنگن
- `Switch.Track` → **BROKEN**: وجود نداره. Fix: `Switch.Control`
