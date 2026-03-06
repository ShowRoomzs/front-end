import { INQUIRY_QUERY_KEY } from "../constants/queryKey";
import { inquiryService } from "../services/inquiryService";
import { InquiryHistory, InquiryHistoryParams } from "../types/inquiry";

import { useInfiniteList } from "@/common/hooks/useInfiniteList";
import { PageResponse } from "@/common/types/page";

export function useGetInquiryHistory(params: InquiryHistoryParams) {
  return useInfiniteList<PageResponse<InquiryHistory>>({
    queryKey: [INQUIRY_QUERY_KEY.INQUIRY_HISTORY, params],
    queryFn: page => inquiryService.getHistory({ ...params, page }),
  });
}
