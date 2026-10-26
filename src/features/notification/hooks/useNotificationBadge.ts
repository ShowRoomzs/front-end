import { useQuery } from "@tanstack/react-query";

import { useUserStore } from "@/common/stores/useUserStore";
import { notificationService } from "@/features/notification/services/notificationService";

export const NOTIFICATION_BADGE_QUERY_KEY = "notificationBadge";

/**
 * C1 홈 종 배지 — C11 목록에 들어간 뒤 새로 온 알림 수(홈 요약 `notificationBadgeCount`).
 * 로그인했을 때만 부르고, 서버에 값이 없으면(개발 서버 미배포) 0이라 점이 켜지지 않는다.
 */
export function useNotificationBadge() {
  const isLoggedIn = !!useUserStore(state => state.user);
  const { data } = useQuery({
    queryKey: [NOTIFICATION_BADGE_QUERY_KEY],
    queryFn: notificationService.getBadgeCount,
    enabled: isLoggedIn,
  });

  return isLoggedIn ? (data ?? 0) : 0;
}
