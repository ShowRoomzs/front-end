import { useMutation } from "@tanstack/react-query";

import { INQUIRY_QUERY_KEY } from "../../constants/queryKey";
import { inquiryService } from "../../services/inquiryService";
import { InquiryRequest } from "../../types/inquiry";

import { queryClient } from "@/common/lib/queryClient";

export function useCreateInquiryMutation() {
  return useMutation({
    mutationFn: (data: InquiryRequest) => inquiryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INQUIRY_QUERY_KEY.INQUIRY_HISTORY] });
      queryClient.invalidateQueries({ queryKey: [INQUIRY_QUERY_KEY.INQUIRY_SUMMARY] });
    },
  });
}
