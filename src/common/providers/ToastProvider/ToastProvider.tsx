import { useCallback, useEffect, useRef, useState } from "react";
import { runOnJS, useSharedValue, withTiming } from "react-native-reanimated";

import { ToastConfig, ToastContext, ToastStateContext } from "./context";
import { registerToastHandler, unregisterToastHandler } from "./toast";

const DEFAULT_DURATION = 3000;

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider(props: ToastProviderProps) {
  const { children } = props;

  const [currentToast, setCurrentToast] = useState<ToastConfig | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const opacity = useSharedValue(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const hideToast = useCallback(() => {
    opacity.value = withTiming(0, { duration: 200 }, finished => {
      if (finished) {
        runOnJS(setCurrentToast)(null);
      }
    });
  }, [opacity]);

  const show = useCallback(
    (config: ToastConfig | string) => {
      clearTimer();

      const toastConfig = typeof config === "string" ? { message: config } : config;

      setCurrentToast(toastConfig);
      opacity.value = withTiming(1, { duration: 200 });

      const duration = toastConfig.duration ?? DEFAULT_DURATION;

      timerRef.current = setTimeout(() => {
        hideToast();
      }, duration);
    },
    [clearTimer, hideToast, opacity]
  );

  const hide = useCallback(() => {
    clearTimer();
    hideToast();
  }, [clearTimer, hideToast]);

  useEffect(() => {
    registerToastHandler({ show, hide });

    return () => {
      clearTimer();
      unregisterToastHandler();
    };
  }, [show, hide, clearTimer]);

  return (
    <ToastContext.Provider value={{ show, hide }}>
      <ToastStateContext.Provider value={{ currentToast, opacity }}>{children}</ToastStateContext.Provider>
    </ToastContext.Provider>
  );
}
