import { useQuery } from "@tanstack/react-query";

import { FILTER_QUERY_KEY } from "@/features/filter/constants/queryKey";
import { filterService } from "@/features/filter/services/filterService";

export function useGetFilters() {
  return useQuery({
    queryKey: [FILTER_QUERY_KEY.FILTERS],
    queryFn: filterService.get,
  });
}
