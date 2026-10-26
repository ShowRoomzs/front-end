import { InfiniteData } from "@tanstack/react-query";

import { queryClient } from "@/common/lib/queryClient";
import { PageResponse } from "@/common/types/page";
import { POST_QUERY_KEY } from "@/features/post/constants/queryKey";
import { FeedItem, GroupBuyInfo, PostDetail } from "@/features/post/types/post";

export interface CachedGroupBuy {
  showroomId: number;
  showroomName: string;
  showroomImageUrl: string | null;
  groupBuy: GroupBuyInfo;
}

type FeedCache = InfiniteData<PageResponse<FeedItem>, number> | undefined;

const FEED_QUERY_KEYS = [
  POST_QUERY_KEY.FOLLOWING_FEED,
  POST_QUERY_KEY.RECOMMENDED_FEED,
  POST_QUERY_KEY.LIKED_POSTS,
  POST_QUERY_KEY.SHOWROOM_POSTS,
];

/**
 * 이미 받아 둔 공구 게시물에서 그 공구를 찾는다.
 *
 * 상품 상세(C7) 응답에는 **어느 쇼룸의 어느 공구인지 · 마감까지 며칠인지 · 같은 공구의 다른 상품**이 없다.
 * 피드나 게시물에서 상품으로 들어오면 그 게시물의 서버 데이터(`PostDto.GroupBuyBlock`)가 캐시에 남아 있으니
 * 그것을 쓴다. 게시물 상세가 먼저다 — 피드 목록은 마감된 공구의 `products`를 비워서 내린다.
 *
 * 캐시에 없으면(딥링크 · 장바구니 · 주문에서 들어온 경우) `undefined` — 화면은 그 줄과 섹션을 그리지 않는다.
 */
export function findCachedGroupBuy(groupBuyId: number): CachedGroupBuy | undefined {
  for (const [, detail] of queryClient.getQueriesData<PostDetail>({
    queryKey: [POST_QUERY_KEY.POST_DETAIL],
  })) {
    if (detail?.groupBuy?.groupBuyId === groupBuyId) {
      return {
        showroomId: detail.showroomId,
        showroomName: detail.showroomName,
        showroomImageUrl: detail.showroomImageUrl,
        groupBuy: detail.groupBuy,
      };
    }
  }

  for (const key of FEED_QUERY_KEYS) {
    for (const [, cache] of queryClient.getQueriesData<FeedCache>({ queryKey: [key] })) {
      for (const page of cache?.pages ?? []) {
        const found = page.content.find(item => item.post.groupBuy?.groupBuyId === groupBuyId);

        if (found?.post.groupBuy) {
          return {
            showroomId: found.post.showroomId,
            showroomName: found.post.showroomName,
            showroomImageUrl: found.post.showroomImageUrl,
            groupBuy: found.post.groupBuy,
          };
        }
      }
    }
  }
  return undefined;
}
