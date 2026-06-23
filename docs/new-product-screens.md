# محصول جدید — لیست صفحات و حالت‌ها (برای بازبینی)

> منبع طراحی: Figma `CfbQjlet5WMabrTfZt46iL`
> قالب: **Two Columns Right Center** (نویگیشن مرحله‌ای راست + فرم مرکز)
> route: `/products/new` · ورود از دکمه «افزودن محصول» در لیست محصولات
> تب‌ها: **اطلاعات محصول** · گالری · تنوع‌ها (یک route، تب داخلی)

## وضعیت پیاده‌سازی

| تب | حالت | دسکتاپ | موبایل | پیاده‌سازی |
|----|------|--------|--------|------------|
| اطلاعات محصول | استاندارد (empty + غیرطلا/غیرتنوع) | ✅ طراحی | ✅ طراحی | 🟡 در حال انجام |
| اطلاعات محصول | طلا (دستهٔ طلا → کارت اختصاصی طلا) | ✅ طراحی | ✅ طراحی | ⬜️ بعدی |
| اطلاعات محصول | ارزی (دلار + نرخ زنده + تبدیل حروف) | ✅ طراحی | ✅ طراحی | ⬜️ بعدی |
| اطلاعات محصول | دارای تنوع (قیمت/موجودی read-only) | ✅ طراحی | ✅ طراحی | ⬜️ بعدی |
| گالری | — | ⬜️ لینک نیامده | ⬜️ | ⬜️ placeholder |
| تنوع‌ها | — | ⬜️ لینک نیامده | ⬜️ | ⬜️ placeholder |

## لینک‌های Figma (node-id)

### دسکتاپ — Section `✅ New Product` (`1135:13477`)
| حالت | node-id | لینک |
|------|---------|------|
| Info empty | `1171:12855` | https://www.figma.com/design/CfbQjlet5WMabrTfZt46iL/Vitrina?node-id=1171-12855 |
| No-Gold Info (استاندارد پرشده) | `1191:22018` | https://www.figma.com/design/CfbQjlet5WMabrTfZt46iL/Vitrina?node-id=1191-22018 |
| Gold Info | `1217:17348` | https://www.figma.com/design/CfbQjlet5WMabrTfZt46iL/Vitrina?node-id=1217-17348 |
| Info & Varient (ارزی/تنوع) | `1200:17927` | https://www.figma.com/design/CfbQjlet5WMabrTfZt46iL/Vitrina?node-id=1200-17927 |
| Dialog «تغییر دسته‌بندی» | `3923:73209` | https://www.figma.com/design/CfbQjlet5WMabrTfZt46iL/Vitrina?node-id=3923-73209 |
| Toast / Publish | `1298:19269` | https://www.figma.com/design/CfbQjlet5WMabrTfZt46iL/Vitrina?node-id=1298-19269 |

### موبایل — Section (`1446:85828`)
| حالت | node-id | لینک |
|------|---------|------|
| Info empty | `1446:85829` | https://www.figma.com/design/CfbQjlet5WMabrTfZt46iL/Vitrina?node-id=1446-85829 |
| No-Gold Info | `1446:85879` | https://www.figma.com/design/CfbQjlet5WMabrTfZt46iL/Vitrina?node-id=1446-85879 |
| Gold Info | `1446:85940` | https://www.figma.com/design/CfbQjlet5WMabrTfZt46iL/Vitrina?node-id=1446-85940 |
| Info & Varient | `1446:86007` | https://www.figma.com/design/CfbQjlet5WMabrTfZt46iL/Vitrina?node-id=1446-86007 |

## اجزای فرم «اطلاعات محصول» (حالت استاندارد)

1. **اطلاعات پایه** — نام محصول*، دسته‌بندی*، شناسه کالا (auto + قابل ویرایش)، وزن
2. **قیمت‌گذاری** — قیمت اصلی* + واحد (تومان) + «تخفیف دارد»، «فروش تلفنی»، Alert اطلاع‌رسانی
3. **موجودی** — موجودی* + «موجودی نامحدود»، Alert هشدار موجودی صفر
4. **ویژگی‌های محصول** — ردیف‌های نام/مقدار + افزودن/حذف (empty: Alert «اول دسته را انتخاب کنید»)
5. **توضیحات اجمالی** — RichTextEditor
6. **برچسب‌ها** — TagsInput

## تصمیمات معماری
- حالت‌های مختلف (طلا/ارزی/تنوع) = **یک فرم با رندر شرطی** بر اساس `pricingMode` دسته (نه route/صفحهٔ جدا).
- `pricingMode` از config دستهٔ backend می‌آید (trigger)؛ رندر شرطی روی frontend. حالت «تنوع» = واکنش frontend به وجود تنوع.
- این پاس: **UI + state محلی** (بدون API/قیمت زنده/چک یکتایی SKU/محاسبهٔ واقعی طلا).
- توگل‌ها: **سوییچ راست، لیبل چپ** (مطابق convention پروژه).
</content>
</invoke>
