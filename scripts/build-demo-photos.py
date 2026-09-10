"""photo-drop/posts 의 원본 사진을 데모 이미지로 굽는다.

원본은 브랜드 공식 컷을 캡처한 것이라 크기가 제각각이고(대개 540px 안팎, 정사각에 가깝다)
그대로는 앱에서 쓸 수 없다. 여기서 세 가지 규격으로 맞춘다.

  게시물 · 상품 대표/서브   1080 x 1080   정사각
  상품 상세                 1080 x 2000   세로로 길게 이어 붙인 한 장

**정사각으로 만들 때 자르지 않고 채우는 쪽을 먼저 고른다.** 원본 대부분이 제품 하나를
가운데 놓은 컷이라, 비율이 조금만 어긋나도 잘라내면 뚜껑이나 바닥이 날아간다.
비율이 1:1에 가까울 때(±12%)만 가운데를 자르고, 그보다 벌어지면 가장자리 색으로 채운다.

원본이 목표 크기의 절반쯤이라 확대가 불가피하다. LANCZOS로 늘린 뒤 언샵을 약하게 먹여
"흐릿한 확대"로 보이지 않게 한다.

    python scripts/build-demo-photos.py
"""

import os
import shutil

from PIL import Image, ImageEnhance, ImageFilter

SRC = "photo-drop/posts"
OUT_POSTS = "src/demo/images/posts"
OUT_PRODUCTS = "src/demo/images/products"

SQUARE = 1080
DETAIL_W, DETAIL_H = 1080, 2000
JPEG_Q = 86

# 정사각에서 이만큼 안쪽이면 잘라도 제품이 안 잘린다 — 넘으면 여백을 채운다
CROP_TOLERANCE = 0.12


def load(name):
    im = Image.open(os.path.join(SRC, name))
    return im.convert("RGB")


