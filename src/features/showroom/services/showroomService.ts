import { apiInstance } from "@/common/lib/apiInstance";
import { PageParams, PageResponse } from "@/common/types/page";
import { IS_DEMO } from "@/demo/config";
import { demoShowroomService } from "@/demo/services/showroom";
import {
  FollowingShowroom,
  FollowingShowroomSort,
  ShowroomDetail,
  ShowroomListItem,
  ShowroomSearchItem,
} from "@/features/showroom/types/showroom";

const realShowroomService = {
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

  /** 쇼룸 방문 기록 — 노출 적재와 같은 30분 세션 규칙을 쓴다 */
  recordVisit: async (showroomId: number, visitorId?: string) => {
    await apiInstance.post<void>(`/user/showrooms/${showroomId}/visits`, { visitorId });
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

/**
 * 데모 모드에서는 서버 대신 `src/demo`의 구현을 쓴다.
 *
 * 타입을 `typeof realShowroomService`로 묶어 두어 데모 구현이 실제 계약에서 벗어나면
 * 컴파일이 잡는다 — 화면 코드는 지금과 하나도 달라지지 않는다.
 */
export const showroomService: typeof realShowroomService = IS_DEMO
  ? { ...realShowroomService, ...demoShowroomService }
  : realShowroomService;
