import { useQuery } from "@tanstack/react-query";

import { PRODUCT_QUERY_KEY } from "@/features/product/constants/queryKey";
import { productService } from "@/features/product/services/productService";

export function useGetProductDetail(productId: number) {
  return useQuery({
    queryKey: [PRODUCT_QUERY_KEY.PRODUCT_DETAIL, productId],
    queryFn: () => productService.getProductDetail(productId),
    staleTime: 1000 * 60 * 5,
  });
}
