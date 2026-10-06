import { useQuery } from "@tanstack/react-query";

import { PRODUCT_QUERY_KEY } from "@/features/product/constants/queryKey";
import { productService } from "@/features/product/services/productService";

/**
 * `groupBuyId`를 알면 넘긴다 — 가격(공구가)과 담기·바로 구매에 쓸 공구가 그것으로 정해진다.
 * 없으면 서버가 이 상품을 담은 판매 중 공구가 정확히 하나일 때만 채워 준다.
 */
export function useGetProductDetail(productId: number, groupBuyId?: number) {
  return useQuery({
    queryKey: [PRODUCT_QUERY_KEY.PRODUCT_DETAIL, productId, groupBuyId ?? null],
    queryFn: () => productService.getDetail(productId, groupBuyId),
    staleTime: 1000 * 60 * 5,
  });
}
