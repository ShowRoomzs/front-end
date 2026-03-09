import { useInfiniteList } from "@/common/hooks/useInfiniteList";
import { PRODUCT_INQUIRY_QUERY_KEY } from "@/features/product/constants/queryKey";
import { productInquiryService } from "@/features/product/services/productInquiryService";
import { ProductInquiryHistory, ProductInquiryHistoryParams } from "@/features/product/types/productInquiry";

export function useGetProductInquiryHistory(params: ProductInquiryHistoryParams) {
  return useInfiniteList<ProductInquiryHistory>({
    queryKey: [PRODUCT_INQUIRY_QUERY_KEY.INQUIRY_HISTORY, params],
    queryFn: page => productInquiryService.getHistory({ ...params, page }),
  });
}
