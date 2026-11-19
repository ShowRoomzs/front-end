import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { LayoutChangeEvent } from "react-native";

import { useToast } from "./context";

/**
 * 화면 하단 고정 바(결제 · 저장 · 장바구니 버튼 줄) 위로 토스트를 띄운다 — 시안은 토스트를 늘 맨 아래 고정
 * 영역 위 16에 둔다(탭바 위 16과 같은 규칙). 바가 없으면 토스트가 버튼을 덮는다.
 *
 * 돌려받은 함수를 바의 `onLayout`에 건다. 바의 높이는 아래 안전 영역 여백까지 포함해 잰다.
 * 화면에 보일 때만 걸린다 — 스택 아래로 가려진 화면의 바는 위 화면의 토스트를 밀어 올리지 않는다.
 */
export function useToastAnchor() {
  const { attachAnchor } = useToast();
  const isFocused = useIsFocused();
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!isFocused || height <= 0) {
      return undefined;
    }

    return attachAnchor(height);
  }, [attachAnchor, height, isFocused]);

  return useCallback((event: LayoutChangeEvent) => setHeight(event.nativeEvent.layout.height), []);
}
