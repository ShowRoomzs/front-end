import { useCallback, useEffect, useRef, useState } from "react";
import { runOnJS, useSharedValue, withTiming } from "react-native-reanimated";

import { ToastConfig, ToastContext, ToastStateContext } from "./context";
import { registerToastHandler, unregisterToastHandler } from "./toast";

const DEFAULT_DURATION = 2000;

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

  const hideToast = useCallback(
    (position: ToastConfig["position"] = "top") => {
      let endTranslateY = 0;
      switch (position) {
        case "top":
          endTranslateY = 100;
          break;
        case "bottom":
          endTranslateY = -100;
          break;
        default:
          endTranslateY = 0;
          break;
      }

      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(endTranslateY, { duration: 200 }, finished => {
        if (finished) {
          runOnJS(setCurrentToast)(null);
        }
      });
    },
    [opacity, translateY]
  );

  const show = useCallback(
    (config: ToastConfig | string) => {
      clearTimer();

      const toastConfig = typeof config === "string" ? { message: config } : config;
      const position = toastConfig.position ?? "top";

      let startTranslateY = 0;
      switch (position) {
        case "top":
          startTranslateY = 100;
          break;
        case "bottom":
          startTranslateY = -100;
          break;
      }
      translateY.value = startTranslateY;

      setCurrentToast(toastConfig);
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withTiming(0, { duration: 200 });

      const duration = toastConfig.duration ?? DEFAULT_DURATION;

      remainingTimeRef.current = duration;
      startTimeRef.current = Date.now();

      timerRef.current = setTimeout(() => {
        hideToast(position);
      }, duration);
    },
    [clearTimer, hideToast, opacity, translateY]
  );

  const hide = useCallback(() => {
    clearTimer();
    const position = currentToast?.position ?? "top";

    hideToast(position);
  }, [clearTimer, hideToast, currentToast?.position]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      const elapsed = Date.now() - startTimeRef.current;

      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
      clearTimer();
    }
  }, [clearTimer]);

  const resumeTimer = useCallback(() => {
    if (remainingTimeRef.current > 0 && currentToast) {
      const position = currentToast.position ?? "top";

      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(() => {
        hideToast(position);
      }, remainingTimeRef.current);
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
