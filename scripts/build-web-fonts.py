"""웹 글꼴 CSS를 굽는다 — public/fonts/pretendard.css

앱은 Pretendard ttf 네 벌(Regular · Medium · SemiBold · Bold, 합계 약 11MB)을 expo-font로 싣는다.
웹은 그걸 그대로 받으면 첫 화면 전에 11MB를 내려받는다. 대신 Pretendard 공식 **동적 서브셋**(woff2를 글자
묶음 92개로 나눠, 화면에 나온 글자가 든 묶음만 받는다)을 jsDelivr에서 쓴다.

Typography는 굵기마다 다른 글꼴 이름(`Pretendard-Bold` 등)을 쓰므로, 공식 CSS의 `Pretendard` 한 패밀리를
굵기별로 그 이름들로 바꿔 적는다. 굵기 범위는 100~900으로 열어 둔다 — 이름이 곧 굵기라 CSS 굵기 값과 엇갈려도
브라우저가 가짜 굵게(faux bold)를 만들지 않게 하려는 것이다.

    python scripts/build-web-fonts.py

Pretendard 버전을 올리면 VERSION만 바꿔 다시 굽는다.
"""

import re
import urllib.request

VERSION = "v1.3.9"
BASE = f"https://cdn.jsdelivr.net/gh/orioncactus/pretendard@{VERSION}"
SOURCE = f"{BASE}/dist/web/static/pretendard-dynamic-subset.css"
OUT = "public/fonts/pretendard.css"

#: 공식 CSS 굵기 → 앱 글꼴 이름(src/common/hooks/useInit.ts · Typography와 같다)
FAMILY_BY_WEIGHT = {
    "400": "Pretendard-Regular",
    "500": "Pretendard-Medium",
    "600": "Pretendard-SemiBold",
    "700": "Pretendard-Bold",
}


def main():
    css = urllib.request.urlopen(SOURCE).read().decode("utf-8")
    rules = re.findall(r"@font-face\s*\{(.*?)\}", css, re.S)
    out = [
        f"/* 생성 파일 — scripts/build-web-fonts.py 로 다시 굽는다. Pretendard {VERSION} (SIL OFL 1.1) */",
    ]

    for body in rules:
        weight = re.search(r"font-weight:\s*(\d+)", body).group(1)
        family = FAMILY_BY_WEIGHT.get(weight)
        if not family:
            continue
        woff2 = re.search(r"url\(([^)]+?\.woff2)\)", body).group(1)
        url = woff2.replace("../../../", f"{BASE}/")
        unicode_range = re.search(r"unicode-range:\s*([^;]+);", body).group(1).strip()
        out.append(
            "@font-face{"
            f"font-family:'{family}';font-style:normal;font-display:swap;font-weight:100 900;"
            f"src:url({url}) format('woff2');unicode-range:{unicode_range}}}"
        )

    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(out) + "\n")

    print(f"{OUT}: {len(out) - 1} rules")


if __name__ == "__main__":
    main()
