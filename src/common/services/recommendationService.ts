import { apiInstance } from "@/common/lib/apiInstance";
import {
  RecommendationParams,
  RecommendationResponse,
  RecommendedMarketResponse,
} from "@/common/types/recommendation";

export const recommendationService = {
  getRecommendations: async (params: RecommendationParams) => {
    const { data: response } = await apiInstance.get<RecommendationResponse>(
      "/common/products/recommendations",
      {
        params,
      }
    );

    return response;
  },
  getRecommendedMarkets: async (params: RecommendationParams) => {
    const { data: response } = await apiInstance.get<RecommendedMarketResponse>(
      "/common/markets/recommendations",
      {
        params,
      }
    );

    return response;
  },
};
