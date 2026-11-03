import { useQuery } from "@tanstack/react-query";

import { useUserStore } from "@/common/stores/useUserStore";
import { homeService } from "@/features/home/services/homeService";
import { HomeSummary } from "@/features/home/types/home";

export const HOME_SUMMARY_QUERY_KEY = "homeSummary";

/**
 * C1 홈 요약을 한 번 받아 종 배지와 빈 상태 분기가 나눠 쓴다. 로그인했을 때만 부른다.
 *
 * @param select 요약에서 쓸 값만 꺼낸다 — 쓰는 값이 바뀔 때만 다시 그린다
 */
export function useHomeSummary<T>(select: (summary: HomeSummary) => T) {
  const isLoggedIn = !!useUserStore(state => state.user);

  return useQuery({
    queryKey: [HOME_SUMMARY_QUERY_KEY],
    queryFn: homeService.getSummary,
    enabled: isLoggedIn,
    select,
  });
}
