import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/common/lib/queryClient";
import { CART_QUERY_KEY } from "@/features/cart/constants/queryKey";
import { cartService } from "@/features/cart/services/cartService";

interface DeleteCartParams {
  cartItemIds: Array<number>;
  selectedCartItemIds?: Array<number>;
}

export function useDeleteCartManyMutation() {
  return useMutation({
    mutationFn: ({ cartItemIds, selectedCartItemIds }: DeleteCartParams) =>
      cartService.deleteMany(cartItemIds, selectedCartItemIds),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY.CART] });
    },
  });
}
