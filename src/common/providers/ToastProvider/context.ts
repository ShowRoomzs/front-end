import { createContext, ReactNode, useContext } from "react";
import { SharedValue } from "react-native-reanimated";

/**
 * 디자인 시스템 §07 토스트 — 배경은 잉크 하나로 같고, 왼쪽 상태 아이콘만 갈린다.
 * success = 흰 체크 / 그 밖(info · error · warning) = 로즈 라인 알림.
 */
export type ToastType = "info" | "success" | "error" | "warning";
export type ToastPosition = "top" | "bottom";

/** 오른쪽 로즈 텍스트 액션 — 되돌리거나 이동할 수 있을 때 하나만([보기] · [실행 취소]) */
export interface ToastAction {
  label: string;
  onPress: () => void;
}

export interface ToastConfig {
  message: string | ReactNode;
  type?: ToastType;
  position?: ToastPosition;
  duration?: number;
  action?: ToastAction;
}

export interface ToastContextValue {
  show: (config: string | ToastConfig) => void;
  hide: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  /** 화면 하단 고정 바의 높이를 걸어 둔다 — 돌려받은 함수로 뗀다(`useToastAnchor`) */
  attachAnchor: (height: number) => () => void;
}

export interface ToastStateContextValue {
  currentToast: ToastConfig | null;
  opacity: SharedValue<number>;
  translateY: SharedValue<number>;
  /** 지금 화면의 하단 고정 바 높이(안전 영역 포함) — 없으면 null이고 탭바 · 안전 영역 위에 띄운다 */
  anchorHeight: number | null;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
export const ToastStateContext = createContext<ToastStateContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}

export function useToastState() {
  const context = useContext(ToastStateContext);

  if (!context) {
    throw new Error("useToastState must be used within a ToastProvider");
  }

  return context;
}
