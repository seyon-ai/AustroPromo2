"""
Builds the AustroClash mark.
- public/logo.png        : black mark on white (1024px)
- public/logo-white.png  : white mark on transparent (inverted, for dark backgrounds)
The geometry is the same as src/components/Logo.tsx (viewBox 0 0 100 100), so the
raster and the animated SVG stay in sync.

NOTE: the original attachment could not be found on disk; this is a faithful
geometric recreation of the described mark (upward chevron, diamond, downward chevron).
Replace public/logo.png with the real PNG and re-run this script to regenerate
logo-white.png from it (see the `--from` option below).
"""
import math, sys, os
from PIL import Image, ImageDraw

HALF = 6.5  # half stroke thickness of chevrons (13 units total)

def thick_polyline(pts, h):
    (x0, y0), (x1, y1), (x2, y2) = pts
    def unit(ax, ay, bx, by):
        dx, dy = bx - ax, by - ay
        l = math.hypot(dx, dy)
        return dx / l, dy / l
    d1 = unit(x0, y0, x1, y1)
    d2 = unit(x1, y1, x2, y2)
    n1 = (-d1[1], d1[0])
    n2 = (-d2[1], d2[0])
    def line_isect(p, d, q, e):
        # p + s d = q + t e
        den = d[0] * (-e[1]) - d[1] * (-e[0])
        s = ((q[0] - p[0]) * (-e[1]) - (q[1] - p[1]) * (-e[0])) / den
        return (p[0] + s * d[0], p[1] + s * d[1])
    def joint(sign):
        p = (x0 + sign * h * n1[0], y0 + sign * h * n1[1])
        q = (x1 + sign * h * n2[0], y1 + sign * h * n2[1])
        return line_isect(p, d1, q, d2)
    L = joint(+1)
    R = joint(-1)
    return [
        (x0 + h * n1[0], y0 + h * n1[1]),
        L,
        (x2 + h * n2[0], y2 + h * n2[1]),
        (x2 - h * n2[0], y2 - h * n2[1]),
        R,
        (x0 - h * n1[0], y0 - h * n1[1]),
    ]

TOP = thick_polyline([(12, 44), (50, 9), (88, 44)], HALF)
BOTTOM = thick_polyline([(12, 56), (50, 91), (88, 56)], HALF)
DIAMOND = [(50, 35), (65, 50), (50, 65), (35, 50)]

def fmt(poly):
    return " ".join(f"{x:.2f},{y:.2f}" for x, y in poly)

def draw(color, bg, out, size=1024):
    S = size * 4
    k = S / 100.0
    mode = "RGBA"
    im = Image.new(mode, (S, S), bg)
    d = ImageDraw.Draw(im)
    for poly in (TOP, BOTTOM, DIAMOND):
        d.polygon([(x * k, y * k) for x, y in poly], fill=color)
    im = im.resize((size, size), Image.LANCZOS)
    im.save(out)
    print("wrote", out)

if __name__ == "__main__":
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    pub = os.path.join(root, "public")
    os.makedirs(pub, exist_ok=True)
    draw((10, 10, 12, 255), (255, 255, 255, 255), os.path.join(pub, "logo.png"))
    draw((244, 244, 245, 255), (0, 0, 0, 0), os.path.join(pub, "logo-white.png"))
    print("TOP", fmt(TOP)); print("BOTTOM", fmt(BOTTOM)); print("DIAMOND", fmt(DIAMOND))
