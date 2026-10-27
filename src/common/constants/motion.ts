import { Easing, ReduceMotion } from "react-native-reanimated";

/**
 * 디자인 시스템 §08 인터랙션 · 모션 — 모든 반응은 300ms 안에 끝나고,
 * 진입은 감속(standard) · 퇴장은 가속(exit, 진입의 75% 길이).
 */
export const MOTION_EASING = {
  /** 빠르게 출발해 부드럽게 멈춤 — 기본 곡선 */
  standard: Easing.bezier(0.2, 0, 0, 1),
  /** 끝에서 살짝 넘쳤다 돌아옴 — 시트 · 하트 팝 */
  spring: Easing.bezier(0.2, 0.8, 0.2, 1),
  /** 천천히 출발해 빠르게 사라짐 — 모든 퇴장 */
  exit: Easing.bezier(0.4, 0, 1, 1),
};

export const MOTION_DURATION = {
  /** 누름 해제 · 색 전환 · 체크 · 칩 선택 */
  fast: 160,
  /** 토글 · 탭 밑줄 · 셰브런 · 아코디언 · 드롭다운 · 모달 · 딤 */
  base: 200,
  /** 바텀 시트 진입 */
  sheet: 280,
};

/** 동작 줄이기 — OS 설정을 따른다(켜져 있으면 이동 · 확대 없이 바로 끝값) */
export const MOTION_REDUCE = ReduceMotion.System;
