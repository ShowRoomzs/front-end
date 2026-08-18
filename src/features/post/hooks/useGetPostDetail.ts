import { useQuery } from "@tanstack/react-query";

import { POST_QUERY_KEY } from "@/features/post/constants/queryKey";
import { postService } from "@/features/post/services/postService";

export function useGetPostDetail(postId: number) {
  return useQuery({
    queryKey: [POST_QUERY_KEY.POST_DETAIL, postId],
    queryFn: () => postService.getPostDetail(postId),
    enabled: !!postId,
  });
}
