# Vitrina — Handoff
> آخرین آپدیت: 2026-07-28

## الان
آخرین commit (`6039969`): صفحهٔ تنظیمات «دامنه اختصاصی» (`/settings/domain`) اضافه شد.
از اون‌موقع (uncommitted روی `main`) — فیکس باگ در `DomainCard.tsx` NS-setup stepper:
- `orientation` به‌جای responsive object، با `useBreakpointValue` به یه string قطعی resolve می‌شه (باگ DS-level Chakra v3 Steps — جزئیات: `dev-knowledge/design-systems/chakra-ui-v3/known-bugs.md`)
- `Steps.Item` روی آیتم‌هایی که separator واقعی دارن `minH="20"` می‌گیره تا خط اتصال عمودی زیر indicator بعدی گم نشه؛ آیتم آخر (بدون separator) hug می‌کنه
- `CLAUDE.md`: breakpoint doc تصحیح شد (`lg` واقعی Chakra v3 = 1024px، نه 992px)

## بعدی
commit فیکس stepper (`DomainCard.tsx`) + `CLAUDE.md`.
