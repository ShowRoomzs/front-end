import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { useUserStore } from "@/common/stores/useUserStore";
import { CART_QUERY_KEY } from "@/features/cart/constants/queryKey";
import { cartService } from "@/features/cart/services/cartService";

/**
 * 선택 상태가 바뀌면 목록을 다시 받는다 — 합계·배송비·무료배송 조건은 공구 단위로 서버가
 * 계산하고, 클라이언트가 다시 계산하면 두 값이 어긋난다.
 */
export function useGetCart(enabled: boolean, selectedCartItemIds?: Array<number>) {
  return useQuery({
    queryKey: [CART_QUERY_KEY.CART, selectedCartItemIds],
    queryFn: () => cartService.get(selectedCartItemIds),
    enabled,
  });
}

/** 헤더 장바구니 배지용 — 담긴 항목 수만 필요할 때 쓴다 */
export function useCartItemCount() {
  const { user } = useUserStore();
  const { data } = useGetCart(!!user);

  return useMemo(
    () => (data?.groups ?? []).reduce((total, group) => total + group.items.length, 0),
    [data?.groups]
  );
}
