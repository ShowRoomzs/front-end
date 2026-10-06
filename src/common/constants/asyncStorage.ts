export const ASYNC_STORAGE = {
  RECENT_SEARCH: "recentSearch",
  /**
   * 결제 대기 중인 주문 `{ orderId, paymentId }` — 결제창 도중 앱이 죽어도 다음 진입에서 주문 상세로
   * 이어 주려고 둔다(서버 결제 연동 규칙 7). 완료·취소·만료가 확인되면 지운다.
   */
  PENDING_ORDER: "pendingOrder",
};
