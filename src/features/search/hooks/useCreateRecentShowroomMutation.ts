import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/common/lib/queryClient";
import { SEARCH_QUERY_KEY } from "@/features/search/constants/queryKey";
import { recentSearchService } from "@/features/search/services/recentSearchService";

/** 검색에서 쇼룸으로 들어간 기록 — 최근 검색에 아바타 행으로 남는다 */
export function useCreateRecentShowroomMutation() {
  return useMutation({
    mutationFn: recentSearchService.createShowroom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SEARCH_QUERY_KEY.RECENT_SEARCH] });
    },
  });
}
