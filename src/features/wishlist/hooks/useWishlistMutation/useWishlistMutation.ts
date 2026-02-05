import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { getInvalidateFns } from "./config";

import { CleanupFn } from "@/common/types/cleanup";
import { wishlistService } from "@/features/wishlist/services/wishlistService";

interface WishlistMutationParams {
  productId: number;
  newIsWished: boolean;
}

export function useWishlistMutation(shouldClearCache = false) {
  const [cleanupFns, setCleanupFns] = useState<ReturnType<typeof getInvalidateFns>>([]);

  const mutation = useMutation({
    mutationFn: (params: WishlistMutationParams) => {
      const { newIsWished, productId } = params;

      if (!shouldClearCache) {
        setCleanupFns(getInvalidateFns(productId));
      }

      return newIsWished ? wishlistService.create(productId) : wishlistService.delete(productId);
    },
    onSuccess: (_data, variables) => {
      if (shouldClearCache) {
        getInvalidateFns(variables.productId).forEach((fn: CleanupFn) => fn());
      }
    },
  });

  return {
    ...mutation,
    cleanupFns,
  };
}
