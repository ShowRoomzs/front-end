import { useCallback } from "react";

import { useCreateCartMutation } from "@/features/cart/hooks/useCreateCartMutation";
import { CreateCartRequest } from "@/features/cart/types/cart";

/**
 * 장바구니 담기 — 상품 상세의 옵션 시트가 쓴다.
 *
 * 조회·수정·삭제는 선택 상태를 함께 보내야 해서 장바구니 화면이 직접 훅을 쓴다.
 * 여기 남는 것은 화면 밖에서도 필요한 "담기" 하나뿐이다.
 */
export function useCart() {
  const { mutateAsync: createMutateAsync } = useCreateCartMutation();

  const create = useCallback(
    async (items: CreateCartRequest) => {
      await createMutateAsync(items);
    },
    [createMutateAsync]
  );

  return { create };
}