def edge_color(im):
    """테두리 1px의 중앙값 — 스튜디오 배경이 대부분 단색이라 이어 붙여도 티가 안 난다"""
    w, h = im.size
    px = []
    px += [im.getpixel((x, 0)) for x in range(0, w, max(1, w // 40))]
    px += [im.getpixel((x, h - 1)) for x in range(0, w, max(1, w // 40))]
    px += [im.getpixel((0, y)) for y in range(0, h, max(1, h // 40))]
    px += [im.getpixel((w - 1, y)) for y in range(0, h, max(1, h // 40))]

    return tuple(sorted(c[i] for c in px)[len(px) // 2] for i in range(3))


def sharpen(im):
    """확대 뒤 잃은 윤곽만 되살린다 — 세게 걸면 캡처 특유의 계단이 드러난다"""
    im = im.filter(ImageFilter.UnsharpMask(radius=1.6, percent=58, threshold=3))

    return ImageEnhance.Color(im).enhance(1.04)


def to_square(im, size=SQUARE):
    w, h = im.size
    aspect = w / h

    if abs(aspect - 1) <= CROP_TOLERANCE:
        # 가운데를 정사각으로 잘라낸다
        side = min(w, h)
        im = im.crop(((w - side) // 2, (h - side) // 2, (w + side) // 2, (h + side) // 2))
        return sharpen(im.resize((size, size), Image.LANCZOS))

    # 비율이 벌어졌으면 통째로 넣고 남는 쪽을 배경색으로 채운다
    scale = size / max(w, h)
    fitted = im.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)
    canvas = Image.new("RGB", (size, size), edge_color(im))
    canvas.paste(fitted, ((size - fitted.width) // 2, (size - fitted.height) // 2))

    return sharpen(canvas)


def to_detail_sheet(images):
    """상세 이미지 여러 장을 세로로 이어 1080x2000 한 장으로 만든다.

    한국 화장품 상세페이지가 원래 이런 모양이라, 여러 컷을 세로로 흘려 두면
    앱에서 스크롤할 때 실제 상세페이지처럼 읽힌다.
    """
    scaled = []
    for im in images:
        w, h = im.size
        scaled.append(im.resize((DETAIL_W, max(1, round(h * DETAIL_W / w))), Image.LANCZOS))

    total = sum(im.height for im in scaled)

    if total > DETAIL_H:
        # 넘치면 전부 같은 비율로 줄여 정확히 채운다
        k = DETAIL_H / total
        scaled = [im.resize((DETAIL_W, max(1, round(im.height * k))), Image.LANCZOS) for im in scaled]
        total = sum(im.height for im in scaled)

    canvas = Image.new("RGB", (DETAIL_W, DETAIL_H), edge_color(images[0]))
    y = (DETAIL_H - total) // 2
    for im in scaled:
        canvas.paste(im, (0, y))
        y += im.height

    return sharpen(canvas)


def save(im, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path, "JPEG", quality=JPEG_Q, optimize=True, progressive=True)

    return os.path.getsize(path)


# ── 무엇을 어디에 넣을지 ────────────────────────────────────────────────
#
# 같은 원본이 게시물과 상품 양쪽에 쓰이는 것은 의도한 것이다 — 게시물이 그 상품을
# 보여 주는 글이라, 피드에서 본 사진이 상세에서 다시 나오는 편이 자연스럽다.

POSTS = [
    # 공구 — 제니 D-3 (아누아 토너 + 세럼). 글이 "토너로 결을 정리하고 세럼으로" 순서라
    # 사진도 두 제품이 한 장씩 나와야 묶음이 설명된다
    ("post-01", "raw-03"),  # 세럼 + 스포이드 + 어성초 잎
    ("post-02", "raw-05"),  # 토너 + 물 스플래시
    # 공구 — 하루 D-5 광고 (세타필 크림 + AHC 로션)
    ("post-03", "raw-09"),  # 세타필 두 통
    ("post-04", "raw-07"),  # AHC 로션 위에서
    # 공구 — 윤 마감 (상품 없음)
    ("post-05", "raw-11"),  # 세타필 초록 배경 — 카드가 50% 흐려지므로 대비가 센 컷을 쓴다
    # 공구 — 소연 D-1 광고 (온더바디 + 폴메디슨)
    ("post-06", "raw-19"),  # 바디워시 3향
    ("post-07", "raw-13"),  # 폴메디슨 두 병
    # 공구 — 다은 D-7 (케라시스 + 엘라스틴 품절)
    ("post-08", "raw-25"),  # 케라마이드 라인 전체
    ("post-09", "raw-15"),  # 엘라스틴 두 병
    # 일반 — 글의 주제와 사진이 맞물리게 짝지었다
    ("post-10", "raw-12"),  # 성분표 읽는 법     ← 세타필 + 실험 유리기구
    ("post-11", "raw-01"),  # 세럼 4주차 기록    ← 세럼 정면
    ("post-12", "raw-10"),  # 무향·무색소        ← 세타필 연두
    ("post-13", "raw-08"),  # 로션은 크림 전 단계 ← AHC 정면
    ("post-14", "raw-04"),  # 토너는 화장솜에     ← 토너 정면
    ("post-15", "raw-06"),  # 얇게 여러 번 겹치기 ← 토너 흐르는 텍스처
    ("post-16", "raw-18"),  # 거품은 손에서       ← 손 위 거품
    ("post-17", "raw-21"),  # 로즈 & 피오니
    ("post-18", "raw-17"),  # 샴푸는 대용량       ← 엘라스틴 패턴
    ("post-19", "raw-22"),  # 라벤더 & 로즈마리
    ("post-20", "raw-23"),  # 레몬 & 버베나
    ("post-21", "raw-24"),  # 케라마이드 4주      ← 케라시스 정면
    ("post-22", "raw-14"),  # 바디로션 바르는 때  ← 폴메디슨 욕실
    ("post-23", "raw-16"),  # 샴푸 + 트리트먼트
]

PRODUCTS = {
    "anua-serum": {"main": "raw-01", "sub": "raw-03", "detail": ["raw-02"]},
    "anua-toner": {"main": "raw-04", "sub": "raw-05", "detail": ["raw-06"]},
    "ahc-lotion": {"main": "raw-08", "sub": "raw-07", "detail": ["raw-07"]},
    "cetaphil-cream": {"main": "raw-10", "sub": "raw-11", "detail": ["raw-12", "raw-09"]},
    "paulmedison-lotion": {"main": "raw-13", "sub": "raw-14", "detail": ["raw-14"]},
    "onthebody-wash": {"main": "raw-19", "sub": "raw-20", "detail": ["raw-21", "raw-22", "raw-23"]},
    "elastine-shampoo": {"main": "raw-15", "sub": "raw-16", "detail": ["raw-17"]},
    "kerasys-treatment": {
        "main": "raw-24",
        "sub": "raw-25",
        # 26·27·28은 한글 카피가 들어간 실제 상세페이지 컷이다 — 세 장을 이어 붙이면
        # 상세 탭에서 진짜 상세페이지처럼 스크롤된다
        "detail": ["raw-26", "raw-27", "raw-28"],
    },
}


def main():
    for folder in (OUT_POSTS, OUT_PRODUCTS):
        if os.path.isdir(folder):
            for f in os.listdir(folder):
                if f.endswith(".jpg"):
                    os.remove(os.path.join(folder, f))
        os.makedirs(folder, exist_ok=True)

    total = 0

    for name, raw in POSTS:
        size = save(to_square(load(raw + ".png")), f"{OUT_POSTS}/{name}.jpg")
        total += size
    print(f"게시물 {len(POSTS)}장")

    for slug, spec in PRODUCTS.items():
        total += save(to_square(load(spec["main"] + ".png")), f"{OUT_PRODUCTS}/{slug}-1.jpg")
        total += save(to_square(load(spec["sub"] + ".png")), f"{OUT_PRODUCTS}/{slug}-2.jpg")
        sheet = to_detail_sheet([load(r + ".png") for r in spec["detail"]])
        total += save(sheet, f"{OUT_PRODUCTS}/{slug}-detail.jpg")
    print(f"상품 {len(PRODUCTS)}종 x 3장")

    for folder in ("showrooms", "user"):
        path = f"src/demo/images/{folder}"
        total += sum(os.path.getsize(os.path.join(path, f)) for f in os.listdir(path) if f.endswith(".jpg"))

    print(f"이미지 전체 {total / 1024 / 1024:.1f}MB")


if __name__ == "__main__":
    main()
    shutil.rmtree("__pycache__", ignore_errors=True)
