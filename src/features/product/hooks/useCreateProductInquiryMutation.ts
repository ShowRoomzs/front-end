import { useMutation } from "@tanstack/react-query";

import { productInquiryService } from "@/features/product/services/productInquiryService";
import { ProductInquiryRequest } from "@/features/product/types/productInquiry";

export function useCreateProductInquiryMutation() {
  return useMutation({
    mutationFn: ({ productId, data }: { productId: number; data: ProductInquiryRequest }) =>
      productInquiryService.create(productId, data),
  });
}
