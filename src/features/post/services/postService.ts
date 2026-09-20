import { apiInstance } from "@/common/lib/apiInstance";
import { PageParams, PageResponse } from "@/common/types/page";
// ⚠️ 임시 — 서버가 공구 게시물 필드를 내려주면 아래 5번의 호출과 함께 지운다
import { withGroupBuyDetailMock, withGroupBuyMock } from "@/features/post/mocks/groupBuyMock";
import {
  FeedItem,
  LikedPostSort,
  PostDetail,
  PostReportReasonItem,
  PostReportRequest,
} from "@/features/post/types/post";

export const postService = {
  /** 팔로우한 쇼룸의 게시물 피드 (C1) */
  getFollowingFeed: async (params: PageParams) => {
    const { data } = await apiInstance.get<PageResponse<FeedItem>>("/user/feed/following", { params });

    return withGroupBuyMock(data);
  },

  /** 팔로우하지 않은 쇼룸의 게시물 — "회원님을 위한 추천" · 팔로잉 0일 때의 발견 피드 */
  getRecommendedFeed: async (params: PageParams) => {
    const { data } = await apiInstance.get<PageResponse<FeedItem>>("/user/feed/recommended", { params });

    return withGroupBuyMock(data);
  },

  /** 좋아요한 게시물 (C3). 경로는 앱이 쓰던 옛 계약을 그대로 둔 것이라 wishlist다 */
  getLikedPosts: async (params: PageParams & { sort?: LikedPostSort }) => {
    const { data } = await apiInstance.get<PageResponse<FeedItem>>("/user/wishlist/contents", { params });

    return withGroupBuyMock(data);
  },

  /** 특정 쇼룸의 게시물 (C4) */
  getShowroomPosts: async (showroomId: number, params: PageParams) => {
    const { data } = await apiInstance.get<PageResponse<FeedItem>>(`/user/showrooms/${showroomId}/posts`, {
      params,
    });

    return withGroupBuyMock(data);
  },

  getPostDetail: async (postId: number) => {
    const { data } = await apiInstance.get<PostDetail>(`/user/showrooms/posts/${postId}`);

    return withGroupBuyDetailMock(data);
  },

  like: async (postId: number) => {
    await apiInstance.post<void>(`/user/showrooms/posts/${postId}/wishlist`);
  },

  unlike: async (postId: number) => {
    await apiInstance.delete<void>(`/user/showrooms/posts/${postId}/wishlist`);
  },

  getReportReasons: async () => {
    const { data } = await apiInstance.get<Array<PostReportReasonItem>>("/user/posts/report-reasons");

    return data;
  },

  report: async (postId: number, body: PostReportRequest) => {
    await apiInstance.post<void>(`/user/posts/${postId}/reports`, body);
  },

  /**
   * 노출 적재 — 카드 한 장이 뷰포트에 들어올 때마다 보내면 요청이 폭발하므로 모아서 보낸다.
   * 같은 사람이 같은 게시물을 다시 봐도 30분 안이면 서버가 적재하지 않는다.
   */
  recordImpressions: async (postIds: Array<number>, visitorId?: string) => {
    await apiInstance.post<void>("/user/posts/impressions", { postIds, visitorId });
  },
};
