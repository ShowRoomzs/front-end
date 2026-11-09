import { useQuery } from "@tanstack/react-query";

import { POST_QUERY_KEY } from "@/features/post/constants/queryKey";
import { postService } from "@/features/post/services/postService";

/** C4 상단 「진행 중인 공구」 — 쇼룸 게시물 피드(`useGetShowroomPosts`)는 진행 중 공구를 싣지 않는다 */
export function useGetShowroomGroupBuyPosts(showroomId: number) {
  return useQuery({
    queryKey: [POST_QUERY_KEY.SHOWROOM_GROUP_BUY_POSTS, showroomId],
    queryFn: () => postService.getShowroomOngoingGroupBuyPosts(showroomId),
    enabled: !!showroomId,
  });
}
