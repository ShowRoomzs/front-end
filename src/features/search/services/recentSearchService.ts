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
  createRecentSearch: async (keyword: string) => {
    const { data: response } = await apiInstance.post(`/user/recent-searches?keyword=${keyword}`);

    return response;
  },
  deleteRecentSearch: async (recentSearchId: number) => {
    const { data: response } = await apiInstance.delete(`/user/recent-searches/${recentSearchId}`);

    return response;
  },
};
