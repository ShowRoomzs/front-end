"""런치 스크린용 로즈 워드마크를 굽는다 (시안 C19).

`assets/logo.png`는 **흰 워드마크 + 투명 배경**이라 어두운 배경용이다. 시안이 배경을 흰색으로
확정했으므로 같은 글자를 로즈로 다시 칠한다 — 알파는 그대로 두고 RGB만 바꾸기 때문에
글자 모양과 안티에일리어싱이 원본 그대로 보존된다. 새로 그리면 자간이 미세하게 달라진다.

**아래쪽 투명 여백**을 함께 넣는다. expo-splash-screen은 이미지를 화면 정중앙에 놓을 뿐
위치를 지정할 수 없는데, 시안은 워드마크를 시각 중심(기하학적 중심보다 살짝 위)에 두라고 한다.
이미지 아래에 빈 공간을 붙여 두면 **그 이미지의 중심이 내려가면서 글자는 위로 올라간다.**

    시안 기준 390x844에서
      상태바 54 · 홈 인디케이터 24 · 콘텐츠 아래 여백 54
      → 워드마크 중심 y = 410  (화면 중심 422보다 12 위)

    262pt 폭으로 놓을 때 12pt를 올리려면 아래 여백이 24pt,
    원본 좌표로는 24 x 1500/262 ≈ 137px.

    python scripts/build-splash-wordmark.py
"""

import os

from PIL import Image

SRC = "assets/logo.png"
OUT = "assets/splash-wordmark.png"

ROSE = (242, 69, 110)  # #F2456E — tailwind.config.js 의 rose 와 같은 값

#: 시안에서 워드마크가 놓이는 폭(pt). app.config.ts 의 imageWidth 와 반드시 같아야 한다
IMAGE_WIDTH_PT = 262
#: 시각 중심을 만들기 위해 글자를 올릴 양(pt)
LIFT_PT = 12


def main():
    im = Image.open(SRC).convert("RGBA")
    w, h = im.size

    # 알파는 유지하고 색만 교체 — 글자 모양이 원본 그대로 남는다
    tinted = Image.new("RGBA", (w, h), ROSE + (0,))
    tinted.putalpha(im.getchannel("A"))

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
