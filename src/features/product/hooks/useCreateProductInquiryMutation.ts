import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/common/lib/queryClient";
import { INQUIRY_QUERY_KEY } from "@/features/inquiry/constants/queryKey";
import { PRODUCT_INQUIRY_QUERY_KEY } from "@/features/product/constants/queryKey";
import { productInquiryService } from "@/features/product/services/productInquiryService";
import { ProductInquiryRequest } from "@/features/product/types/productInquiry";

export function useCreateProductInquiryMutation() {
  return useMutation({
    mutationFn: ({ productId, data }: { productId: number; data: ProductInquiryRequest }) =>
      productInquiryService.create(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_INQUIRY_QUERY_KEY.INQUIRY_HISTORY] });
      queryClient.invalidateQueries({ queryKey: [INQUIRY_QUERY_KEY.INQUIRY_SUMMARY] });
    },
  });
}
