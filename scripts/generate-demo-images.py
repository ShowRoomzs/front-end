# -*- coding: utf-8 -*-
"""
데모 이미지 생성기 — src/demo/images/ 아래 61장을 만든다.

투자 미팅용 데모 빌드에 들어갈 화면을 채우기 위한 것이다. 실제 촬영본을 받으면 같은 파일명으로
덮어쓰면 되고, 이 스크립트는 그때 지워도 된다.

**사람 얼굴이나 실제 브랜드 제품을 흉내내지 않는다.** 쇼룸 아바타는 모노그램이고, 상품은
스튜디오 배경 위의 제품 형태 일러스트다 — 실물 사진인 척하지 않으면서도 화면이 비어 보이지
않게 하는 것이 목적이다.

실행:
    cd front-end && python scripts/generate-demo-images.py
"""
import os
import math
import random

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "src", "demo", "images")
FONT_PATH = os.path.join(ROOT, "src", "common", "assets", "fonts", "PretendardVariable.ttf")

SS = 2  # 슈퍼샘플링 배수 — 2배로 그린 뒤 줄여 계단현상을 없앤다


def font(size):
    return ImageFont.truetype(FONT_PATH, int(size))


# ─────────────────────────────────────────────────────────── 색

PALETTES = {
    "labo": {  # 라보에이치 — 시카/진정, 세이지 그린
        "bg1": (243, 241, 236), "bg2": (222, 216, 205),
        "body": (232, 238, 231), "body2": (198, 212, 198),
        "cap": (76, 92, 76), "accent": (110, 127, 107), "ink": (58, 66, 57),
    },
    "harubi": {  # 하루비 — 클린뷰티, 민트 아이보리
        "bg1": (240, 244, 240), "bg2": (211, 224, 214),
        "body": (244, 249, 246), "body2": (206, 226, 214),
        "cap": (95, 133, 112), "accent": (95, 133, 112), "ink": (52, 74, 62),
    },
    "nutricell": {  # 뉴트리셀 — 비타민, 피치 앰버
        "bg1": (250, 240, 229), "bg2": (236, 214, 189),
        "body": (250, 226, 195), "body2": (232, 190, 142),
        "cap": (176, 118, 58), "accent": (201, 138, 75), "ink": (94, 62, 30),
    },
    "coralogy": {  # 코랄로지 — 색조, 블러시 로즈
        "bg1": (249, 238, 240), "bg2": (233, 205, 212),
        "body": (247, 226, 230), "body2": (226, 178, 190),
        "cap": (150, 74, 92), "accent": (196, 101, 124), "ink": (96, 48, 60),
    },
    "daeunlab": {  # 다은랩 — 헤어, 라벤더 그레이
        "bg1": (240, 238, 245), "bg2": (213, 208, 226),
        "body": (233, 230, 243), "body2": (200, 193, 222),
        "cap": (95, 85, 120), "accent": (122, 110, 150), "ink": (60, 53, 79),
    },
    "neutral": {
        "bg1": (245, 243, 240), "bg2": (224, 219, 212),
        "body": (238, 236, 232), "body2": (212, 207, 200),
        "cap": (90, 88, 84), "accent": (120, 116, 110), "ink": (60, 58, 55),
    },
}


def lerp(c1, c2, t):
    return tuple(int(round(a + (b - a) * t)) for a, b in zip(c1, c2))


# ─────────────────────────────────────────────────────────── 배경

def gradient(size, c1, c2, direction="v"):
    w, h = size
    if direction == "v":
        t = np.tile(np.linspace(0, 1, h)[:, None], (1, w))
    else:
        t = np.tile(np.linspace(0, 1, w)[None, :], (h, 1))
    a = np.array(c1, float)[None, None, :] * (1 - t[:, :, None])
    b = np.array(c2, float)[None, None, :] * t[:, :, None]
    return Image.fromarray((a + b).astype(np.uint8), "RGB")


def radial_glow(im, cx=0.5, cy=0.38, radius=0.62, color=(255, 255, 255), strength=0.55):
    """스튜디오 조명 — 위쪽 한 점에서 부드럽게 퍼지는 밝은 원."""
    w, h = im.size
    yy, xx = np.mgrid[0:h, 0:w]
    dx = (xx / w - cx) * (w / max(w, h))
    dy = (yy / h - cy) * (h / max(w, h))
    d = np.sqrt(dx * dx + dy * dy) / radius
    m = np.clip(1 - d, 0, 1) ** 2 * strength
    arr = np.array(im, float)
    rgb = arr[:, :, :3]
    rgb = rgb * (1 - m[:, :, None]) + np.array(color, float)[None, None, :] * m[:, :, None]
    arr[:, :, :3] = rgb
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), im.mode)


def vignette(im, strength=0.16):
    w, h = im.size
    yy, xx = np.mgrid[0:h, 0:w]
    dx = (xx / w - 0.5) * 2
    dy = (yy / h - 0.5) * 2
    d = np.clip(np.sqrt(dx * dx + dy * dy) / 1.414, 0, 1)
    m = 1 - strength * d ** 2
    arr = np.array(im, float)
    arr[:, :, :3] = arr[:, :, :3] * m[:, :, None]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), im.mode)


