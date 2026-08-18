import { useInfiniteList } from "@/common/hooks/useInfiniteList";
import { POST_QUERY_KEY } from "@/features/post/constants/queryKey";
import { postService } from "@/features/post/services/postService";
import { FeedItem } from "@/features/post/types/post";

const PAGE_SIZE = 10;

export function useGetShowroomPosts(showroomId: number) {
  return useInfiniteList<FeedItem>({
    queryKey: [POST_QUERY_KEY.SHOWROOM_POSTS, showroomId],
    queryFn: page => postService.getShowroomPosts(showroomId, { page, size: PAGE_SIZE }),
  });
}
