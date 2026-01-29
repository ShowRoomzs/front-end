import { useMutation } from "@tanstack/react-query";

import { getInvalidateFns } from "./config";

import { wishlistService } from "@/features/wishlist/services/wishlistService";

export function useAddWishlistMutation(invalidateOnSuccess = true) {
  return useMutation({
    mutationFn: wishlistService.addWishlist,
    onSuccess: (_data, productId) => {
      if (invalidateOnSuccess) {
        getInvalidateFns(productId).forEach(fn => fn());
      }
    },
  });
}
