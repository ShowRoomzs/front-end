import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/common/lib/queryClient";
import { CART_QUERY_KEY } from "@/features/cart/constants/queryKey";
import { cartService } from "@/features/cart/services/cartService";
import { UpdateCartRequest } from "@/features/cart/types/cart";

interface UpdateCartParams {
  cartId: number;
  data: UpdateCartRequest;
  /** 선택 상태를 함께 보내야 서버가 같은 기준으로 합계를 다시 계산한다 */
  selectedCartItemIds?: Array<number>;
}

export function useUpdateCartMutation() {
  return useMutation({
    mutationFn: ({ cartId, data, selectedCartItemIds }: UpdateCartParams) =>
      cartService.update(cartId, data, selectedCartItemIds),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY.CART] });
    },
  });
}
