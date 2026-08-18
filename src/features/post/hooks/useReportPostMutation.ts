import { useMutation } from "@tanstack/react-query";

import { postService } from "@/features/post/services/postService";
import { PostReportRequest } from "@/features/post/types/post";

interface ReportPostParams {
  postId: number;
  body: PostReportRequest;
}

export function useReportPostMutation() {
  return useMutation({
    mutationFn: ({ postId, body }: ReportPostParams) => postService.report(postId, body),
  });
}
