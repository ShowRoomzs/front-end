import { useInfiniteList } from "@/common/hooks/useInfiniteList";
import { POST_QUERY_KEY } from "@/features/post/constants/queryKey";
import { postService } from "@/features/post/services/postService";
import { FeedItem, LikedPostSort } from "@/features/post/types/post";

const PAGE_SIZE = 10;

export function useGetLikedPosts(sort: LikedPostSort = "DEFAULT", enabled = true) {
  return useInfiniteList<FeedItem>({
    queryKey: [POST_QUERY_KEY.LIKED_POSTS, sort],
    queryFn: page => postService.getLikedPosts({ page, size: PAGE_SIZE, sort }),
    enabled,
  });
}
