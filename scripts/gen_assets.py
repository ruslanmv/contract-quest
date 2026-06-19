#!/usr/bin/env python3
"""Generates Contract Quest's original pixel-art assets into public/assets/.
All art is drawn programmatically (no third-party/copyrighted assets).
Run: python3 scripts/gen_assets.py"""
import os, math, random
from PIL import Image, ImageDraw

random.seed(7)
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "assets")
os.makedirs(OUT, exist_ok=True)

def img(w, h):
    return Image.new("RGBA", (w, h), (0, 0, 0, 0))

def save(im, name):
    im.save(os.path.join(OUT, name))
    print("  ", name, im.size)

OUTLINE = (16, 14, 10, 255)

# ---------------------------------------------------------------- backgrounds
def sky():
    w, h = 640, 360
    im = img(w, h); d = ImageDraw.Draw(im)
    top = (27, 42, 85); mid = (120, 74, 70); bot = (201, 122, 60)
    for y in range(h):
        t = y / h
        if t < 0.5:
            k = t / 0.5; c = tuple(int(top[i] + (mid[i] - top[i]) * k) for i in range(3))
        else:
            k = (t - 0.5) / 0.5; c = tuple(int(mid[i] + (bot[i] - mid[i]) * k) for i in range(3))
        d.line([(0, y), (w, y)], fill=c + (255,))
    # sun disc + glow
    for r in range(180, 0, -2):
        a = int(95 * (1 - r / 180) ** 1.4)
        d.ellipse([w * 0.66 - r, 205 - r, w * 0.66 + r, 205 + r], fill=(255, 214, 150, a))
    d.ellipse([w * 0.66 - 26, 205 - 26, w * 0.66 + 26, 205 + 26], fill=(255, 236, 190, 200))
    # soft warm clouds (light, high in the sky)
    for _ in range(5):
        cx = random.randint(0, w); cy = random.randint(30, 110)
        for _ in range(4):
            ox = random.randint(-30, 30); oy = random.randint(-6, 6)
            rw = random.randint(18, 42); rh = random.randint(7, 14)
            d.ellipse([cx + ox - rw, cy + oy - rh, cx + ox + rw, cy + oy + rh],
                      fill=(255, 232, 205, 16))
    save(im, "sky.png")

def city(name, base, alpha, win, count, hmin, hmax, w=960, h=300):
    im = img(w, h); d = ImageDraw.Draw(im)
    x = 0
    while x < w:
        bw = random.randint(40, 90); bh = random.randint(hmin, hmax)
        d.rectangle([x, h - bh, x + bw, h], fill=base + (alpha,))
        # antenna
        if random.random() < 0.4:
            d.line([(x + bw // 2, h - bh), (x + bw // 2, h - bh - 14)], fill=base + (alpha,))
        # lit windows
        if win:
            for wy in range(h - bh + 8, h - 8, 12):
                for wx in range(x + 6, x + bw - 6, 12):
                    if random.random() < 0.45:
                        d.rectangle([wx, wy, wx + 4, wy + 5], fill=(255, 200, 110, min(255, alpha + 90)))
        x += bw + random.randint(2, 10)
    save(im, name)

# ---------------------------------------------------------------- tiles
def ground():
    s = 32; im = img(s, s); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, s, s], fill=(74, 51, 32, 255))
    # bricks
    for by in range(6, s, 9):
        d.line([(0, by), (s, by)], fill=(54, 36, 22, 255))
    for i, by in enumerate(range(6, s, 9)):
        off = 0 if i % 2 else 16
        for bx in range(off, s, 32):
            d.line([(bx, by), (bx, by + 9)], fill=(54, 36, 22, 255))
    # highlights
    for bx in range(3, s, 8):
        d.point([(bx, 10)], fill=(96, 66, 42, 255))
    # mossy top
    d.rectangle([0, 0, s, 5], fill=(63, 125, 51, 255))
    for mx in range(0, s, 4):
        d.rectangle([mx, 4, mx + 2, 4 + random.randint(1, 4)], fill=(95, 168, 74, 255))
    save(im, "ground.png")

def metal():
    w, hh = 32, 16; im = img(w, hh); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, w, hh], fill=(70, 86, 106, 255))
    d.rectangle([0, 0, w, 3], fill=(127, 208, 255, 255))
    for rx in range(5, w, 9):
        d.ellipse([rx, 7, rx + 3, 10], fill=(40, 50, 64, 255))
    save(im, "metal.png")

