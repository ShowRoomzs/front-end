import { useQuery } from "@tanstack/react-query";

import { RECOMMENDATION_QUERY_KEY } from "@/common/constants/queryKey";
import { recommendationService } from "@/common/services/recommendationService";
import { RecommendationParams } from "@/common/types/recommendation";

export function useGetRecommendations(params: RecommendationParams) {
  return useQuery({
    queryKey: [RECOMMENDATION_QUERY_KEY.RECOMMENDATIONS, params],
    queryFn: () => recommendationService.getRecommendations(params),
  });
}
