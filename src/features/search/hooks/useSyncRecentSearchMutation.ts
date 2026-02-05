import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/common/lib/queryClient";
import { RECENT_SEARCH_QUERY_KEY } from "@/features/search/constants/queryKey";
import { recentSearchService } from "@/features/search/services/recentSearchService";

export function useSyncRecentSearchMutation() {
  return useMutation({
    mutationFn: recentSearchService.sync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RECENT_SEARCH_QUERY_KEY.RECENT_SEARCH] });
    },
  });
}
