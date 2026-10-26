import { apiInstance } from "@/common/lib/apiInstance";
import { PageParams, PageResponse } from "@/common/types/page";
import {
  FeedItem,
  GroupBuyInfo,
  LikedPostSort,
  PostDetail,
  PostListItem,
  PostReportReasonItem,
  PostReportRequest,
  RawGroupBuyBlock,
} from "@/features/post/types/post";

/** 서버가 보내는 그대로 — 공구 블록만 `RawGroupBuyBlock`이다 */
type RawFeedItem = Omit<FeedItem, "post"> & {
  post: Omit<PostListItem, "groupBuy"> & { groupBuy: RawGroupBuyBlock | null };
};
type RawPostDetail = Omit<PostDetail, "groupBuy"> & { groupBuy: RawGroupBuyBlock | null };

/**
 * 서버 공구 블록(`PostDto.GroupBuyBlock`) → 화면이 쓰는 `GroupBuyInfo`.
 *
 * - 마감(`CLOSED`)이 아니면 진행 중으로 본다 — 일부·전부 품절은 상품 행의 `soldOut`이 말한다
 * - 대가관계 표시는 공구 게시물에 항상 붙는다(서버 규칙) — 블록이 있으면 배지를 그린다
 * - 상품 행에 공구 ID를 실어, 누르면 상품 상세가 이 공구의 가격·담기로 열리게 한다
 */
function toGroupBuyInfo(raw: RawGroupBuyBlock): GroupBuyInfo {
  return {
    groupBuyId: raw.groupBuyId,
    title: raw.title,
    dday: raw.dDay ?? 0,
    status: raw.saleState === "CLOSED" ? "CLOSED" : "OPEN",
    isPaidAd: !!raw.adDisclosure,
    brandName: raw.brandName ?? null,
    products: (raw.products ?? []).map(product => ({
      productId: product.productId,
      name: product.name,
      imageUrl: product.thumbnailUrl,
      listPrice: product.regularPrice ?? product.groupBuyPrice ?? 0,
      price: product.groupBuyPrice ?? product.regularPrice ?? 0,
      discountRate: product.discountRate ?? 0,
      soldOut: product.state !== "ON_SALE",
      groupBuyId: raw.groupBuyId,
      detailAvailable: product.detailAvailable,
    })),
  };
}

function toFeedPage(page: PageResponse<RawFeedItem>): PageResponse<FeedItem> {
  return {
    ...page,
    content: page.content.map(item => ({
      ...item,
      post: { ...item.post, groupBuy: item.post.groupBuy ? toGroupBuyInfo(item.post.groupBuy) : null },
    })),
  };
}

export const postService = {
  /** 팔로우한 쇼룸의 게시물 피드 (C1) */
  getFollowingFeed: async (params: PageParams) => {
    const { data } = await apiInstance.get<PageResponse<RawFeedItem>>("/user/feed/following", { params });

    return toFeedPage(data);
  },

  /** 팔로우하지 않은 쇼룸의 게시물 — "회원님을 위한 추천" · 팔로잉 0일 때의 발견 피드 */
  getRecommendedFeed: async (params: PageParams) => {
    const { data } = await apiInstance.get<PageResponse<RawFeedItem>>("/user/feed/recommended", { params });

    return toFeedPage(data);
  },

  /** 좋아요한 게시물 (C3). 경로는 앱이 쓰던 옛 계약을 그대로 둔 것이라 wishlist다 */
  getLikedPosts: async (params: PageParams & { sort?: LikedPostSort }) => {
    const { data } = await apiInstance.get<PageResponse<RawFeedItem>>("/user/wishlist/contents", { params });

    return toFeedPage(data);
  },

  /** 특정 쇼룸의 게시물 (C4) */
  getShowroomPosts: async (showroomId: number, params: PageParams) => {
    const { data } = await apiInstance.get<PageResponse<RawFeedItem>>(`/user/showrooms/${showroomId}/posts`, {
      params,
    });

    return toFeedPage(data);
  },

  getPostDetail: async (postId: number): Promise<PostDetail> => {
    const { data } = await apiInstance.get<RawPostDetail>(`/user/showrooms/posts/${postId}`);

    return { ...data, groupBuy: data.groupBuy ? toGroupBuyInfo(data.groupBuy) : null };
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
    if (postIds.length === 0) {
      return;
    }

    await apiInstance.post<void>("/user/posts/impressions", { postIds, visitorId });
  },
};