def grain(im, amount=3.0):
    arr = np.array(im).astype(np.int16)
    n = np.random.normal(0, amount, arr.shape[:2])[:, :, None]
    arr[:, :, :3] = np.clip(arr[:, :, :3] + n, 0, 255)
    return Image.fromarray(arr.astype(np.uint8), im.mode)


def studio_bg(size, pal, glow=0.5, cy=0.34):
    im = gradient(size, pal["bg1"], pal["bg2"], "v")
    return radial_glow(im, cy=cy, strength=glow)


# ─────────────────────────────────────────────────────────── 합성

def drop_shadow(base, mask, offset=(0, 18), blur=26, opacity=64, color=(40, 36, 32)):
    """마스크 모양의 그림자를 base에 먼저 깐다."""
    sh = mask.filter(ImageFilter.GaussianBlur(blur))
    sh = sh.point(lambda v: int(v * opacity / 255))
    layer = Image.new("RGBA", base.size, color + (0,))
    layer.putalpha(sh)
    base.alpha_composite(layer, dest=(0, 0)) if False else None
    shifted = Image.new("RGBA", base.size, (0, 0, 0, 0))
    shifted.paste(layer, offset, layer)
    return Image.alpha_composite(base, shifted)


def contact_shadow(base, cx, cy, rx, ry, opacity=70):
    """바닥에 닿는 자리의 짙은 타원 그림자."""
    m = Image.new("L", base.size, 0)
    ImageDraw.Draw(m).ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=opacity)
    m = m.filter(ImageFilter.GaussianBlur(int(ry * 0.9) + 6))
    layer = Image.new("RGBA", base.size, (52, 46, 40, 0))
    layer.putalpha(m)
    return Image.alpha_composite(base, layer)


def gloss(layer, box, strength=90, side="l"):
    """제품 표면의 세로 하이라이트 띠."""
    x0, y0, x1, y1 = box
    w = x1 - x0
    gx0 = x0 + w * (0.14 if side == "l" else 0.66)
    gx1 = x0 + w * (0.30 if side == "l" else 0.84)
    m = Image.new("L", layer.size, 0)
    ImageDraw.Draw(m).rounded_rectangle([gx0, y0 + (y1 - y0) * 0.06, gx1, y1 - (y1 - y0) * 0.08],
                                        radius=int(w * 0.1), fill=strength)
    m = m.filter(ImageFilter.GaussianBlur(int(w * 0.06) + 3))
    hl = Image.new("RGBA", layer.size, (255, 255, 255, 0))
    hl.putalpha(m)
    return Image.alpha_composite(layer, hl)


def body_gradient_fill(layer, mask, c_left, c_right):
    """마스크 영역을 좌→우 그라디언트로 채운다 — 원통형 음영."""
    g = gradient(layer.size, c_left, c_right, "h").convert("RGBA")
    g.putalpha(mask)
    return Image.alpha_composite(layer, g)


# ─────────────────────────────────────────────────────────── 제품 형태

def _cyl_colors(pal):
    return lerp(pal["body"], (255, 255, 255), 0.35), lerp(pal["body2"], (0, 0, 0), 0.10)


def form_dropper(size, pal, slim=False):
    """스포이드 앰플 병"""
    W, H = size
    lay = Image.new("RGBA", size, (0, 0, 0, 0))
    bw = W * (0.24 if slim else 0.30)
    bh = H * 0.44
    cx, by = W * 0.5, H * 0.80
    box = [cx - bw / 2, by - bh, cx + bw / 2, by]
    m = Image.new("L", size, 0)
    d = ImageDraw.Draw(m)
    d.rounded_rectangle(box, radius=int(bw * 0.16), fill=255)
    # 목
    nw = bw * 0.34
    d.rectangle([cx - nw / 2, by - bh - H * 0.05, cx + nw / 2, by - bh + 6], fill=255)
    lay = body_gradient_fill(lay, m, *_cyl_colors(pal))
    # 스포이드 캡
    cm = Image.new("L", size, 0)
    cd = ImageDraw.Draw(cm)
    cw = bw * 0.52
    cd.rounded_rectangle([cx - cw / 2, by - bh - H * 0.155, cx + cw / 2, by - bh - H * 0.045],
                         radius=int(cw * 0.22), fill=255)
    cap = Image.new("RGBA", size, (0, 0, 0, 0))
    cg = gradient(size, lerp(pal["cap"], (255, 255, 255), 0.3), pal["cap"], "h").convert("RGBA")
    cg.putalpha(cm)
    cap = Image.alpha_composite(cap, cg)
    lay = Image.alpha_composite(lay, cap)
    lay = gloss(lay, box)
    return lay, box, m


