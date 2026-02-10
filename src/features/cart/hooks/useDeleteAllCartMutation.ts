import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/common/lib/queryClient";
import { CART_QUERY_KEY } from "@/features/cart/constants/queryKey";
import { cartService } from "@/features/cart/services/cartService";

export function useDeleteAllCartMutation() {
  return useMutation({
    mutationFn: cartService.deleteAll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY.CART] });
    },
  });
}
