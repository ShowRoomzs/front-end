import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/common/lib/queryClient";
import { SEARCH_QUERY_KEY } from "@/features/search/constants/queryKey";
import { recentSearchService } from "@/features/search/services/recentSearchService";

/** [전체 삭제] — 개별 삭제를 반복하지 않는다(요청 수도, 실패 지점도 하나여야 한다) */
export function useDeleteAllRecentSearchMutation() {
  return useMutation({
    mutationFn: recentSearchService.deleteAll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SEARCH_QUERY_KEY.RECENT_SEARCH] });
    },
  });
}
