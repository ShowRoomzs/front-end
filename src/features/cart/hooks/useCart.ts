import { useCallback } from "react";

import { useUserStore } from "@/common/stores/useUserStore";
import { useCreateCartMutation } from "@/features/cart/hooks/useCreateCartMutation";
import { useDeleteCartManyMutation } from "@/features/cart/hooks/useDeleteManyCartMutation";
import { useGetCart } from "@/features/cart/hooks/useGetCart";
import { useUpdateCartMutation } from "@/features/cart/hooks/useUpdateCartMutation";
import { CreateCartRequest, UpdateCartRequest } from "@/features/cart/types/cart";

export function useCart() {
  const { user } = useUserStore();
  const { data: cartData } = useGetCart(!!user);
  const { mutateAsync: createMutateAsync } = useCreateCartMutation();
  const { mutateAsync: updateMutateAsync } = useUpdateCartMutation();
  const { mutateAsync: deleteManyMutateAsync } = useDeleteCartManyMutation();

  const create = useCallback(
    async (cartData: CreateCartRequest) => {
      await createMutateAsync(cartData);
    },
    [createMutateAsync]
  );

  const update = useCallback(
    async (id: number, cartData: UpdateCartRequest) => {
      await updateMutateAsync({ cartId: id, data: cartData });
    },
    [updateMutateAsync]
  );

  const remove = useCallback(
    async (id: number) => {
      await deleteManyMutateAsync([id]);
    },
    [deleteManyMutateAsync]
  );

  const removeMany = useCallback(
    async (ids: Array<number>) => {
      await deleteManyMutateAsync(ids);
    },
    [deleteManyMutateAsync]
  );

  return {
    data: cartData?.items ?? [],
    create,
    update,
    remove,
    removeMany,
  };
}
