/**
 * C15-3 / C15-4 회원 탈퇴 — back-end `WithdrawalInfoResponse` · `WithdrawalRequest`.
 *
 * 진입 시 한 번에 받아 두 화면이 나눠 쓴다 — 1단계는 이유 목록을, 2단계는 차단 여부와
 * 최종 확인 모달에 들어갈 실제 개수("팔로잉 4곳과 좋아요 12개가…")를 쓴다.
 */
export type WithdrawalReasonCode =
  | "NO_GROUP_BUY"
  | "TOO_MANY_NOTIFICATIONS"
  | "INCONVENIENT_APP"
  | "PRIVACY_CONCERN"
  | "REJOIN_OTHER_ACCOUNT"
  | "ETC";

export interface WithdrawalReasonOption {
  code: WithdrawalReasonCode;
  label: string;
}

export interface WithdrawalBlockers {
  ongoingOrders: number;
  openClaims: number;
  unpaidCharges: number;
  pendingTransfers: number;
}

export interface WithdrawalInfo {
  /** false면 동의 체크와 [탈퇴하기]가 계속 비활성 */
  withdrawable: boolean;
  /** 진행 중인 주문 상품 수 (= blockers.ongoingOrders) */
  ongoingOrderCount: number;
  /**
   * 탈퇴를 막는 건수 — 구매확정 전 주문 · 반품/교환 진행 중 · 재발송비 미결제 · 송금 대기(1021 기-31).
   * 개발 서버 미배포(2026-10-24)라 없을 수 있다.
   */
  blockers?: WithdrawalBlockers;
  /** 이용 정지 중 탈퇴를 막는 설정일 때의 사유 — 기본은 막지 않아 null */
  suspensionBlockedReason?: string | null;
  followingCount: number;
  wishlistCount: number;
  cartCount: number;
  reasons: Array<WithdrawalReasonOption>;
}

export interface WithdrawalRequest {
  /** [필수] 계정과 활동 기록이 삭제되는 데 동의 */
  agreeConsent: boolean;
  /** 선택 — 고르지 않으면 null. 서비스 개선용이라 없어도 탈퇴할 수 있다 */
  reason?: WithdrawalReasonCode | null;
  /** 이유가 ETC일 때 자유 입력 (선택) */
  customReason?: string | null;
}
