"""런치 스크린용 로즈 워드마크를 굽는다 (시안 C19).

원본은 `assets/wordmark.svg` — 시안 폴더의 `showroomz-wordmark-color.svg`이자 C19가 그리는 바로 그 워드마크다.
예전 원본(`assets/logo.png`)은 글자꼴이 시안과 달라(획이 두껍고 W 모양이 다르다) 스플래시가 시안과 어긋났다.

PIL은 SVG를 읽지 못해, SVG를 폭 1600px · 투명 배경으로 래스터화한 `assets/wordmark-1600.png`를 읽는다.
워드마크가 바뀌면 SVG를 교체하고 PNG를 다시 굽는다 — 크롬 헤드리스로 구웠다:

    chrome --headless=new --default-background-color=00000000 --window-size=1600,172 \
      --screenshot=assets/wordmark-1600.png <img src="wordmark.svg" width=1600 을 담은 html>

색은 로즈로 다시 칠한다 — 알파는 그대로 두고 RGB만 바꾸므로 글자 모양과 안티에일리어싱이 원본 그대로다.

**아래쪽 투명 여백**을 함께 넣는다. expo-splash-screen은 이미지를 화면 정중앙에 놓을 뿐
위치를 지정할 수 없는데, 시안은 워드마크를 시각 중심(기하학적 중심보다 살짝 위)에 두라고 한다.
이미지 아래에 빈 공간을 붙여 두면 **그 이미지의 중심이 내려가면서 글자는 위로 올라간다.**

    시안 기준 390x844에서
      상태바 54 · 홈 인디케이터 24 · 콘텐츠 아래 여백 54
      → 워드마크 중심 y = 410  (화면 중심 422보다 12 위)

    262pt 폭으로 놓을 때 12pt를 올리려면 아래 여백이 24pt,
    원본 좌표로는 24 x 원본폭/262 (지금 원본 1600px 이면 ≈ 147px).

    python scripts/build-splash-wordmark.py
"""

import os

from PIL import Image

SRC = "assets/wordmark-1600.png"
OUT = "assets/splash-wordmark.png"

ROSE = (242, 69, 110)  # #F2456E — tailwind.config.js 의 rose 와 같은 값

#: 시안에서 **글자가** 놓이는 폭(pt). app.config.ts 의 imageWidth 와 반드시 같아야 한다.
#: 원본의 좌우 여백을 잘라내므로 이 값이 곧 글자 폭이다 — 여백을 남기면 같은 값에도 글자가 작아진다
IMAGE_WIDTH_PT = 262
#: 시각 중심을 만들기 위해 글자를 올릴 양(pt)
LIFT_PT = 12


def main():
    im = Image.open(SRC).convert("RGBA")
    w, h = im.size

    # 알파는 유지하고 색만 교체 — 글자 모양이 원본 그대로 남는다
    tinted = Image.new("RGBA", (w, h), ROSE + (0,))
    tinted.putalpha(im.getchannel("A"))

    # ── 좌우 투명 여백을 잘라낸다 ──────────────────────────────────
    #
    # 원본에 좌우 여백이 있으면 `imageWidth` 를 아무리 키워도 그 일부만 글자라 시안보다 작게 보인다
    # (예전 원본은 1500px 중 968px 만 글자였다). 잘라내고 나면 `imageWidth` 가 곧 글자 폭이 된다.
    # 지금 원본(SVG 래스터)은 여백이 없어 그대로지만, 원본이 바뀌어도 같은 결과가 나오게 남겨 둔다.
    bbox = tinted.getchannel("A").getbbox()
    tinted = tinted.crop((bbox[0], 0, bbox[2], h))
    w = tinted.width

    # 이미지가 정중앙에 놓이므로, 아래에 빈 공간을 붙인 만큼 글자가 위로 올라간다
    pad = round(LIFT_PT * 2 * w / IMAGE_WIDTH_PT)
    canvas = Image.new("RGBA", (w, h + pad), (0, 0, 0, 0))
    canvas.paste(tinted, (0, 0))
    canvas.save(OUT)

    # 실제로 어디에 놓이는지 되짚어 확인한다 — 시안은 워드마크 중심 y=410 (390x844 기준)
    scale = IMAGE_WIDTH_PT / w
    drawn_h = (h + pad) * scale
    center_y = 844 / 2 - drawn_h / 2 + (h * scale) / 2

    print(f"{OUT}  {canvas.size[0]}x{canvas.size[1]}  {os.path.getsize(OUT) // 1024}KB")
    print(f"아래 여백 {pad}px → 390x844 화면에서 워드마크 중심 y={center_y:.1f} (시안 410)")


if __name__ == "__main__":
    main()
