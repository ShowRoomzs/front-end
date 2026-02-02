import { useQuery } from "@tanstack/react-query";

import { RECENT_SEARCH_QUERY_KEY } from "@/features/search/constants/queryKey";
import { recentSearchService } from "@/features/search/services/recentSearchService";
import { RecentSearchParams } from "@/features/search/types/params";

export function useGetRecentSearch(params: RecentSearchParams, enabled: boolean = false) {
  return useQuery({
    queryKey: [RECENT_SEARCH_QUERY_KEY.RECENT_SEARCH, params],
    queryFn: () => recentSearchService.getRecentSearchKeywords(params),
    enabled,
  });
}
