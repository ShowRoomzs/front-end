import { useQuery } from "@tanstack/react-query";

import { INQUIRY_QUERY_KEY } from "../constants/queryKey";
import { inquiryService } from "../services/inquiryService";
import { InquiryListParams } from "../types/inquiry";

export function useGetInquiries(params: InquiryListParams) {
  return useQuery({
    queryKey: [INQUIRY_QUERY_KEY.LIST, params],
    queryFn: () => inquiryService.getInquiries(params),
  });
}