def form_jar(size, pal, squat=True):
    """넓은 원형 용기"""
    W, H = size
    lay = Image.new("RGBA", size, (0, 0, 0, 0))
    bw = W * (0.50 if squat else 0.42)
    bh = H * (0.26 if squat else 0.34)
    cx, by = W * 0.5, H * 0.76
    box = [cx - bw / 2, by - bh, cx + bw / 2, by]
    m = Image.new("L", size, 0)
    d = ImageDraw.Draw(m)
    d.rounded_rectangle(box, radius=int(bw * 0.13), fill=255)
    lay = body_gradient_fill(lay, m, *_cyl_colors(pal))
    # 뚜껑
    cm = Image.new("L", size, 0)
    ImageDraw.Draw(cm).rounded_rectangle([cx - bw / 2 - 4, by - bh - H * 0.075, cx + bw / 2 + 4, by - bh + H * 0.012],
                                         radius=int(bw * 0.10), fill=255)
    cg = gradient(size, lerp(pal["cap"], (255, 255, 255), 0.28), pal["cap"], "h").convert("RGBA")
    cg.putalpha(cm)
    lay = Image.alpha_composite(lay, cg)
    lay = gloss(lay, box)
    return lay, box, m


def form_tube(size, pal, slim=False):
    """튜브 — 위가 좁고 아래가 각진 형태"""
    W, H = size
    lay = Image.new("RGBA", size, (0, 0, 0, 0))
    bw = W * (0.20 if slim else 0.26)
    bh = H * 0.50
    cx, by = W * 0.5, H * 0.80
    box = [cx - bw / 2, by - bh, cx + bw / 2, by]
    m = Image.new("L", size, 0)
    d = ImageDraw.Draw(m)
    d.rounded_rectangle(box, radius=int(bw * 0.14), fill=255)
    d.rectangle([cx - bw / 2, by - bh * 0.18, cx + bw / 2, by], fill=255)  # 아래는 각지게
    lay = body_gradient_fill(lay, m, *_cyl_colors(pal))
    # 캡
    cm = Image.new("L", size, 0)
    cw = bw * 0.78
    ImageDraw.Draw(cm).rounded_rectangle([cx - cw / 2, by - bh - H * 0.085, cx + cw / 2, by - bh + 5],
                                         radius=int(cw * 0.20), fill=255)
    cg = gradient(size, lerp(pal["cap"], (255, 255, 255), 0.3), pal["cap"], "h").convert("RGBA")
    cg.putalpha(cm)
    lay = Image.alpha_composite(lay, cg)
    lay = gloss(lay, box)
    return lay, box, m


def form_pump(size, pal):
    """펌프 보틀"""
    W, H = size
    lay = Image.new("RGBA", size, (0, 0, 0, 0))
    bw = W * 0.30
    bh = H * 0.46
    cx, by = W * 0.5, H * 0.80
    box = [cx - bw / 2, by - bh, cx + bw / 2, by]
    m = Image.new("L", size, 0)
    d = ImageDraw.Draw(m)
    d.rounded_rectangle(box, radius=int(bw * 0.18), fill=255)
    lay = body_gradient_fill(lay, m, *_cyl_colors(pal))
    cm = Image.new("L", size, 0)
    cd = ImageDraw.Draw(cm)
    nw = bw * 0.36
    cd.rectangle([cx - nw / 2, by - bh - H * 0.055, cx + nw / 2, by - bh + 4], fill=255)
    cd.rounded_rectangle([cx - nw * 0.75, by - bh - H * 0.10, cx + nw * 0.75, by - bh - H * 0.048],
                         radius=int(nw * 0.3), fill=255)
    cd.rounded_rectangle([cx - nw * 1.5, by - bh - H * 0.098, cx - nw * 0.6, by - bh - H * 0.070],
                         radius=int(nw * 0.25), fill=255)  # 노즐
    cg = gradient(size, lerp(pal["cap"], (255, 255, 255), 0.3), pal["cap"], "h").convert("RGBA")
    cg.putalpha(cm)
    lay = Image.alpha_composite(lay, cg)
    lay = gloss(lay, box)
    return lay, box, m


def form_lipstick(size, pal):
    """립스틱 케이스 + 노출된 발색부"""
    W, H = size
    lay = Image.new("RGBA", size, (0, 0, 0, 0))
    bw = W * 0.16
    bh = H * 0.36
    cx, by = W * 0.5, H * 0.78
    box = [cx - bw / 2, by - bh, cx + bw / 2, by]
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).rounded_rectangle(box, radius=int(bw * 0.16), fill=255)
    lay = body_gradient_fill(lay, m, lerp(pal["cap"], (255, 255, 255), 0.35), pal["cap"])
    # 발색부
    tm = Image.new("L", size, 0)
    tw = bw * 0.74
    ty = by - bh
    ImageDraw.Draw(tm).polygon(
        [(cx - tw / 2, ty), (cx + tw / 2, ty), (cx + tw / 2, ty - H * 0.10), (cx - tw / 2, ty - H * 0.15)],
        fill=255)
    tip = lerp(pal["accent"], (255, 120, 140), 0.35)
    tg = gradient(size, lerp(tip, (255, 255, 255), 0.25), lerp(tip, (0, 0, 0), 0.18), "h").convert("RGBA")
    tg.putalpha(tm)
    lay = Image.alpha_composite(lay, tg)
    lay = gloss(lay, box, strength=110)
    return lay, box, m


