import { apiInstance } from "@/common/lib/apiInstance";
import { PageParams, PageResponse } from "@/common/types/page";
import { getVisitorId } from "@/common/utils/visitorId";
import {
  BlockedShowroom,
  FollowingShowroom,
  FollowingShowroomSort,
  ShowroomDetail,
  ShowroomListItem,
  ShowroomSearchItem,
} from "@/features/showroom/types/showroom";

export const showroomService = {
  getList: async (params: PageParams & { keyword?: string }) => {
    const { data } = await apiInstance.get<PageResponse<ShowroomListItem>>("/user/showrooms", { params });

    return data;
  },

  /** 비로그인도 열 수 있다 — 토큰이 실려 오면 isFollowing이 채워진다 */
  getDetail: async (showroomId: number) => {
    const { data } = await apiInstance.get<ShowroomDetail>(`/user/showrooms/${showroomId}`);

    return data;
  },

  getFollowing: async (params: PageParams & { sort?: FollowingShowroomSort }) => {
    const { data } = await apiInstance.get<PageResponse<FollowingShowroom>>("/user/showrooms/following", {
      params,
    });

    return data;
  },

  follow: async (showroomId: number) => {
    await apiInstance.post<void>(`/user/showrooms/${showroomId}/follow`);
  },

  unfollow: async (showroomId: number) => {
    await apiInstance.delete<void>(`/user/showrooms/${showroomId}/follow`);
  },

  /**
   * 차단(App Store 심사 1.2) — 그 쇼룸의 게시물이 피드에서 빠지고 쇼룸 목록 · 검색에서도 빠진다.
   * 팔로우 중이었으면 서버가 끊는다(해제해도 되살리지 않는다). 이미 차단했으면 아무 일도 없다(204).
   * 내 쇼룸이면 400(INVALID_INPUT_VALUE)
   */
  block: async (showroomId: number) => {
    await apiInstance.post<void>(`/user/showrooms/${showroomId}/block`);
  },

  unblock: async (showroomId: number) => {
    await apiInstance.delete<void>(`/user/showrooms/${showroomId}/block`);
  },

  /** 설정 > 차단한 쇼룸 — 최근 차단순 */
  getBlocked: async (params: PageParams) => {
    const { data } = await apiInstance.get<PageResponse<BlockedShowroom>>("/user/showrooms/blocked", {
      params,
    });

    return data;
  },

  /**
   * 쇼룸 방문 기록 — 노출 적재와 같은 30분 세션 규칙을 쓴다.
   * `source`는 쇼룸 링크의 `?from=` 값(ig · search · post · direct) — 없으면 서버가 직접 유입으로 센다.
   */
  recordVisit: async (showroomId: number, source?: string) => {
    const visitorId = await getVisitorId();

    await apiInstance.post<void>(`/user/showrooms/${showroomId}/visits`, { source, visitorId });
  },

  /** C14 — 검색 대상은 쇼룸 이름과 아이디(@handle)뿐이다 */
  search: async (params: PageParams & { keyword?: string }) => {
    const { data } = await apiInstance.get<PageResponse<ShowroomSearchItem>>("/user/search/showrooms", {
      params,
    });

    return data;
  },

  /** 결과 없음 화면의 "이런 쇼룸은 어떠세요" 목록 */
  getActive: async (size?: number) => {
    const { data } = await apiInstance.get<Array<ShowroomSearchItem>>("/user/search/showrooms/active", {
      params: { size },
    });

    return data;
  },
};
