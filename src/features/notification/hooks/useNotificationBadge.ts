import { useUserStore } from "@/common/stores/useUserStore";
import { useHomeSummary } from "@/features/home/hooks/useHomeSummary";
import { HomeSummary } from "@/features/home/types/home";

const selectBadge = (summary: HomeSummary) => summary.notificationBadgeCount ?? 0;

/**
 * C1 홈 종 배지 — C11 목록에 들어간 뒤 새로 온 알림 수(홈 요약 `notificationBadgeCount`).
 * 로그인했을 때만 부르고, 서버에 값이 없으면(개발 서버 미배포) 0이라 점이 켜지지 않는다.
 */
export function useNotificationBadge() {
  const isLoggedIn = !!useUserStore(state => state.user);
  const { data } = useHomeSummary(selectBadge);

  return isLoggedIn ? (data ?? 0) : 0;
}
