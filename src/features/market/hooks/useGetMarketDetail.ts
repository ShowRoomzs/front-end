import { useQuery } from "@tanstack/react-query";

import { MARKET_QUERY_KEY } from "@/features/market/constants/queryKey";
import { marketService } from "@/features/market/services/marketService";

export function useGetMarketDetail(marketId: number) {
  return useQuery({
    queryKey: [MARKET_QUERY_KEY.MARKET_DETAIL, marketId],
    queryFn: () => marketService.getDetail(marketId),
  });
}
