"""쇼룸 · 사용자 프로필 사진을 원본에서 굽는다.

원본은 `photo-drop/profiles/`에 둔다. 크기도 비율도 제각각이라 여기서 **얼굴을 가운데 둔
정사각**으로 잘라 규격을 맞춘다. 앱에서 원형으로 잘려 나가므로 얼굴이 가운데에서 벗어나면
정수리나 턱이 잘린다 — 사진마다 자를 위치를 손으로 지정하는 이유다.

`crop`은 (가로 중심, 세로 중심, 한 변) 세 값을 원본 짧은 변에 대한 비율로 적는다.
세로 중심을 0.5보다 작게 두면 위쪽(얼굴)을 잡는다.

    python scripts/build-demo-avatars.py
"""

import os
import shutil

from PIL import Image, ImageEnhance, ImageFilter

SRC = "photo-drop/profiles"
OUT_SHOWROOM = "src/demo/images/showrooms"
OUT_USER = "src/demo/images/user"

SHOWROOM_SIZE = 600
USER_SIZE = 400

# 어느 원본을 어느 쇼룸에 쓸지.
#
# 여섯 명이 서로 다른 사람으로 보여야 하고, 쇼룸 성격과도 맞아야 한다.
# 남성 사진 두 장은 인물이 특정되지 않은 두 곳(브랜드 계정인 하루, 성별을 안 정한 윤)에 넣었다.
PEOPLE = {
    # 제니의 뷰티룸 — 민감성 12년차. 꾸미지 않은 인상이라야 "직접 써 보고 올린다"가 읽힌다
    "jenny": ("smiling-asian-young-woman-face-portrait_53876-145636.jpg", (0.50, 0.44, 0.86)),
    # 하루 코스메틱 — 브랜드 계정. 흰 배경에 단정한 컷
    "haru": ("portrait-young-asian-man_264197-455.jpg", (0.45, 0.46, 0.80)),
    # 미아 스킨노트 — 성분과 피부 이야기. 맨피부가 크게 보이는 컷
    "mia": ("pngtree-korean-beauty-portrait-flawless-skin-makeup-studio-lighting-image_21030366.jpg",
            (0.56, 0.50, 1.00), "contain"),
    # 윤의 클린뷰티 — 미니멀. 회색 배경에 장식 없는 컷
    "yoon": ("9931CB4B5D904D7607.jpg", (0.50, 0.50, 1.00)),
    # 소연의 바디랩 — 여섯 중 제일 화려하다
    "soyeon": ("mega_AIkeyword_149b.jpg", (0.52, 0.42, 0.92)),
    # 다은의 헤어살롱 — 머리가 주인공인 컷
    "daeun": ("SFfC9n9HGa4zRdUNds1UojAJx2hMeqcKWdPg4uKfZgFaEJyUUKRiSPvVcnv3yR7-Ex3apHV8_KZFIlgbNJ5a2g.jpg",
              (0.50, 0.30, 0.62)),
}

# 사용자 본인. 이름을 맞춰 넣어 주신 파일을 그대로 쓴다
USER = ("me.jpg", (0.50, 0.50, 0.92))


def square(path, crop, size, fit="cover"):
    """정사각으로 맞춘다.

    `cover`  가운데를 잘라 꽉 채운다. 얼굴이 여유 있게 들어간 사진에 쓴다.
    `contain` **아무것도 자르지 않고** 통째로 넣고, 남는 위아래를 같은 사진을 확대·블러한
             것으로 메운다. 눈코입만 꽉 찬 접사처럼 잘라 낼 여백이 없는 사진에 쓴다.
             가로로 눌러 늘이면 얼굴이 찌그러지므로 비율은 건드리지 않는다.
    """
    im = Image.open(path).convert("RGB")
    w, h = im.size

    if fit == "contain":
        # 뒤에 깔 배경 — 같은 사진을 정사각으로 꽉 채워 자른 뒤 흐리게
        side = min(w, h)
        back = im.crop(((w - side) // 2, (h - side) // 2, (w + side) // 2, (h + side) // 2))
        back = back.resize((size, size), Image.LANCZOS)
        back = back.filter(ImageFilter.GaussianBlur(size * 0.055))
        back = ImageEnhance.Brightness(back).enhance(1.06)

        # 사진을 정사각 높이의 78%까지 키운다 — 그냥 통째로 넣으면 흐린 띠가 너무 넓어진다.
        # 넘치는 좌우는 잘라 낸다. 접사라 양옆은 배경이나 머리카락이라 잘라도 손해가 없다.
        scale = size * 0.78 / h
        front = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)

        if front.width > size:
            cx = min(max(front.width * crop[0], size / 2), front.width - size / 2)
            front = front.crop((round(cx - size / 2), 0, round(cx + size / 2), front.height))

        back.paste(front, ((size - front.width) // 2, (size - front.height) // 2))
        out = back
    else:
        side = min(w, h) * crop[2]
        cx, cy = w * crop[0], h * crop[1]

        # 원본 밖으로 나가지 않게 중심을 안쪽으로 민다
        cx = min(max(cx, side / 2), w - side / 2)
        cy = min(max(cy, side / 2), h - side / 2)

        out = im.crop(
            (round(cx - side / 2), round(cy - side / 2), round(cx + side / 2), round(cy + side / 2))
        ).resize((size, size), Image.LANCZOS)

    # 작게 줄면 윤곽이 뭉개진다 — 아주 약하게만 되살린다
    out = out.filter(ImageFilter.UnsharpMask(radius=1.2, percent=42, threshold=3))

    return ImageEnhance.Color(out).enhance(1.02)


def main():
    total = 0

    for name, spec in PEOPLE.items():
        src, crop, fit = (*spec, "cover")[:3]
        out = os.path.join(OUT_SHOWROOM, name + ".jpg")
        square(os.path.join(SRC, src), crop, SHOWROOM_SIZE, fit).save(
            out, "JPEG", quality=90, optimize=True
        )
        total += os.path.getsize(out)

    src, crop = USER
    out = os.path.join(OUT_USER, "me.jpg")
    square(os.path.join(SRC, src), crop, USER_SIZE).save(out, "JPEG", quality=90, optimize=True)
    total += os.path.getsize(out)

    print(f"프로필 {len(PEOPLE) + 1}장  {total / 1024:.0f}KB")


if __name__ == "__main__":
    main()
    shutil.rmtree("__pycache__", ignore_errors=True)
