import { useMutation } from "@tanstack/react-query";

import { INQUIRY_QUERY_KEY } from "../../constants/queryKey";
import { inquiryService } from "../../services/inquiryService";
import { InquiryRequest } from "../../types/inquiry";

import { queryClient } from "@/common/lib/queryClient";

export function useUpdateInquiryMutation() {
  return useMutation({
    mutationFn: ({ inquiryId, data }: { inquiryId: number; data: InquiryRequest }) =>
      inquiryService.update(inquiryId, data),
    onSuccess: (_, { inquiryId }) => {
      queryClient.invalidateQueries({ queryKey: [INQUIRY_QUERY_KEY.LIST] });
      queryClient.invalidateQueries({ queryKey: [INQUIRY_QUERY_KEY.DETAIL, inquiryId] });
    },
  });
}
