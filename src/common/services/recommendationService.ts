import { apiInstance } from "@/common/lib/apiInstance";
import { RecommendationParams, RecommendationResponse } from "@/common/types/recommendation";

export const recommendationService = {
  getRecommendations: async (params: RecommendationParams) => {
    const { data: response } = await apiInstance.get<RecommendationResponse>("/common/recommendations", {
      params,
    });

    return response;
  },
};
