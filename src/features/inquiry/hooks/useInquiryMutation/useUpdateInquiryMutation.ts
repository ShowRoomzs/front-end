import { useMutation } from "@tanstack/react-query";

import { INQUIRY_QUERY_KEY } from "../../constants/queryKey";
import { inquiryService } from "../../services/inquiryService";

import { queryClient } from "@/common/lib/queryClient";

export function useUpdateInquiryMutation() {
  return useMutation({
    mutationFn: inquiryService.updateInquiry,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [INQUIRY_QUERY_KEY.LIST] });
      queryClient.invalidateQueries({ queryKey: [INQUIRY_QUERY_KEY.DETAIL, variables.inquiryId] });
    },
  });
}