def form_palette(size, pal, cols=3, rows=3):
    """아이팔레트 — 눕힌 컴팩트에 색 격자"""
    W, H = size
    lay = Image.new("RGBA", size, (0, 0, 0, 0))
    bw, bh = W * 0.62, H * 0.40
    cx, cy = W * 0.5, H * 0.56
    box = [cx - bw / 2, cy - bh / 2, cx + bw / 2, cy + bh / 2]
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).rounded_rectangle(box, radius=int(W * 0.035), fill=255)
    lay = body_gradient_fill(lay, m, lerp(pal["cap"], (255, 255, 255), 0.25), pal["cap"])
    d = ImageDraw.Draw(lay, "RGBA")
    pad = W * 0.045
    gw = (bw - pad * 2) / cols
    gh = (bh - pad * 2) / rows
    base_tones = [(226, 197, 178), (198, 158, 136), (166, 121, 104), (232, 214, 205),
                  (140, 96, 90), (206, 168, 176), (118, 92, 88), (183, 143, 128), (96, 74, 72)]
    for r in range(rows):
        for c in range(cols):
            x0 = box[0] + pad + c * gw + gw * 0.06
            y0 = box[1] + pad + r * gh + gh * 0.06
            x1 = x0 + gw * 0.88
            y1 = y0 + gh * 0.88
            tone = base_tones[(r * cols + c) % len(base_tones)]
            d.rounded_rectangle([x0, y0, x1, y1], radius=int(gw * 0.10), fill=tone + (255,))
            d.rounded_rectangle([x0, y0, x1, y0 + (y1 - y0) * 0.4], radius=int(gw * 0.10),
                                fill=lerp(tone, (255, 255, 255), 0.18) + (70,))
    return lay, box, m


FORMS = {
    "dropper": form_dropper,
    "dropper_slim": lambda s, p: form_dropper(s, p, slim=True),
    "jar": form_jar,
    "jar_tall": lambda s, p: form_jar(s, p, squat=False),
    "tube": form_tube,
    "tube_slim": lambda s, p: form_tube(s, p, slim=True),
    "pump": form_pump,
    "lipstick": form_lipstick,
    "palette": form_palette,
}


# ─────────────────────────────────────────────────────────── 라벨

def draw_label(im, box, brand, name_kr, pal, scale=1.0):
    """제품 몸통 위의 라벨 — 브랜드 로마자 + 한글 제품명"""
    d = ImageDraw.Draw(im, "RGBA")
    x0, y0, x1, y1 = box
    w = x1 - x0
    cx = (x0 + x1) / 2
    ly = y0 + (y1 - y0) * 0.42
    fb = font(w * 0.115 * scale)
    fn = font(w * 0.093 * scale)
    d.text((cx, ly), brand.upper(), font=fb, fill=pal["ink"] + (215,), anchor="mm")
    d.line([cx - w * 0.16, ly + w * 0.115, cx + w * 0.16, ly + w * 0.115],
           fill=pal["ink"] + (90,), width=max(1, int(w * 0.006)))
    d.text((cx, ly + w * 0.215), name_kr, font=fn, fill=pal["ink"] + (185,), anchor="mm")
    return im


# ─────────────────────────────────────────────────────────── 상품 컷

def product_shot(out_path, size, pal_key, form_key, brand, label_kr, caption=None, glow=0.5):
    pal = PALETTES[pal_key]
    S = (size[0] * SS, size[1] * SS)
    base = studio_bg(S, pal, glow=glow).convert("RGBA")

    lay, box, mask = FORMS[form_key](S, pal)
    base = contact_shadow(base, (box[0] + box[2]) / 2, box[3] - S[1] * 0.004,
                          (box[2] - box[0]) * 0.62, S[1] * 0.022)
    base = drop_shadow(base, mask, offset=(0, int(S[1] * 0.016)), blur=int(S[0] * 0.028), opacity=58)
    base = Image.alpha_composite(base, lay)
    base = draw_label(base, box, brand, label_kr, pal)

    if caption:
        d = ImageDraw.Draw(base, "RGBA")
        f = font(S[0] * 0.036)
        d.text((S[0] * 0.5, S[1] * 0.945), caption, font=f, fill=pal["ink"] + (120,), anchor="mm")

    im = base.convert("RGB").resize(size, Image.LANCZOS)
    im = vignette(im, 0.14)
    im = grain(im, 2.6)
    im.save(out_path, "JPEG", quality=86, optimize=True)