# ---------------------------------------------------------------- hero sheet
def hero():
    fw, fh, frames = 28, 36, 4   # idle, run1, run2, jump
    im = img(fw * frames, fh)
    for f in range(frames):
        d = ImageDraw.Draw(im); ox = f * fw
        bob = 1 if f == 0 else 0
        legs = f  # vary legs
        # backpack
        d.rounded_rectangle([ox + 3, 12 + bob, ox + 9, 28 + bob], 2, fill=(90, 100, 114, 255), outline=OUTLINE)
        # body
        d.rounded_rectangle([ox + 6, 9 + bob, ox + 22, 30 + bob], 5, fill=(201, 205, 214, 255), outline=OUTLINE)
        d.rectangle([ox + 6, 20 + bob, ox + 22, 30 + bob], fill=(154, 160, 173, 255))
        # visor
        d.rounded_rectangle([ox + 8, 13 + bob, ox + 20, 22 + bob], 3, fill=(16, 36, 63, 255), outline=OUTLINE)
        d.ellipse([ox + 10, 16 + bob, ox + 13, 19 + bob], fill=(54, 194, 255, 255))
        d.ellipse([ox + 16, 16 + bob, ox + 19, 19 + bob], fill=(54, 194, 255, 255))
        # helmet
        d.pieslice([ox + 5, 2 + bob, ox + 23, 18 + bob], 180, 360, fill=(255, 176, 0, 255), outline=OUTLINE)
        d.rectangle([ox + 5, 9 + bob, ox + 23, 11 + bob], fill=(204, 138, 0, 255))
        # legs (animated)
        if f == 1:
            d.rectangle([ox + 8, 30 + bob, ox + 12, 36], fill=(120, 126, 138, 255), outline=OUTLINE)
            d.rectangle([ox + 16, 30 + bob, ox + 20, 34], fill=(120, 126, 138, 255), outline=OUTLINE)
        elif f == 2:
            d.rectangle([ox + 8, 30 + bob, ox + 12, 34], fill=(120, 126, 138, 255), outline=OUTLINE)
            d.rectangle([ox + 16, 30 + bob, ox + 20, 36], fill=(120, 126, 138, 255), outline=OUTLINE)
        elif f == 3:
            d.rectangle([ox + 9, 30, ox + 13, 35], fill=(120, 126, 138, 255), outline=OUTLINE)
            d.rectangle([ox + 15, 29, ox + 19, 34], fill=(120, 126, 138, 255), outline=OUTLINE)
        else:
            d.rectangle([ox + 9, 30 + bob, ox + 13, 36], fill=(120, 126, 138, 255), outline=OUTLINE)
            d.rectangle([ox + 16, 30 + bob, ox + 20, 36], fill=(120, 126, 138, 255), outline=OUTLINE)
    save(im, "hero.png")

# ---------------------------------------------------------------- enemies
def bug():
    w, hh = 32, 24; im = img(w, hh); d = ImageDraw.Draw(im)
    # legs
    for lx in (8, 16, 24):
        d.line([(lx, 18), (lx - 4, 24)], fill=OUTLINE, width=2)
        d.line([(lx, 18), (lx + 4, 24)], fill=OUTLINE, width=2)
    # shell
    d.ellipse([4, 4, 28, 20], fill=(255, 138, 60, 255), outline=OUTLINE)
    d.ellipse([4, 4, 28, 12], fill=(255, 170, 96, 255))
    d.line([(16, 5), (16, 19)], fill=(184, 90, 30, 255), width=1)
    # antennae + eyes
    d.line([(11, 5), (8, 0)], fill=OUTLINE, width=1); d.line([(21, 5), (24, 0)], fill=OUTLINE, width=1)
    d.ellipse([10, 9, 14, 13], fill=(255, 255, 255, 255)); d.ellipse([11, 10, 13, 12], fill=OUTLINE)
    d.ellipse([18, 9, 22, 13], fill=(255, 255, 255, 255)); d.ellipse([19, 10, 21, 12], fill=OUTLINE)
    save(im, "bug.png")

