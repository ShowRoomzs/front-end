/**
 * C20 계정 이용 정지 — 앱이 드는 고정 문구.
 *
 * 차단 안내 줄은 서버 409 메시지(`UserBlockedAction` 「이용 정지 중에는 {무엇을} 수 없어요.」)와 같은 말투다.
 */
export const SUSPENSION_SHEET_ID = "suspension-notice";
export const ACCOUNT_STATUS_QUERY_KEY = "accountStatus";

export const SUSPENSION_CANNOT = "상품 구매 · 상품 문의 · 팔로우 · 좋아요 · 게시물 신고";
export const SUSPENSION_CAN =
  "진행 중인 주문의 배송 조회 · 취소 · 구매확정 · 반품 · 교환, 1:1 문의, 회원 탈퇴";

export const SUSPENSION_BLOCKED = {
  LIKE: "이용 정지 중에는 좋아요를 누를 수 없어요",
  FOLLOW: "이용 정지 중에는 팔로우할 수 없어요",
  REPORT: "이용 정지 중에는 게시물을 신고할 수 없어요",
  PURCHASE: "이용 정지 중에는 구매할 수 없어요",
  INQUIRY: "이용 정지 중에는 문의할 수 없어요 · 목록은 볼 수 있어요",
  PROFILE: "이용 정지 중에는 닉네임 · 프로필 사진을 바꿀 수 없어요",
} as const;

export const SUSPENSION_ORDER_NOTE =
  "이미 결제한 주문은 이용 정지와 관계없이 배송 조회 · 취소 · 구매확정 · 반품 · 교환을 그대로 할 수 있어요.";

/** 1:1 문의 유형 「계정 이용 정지」 — 서버는 유형 ACCOUNT + `sanctionAppeal: true`로 받는다 */
export const SANCTION_APPEAL_TYPE = "ACCOUNT";
export const SANCTION_APPEAL_TYPE_LABEL = "계정 이용 정지";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** 이벤트 시각(UTC · `…Z`) → 「2026-10-10 14:20」(KST). 시간대가 없으면 벽시계 그대로 */
export function formatSuspendedAt(value: string | null) {
  if (!value) {
    return null;
  }
  const hasZone = /(Z|[+-]\d{2}:?\d{2})$/.test(value);
  const epoch = Date.parse(value);

  if (!hasZone || Number.isNaN(epoch)) {
    return value.slice(0, 16).replace("T", " ");
  }
  return new Date(epoch + KST_OFFSET_MS).toISOString().slice(0, 16).replace("T", " ");
}

/** 날짜 기준 값 → 「10.14(수)」 — 앞 10자리를 그대로 읽는다 */
export function formatShortDate(value: string | null) {
  if (!value) {
    return null;
  }
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  const weekday = WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];

  return `${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}(${weekday})`;
}