def texture_shot(out_path, size, pal_key, kind="smear", form_key="jar"):
    """두 번째 컷 — 같은 제품의 **클로즈업**이거나 색 스와치다.

    처음에는 제형을 흐린 얼룩으로 그렸는데, 상품 상세에서 옆으로 넘겼을 때 빈 이미지처럼
    보였다. 두 번째 컷의 역할은 "다른 각도에서 한 번 더 보여 주는 것"이므로, 제품을 크게
    잘라 담는 편이 그 역할을 한다.
    """
    pal = PALETTES[pal_key]
    S = (size[0] * SS, size[1] * SS)
    rnd = random.Random(hash(out_path) & 0xFFFF)

    if kind == "swatch":
        base = studio_bg(S, pal, glow=0.45, cy=0.4).convert("RGBA")
        n = 5
        for i in range(n):
            cx = S[0] * (0.5 + (i - (n - 1) / 2) * 0.16)
            cy = S[1] * 0.5
            r = S[0] * 0.068
            tone = lerp(pal["accent"], (255, 255, 255), 0.06 + 0.15 * i)
            m = Image.new("L", S, 0)
            ImageDraw.Draw(m).ellipse([cx - r, cy - r * 1.3, cx + r, cy + r * 1.3], fill=245)
            m = m.filter(ImageFilter.GaussianBlur(int(S[0] * 0.005)))
            lyr = Image.new("RGBA", S, tone + (0,))
            lyr.putalpha(m)
            base = Image.alpha_composite(base, lyr)
        d = ImageDraw.Draw(base, "RGBA")
        d.text((S[0] * 0.5, S[1] * 0.80), "전 색상 스와치", font=font(S[0] * 0.038),
               fill=pal["ink"] + (140,), anchor="mm")
    else:
        # 색면을 절반 깔고 그 위에 제품을 크게 잘라 담는다
        base = gradient(S, lerp(pal["bg1"], (255, 255, 255), 0.4), pal["bg2"], "v").convert("RGBA")
        d = ImageDraw.Draw(base, "RGBA")
        d.rectangle([0, int(S[1] * 0.56), S[0], S[1]],
                    fill=lerp(pal["accent"], (255, 255, 255), 0.72) + (255,))
        base = radial_glow(base, cx=0.62, cy=0.3, radius=0.5, strength=0.4)

        # 같은 제품을 한쪽으로 밀어 담는다 — 뚜껑과 라벨이 보여야 "같은 제품의 다른 컷"으로 읽힌다
        big = (int(S[0] * 1.10), int(S[1] * 1.10))
        lay, box, mask = FORMS[form_key](big, pal)
        ox = int(S[0] * 0.13 + rnd.randint(-14, 14))
        oy = int(-S[1] * 0.13)
        mh = Image.new("L", S, 0)
        mh.paste(mask, (ox, oy))
        holder = Image.new("RGBA", S, (0, 0, 0, 0))
        holder.paste(lay, (ox, oy), lay)
        base = drop_shadow(base, mh, offset=(int(S[0] * 0.01), int(S[1] * 0.014)),
                           blur=int(S[0] * 0.035), opacity=60)
        base = Image.alpha_composite(base, holder)

    im = base.convert("RGB").resize(size, Image.LANCZOS)
    im = vignette(im, 0.16)
    im = grain(im, 3.0)
    im.save(out_path, "JPEG", quality=85, optimize=True)


def detail_sheet(out_path, size, pal_key, form_key, brand, title_kr, bullets):
    """세로로 긴 상세페이지 이미지"""
    pal = PALETTES[pal_key]
    W, H = size
    S = (W * SS, H * SS)
    base = gradient(S, pal["bg1"], lerp(pal["bg2"], (255, 255, 255), 0.35), "v").convert("RGBA")
    base = radial_glow(base, cy=0.18, radius=0.55, strength=0.45)

    # 상단 제품
    top = (S[0], int(S[1] * 0.46))
    lay, box, mask = FORMS[form_key](top, pal)
    holder = Image.new("RGBA", S, (0, 0, 0, 0))
    holder.paste(lay, (0, 0), lay)
    mh = Image.new("L", S, 0)
    mh.paste(mask, (0, 0))
    base = contact_shadow(base, (box[0] + box[2]) / 2, box[3], (box[2] - box[0]) * 0.6, S[1] * 0.010)
    base = drop_shadow(base, mh, offset=(0, int(S[1] * 0.008)), blur=int(S[0] * 0.03), opacity=52)
    base = Image.alpha_composite(base, holder)
    base = draw_label(base, box, brand, title_kr[:10], pal)

    d = ImageDraw.Draw(base, "RGBA")
    y = int(S[1] * 0.50)
    d.text((S[0] * 0.5, y), title_kr, font=font(S[0] * 0.052), fill=pal["ink"] + (255,), anchor="mm")
    y += int(S[1] * 0.035)
    d.line([S[0] * 0.42, y, S[0] * 0.58, y], fill=pal["accent"] + (140,), width=max(2, int(S[0] * 0.004)))
    y += int(S[1] * 0.035)

    fb = font(S[0] * 0.034)
    for b in bullets:
        d.ellipse([S[0] * 0.14 - S[0] * 0.006, y - S[0] * 0.006,
                   S[0] * 0.14 + S[0] * 0.006, y + S[0] * 0.006], fill=pal["accent"] + (200,))
        d.text((S[0] * 0.175, y), b, font=fb, fill=pal["ink"] + (205,), anchor="lm")
        y += int(S[1] * 0.032)

    # 하단 색 블록
    y = int(S[1] * 0.80)
    bw = S[0] * 0.72
    d.rounded_rectangle([S[0] * 0.14, y, S[0] * 0.14 + bw, y + S[1] * 0.13],
                        radius=int(S[0] * 0.02), fill=lerp(pal["bg2"], (255, 255, 255), 0.45) + (255,))
    d.text((S[0] * 0.5, y + S[1] * 0.065), "성분·사용법은 상품 정보 제공 고시를 확인해 주세요",
           font=font(S[0] * 0.029), fill=pal["ink"] + (150,), anchor="mm")

    im = base.convert("RGB").resize(size, Image.LANCZOS)
    im = grain(im, 2.2)
    im.save(out_path, "JPEG", quality=84, optimize=True)


