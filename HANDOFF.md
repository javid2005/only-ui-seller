# Vitrina — Handoff
> آخرین آپدیت: 2026-08-02

## الان
صفحه‌ی کانال‌های تبلیغاتی (`/marketing/channels`) و پنل تکمیل سفارش قبلاً commit شدن (`88359b5`, `60eba60`). این session روی زیرساخت `dev-engine` کار شد، نه فیچر جدید — فقط `CLAUDE.md` تغییر کرده (uncommitted):

- **بخش «dev-engine CLI — اجرای صحیح» آپدیت شد**: باینری الان `npm link` شده و global در PATH هست (قبلاً باید با `node dist/cli.js` صدا زده می‌شد).
- **بخش جدید «تطابق با طرح فیگما — دو لایه»**: `layout-diff` (متن کد) و `verify-render` (پیکسل رندرشده، تازه اضافه شده در `dev-agents`) + قرارداد semantic (`start`/`end` نه `left`/`right`) + سابقه‌ی باگ نگاشت جهت‌کور که کشف و در `dev-agents/src/direction.ts` فیکس شد.

## نکته‌ی باز — نیاز به تایید بصری
`layout-diff` روی این کدبیس یه تناقض واقعی پیدا کرد: `AdChannelCard.tsx:119` — `textAlign="right"` در کد، `end` (چپ) در `.claude/context/figma-layout.json`. عمداً دست نزده شد چون snapshot به‌احتمال زیاد خودش قربانی همون باگ نگاشت جهت‌کور بوده (پیش از فیکس نوشته شده)، نه کد. Figma MCP در session قبل auth نداشت. قدم بعدی: با فیگما وصل شو و یه‌بار بزن:
```
dev-engine layout-sync . --set AdChannelCard --data '{"textAlign":"start"}'
```

## بعدی
تصمیم کاربر — یا تایید بصری بالا، یا ادامه‌ی فیچرهای بعدی marketing/orders.
