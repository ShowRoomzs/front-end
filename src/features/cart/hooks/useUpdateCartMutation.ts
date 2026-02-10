import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/common/lib/queryClient";
import { CART_QUERY_KEY } from "@/features/cart/constants/queryKey";
import { cartService } from "@/features/cart/services/cartService";
import { UpdateCartRequest } from "@/features/cart/types/cart";

interface UpdateCartParams {
  cartId: number;
  data: UpdateCartRequest;
}

export function useUpdateCartMutation() {
  return useMutation({
    mutationFn: ({ cartId, data }: UpdateCartParams) => cartService.update(cartId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY.CART] });
    },
  });
}