# ─────────────────────────────────────────────────────────── 아바타

def avatar(out_path, size, pal_key, initial, seed=0):
    pal = PALETTES[pal_key]
    S = (size * SS, size * SS)
    rnd = random.Random(seed)
    c1 = lerp(pal["accent"], (255, 255, 255), 0.55)
    c2 = lerp(pal["accent"], (0, 0, 0), 0.10)
    base = gradient(S, c1, c2, "v").convert("RGBA")
    d = ImageDraw.Draw(base, "RGBA")
    # 부드러운 원 두어 개로 깊이감
    for _ in range(3):
        r = rnd.randint(int(S[0] * 0.18), int(S[0] * 0.42))
        x = rnd.randint(0, S[0])
        y = rnd.randint(0, S[1])
        m = Image.new("L", S, 0)
        ImageDraw.Draw(m).ellipse([x - r, y - r, x + r, y + r], fill=46)
        m = m.filter(ImageFilter.GaussianBlur(int(S[0] * 0.09)))
        lyr = Image.new("RGBA", S, (255, 255, 255, 0))
        lyr.putalpha(m)
        base = Image.alpha_composite(base, lyr)
    d = ImageDraw.Draw(base, "RGBA")
    d.text((S[0] * 0.5, S[1] * 0.47), initial, font=font(S[0] * 0.44),
           fill=(255, 255, 255, 235), anchor="mm")
    im = base.convert("RGB").resize((size, size), Image.LANCZOS)
    im = grain(im, 2.0)
    im.save(out_path, "JPEG", quality=88, optimize=True)


# ─────────────────────────────────────────────────────────── 게시물 사진

