import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/common/lib/queryClient";
import { INQUIRY_QUERY_KEY } from "@/features/inquiry/constants/queryKey";
import { PRODUCT_INQUIRY_QUERY_KEY } from "@/features/product/constants/queryKey";
import { productInquiryService } from "@/features/product/services/productInquiryService";

export function useDeleteInquiryMutation() {
  return useMutation({
    mutationFn: (inquiryId: number) => productInquiryService.delete(inquiryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_INQUIRY_QUERY_KEY.INQUIRY_HISTORY] });
      queryClient.invalidateQueries({ queryKey: [INQUIRY_QUERY_KEY.INQUIRY_SUMMARY] });
    },
  });
}
