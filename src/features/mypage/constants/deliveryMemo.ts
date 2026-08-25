/**
 * 배송 메모 프리셋 (C13-1).
 *
 * 자유 입력만 두면 기사에게 전달되지 않는 문장("초인종 누르지 마세요" 같은 개인 요청)이
 * 쌓인다. 실제로 송장에 실리는 문구를 미리 골라 두고, 그 밖은 [직접 입력]으로 받는다.
 */
export const DELIVERY_MEMO_CUSTOM = "직접 입력";

export const DELIVERY_MEMO_PRESETS = [
  "문 앞에 두세요",
  "경비실에 맡겨주세요",
  "배송 전 연락 주세요",
  "부재 시 전화 주세요",
] as const;

export const DELIVERY_MEMO_OPTIONS = [...DELIVERY_MEMO_PRESETS, DELIVERY_MEMO_CUSTOM];

/** 송장에 실리는 문구라 길면 잘린다 — 서버도 50자로 막는다 */
export const DELIVERY_MEMO_MAX_LENGTH = 50;