def post_shot(out_path, size, pal_key, kind, forms, caption=None, seed=0):
    pal = PALETTES[pal_key]
    W, H = size
    S = (W * SS, H * SS)
    rnd = random.Random(seed)
    base = studio_bg(S, pal, glow=0.5, cy=0.3).convert("RGBA")

    if kind == "hero":
        # 큰 원 배경 + 제품 하나
        r = S[0] * 0.40
        cx, cy = S[0] * 0.5, S[1] * 0.44
        m = Image.new("L", S, 0)
        ImageDraw.Draw(m).ellipse([cx - r, cy - r, cx + r, cy + r], fill=90)
        m = m.filter(ImageFilter.GaussianBlur(int(S[0] * 0.03)))
        lyr = Image.new("RGBA", S, lerp(pal["accent"], (255, 255, 255), 0.62) + (0,))
        lyr.putalpha(m)
        base = Image.alpha_composite(base, lyr)
        sub = (S[0], int(S[1] * 0.86))
        lay, box, mask = FORMS[forms[0]](sub, pal)
        mh = Image.new("L", S, 0); mh.paste(mask, (0, int(S[1] * 0.07)))
        holder = Image.new("RGBA", S, (0, 0, 0, 0)); holder.paste(lay, (0, int(S[1] * 0.07)), lay)
        base = drop_shadow(base, mh, offset=(0, int(S[1] * 0.012)), blur=int(S[0] * 0.03), opacity=60)
        base = Image.alpha_composite(base, holder)

    elif kind == "flatlay":
        # 제품 두세 개를 나란히 — 위가 비지 않게 뒤에 큰 원을 깐다
        r = S[0] * 0.44
        bcx, bcy = S[0] * 0.5, S[1] * 0.40
        bm = Image.new("L", S, 0)
        ImageDraw.Draw(bm).ellipse([bcx - r, bcy - r, bcx + r, bcy + r], fill=84)
        bm = bm.filter(ImageFilter.GaussianBlur(int(S[0] * 0.035)))
        blyr = Image.new("RGBA", S, lerp(pal["accent"], (255, 255, 255), 0.66) + (0,))
        blyr.putalpha(bm)
        base = Image.alpha_composite(base, blyr)

        n = len(forms)
        for i, fk in enumerate(forms):
            sub = (int(S[0] * 0.56), int(S[1] * 0.78))
            lay, box, mask = FORMS[fk](sub, pal)
            ox = int(S[0] * (0.5 - 0.28 + (i - (n - 1) / 2) * 0.31))
            oy = int(S[1] * (0.055 + (0.045 if i % 2 else 0)))
            mh = Image.new("L", S, 0); mh.paste(mask, (ox, oy))
            holder = Image.new("RGBA", S, (0, 0, 0, 0)); holder.paste(lay, (ox, oy), lay)
            base = drop_shadow(base, mh, offset=(0, int(S[1] * 0.010)), blur=int(S[0] * 0.024), opacity=48)
            base = Image.alpha_composite(base, holder)

    elif kind == "swatch":
        d = ImageDraw.Draw(base, "RGBA")
        cols = 3
        rowsn = 4
        pad = S[0] * 0.12
        gw = (S[0] - pad * 2) / cols
        gh = (S[1] * 0.62 - pad * 0) / rowsn
        for r_ in range(rowsn):
            for c_ in range(cols):
                x0 = pad + c_ * gw + gw * 0.08
                y0 = S[1] * 0.20 + r_ * gh + gh * 0.08
                tone = lerp(pal["accent"], (255, 255, 255), 0.08 + 0.07 * (r_ * cols + c_))
                d.rounded_rectangle([x0, y0, x0 + gw * 0.84, y0 + gh * 0.84],
                                    radius=int(gw * 0.16), fill=tone + (255,))
                d.rounded_rectangle([x0, y0, x0 + gw * 0.84, y0 + gh * 0.34],
                                    radius=int(gw * 0.16), fill=(255, 255, 255, 46))

    elif kind == "editorial":
        # 색면 구성 + 작은 제품
        d = ImageDraw.Draw(base, "RGBA")
        d.rounded_rectangle([S[0] * 0.08, S[1] * 0.10, S[0] * 0.92, S[1] * 0.62],
                            radius=int(S[0] * 0.05),
                            fill=lerp(pal["bg2"], (255, 255, 255), 0.30) + (255,))
        sub = (int(S[0] * 0.62), int(S[1] * 0.52))
        lay, box, mask = FORMS[forms[0]](sub, pal)
        ox, oy = int(S[0] * 0.19), int(S[1] * 0.14)
        mh = Image.new("L", S, 0); mh.paste(mask, (ox, oy))
        holder = Image.new("RGBA", S, (0, 0, 0, 0)); holder.paste(lay, (ox, oy), lay)
        base = drop_shadow(base, mh, offset=(0, int(S[1] * 0.010)), blur=int(S[0] * 0.026), opacity=54)
        base = Image.alpha_composite(base, holder)

    if caption:
        d = ImageDraw.Draw(base, "RGBA")
        d.text((S[0] * 0.5, S[1] * 0.885), caption, font=font(S[0] * 0.044),
               fill=pal["ink"] + (185,), anchor="mm")
        d.line([S[0] * 0.44, S[1] * 0.925, S[0] * 0.56, S[1] * 0.925],
               fill=pal["accent"] + (120,), width=max(2, int(S[0] * 0.004)))

    im = base.convert("RGB").resize(size, Image.LANCZOS)
    im = vignette(im, 0.15)
    im = grain(im, 3.0)
    im.save(out_path, "JPEG", quality=85, optimize=True)


# ─────────────────────────────────────────────────────────── 목록

SHOWROOMS = [
    ("jenny", "labo", "제"),
    ("haru", "harubi", "하"),
    ("mia", "nutricell", "미"),
    ("yoon", "harubi", "윤"),
    ("soyeon", "coralogy", "소"),
    ("daeun", "daeunlab", "다"),
]

PRODUCTS = [
    # slug, palette, form, brand roman, 라벨 한글, 상세 제목, 불릿
    ("cica-ampoule", "labo", "dropper", "LABO H", "시카 앰플", "시카 리페어 앰플 30ml",
     ["판테놀 · 마데카소사이드 고함량", "자극 테스트 완료 · 민감성 사용 가능", "가벼운 제형, 아침저녁 모두"]),
    ("toner-pad", "labo", "jar", "LABO H", "토너 패드", "진정 토너 패드 60매",
     ["약산성 pH 5.5 · 데일리 사용", "앞뒤 다른 결의 이중 엠보싱", "넉넉한 60매 대용량"]),
    ("barrier-cream", "labo", "jar_tall", "LABO H", "배리어 크림", "배리어 크림 50ml",
     ["세라마이드 5종 복합", "끈적임 없이 마무리", "장벽 강화 · 수분 유지"]),
    ("cleansing-foam", "harubi", "tube", "HARUBI", "클렌징 폼", "마일드 클렌징 폼 150ml",
     ["약산성 · 눈시림 없는 저자극", "미세 거품으로 모공 속까지", "세정 후 당김 없이 촉촉"]),
    ("vitamin-serum", "nutricell", "dropper_slim", "NUTRICELL", "비타민 세럼", "비타민C 20% 브라이트닝 세럼",
     ["순수 비타민C 20% 고농축", "갈변 방지 차광 용기", "톤 · 잡티 집중 관리"]),
    ("sunscreen", "harubi", "tube_slim", "HARUBI", "선크림", "데일리 톤업 선크림 SPF50+",
     ["SPF50+ PA++++ 자외선 차단", "백탁 없는 자연스러운 톤업", "메이크업 베이스로도"]),
    ("lip-tint", "coralogy", "lipstick", "CORALOGY", "립 틴트", "벨벳 블러 립틴트",
     ["한 번에 꽉 차는 발색", "가볍게 밀착되는 벨벳 마무리", "12색 전 컬러 데일리"]),
    ("eye-palette", "coralogy", "palette", "CORALOGY", "아이 팔레트", "데일리 뉴트럴 아이팔레트 9색",
     ["매트 · 글리터 · 시머 9색 구성", "가루 날림 적은 밀착 포뮬러", "데일리부터 포인트까지"]),
    ("hair-essence", "daeunlab", "pump", "DAEUN LAB", "헤어 에센스", "실크 리페어 헤어 에센스 100ml",
     ["가수분해 실크 단백질 함유", "무겁지 않게 감기는 마무리", "열 보호 · 손상모 집중"]),
    ("scalp-scaler", "daeunlab", "pump", "DAEUN LAB", "두피 스케일러", "딥 클린 두피 스케일러 250ml",
     ["주 2회 두피 각질 케어", "쿨링 없이 순한 자극", "노폐물 · 피지 정돈"]),
]

