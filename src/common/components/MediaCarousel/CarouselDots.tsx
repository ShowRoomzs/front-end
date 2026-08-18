import { View } from "react-native";

import { cn } from "@/common/utils/cn";

/**
 * 미디어 캐러셀 도트 — 디자인 시스템 05.
 *
 * 도트 6px · 간격 5 · 상하 11/3 · 활성 잉크(#0F0F0F) / 비활성 #DEDEE0. 1장이면 노출하지 않는다.
 *
 * 6장 이상(최대 20)이어도 화면에 노출하는 도트는 항상 5개다 — 도트 수는 장수를 세는 눈금이
 * 아니라 현재 위치를 알리는 신호로만 쓴다. 활성 도트는 3번째 칸에 고정하고 나머지가 좌우로
 * 슬라이딩하며, 처음·마지막 2장 구간에서만 활성 도트가 창 안에서 이동한다.
 *
 * 끝 도트 축소 — 5개가 모두 같은 크기면 "이게 전부"로 읽히므로, 그 방향에 남은 장이 있는 쪽의
 * 맨 끝 도트만 4px(#EAEAEC)로 줄여 더 있다는 신호를 준다. 숫자 카운터(1/12)는 쓰지 않는다.
 */
interface CarouselDotsProps {
  count: number;
  activeIndex: number;
  /**
   * `below` 피드 게시물 카드 — 미디어 아래 중앙(잉크 / #DEDEE0)
   * `inside` 상품 갤러리(상품 상세) — 이미지 안 하단(흰 도트 + 옅은 그림자)
   */
  placement?: "below" | "inside";
}

const WINDOW_SIZE = 5;
const DOT_SIZE = 6;
const DOT_SIZE_SHRUNK = 4;
const DOT_GAP = 5;

/**
 * 위치에 따라 색이 다르다(의도적) — 피드 게시물 카드는 미디어 아래 중앙(잉크 / #DEDEE0),
 * 상품 갤러리는 이미지 안 하단(흰 도트 + 옅은 그림자)이다.
 */
function getDotColor(placement: "below" | "inside", state: { isActive: boolean; isShrunk: boolean }): string {
  if (placement === "inside") {
    return state.isActive ? "#FFFFFF" : "rgba(255,255,255,0.5)";
  }
  if (state.isActive) {
    return "#0F0F0F";
  }
  return state.isShrunk ? "#EAEAEC" : "#DEDEE0";
}

export default function CarouselDots(props: CarouselDotsProps) {
  const { count, activeIndex, placement = "below" } = props;

  if (count <= 1) {
    return null;
  }

  const isWindowed = count > WINDOW_SIZE;
  const windowStart = isWindowed ? Math.min(Math.max(activeIndex - 2, 0), count - WINDOW_SIZE) : 0;
  const visibleCount = isWindowed ? WINDOW_SIZE : count;

  // 그 방향에 남은 장이 있을 때만 끝 도트를 줄인다
  const hasMoreBefore = windowStart > 0;
  const hasMoreAfter = windowStart + visibleCount < count;

  return (
    <View
      className={cn(
        "flex-row items-center justify-center",
        placement === "inside" && "absolute bottom-0 left-0 right-0"
      )}
      style={{ gap: DOT_GAP, paddingTop: 11, paddingBottom: 3 }}
    >
      {Array.from({ length: visibleCount }).map((_, position) => {
        const index = windowStart + position;
        const isActive = index === activeIndex;
        const isShrunk = (position === 0 && hasMoreBefore) || (position === visibleCount - 1 && hasMoreAfter);
        const size = isShrunk ? DOT_SIZE_SHRUNK : DOT_SIZE;

        const backgroundColor = getDotColor(placement, { isActive, isShrunk });

        return (
          <View
            key={`dot-${index}`}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor,
              ...(placement === "inside" && {
                shadowColor: "#000",
                shadowOpacity: 0.18,
                shadowRadius: 2,
                shadowOffset: { width: 0, height: 1 },
              }),
            }}
          />
        );
      })}
    </View>
  );
}
