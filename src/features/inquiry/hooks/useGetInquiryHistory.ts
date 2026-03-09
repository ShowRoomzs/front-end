import { INQUIRY_QUERY_KEY } from "../constants/queryKey";
import { inquiryService } from "../services/inquiryService";
import { InquiryHistory, InquiryHistoryParams } from "../types/inquiry";

import { useInfiniteList } from "@/common/hooks/useInfiniteList";

export function useGetInquiryHistory(params: InquiryHistoryParams) {
  return useInfiniteList<InquiryHistory>({
    queryKey: [INQUIRY_QUERY_KEY.INQUIRY_HISTORY, params],
    queryFn: page => inquiryService.getHistory({ ...params, page }),
  });
}
