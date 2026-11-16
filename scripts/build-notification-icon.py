"""안드로이드 상태바 알림 아이콘을 굽는다 — `assets/notification-icon.png`.

안드로이드는 알림 작은 아이콘의 **알파만** 쓴다(색은 버리고 흰 실루엣으로 칠한다). 앱 아이콘(로즈 바탕 사각형)을
그대로 쓰면 상태바에 흰 네모만 보인다 — 그래서 투명 바탕에 심볼만 남긴 원본이 따로 필요하다.

원본은 `assets/notification-icon.svg` — `appicon-android.svg`에서 로즈 바탕(rect)만 뺀 같은 심볼이다.
PIL은 SVG를 못 읽어 크롬 헤드리스로 1024px · 투명 배경으로 래스터화한 PNG를 읽는다:

    chrome --headless=new --default-background-color=00000000 --window-size=1024,1024 \
      --screenshot=<1024.png> <img src="notification-icon.svg" width=1024 을 담은 html>

    python scripts/build-notification-icon.py <1024.png>

머티리얼 규격(24dp 안에 사방 2dp 여백)대로 심볼을 20/24 높이에 맞춰 가운데 둔다. app.config.ts의
`notification.icon`이 이 파일을 가리키고, 프리빌드가 밀도별 drawable(`notification_icon`)로 나눠 굽는다.
"""

import sys

from PIL import Image

OUT = "assets/notification-icon.png"
SIZE = 384  # 24dp × 16 — 프리빌드가 밀도별(24·36·48·72·96px)로 줄인다
CONTENT = SIZE * 20 // 24

src = Image.open(sys.argv[1]).convert("RGBA")
alpha = src.getchannel("A")
glyph = src.crop(alpha.getbbox())

scale = CONTENT / max(glyph.size)
glyph = glyph.resize((round(glyph.width * scale), round(glyph.height * scale)), Image.LANCZOS)

# 색은 흰색으로 고정하고 알파만 남긴다
white = Image.new("RGBA", glyph.size, (255, 255, 255, 0))
white.putalpha(glyph.getchannel("A"))

canvas = Image.new("RGBA", (SIZE, SIZE), (255, 255, 255, 0))
canvas.paste(white, ((SIZE - white.width) // 2, (SIZE - white.height) // 2), white)
canvas.save(OUT)
print(OUT, canvas.size)
