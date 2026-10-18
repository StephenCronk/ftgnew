#!/usr/bin/env bash
# Screenshot a page of the local build at true phone width (390px).
# Headless Chrome will not make a window narrower than 500px, so the page is
# rendered inside a 390px iframe. Builds _site first if it is missing.
# Usage: scripts/shot-mobile.sh <page-path> <out.png> [max-height=14000]
#   e.g. scripts/shot-mobile.sh /contact/ /tmp/contact-390.png
set -euo pipefail
cd "$(dirname "$0")/.."
PAGE="${1:?page path, e.g. /about/}"; OUT="${2:?output png}"; H="${3:-14000}"
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -f _site/index.html ] || npx eleventy --quiet >/dev/null
PORT=$(( 8100 + RANDOM % 800 ))
/usr/bin/python3 -m http.server "$PORT" --directory _site >/dev/null 2>&1 &
SRV=$!; disown "$SRV"
HARNESS=_site/__mobile-harness.html
trap 'kill $SRV 2>/dev/null; rm -f "$HARNESS"' EXIT
cat > "$HARNESS" <<EOF
<!doctype html><html><body style="margin:0;background:#888">
<iframe id="f" src="$PAGE" style="width:390px;height:${H}px;border:0"></iframe>
<script>const f=document.getElementById('f');f.onload=()=>{const b=f.contentDocument.getElementById('cookie-bar');if(b)b.hidden=true;setTimeout(()=>{const d=f.contentDocument,e=d.querySelector('.site-footer')||d.body;f.style.height=Math.ceil(e.getBoundingClientRect().bottom+f.contentWindow.scrollY)+'px';},300);};</script>
</body></html>
EOF
sleep 1
"$CH" --headless=new --disable-gpu --hide-scrollbars --window-size=500,"$H" --virtual-time-budget=6000 \
  --screenshot="$OUT" "http://localhost:$PORT/__mobile-harness.html" >/dev/null 2>&1
/usr/bin/python3 -c "
from PIL import Image
im = Image.open('$OUT').convert('RGB').crop((0, 0, 390, $H))
px = im.load()
# trim the grey area below the page
bottom = $H
while bottom > 1 and px[5, bottom - 1] == (136, 136, 136): bottom -= 1
im.crop((0, 0, 390, bottom)).save('$OUT')
print('$OUT', 390, bottom)
"
