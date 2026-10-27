import { useCallback, useEffect, useRef, useState } from "react";
import { AccessibilityInfo } from "react-native";
import { runOnJS, useSharedValue, withTiming } from "react-native-reanimated";

import { ToastConfig, ToastContext, ToastStateContext } from "./context";
import { registerToastHandler, unregisterToastHandler } from "./toast";

import { MOTION_EASING, MOTION_REDUCE } from "@/common/constants/motion";

/** 디자인 시스템 §07 · §08 — 12px 올라오며 220ms → 2초 유지 → 180ms 페이드 아웃 */
const DEFAULT_DURATION = 2000;
const ENTER_DURATION = 220;
const EXIT_DURATION = 180;
const ENTER_OFFSET = 12;

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider(props: ToastProviderProps) {
  const { children } = props;

  const [currentToast, setCurrentToast] = useState<ToastConfig | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 퇴장은 제자리에서 투명도만 — 움직이며 사라지면 다음 토스트의 진입과 겹쳐 보인다
  const hideToast = useCallback(() => {
    opacity.value = withTiming(
      0,
      { duration: EXIT_DURATION, easing: MOTION_EASING.exit, reduceMotion: MOTION_REDUCE },
      finished => {
        if (finished) {
          runOnJS(setCurrentToast)(null);
        }
      }
    );
  }, [opacity]);

  const show = useCallback(
    (config: ToastConfig | string) => {
      clearTimer();

      const toastConfig = typeof config === "string" ? { message: config } : config;
      const enterFrom = (toastConfig.position ?? "bottom") === "bottom" ? ENTER_OFFSET : -ENTER_OFFSET;

      // 새 토스트는 쌓지 않고 바꿔 끼운다
      setCurrentToast(toastConfig);
      opacity.value = 0;
      translateY.value = enterFrom;
      const enter = { duration: ENTER_DURATION, easing: MOTION_EASING.standard, reduceMotion: MOTION_REDUCE };

      opacity.value = withTiming(1, enter);
      translateY.value = withTiming(0, enter);

      // 스크린리더가 읽도록 알린다(§08 — 토스트는 live region으로)
      if (typeof toastConfig.message === "string") {
        AccessibilityInfo.announceForAccessibility(toastConfig.message);
      }

      const duration = toastConfig.duration ?? DEFAULT_DURATION;

      remainingTimeRef.current = duration;
      startTimeRef.current = Date.now();

      timerRef.current = setTimeout(hideToast, duration);
    },
    [clearTimer, hideToast, opacity, translateY]
  );

  const hide = useCallback(() => {
    clearTimer();
    hideToast();
  }, [clearTimer, hideToast]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      const elapsed = Date.now() - startTimeRef.current;

      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
      clearTimer();
    }
  }, [clearTimer]);

  const resumeTimer = useCallback(() => {
    if (remainingTimeRef.current > 0 && currentToast) {
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(hideToast, remainingTimeRef.current);
    }
  }, [currentToast, hideToast]);

  useEffect(() => {
    registerToastHandler({ show, hide });

    return () => {
      clearTimer();
      unregisterToastHandler();
    };
  }, [show, hide, clearTimer]);

  return (
    <ToastContext.Provider value={{ show, hide, pauseTimer, resumeTimer }}>
      <ToastStateContext.Provider value={{ currentToast, opacity, translateY }}>
        {children}
      </ToastStateContext.Provider>
    </ToastContext.Provider>
  );
}
