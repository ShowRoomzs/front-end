import { queryClient } from "@/common/lib/queryClient";
import { PRODUCT_QUERY_KEY } from "@/features/product/constants/queryKey";
import { WISHLIST_QUERY_KEY } from "@/features/wishlist/constants/queryKey";

export function getInvalidateFns(productId: number) {
  return [
    () => queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY.PRODUCT_DETAIL, productId] }),
    () => queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY.PRODUCTS] }),
    () => queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY.RELATED_PRODUCTS, productId] }),
    () => queryClient.invalidateQueries({ queryKey: [WISHLIST_QUERY_KEY.WISHLIST] }),
  ];
}
