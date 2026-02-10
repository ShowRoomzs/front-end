import { createContext, ReactNode, useContext } from "react";
import { SharedValue } from "react-native-reanimated";

export type ToastType = "info" | "success" | "error" | "warning";
export type ToastPosition = "top" | "bottom" | "center";
export type ToastOffset = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export interface ToastConfig {
  message: string | ReactNode;
  type?: ToastType;
  position?: ToastPosition;
  duration?: number;
  offset?: ToastOffset | number; // 기본 number타입은 상, 하 조정
  wrapperClassName?: string;
  labelClassName?: string;
}

export interface ToastContextValue {
  show: (config: string | ToastConfig) => void;
  hide: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
}

export interface ToastStateContextValue {
  currentToast: ToastConfig | null;
  opacity: SharedValue<number>;
  translateY: SharedValue<number>;
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
