import * as Haptics from "expo-haptics";

/**
 * 디자인 시스템 §08 햅틱 — 남발하면 신호가 사라지므로 아래 자리에만 쓴다.
 * 스크롤 · 탭 이동 · 일반 버튼에는 쓰지 않는다.
 * 진동을 못 내는 기기에서도 화면 동작은 그대로 가야 하므로 실패는 삼킨다.
 */

/** light — 좋아요 · 팔로우 · 토글 · 옵션 선택 완료 */
export function lightHaptic() {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
}

/** selection — 드롭다운 · 시트 목록에서 항목을 넘길 때 */
export function selectionHaptic() {
  void Haptics.selectionAsync().catch(() => undefined);
}

/** success — 주문 완료 · 취소/반품/교환 요청 접수 */
export function successHaptic() {
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
}

/** warning — 결제 중 마감 차단 · 이용 정지 차단 안내 */
export function warningHaptic() {
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => undefined);
}
