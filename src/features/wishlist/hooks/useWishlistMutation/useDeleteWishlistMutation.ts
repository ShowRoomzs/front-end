import { useMutation } from "@tanstack/react-query";

import { getInvalidateFns } from "./config";

import { wishlistService } from "@/features/wishlist/services/wishlistService";

export function useDeleteWishlistMutation(invalidateOnSuccess = true) {
  return useMutation({
    mutationFn: wishlistService.removeWishlist,
    onSuccess: (_data, productId) => {
      if (invalidateOnSuccess) {
        getInvalidateFns(productId).forEach(fn => fn());
      }
    },
  });
}
