import { Easing, Keyframe, ReduceMotion } from "react-native-reanimated";

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
  /** 바텀 시트 퇴장 */
  sheetExit: 220,
  /** 아코디언 · 드롭다운 접힘 — 펼침(200ms)의 75% */
  collapse: 150,
};

/** 동작 줄이기 — OS 설정을 따른다(켜져 있으면 이동 · 확대 없이 바로 끝값) */
export const MOTION_REDUCE = ReduceMotion.System;

/** 바텀 시트 — 아래에서 280ms spring으로 올라온다 */
export const SHEET_ENTER_TIMING = {
  duration: MOTION_DURATION.sheet,
  easing: MOTION_EASING.spring,
  reduceMotion: MOTION_REDUCE,
};

/** 바텀 시트 퇴장 — 220ms exit */
export const SHEET_EXIT_TIMING = {
  duration: MOTION_DURATION.sheetExit,
  easing: MOTION_EASING.exit,
  reduceMotion: MOTION_REDUCE,
};

/**
 * 아코디언 · 드롭다운 · 접히는 섹션의 내용 — 위에서 4px 내려오며 페이드 200ms(§08).
 * 레이아웃 애니메이션이라 `entering`으로 쓴다. 키프레임은 팩토리가 아닌 함수 곡선(bezierFn)을 받는다.
 */
export const EXPAND_ENTERING = new Keyframe({
  0: { opacity: 0, transform: [{ translateY: -4 }] },
  100: { opacity: 1, transform: [{ translateY: 0 }], easing: Easing.bezierFn(0.2, 0, 0, 1) },
})
  .duration(MOTION_DURATION.base)
  .reduceMotion(MOTION_REDUCE);

/** 접을 때는 제자리에서 150ms로 바로 사라진다 */
export const EXPAND_EXITING = new Keyframe({
  0: { opacity: 1 },
  100: { opacity: 0, easing: Easing.bezierFn(0.4, 0, 1, 1) },
})
  .duration(MOTION_DURATION.collapse)
  .reduceMotion(MOTION_REDUCE);
