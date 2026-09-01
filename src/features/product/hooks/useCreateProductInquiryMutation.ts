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
      // 문의 탭의 공개 목록과 머리의 건수도 방금 쓴 글을 반영해야 한다
      queryClient.invalidateQueries({ queryKey: [PRODUCT_INQUIRY_QUERY_KEY.PUBLIC_INQUIRIES] });
    },
  });
}
