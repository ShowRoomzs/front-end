import { useInfiniteQuery } from "@tanstack/react-query";

import { RECOMMENDATION_QUERY_KEY } from "@/common/constants/queryKey";
import { recommendationService } from "@/common/services/recommendationService";
import { PageInfo } from "@/common/types/page";
import { RecommendationParams, RecommendationResponse } from "@/common/types/recommendation";

export function useGetRecommendations(params: Omit<RecommendationParams, "page">) {
  const query = useInfiniteQuery({
    queryKey: [RECOMMENDATION_QUERY_KEY.RECOMMENDATIONS, params],
    queryFn: async ({ pageParam }) => {
      return recommendationService.getRecommendations({ ...params, page: pageParam });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: RecommendationResponse) =>
      lastPage.pageInfo.hasNext ? lastPage.pageInfo.currentPage + 1 : undefined,
  });

  const content = query.data?.pages.flatMap(page => page.content) ?? [];
  const pageInfo: PageInfo | undefined = query.data?.pages.at(-1)?.pageInfo;

  return {
    ...query,
    data: { content, pageInfo },
    content,
    pageInfo,
  };
}
