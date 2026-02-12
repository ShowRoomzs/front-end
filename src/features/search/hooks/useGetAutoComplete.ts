import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { SEARCH_QUERY_KEY } from "@/features/search/constants/queryKey";
import { autoCompleteService } from "@/features/search/services/autoCompleteService";

export function useGetAutoComplete(keyword: string) {
  return useQuery({
    queryKey: [SEARCH_QUERY_KEY.AUTO_COMPLETE, keyword],
    queryFn: () => autoCompleteService.get(keyword),
    enabled: !!keyword,
    placeholderData: keepPreviousData,
  });
}
