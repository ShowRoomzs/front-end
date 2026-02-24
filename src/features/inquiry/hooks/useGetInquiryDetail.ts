import { useQuery } from "@tanstack/react-query";

import { INQUIRY_QUERY_KEY } from "../constants/queryKey";
import { inquiryService } from "../services/inquiryService";

export function useGetInquiryDetail(inquiryId: number) {
  return useQuery({
    queryKey: [INQUIRY_QUERY_KEY.DETAIL, inquiryId],
    queryFn: () => inquiryService.getDetail(inquiryId),
    enabled: !!inquiryId,
  });
}
