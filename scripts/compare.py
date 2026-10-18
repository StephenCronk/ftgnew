#!/usr/bin/env python3
"""Usage: compare.py ref.png new.png out.png [top] [height]
Crops both to the given vertical window and writes them side by side (ref left, new right)."""
import sys
from PIL import Image
ref, new, out = sys.argv[1:4]
top = int(sys.argv[4]) if len(sys.argv) > 4 else 0
h = int(sys.argv[5]) if len(sys.argv) > 5 else 1800
a = Image.open(ref).convert('RGB'); b = Image.open(new).convert('RGB')
w = max(a.width, b.width)
a = a.crop((0, top, a.width, top + h)); b = b.crop((0, top, b.width, top + h))
canvas = Image.new('RGB', (a.width + b.width + 20, h), (255, 0, 255))
canvas.paste(a, (0, 0)); canvas.paste(b, (a.width + 20, 0))
canvas.save(out)
