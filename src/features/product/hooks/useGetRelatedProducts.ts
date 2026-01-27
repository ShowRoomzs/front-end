import { useQuery } from "@tanstack/react-query";

import { PageParams } from "@/common/types/page";
import { PRODUCT_QUERY_KEY } from "@/features/product/constants/queryKey";
import { productService } from "@/features/product/services/productService";

export function useGetRelatedProducts(productId: number) {
  // 연관상품이 페이징 처리가 필요한가?
  const params: PageParams = {
    page: 1,
    limit: 4,
  };

  return useQuery({
    queryKey: [PRODUCT_QUERY_KEY.RELATED_PRODUCTS, productId, params],
    queryFn: () => productService.getRelatedProducts(productId, params),
  });
}
