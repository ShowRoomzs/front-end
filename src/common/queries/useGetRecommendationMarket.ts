import { useQuery } from "@tanstack/react-query";

import { RECOMMENDATION_QUERY_KEY } from "@/common/constants/queryKey";
import { recommendationService } from "@/common/services/recommendationService";
import { RecommendationParams } from "@/common/types/recommendation";

export function useGetRecommendationMarket(params: RecommendationParams) {
  return useQuery({
    queryKey: [RECOMMENDATION_QUERY_KEY.RECOMMENDATION_MARKET, params],
    queryFn: () => recommendationService.getRecommendedMarkets(params),
  });
}
