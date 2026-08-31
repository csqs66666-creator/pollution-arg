# -*- coding: utf-8 -*-
"""Remove white background from koi images -> transparent PNG with tight crop."""
from PIL import Image
import os

SRC = r"D:\workbuddy\2026-08-24-18-47-34\abyss-fishing\assets\desktop\koi"

JOBS = [
    ("koi-gold-big.png",             "koi-gold-big-alpha.png"),
    ("koi-red-black-with-lotus.png", "koi-red-black-alpha.png"),
    ("koi-red-white-black.jpg",      "koi-pair-alpha.png"),
]

WHITE_T = 242   # >= this on all channels => fully transparent
FEATHER_LO = 205  # start feathering below white threshold

def process(src, dst):
    im = Image.open(os.path.join(SRC, src)).convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            mn = min(r, g, b)
            mx = max(r, g, b)
            sat = mx - mn
            # near-white AND low saturation -> background
            if mn >= WHITE_T and sat < 18:
                px[x, y] = (r, g, b, 0)
            elif mn >= FEATHER_LO and sat < 30:
                # feather zone: scale alpha down smoothly
                t = (WHITE_T - mn) / (WHITE_T - FEATHER_LO)  # 0..1
                px[x, y] = (r, g, b, int(a * t))
    # tight crop to non-transparent bbox
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    im.save(os.path.join(SRC, dst), "PNG", optimize=True)
    print(src, "->", dst, im.size)

for s, d in JOBS:
    process(s, d)
print("done")
