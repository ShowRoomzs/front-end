import { useQuery } from "@tanstack/react-query";

import { NOTICE_QUERY_KEY } from "../constants/queryKey";
import { noticeService } from "../services/noticeService";

export default function useGetNoticeDetail(noticeId?: number) {
  return useQuery({
    queryKey: [NOTICE_QUERY_KEY.NOTICE_DETAIL, noticeId],
    queryFn: () => noticeService.getNoticeDetail(noticeId ?? 0),
    enabled: !!noticeId,
  });
}
