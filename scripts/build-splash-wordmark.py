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
#: 안드로이드 하단 브랜딩용 — 밀도별로 굽는다(plugins/withSplashBranding.js 가 집어 간다)
OUT_BRANDING_DIR = "assets/splash-branding"

#: Android 가 하단 브랜딩에 허용하는 크기(200dp x 80dp) 안에서 폭을 꽉 채운다
BRANDING_WIDTH_DP = 200
DENSITIES = {"mdpi": 1, "hdpi": 1.5, "xhdpi": 2, "xxhdpi": 3, "xxxhdpi": 4}

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
    # 원본은 1500x100 인데 글자는 968px 뿐이고 좌우에 532px 이 비어 있다. 그대로 쓰면
    # `imageWidth` 를 아무리 키워도 그 65% 만 글자라 시안보다 한참 작게 보인다.
    # 잘라내고 나면 `imageWidth` 가 곧 글자 폭이 된다.
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

    # ── 안드로이드 하단 브랜딩 ────────────────────────────────────────
    #
    # Android 12+ 는 가운데 아이콘을 **원형으로 잘라내서** 가로로 긴 워드마크를 넣을 수 없다.
    # 자르지 않는 자리는 하단 브랜딩 슬롯뿐이라 글자 전체를 보이려면 여기를 쓴다.
    # 여백은 넣지 않는다 — 시스템이 알아서 화면 아래에 배치한다.
    os.makedirs(OUT_BRANDING_DIR, exist_ok=True)
    for name, scale in DENSITIES.items():
        bw = round(BRANDING_WIDTH_DP * scale)
        bh = max(1, round(bw * h / w))
        path = os.path.join(OUT_BRANDING_DIR, f"{name}.png")
        tinted.resize((bw, bh), Image.LANCZOS).save(path)
    print(f"{OUT_BRANDING_DIR}/  {len(DENSITIES)}개  (mdpi {BRANDING_WIDTH_DP}px ~ xxxhdpi {BRANDING_WIDTH_DP * 4}px)")


if __name__ == "__main__":
    main()
