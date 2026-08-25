import { useMutation } from "@tanstack/react-query";

import { INQUIRY_QUERY_KEY } from "../../constants/queryKey";
import { inquiryService } from "../../services/inquiryService";
import { InquiryRequest } from "../../types/inquiry";

import { queryClient } from "@/common/lib/queryClient";

export function useUpdateInquiryMutation(inquiryId: number) {
  return useMutation({
    mutationFn: (data: InquiryRequest) => inquiryService.update(inquiryId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INQUIRY_QUERY_KEY.INQUIRY_HISTORY] });
      queryClient.invalidateQueries({ queryKey: [INQUIRY_QUERY_KEY.INQUIRY_SUMMARY] });
      queryClient.invalidateQueries({ queryKey: [INQUIRY_QUERY_KEY.INQUIRY_DETAIL, inquiryId] });
    },
  });
}
