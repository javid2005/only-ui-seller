# Vitrina — Session Handoff
> این فایل بعد از هر milestone آپدیت میشه
> آخرین آپدیت: 2026-05-24

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

**آخرین milestone:** صفحه تنظیمات فروش (`/settings/sales`) پیاده‌سازی + polish
- SalesSettings: switch قیمت دلاری/طلا، PhoneCard grid، EmptyState
- همه صفحات: `pb="6"` (24px) ثابت، Settings از `isCompact` برای padding استفاده می‌کنه
- TitleBar: nowrap حذف شد — عناوین بلند wrap میشن (360px)

**بعدی:** commit تغییرات → صفحه بعدی (`/settings/shipping`)

---

## صفحات باقی‌مانده

| Route | صفحه | وضعیت |
|-------|------|--------|
| `/settings/store-info` | اطلاعات فروشگاه | ✅ |
| `/settings/categories` | دسته‌بندی‌ها | ✅ |
| `/settings/sales` | تنظیمات فروش | ✅ |
| `/settings/shipping` | روش‌های ارسال | ⏳ |
| `/settings/badges` | نمادها و مجوزها | ⏳ |
| `/settings/themes` | پوسته‌ها | ⏳ |

---

## تصمیم‌های معماری (چیزایی که git نمیدونه)

- **Window scroll** نه div scroll → scrollbar لبه چپ مرورگر در RTL
- **bg="bg.panel"** روی همه panel wrapperهای صفحات settings (نه bg="bg")
- **panel standard style:** `bg="bg.panel" borderWidth="1px" borderColor="border" rounded="2xl"`
- **TitleBar** با `divider` برای عنوان section‌ها در همه صفحات
- **Switch.Control** نه ~~Switch.Track~~ (Chakra v3 API)
- **Collapsible.Root** برای accordion animation — نیاز به `style={{ width: '100%', minWidth: 0 }}` دارد
- **Middle column flex item** → همیشه `minW="0"` بگیره وگرنه در RTL flex از container بیرون میزنه
- **Responsive pattern:** `{ base: 'small', sm: 'large' }` — xs breakpoint فقط برای تمایز زیر ۳۶۰px

## باگ‌های کشف‌شده (ثبت‌شده در CLAUDE.md)

- `textAlign="end"` در RTL = چپ‌چین (باید `"right"` باشه)
- `alignItems="flex-end"` در column flex = سمت چپ در RTL
- `bg="bg.subtle"` و `bg="bg"` در dark mode تقریباً یه رنگن
- `Switch.Track` → **BROKEN**: وجود نداره. Fix: `Switch.Control`
- `justify="flex-end"` در RTL = چپ‌چین. برای راست‌چین از `justify="flex-start"` استفاده کن
- flex item بدون `minW="0"` در RTL row → overflow از container
