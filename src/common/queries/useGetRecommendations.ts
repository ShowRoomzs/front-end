import { RECOMMENDATION_QUERY_KEY } from "@/common/constants/queryKey";
import { useInfiniteList } from "@/common/hooks/useInfiniteList";
import { recommendationService } from "@/common/services/recommendationService";
import { RecommendationParams, RecommendedProduct } from "@/common/types/recommendation";

export function useGetRecommendations(params: Omit<RecommendationParams, "page">) {
  return useInfiniteList<RecommendedProduct>({
    queryKey: [RECOMMENDATION_QUERY_KEY.RECOMMENDATIONS, params],
    queryFn: page => recommendationService.getRecommendations({ ...params, page }),
  });
}
