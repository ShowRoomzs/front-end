import { useQuery } from "@tanstack/react-query";

import { PRODUCT_QUERY_KEY } from "@/features/product/constants/queryKey";
import { productService } from "@/features/product/services/productService";

export function useGetStock(
  productId: number,
  variantIds: Array<number>,
  enabled: boolean,
  groupBuyId?: number | null
) {
  return useQuery({
    queryKey: [PRODUCT_QUERY_KEY.STOCK, productId, variantIds, groupBuyId ?? null],
    queryFn: () => productService.getStock(productId, variantIds, groupBuyId),
    enabled,
  });
}
