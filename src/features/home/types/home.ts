/** `GET /v1/user/home/summary` — BE `HomeSummaryResponse`. 구버전 서버에서 빠질 수 있어 모두 optional */
export interface HomeSummary {
  /** 장바구니에 담긴 상품 수 */
  cartCount?: number;
  /** 팔로우 중인 쇼룸 수 — 0이면 「팔로우한 쇼룸이 없어요」, 1 이상이면 피드가 비어도 빈 상태가 아니다 */
  followingCount?: number;
  /** 종 배지 — C11 목록에 들어간 뒤 새로 온 알림 수 */
  notificationBadgeCount?: number;
}
