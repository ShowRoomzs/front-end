import { apiInstance } from "@/common/lib/apiInstance";
import { RecentSearchParams } from "@/features/search/types/params";
import { RecentSearchResponse } from "@/features/search/types/recentSearch";

export const recentSearchService = {
  getRecentSearchKeywords: async (params: RecentSearchParams) => {
    const { data: response } = await apiInstance.get<RecentSearchResponse>("/user/recent-searches", {
      params,
    });

    return response;
  },
};
