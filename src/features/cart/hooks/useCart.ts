import { useCallback } from "react";

import { useCreateCartMutation } from "@/features/cart/hooks/useCreateCartMutation";
import { useDeleteAllCartMutation } from "@/features/cart/hooks/useDeleteAllCartMutation";
import { useDeleteCartMutation } from "@/features/cart/hooks/useDeleteCartMutation";
import { useGetCart } from "@/features/cart/hooks/useGetCart";
import { useUpdateCartMutation } from "@/features/cart/hooks/useUpdateCartMutation";
import { CreateCartRequest, UpdateCartRequest } from "@/features/cart/types/cart";

export function useCart() {
  const { data: cartData } = useGetCart();
  const { mutateAsync: createMutateAsync } = useCreateCartMutation();
  const { mutateAsync: updateMutateAsync } = useUpdateCartMutation();
  const { mutateAsync: deleteMutateAsync } = useDeleteCartMutation();
  const { mutateAsync: deleteAllMutateAsync } = useDeleteAllCartMutation();

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
      await deleteMutateAsync(id);
    },
    [deleteMutateAsync]
  );

  const removeAll = useCallback(async () => {
    await deleteAllMutateAsync();
  }, [deleteAllMutateAsync]);

  return {
    data: cartData?.content ?? [],
    create,
    update,
    remove,
    removeAll,
  };
}
