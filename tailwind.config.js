/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // 기본 spacing을 1px 단위로 오버라이드
    spacing: generatePixelSpacing(),
    // 기본 폰트를 Pretendard로 설정
    fontFamily: {
      sans: ["Pretendard"],
    },
    extend: {
      // 폰트 사이즈도 픽셀로 직접 매핑 (text-12 -> 12px)
      fontSize: generatePixelFontSize(),
      fontFamily: {
        pretendard: ["Pretendard"],
      },
      // 반경 — 디자인 시스템 03. 상품 썸네일 4 / 그 외 전부 8 / 아바타·배지 full
      borderRadius: {
        thumbnail: "4px",
        base: "8px",
      },
      colors: {
        white: "#FFFFFF",

        // ── 디자인 시스템 v0.1 · 01 색 ─────────────────────────────
        // 로즈는 공구 신호에만 — D-day · 할인율 · 알림 점 · 장바구니 배지 ·
        // 공구 진행 중 쇼룸의 아바타 링. 그 외 어디에도 쓰지 않는다(탭바 활성 포함).
        rose: "#F2456E",
        roseTint: "#FEF4F6", // 로즈 틴트 배경 — 경고·차단, 선택된 항목, 기본 배송지 배지
        roseText: "#CF3D61", // 틴트 위에 얹는 로즈 텍스트 · [필수] 태그 · 입력 오류 메시지
        roseBorder: "#FBC0CE", // 로즈 틴트 블록의 테두리
        success: "#0C9E4E", // 검증 통과 — 닉네임 사용 가능 등. 로즈의 반대 신호
        ink: "#0F0F0F", // 제목 · 가격 · 활성 탭
        ink80: "#2E2E2E", // 상품명
        ink76: "#3C3C3C", // 본문 · 버튼 라벨
        gray55: "#8E8E8E", // 타임스탬프 · 플레이스홀더
        gray62: "#9E9E9E", // 비활성 탭 · 품절/마감 텍스트
        gray71: "#B5B5B5", // 정가 취소선 (텍스트 금지)
        gray45: "#737373", // 중립 배지 · 법정 고지 본문 · 보조 텍스트 최저선
        fill: "#F4F4F5", // 검색 필드 · 중립 배지 · 회색 채움 버튼
        band: "#F7F7F8", // 그룹 구분 밴드 · 인포 블록 · 아코디언 답변
        divider: "#EFEFEF", // 게시물 구분 0.5px
        dividerProduct: "#F0F0F0", // 상품 행 구분 0.5px
        borderButton: "#E3E3E5", // 버튼 외곽선 1px
        borderButtonStrong: "#DCDCDE", // 파괴적 액션의 중립 외곽선 (탈퇴하기 등)
        dotInactive: "#DEDEE0", // 캐러셀 비활성 도트
        heartClosed: "#C8C8CA", // 마감된 공구의 하트
        chevron: "#C7C7C7", // 셰브런 · 품절 취소선
        badgeClosedBg: "#F1F1F2", // 마감 D-day 배지 배경
        roleInfluencerText: "#6B48CC", // INFLUENCER 역할 칩 텍스트

        // ── 기존 스케일 — 디자인 시스템 값으로 전면 교체 ────────────
        // 이름은 유지하고 값만 옮겨, 기존 화면도 새 팔레트로 함께 넘어간다.
        black: "#0F0F0F", // = ink
        gray0: "#F7F7F8", // = band
        gray1: "#F4F4F5", // = fill
        gray2: "#EFEFEF", // = divider
        gray3: "#E3E3E5", // = borderButton
        gray4: "#DEDEE0", // = dotInactive
        gray5: "#D6D6D6",
        gray6: "#C8C8CA", // = heartClosed
        gray7: "#C7C7C7", // = chevron
        gray8: "#B5B5B5", // = gray71
        gray9: "#9E9E9E", // = gray62
        gray10: "#8E8E8E", // = gray55
        gray11: "#737373", // = gray45
        gray12: "#5E5E5E",
        gray13: "#4A4A4A",
        gray14: "#3C3C3C", // = ink76
        gray15: "#2E2E2E", // = ink80
        gray16: "#232323",
        gray17: "#1A1A1A",

        positiveColor: "#23BE76",
        negativeColor: "#F2456E",
        pointColor: "#F2456E", // = rose
        pointColorOpacity10: "#F2456E1A",
        pointColorOpacity80: "#F2456ECC",
        pointColorNew: "#5637EF",
        pointColorNewOpacity10: "#5637EF1A",
        pointColorHot: "#377BEF",
        pointColorHotOpacity10: "#377BEF1A",
      },
    },
  },
  plugins: [],
};

function generatePixelSpacing() {
  const spacing = {};
  for (let i = 0; i <= 200; i++) {
    spacing[i] = `${i}px`;
  }
  spacing["0.5"] = "0.5px";
  return spacing;
}

function generatePixelFontSize() {
  const fontSize = {};
  for (let i = 0; i <= 200; i++) {
    fontSize[i] = `${i}px`;
  }
  // 0.5px 단위 타이포(13.5 본문 · 14.5 이름 등)는 클래스명에 점을 넣을 수 없어
  // Typography의 variant 토큰으로 정의한다 — components/Typography/tokens.ts
  return fontSize;
}
