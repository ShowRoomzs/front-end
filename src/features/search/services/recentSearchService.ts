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
  /**
   * 검색어 기록 — 같은 엔드포인트가 `showroomId`도 받는다(아래 `createShowroom`).
   *
   * 검색어를 그대로 붙이면 `&`·`#`·공백이 든 검색어에서 쿼리스트링이 깨지므로 params로 넘긴다.
   */
  create: async (keyword: string) => {
    const { data: response } = await apiInstance.post("/user/recent-searches", null, {
      params: { keyword },
    });

    return response;
  },
  /** 쇼룸 기록 — 검색 결과·최근 검색에서 쇼룸으로 들어갔을 때 아바타 행으로 쌓인다 */
  createShowroom: async (showroomId: number) => {
    const { data: response } = await apiInstance.post("/user/recent-searches", null, {
      params: { showroomId },
    });

    return response;
  },
  delete: async (recentSearchId: number) => {
    const { data: response } = await apiInstance.delete(`/user/recent-searches/${recentSearchId}`);

    return response;
  },
  /** 전체 삭제 — 서버가 한 번에 지운다. 항목 수만큼 요청을 보내지 않는다 */
  deleteAll: async () => {
    const { data: response } = await apiInstance.delete("/user/recent-searches");

    return response;
  },
  sync: async (data: RecentSearchSyncRequest) => {
    const { data: response } = await apiInstance.post(`/user/recent-searches/sync`, data);

    return response;
  },
};
