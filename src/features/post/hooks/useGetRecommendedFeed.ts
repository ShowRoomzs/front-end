import { useInfiniteList } from "@/common/hooks/useInfiniteList";
import { POST_QUERY_KEY } from "@/features/post/constants/queryKey";
import { postService } from "@/features/post/services/postService";
import { FeedItem } from "@/features/post/types/post";

const PAGE_SIZE = 10;

/**
 * @param userId 비로그인이면 `undefined`. **캐시를 사용자별로 나눈다** — 서버는 요청한 순간의
 * 팔로우로 추천을 거르는데(비로그인은 거를 것이 없다), 키가 하나뿐이면 로그인 전에 받은 추천이
 * 로그인 뒤에도 그대로 쓰여 팔로잉 피드에 있는 게시물이 추천에 또 나왔다.
 */
export function useGetRecommendedFeed(userId: number | undefined) {
  return useInfiniteList<FeedItem>({
    queryKey: [POST_QUERY_KEY.RECOMMENDED_FEED, userId ?? null],
    queryFn: page => postService.getRecommendedFeed({ page, size: PAGE_SIZE }),
  });
}
