import { useQuery } from "@tanstack/react-query";

import { CART_QUERY_KEY } from "@/features/cart/constants/queryKey";
import { cartService } from "@/features/cart/services/cartService";

export function useGetCart(enabled: boolean) {
  return useQuery({
    queryKey: [CART_QUERY_KEY.CART],
    queryFn: cartService.get,
    enabled,
  });
}
