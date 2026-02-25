import { useQuery } from "@tanstack/react-query";

import { PRODUCT_INQUIRY_QUERY_KEY } from "@/features/product/constants/queryKey";
import { productInquiryService } from "@/features/product/services/productInquiryService";

export function useGetProductInquiryDetail(inquiryId: number | undefined) {
  return useQuery({
    queryKey: [PRODUCT_INQUIRY_QUERY_KEY.INQUIRY_DETAIL, inquiryId],
    queryFn: () => productInquiryService.getDetail(inquiryId!),
    enabled: inquiryId !== undefined,
  });
}
