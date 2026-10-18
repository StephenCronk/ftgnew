#!/usr/bin/env bash
# Usage: scripts/shot.sh <url> <out.png> [width=1440] [height=9000]
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CH" --headless=new --disable-gpu --hide-scrollbars --window-size="${3:-1440},${4:-9000}" --virtual-time-budget=6000 --screenshot="$2" "$1" 2>/dev/null
