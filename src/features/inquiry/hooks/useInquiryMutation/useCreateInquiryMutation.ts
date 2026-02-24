import { useMutation } from "@tanstack/react-query";

import { INQUIRY_QUERY_KEY } from "../../constants/queryKey";
import { inquiryService } from "../../services/inquiryService";

import { queryClient } from "@/common/lib/queryClient";

export function useCreateInquiryMutation() {
  return useMutation({
    mutationFn: inquiryService.createInquiry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INQUIRY_QUERY_KEY.LIST] });
    },
  });
}
