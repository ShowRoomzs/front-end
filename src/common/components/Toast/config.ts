import { ToastType } from "@/common/providers/ToastProvider";

export const TYPE_STYLES: Record<ToastType, string> = {
  info: "bg-gray14",
  success: "bg-positiveColor",
  error: "bg-negativeColor",
  warning: "bg-pointColor",
};

export const DEFAULT_OFFSET = {
  top: 10,
  bottom: 10,
  left: 10,
  right: 10,
};

// 토스트 스와이프 시 반대 방향(top > bottom, bottom > top)으로 최대 이동 가능 거리
export const LIMIT_OPPOSITE_OFFSET = 30;
export const VELOCITY_THRESHOLD = 500;
export const DISTANCE_THRESHOLD_PERCENT = 0.3;
