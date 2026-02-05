import { apiInstance } from "@/common/lib/apiInstance";
import { RecentSearchParams } from "@/features/search/types/params";
import { RecentSearchResponse, RecentSearchSyncRequest } from "@/features/search/types/recentSearch";

export const recentSearchService = {
  get: async (params: RecentSearchParams) => {
    const { data: response } = await apiInstance.get<RecentSearchResponse>("/user/recent-searches", {
      params,
    });

    return response;
  },
  create: async (keyword: string) => {
    const { data: response } = await apiInstance.post(`/user/recent-searches?keyword=${keyword}`);

    return response;
  },
  delete: async (recentSearchId: number) => {
    const { data: response } = await apiInstance.delete(`/user/recent-searches/${recentSearchId}`);

    return response;
  },
  sync: async (data: RecentSearchSyncRequest) => {
    const { data: response } = await apiInstance.post(`/user/recent-searches/sync`, data);

    return response;
  },
};
