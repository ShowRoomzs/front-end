import { useQuery } from "@tanstack/react-query";

import { POST_QUERY_KEY } from "@/features/post/constants/queryKey";
import { postService } from "@/features/post/services/postService";

/**
 * 신고 사유 목록은 서버가 내려준다 — 사유는 운영정책과 함께 움직이는 값이라
 * 앱 배포 주기에 묶이면 규정이 바뀌어도 화면이 따라가지 못한다.
 */
export function useGetReportReasons(enabled = true) {
  return useQuery({
    queryKey: [POST_QUERY_KEY.REPORT_REASONS],
    queryFn: postService.getReportReasons,
    enabled,
    staleTime: 1000 * 60 * 60,
  });
}
