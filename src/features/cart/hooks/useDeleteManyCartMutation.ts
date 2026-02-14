import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/common/lib/queryClient";
import { CART_QUERY_KEY } from "@/features/cart/constants/queryKey";
import { cartService } from "@/features/cart/services/cartService";

export function useDeleteCartManyMutation() {
  return useMutation({
    mutationFn: cartService.deleteMany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY.CART] });
    },
  });
}