# post-01 ~ post-24 : (palette, kind, forms, caption)
POSTS = [
    ("labo", "hero", ["dropper"], "3주 루틴 기록"),
    ("labo", "flatlay", ["dropper", "jar"], "아침 저녁 두 단계"),
    ("labo", "editorial", ["jar_tall"], "장벽 회복 4주차"),
    ("harubi", "hero", ["tube"], "순한 세안의 기준"),
    ("harubi", "flatlay", ["tube_slim", "tube"], "여름 필수 두 가지"),
    ("harubi", "editorial", ["tube_slim"], "백탁 없는 톤업"),
    ("nutricell", "hero", ["dropper_slim"], "비타민 20% 도전기"),
    ("nutricell", "editorial", ["dropper_slim"], "갈변 없는 보관법"),
    ("coralogy", "swatch", [], "12색 전 컬러 스와치"),
    ("coralogy", "hero", ["lipstick"], "데일리 MLBB"),
    ("coralogy", "flatlay", ["lipstick", "palette"], "가을 메이크업 조합"),
    ("coralogy", "editorial", ["palette"], "9색 한 판 정리"),
    ("daeunlab", "hero", ["pump"], "머리 감고 3분"),
    ("daeunlab", "editorial", ["pump"], "두피부터 다시"),
    ("labo", "swatch", [], "제형 비교"),
    ("harubi", "hero", ["jar"], "클린뷰티 새 라인"),
    ("nutricell", "flatlay", ["dropper_slim", "jar"], "브라이트닝 2종"),
    ("labo", "editorial", ["dropper"], "성분표 읽는 법"),
    ("coralogy", "hero", ["palette"], "언박싱"),
    ("daeunlab", "flatlay", ["pump", "pump"], "샴푸 후 순서"),
    ("harubi", "swatch", [], "톤 비교"),
    ("labo", "flatlay", ["jar", "jar_tall"], "겨울 준비"),
    ("nutricell", "hero", ["jar"], "각질 정리 주간"),
    ("daeunlab", "editorial", ["pump"], "손상모 4주 변화"),
]


def main():
    random.seed(20260910)
    np.random.seed(20260910)
    for sub in ("showrooms", "products", "posts", "user"):
        os.makedirs(os.path.join(OUT, sub), exist_ok=True)

    n = 0
    for slug, pal, initial in SHOWROOMS:
        avatar(os.path.join(OUT, "showrooms", f"{slug}.jpg"), 600, pal, initial, seed=hash(slug) & 0xFF)
        n += 1
    print(f"showrooms {n}")

    for slug, pal, form, brand, label, title, bullets in PRODUCTS:
        product_shot(os.path.join(OUT, "products", f"{slug}-1.jpg"), (1000, 1000), pal, form, brand, label)
        texture_shot(os.path.join(OUT, "products", f"{slug}-2.jpg"), (1000, 1000), pal,
                     "swatch" if pal == "coralogy" else "closeup", form)
        detail_sheet(os.path.join(OUT, "products", f"{slug}-detail.jpg"), (1080, 2000), pal, form,
                     brand, title, bullets)
        n += 3
    print(f"+products = {n}")

    for i, (pal, kind, forms, cap) in enumerate(POSTS, start=1):
        post_shot(os.path.join(OUT, "posts", f"post-{i:02d}.jpg"), (1080, 1350), pal, kind, forms,
                  caption=cap, seed=1000 + i)
        n += 1
    print(f"+posts = {n}")

    avatar(os.path.join(OUT, "user", "me.jpg"), 400, "neutral", "수", seed=7)
    n += 1
    print(f"total {n}")


if __name__ == "__main__":
    main()
