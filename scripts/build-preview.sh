#!/usr/bin/env bash
# ساخت پیش‌نمایش زندهٔ یک چک‌پوینت از صفحهٔ ویرایشگر محصول.
#
# خروجی استاتیک Next را می‌گیرد و فقط فایل‌هایی را که همین صفحه ارجاع می‌دهد
# برمی‌دارد، تا چند چک‌پوینت کنار هم در سقف ۲۵۵ فایلِ Artifact جا شوند.
#
# ⚠️ HTML خروجی را دستکاری نکن. مسیرها با `assetPrefix: '.'` در خودِ build نسبی
# می‌شوند؛ بازنویسیِ بعدیِ `/_next/` در HTML، مسیرهای داخل payload را ناسازگار
# می‌کند و صفحه اصلاً هیدریت نمی‌شود (استاتیکِ بی‌جان می‌ماند).
#
# استفاده:  scripts/build-preview.sh <out-dir>
set -euo pipefail

DEST="${1:?usage: build-preview.sh <out-dir>}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
cd "$ROOT"

# مسیر داینامیک با output:export سازگار نیست (generateStaticParams ندارد) —
# موقتاً کنار می‌رود و در هر حالتی برمی‌گردد.
DYN="src/app/orders/[orderId]"
restore() { [ -d "$TMP/dynroute" ] && mv "$TMP/dynroute" "$DYN" || true; }
if [ -d "$DYN" ]; then mv "$DYN" "$TMP/dynroute"; fi
trap restore EXIT
STATIC_EXPORT=1 pnpm build >/dev/null
restore; trap - EXIT

rm -rf "$DEST"; mkdir -p "$DEST"

python3 - "$DEST" <<'PY'
import os, re, shutil, sys
dest = sys.argv[1]
html = open('out/products/new/index.html', encoding='utf-8').read()

# صفحه با assetPrefix='.' به «./_next/...» ارجاع می‌دهد → _next کنار خودِ فایل
refs = sorted(set(re.findall(r'\./(_next/[A-Za-z0-9._/-]+)', html)))
copied = 0
for r in refs:
    p = os.path.join('out', r)
    if not os.path.isfile(p):
        continue
    out = os.path.join(dest, r)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    shutil.copy2(p, out)
    copied += 1

shutil.copy2('out/products/new/index.html', os.path.join(dest, 'index.html'))

# چانک‌های ری‌اکت کاراکتر U+FFFD را عیناً داخل رشته می‌گذارند (مسیر decode کردن URI و
# escape کردن CSS). انتشار Artifact فایل متنی حاوی این کاراکتر را رد می‌کند، پس فقط
# جایی که دقیقاً "<U+FFFD>" است به escape معادلش تبدیل می‌شود — از نظر اجرا یکسان.
fixed = 0
for root_dir, _, names in os.walk(dest):
    for n in names:
        if not n.endswith('.js'):
            continue
        fp = os.path.join(root_dir, n)
        t = open(fp, encoding='utf-8').read()
        if '\ufffd' not in t:
            continue
        t2 = t.replace('"\ufffd"', '"\\uFFFD"')
        assert '\ufffd' not in t2, f'U+FFFD outside a string literal in {fp}'
        open(fp, 'w', encoding='utf-8').write(t2)
        fixed += 1

print(f'refs={len(refs)} copied={copied} escaped={fixed}')
PY

echo "files: $(find "$DEST" -type f | wc -l)  size: $(du -sh "$DEST" | cut -f1)"
