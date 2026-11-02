import { useCallback, useEffect, useState } from "react";
import { runOnJS, useSharedValue, withTiming } from "react-native-reanimated";

import { ModalConfig, ModalContext, ModalStateContext } from "./context";
import { registerModalHandler, unregisterModalHandler } from "./modal";

import { MOTION_DURATION, MOTION_EASING, MOTION_REDUCE } from "@/common/constants/motion";

/** 디자인 시스템 §08 확인 모달 — 딤 · 대화상자 scale .96 → 1 · 투명도 200ms. 퇴장은 투명도만 150ms */
const ENTER_SCALE = 0.96;
const EXIT_DURATION = 150;

interface ModalProviderProps {
  children: React.ReactNode;
}

export function ModalProvider(props: ModalProviderProps) {
  const { children } = props;

  const [currentModal, setCurrentModal] = useState<ModalConfig | null>(null);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(ENTER_SCALE);

  const show = useCallback(
    (config: ModalConfig) => {
      setCurrentModal(config);
      opacity.value = 0;
      scale.value = ENTER_SCALE;
      const enter = {
        duration: MOTION_DURATION.base,
        easing: MOTION_EASING.standard,
        reduceMotion: MOTION_REDUCE,
      };

      opacity.value = withTiming(1, enter);
      scale.value = withTiming(1, enter);
    },
    [opacity, scale]
  );

  // 퇴장은 제자리에서 투명도만 — 줄어들며 사라지면 누른 버튼이 밀려나는 것처럼 보인다
  const hide = useCallback(() => {
    opacity.value = withTiming(
      0,
      { duration: EXIT_DURATION, easing: MOTION_EASING.exit, reduceMotion: MOTION_REDUCE },
      finished => {
        if (finished) {
          runOnJS(setCurrentModal)(null);
        }
      }
    );
  }, [opacity]);

  useEffect(() => {
    registerModalHandler({ show, hide });

    return () => {
      unregisterModalHandler();
    };
  }, [show, hide]);

  return (
    <ModalContext.Provider value={{ show, hide }}>
      <ModalStateContext.Provider value={{ currentModal, opacity, scale }}>
        {children}
      </ModalStateContext.Provider>
    </ModalContext.Provider>
  );
}
