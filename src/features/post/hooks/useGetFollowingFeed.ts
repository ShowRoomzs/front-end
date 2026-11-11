import { useInfiniteList } from "@/common/hooks/useInfiniteList";
import { POST_QUERY_KEY } from "@/features/post/constants/queryKey";
import { postService } from "@/features/post/services/postService";
import { FeedItem } from "@/features/post/types/post";

const PAGE_SIZE = 10;

/** @param userId 비로그인이면 `undefined` — 받지 않는다. 계정을 바꿔 로그인하면 남의 피드가 남지 않게 사용자별로 캐시한다 */
export function useGetFollowingFeed(userId: number | undefined) {
  return useInfiniteList<FeedItem>({
    queryKey: [POST_QUERY_KEY.FOLLOWING_FEED, userId ?? null],
    queryFn: page => postService.getFollowingFeed({ page, size: PAGE_SIZE }),
    enabled: userId !== undefined,
  });
}
