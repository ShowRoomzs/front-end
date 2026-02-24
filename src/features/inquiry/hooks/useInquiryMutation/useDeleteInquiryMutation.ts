import { useMutation } from "@tanstack/react-query";

import { INQUIRY_QUERY_KEY } from "../../constants/queryKey";
import { inquiryService } from "../../services/inquiryService";

import { queryClient } from "@/common/lib/queryClient";

export function useDeleteInquiryMutation() {
  return useMutation({
    mutationFn: inquiryService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INQUIRY_QUERY_KEY.LIST] });
    },
  });
}
