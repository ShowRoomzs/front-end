import { useQuery } from "@tanstack/react-query";

import { PRODUCT_INQUIRY_QUERY_KEY } from "@/features/product/constants/queryKey";
import { productInquiryService } from "@/features/product/services/productInquiryService";

export function useGetProductInquiryCategory() {
  return useQuery({
    queryKey: [PRODUCT_INQUIRY_QUERY_KEY.PRODUCT_INQUIRY_CATEGORY],
    queryFn: productInquiryService.getCategories,
  });
}
