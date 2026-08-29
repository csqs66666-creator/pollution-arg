from PIL import Image
import os

ROOT = r"D:\workbuddy\2026-08-24-18-47-34\abyss-fishing"
SRC = os.path.join(ROOT, "assets", "pin")
OUT = os.path.join(ROOT, "assets", "pin", "crops")
os.makedirs(OUT, exist_ok=True)

# (文件名, 列数, 行数) —— 按网格切，单只眼/单块独立成文件，青司随便挑
jobs = [
    ("crt-eyes-array.jpg", 3, 3),
    ("eyes-collage.jpg",   3, 3),
    ("hands-reaching.jpg", 3, 1),
]

manifest = []
for fname, cols, rows in jobs:
    im = Image.open(os.path.join(SRC, fname)).convert("RGB")
    w, h = im.size
    tw, th = w // cols, h // rows
    base = fname.rsplit(".", 1)[0]
    n = 0
    for r in range(rows):
        for c in range(cols):
            box = (c * tw, r * th, c * tw + tw, r * th + th)
            tile = im.crop(box)
            out = os.path.join(OUT, f"{base}_r{r}c{c}.jpg")
            tile.save(out, quality=88)
            manifest.append(f"{base}_r{r}c{c}.jpg  ({tw}x{th})")
            n += 1
    print(f"{fname}: {cols}x{rows} -> {n} 张, 原图 {w}x{h}")

with open(os.path.join(OUT, "manifest.txt"), "w", encoding="utf-8") as f:
    f.write("\n".join(manifest))
print("总切图:", len(manifest))