def slime():
    w, hh = 28, 22; im = img(w, hh); d = ImageDraw.Draw(im)
    d.pieslice([2, 0, 26, 30], 180, 360, fill=(176, 38, 255, 255), outline=OUTLINE)
    d.rectangle([2, 12, 26, 21], fill=(176, 38, 255, 255), outline=None)
    d.line([(2, 21), (26, 21)], fill=OUTLINE)
    d.ellipse([6, 4, 13, 11], fill=(200, 107, 255, 255))  # gloss
    d.ellipse([9, 11, 12, 15], fill=OUTLINE); d.ellipse([16, 11, 19, 15], fill=OUTLINE)  # eyes
    d.ellipse([10, 12, 11, 13], fill=(255, 255, 255, 255)); d.ellipse([17, 12, 18, 13], fill=(255, 255, 255, 255))
    save(im, "slime.png")

# ---------------------------------------------------------------- collectibles + props
def coin():
    s = 16; im = img(s, s); d = ImageDraw.Draw(im)
    d.ellipse([0, 0, 15, 15], fill=(255, 207, 51, 255), outline=OUTLINE)
    d.ellipse([2, 2, 13, 13], fill=(184, 134, 11, 255))
    d.ellipse([2, 2, 13, 13], outline=(255, 242, 168, 255))
    d.line([(6, 5), (4, 8), (6, 11)], fill=(255, 242, 168, 255))   # <
    d.line([(10, 5), (12, 8), (10, 11)], fill=(255, 242, 168, 255))  # >
    save(im, "coin.png")

def star():
    s = 30; im = img(s, s); d = ImageDraw.Draw(im); cx = cy = 15
    pts = []
    for i in range(10):
        r = 14 if i % 2 == 0 else 6
        a = math.pi / 5 * i - math.pi / 2
        pts.append((cx + math.cos(a) * r, cy + math.sin(a) * r))
    d.polygon(pts, fill=(58, 123, 255, 255), outline=(255, 255, 255, 255))
    save(im, "rmd.png")

def gate():
    w, hh = 96, 140; im = img(w, hh); d = ImageDraw.Draw(im)
    d.rounded_rectangle([6, 6, 90, 134], 8, fill=(43, 53, 80, 255), outline=(127, 208, 255, 160), width=2)
    d.rectangle([18, 18, 78, 122], fill=(20, 26, 44, 255))
    for r in range(46, 4, -3):
        a = int(200 * (1 - r / 46))
        d.ellipse([48 - r * 0.6, 70 - r, 48 + r * 0.6, 70 + r], fill=(31, 111, 255, a))
    d.polygon([(48, 48), (66, 70), (48, 92), (30, 70)], outline=(160, 210, 255, 255))
    # shield banners
    for sx in (14, 82):
        d.polygon([(sx - 8, 30), (sx + 8, 30), (sx + 8, 44), (sx, 52), (sx - 8, 44)], fill=(40, 70, 120, 255), outline=(127, 208, 255, 200))
    save(im, "gate.png")

def flag():
    w, hh = 26, 42; im = img(w, hh); d = ImageDraw.Draw(im)
    d.rectangle([4, 2, 7, 42], fill=(150, 160, 175, 255), outline=OUTLINE)
    d.polygon([(7, 4), (24, 9), (7, 18)], fill=(46, 86, 170, 255), outline=OUTLINE)
    d.line([(12, 10), (14, 13), (19, 7)], fill=(255, 255, 255, 255), width=2)
    save(im, "flag.png")

# ---------------------------------------------------------------- fx + ui
def glow():
    s = 64; im = img(s, s); d = ImageDraw.Draw(im)
    for r in range(32, 0, -1):
        a = int(120 * (1 - r / 32) ** 1.6)
        d.ellipse([32 - r, 32 - r, 32 + r, 32 + r], fill=(255, 255, 255, a))
    save(im, "glow.png")

def vignette():
    w, h = 320, 180; im = img(w, h); d = ImageDraw.Draw(im)
    cx, cy = w / 2, h / 2; maxd = (cx ** 2 + cy ** 2) ** 0.5
    for y in range(h):
        for x in range(0, w, 1):
            dist = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5 / maxd
            a = int(max(0, (dist - 0.55)) / 0.45 * 150)
            if a > 0:
                d.point([(x, y)], fill=(8, 6, 12, a))
    save(im, "vignette.png")

def ember():
    s = 8; im = img(s, s); d = ImageDraw.Draw(im)
    d.ellipse([1, 1, 6, 6], fill=(255, 200, 120, 255)); d.point([(4, 4)], fill=(255, 255, 230, 255))
    save(im, "ember.png")

def icon(name, draw_fn):
    s = 16; im = img(s, s); d = ImageDraw.Draw(im); draw_fn(d); save(im, name)

