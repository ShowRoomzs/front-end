import { useInfiniteList } from "@/common/hooks/useInfiniteList";
import { POST_QUERY_KEY } from "@/features/post/constants/queryKey";
import { postService } from "@/features/post/services/postService";
import { FeedItem } from "@/features/post/types/post";

const PAGE_SIZE = 10;

export function useGetFollowingFeed(enabled = true) {
  return useInfiniteList<FeedItem>({
    queryKey: [POST_QUERY_KEY.FOLLOWING_FEED],
    queryFn: page => postService.getFollowingFeed({ page, size: PAGE_SIZE }),
    enabled,
  });
}