def icons():
    def coin_i(d):
        d.ellipse([1, 1, 14, 14], fill=(255, 207, 51, 255), outline=OUTLINE)
        d.line([(6, 5), (4, 8), (6, 11)], fill=(184, 134, 11, 255)); d.line([(10, 5), (12, 8), (10, 11)], fill=(184, 134, 11, 255))
    def robot_i(d):
        d.rounded_rectangle([2, 3, 13, 13], 3, fill=(201, 205, 214, 255), outline=OUTLINE)
        d.rectangle([4, 6, 11, 10], fill=(16, 36, 63, 255)); d.ellipse([5, 7, 7, 9], fill=(54, 194, 255, 255)); d.ellipse([9, 7, 11, 9], fill=(54, 194, 255, 255))
    def lock_i(d):
        d.rounded_rectangle([3, 7, 12, 14], 2, fill=(127, 176, 255, 255), outline=OUTLINE)
        d.arc([4, 2, 11, 10], 180, 360, fill=OUTLINE, width=2)
    def shield_i(d):
        d.polygon([(8, 1), (14, 4), (14, 9), (8, 15), (2, 9), (2, 4)], fill=(90, 200, 255, 255), outline=OUTLINE)
    def jump_i(d):
        d.polygon([(8, 2), (13, 9), (3, 9)], fill=(255, 207, 51, 255), outline=OUTLINE); d.rectangle([6, 9, 10, 14], fill=(255, 207, 51, 255), outline=OUTLINE)
    icon("icon_coin.png", coin_i); icon("icon_robot.png", robot_i)
    icon("icon_lock.png", lock_i); icon("icon_shield.png", shield_i); icon("icon_jump.png", jump_i)

def gate_swirl():
    s = 80; im = img(s, s); d = ImageDraw.Draw(im); cx = cy = 40
    for k in range(3):
        for t in range(0, 360, 5):
            a = math.radians(t + k * 120); r = 4 + t / 360 * 34
            x = cx + math.cos(a) * r; y = cy + math.sin(a) * r
            col = (170, 215, 255, 200) if k % 2 == 0 else (255, 255, 255, 170)
            d.ellipse([x - 2, y - 2, x + 2, y + 2], fill=col)
    save(im, "gate_swirl.png")

def coin_spin():
    fw, fh, n = 16, 16, 4; im = img(fw * n, fh); widths = [14, 11, 7, 11]
    for f in range(n):
        d = ImageDraw.Draw(im); ox = f * fw; w = widths[f]
        d.ellipse([ox + 8 - w // 2, 1, ox + 8 + w // 2, 15], fill=(255, 207, 51, 255), outline=OUTLINE)
        if w > 5:
            d.ellipse([ox + 8 - w // 2 + 1, 3, ox + 8 + w // 2 - 1, 13], outline=(255, 242, 168, 255))
    save(im, "coin_spin.png")

def lantern():
    w, h = 12, 20; im = img(w, h); d = ImageDraw.Draw(im)
    d.line([(6, 0), (6, 4)], fill=OUTLINE)
    d.rounded_rectangle([2, 4, 10, 16], 2, fill=(60, 52, 40, 255), outline=OUTLINE)
    d.rectangle([4, 6, 8, 14], fill=(255, 200, 110, 255))
    save(im, "lantern.png")

def plant():
    w, h = 18, 14; im = img(w, h); d = ImageDraw.Draw(im)
    for bx in (4, 9, 14):
        d.polygon([(bx, 14), (bx - 3, 5), (bx, 0), (bx + 3, 5)], fill=(63, 125, 51, 255), outline=(40, 90, 40, 255))
    save(im, "plant.png")

def ray():
    w, h = 200, 16; im = img(w, h); d = ImageDraw.Draw(im)
    for x in range(w):
        a = int(70 * (1 - x / w))
        d.line([(x, 0), (x, h)], fill=(255, 220, 150, a))
    save(im, "ray.png")

print("Generating assets ->", os.path.abspath(OUT))
sky()
city("city_far.png", (58, 42, 51), 150, False, 0, 90, 200, w=960, h=300)
city("city_near.png", (74, 56, 66), 210, True, 0, 130, 240, w=960, h=300)
ground(); metal(); hero(); bug(); slime(); coin(); coin_spin(); star(); gate(); gate_swirl(); flag()
glow(); vignette(); ember(); ray(); lantern(); plant(); icons()
print("done.")
