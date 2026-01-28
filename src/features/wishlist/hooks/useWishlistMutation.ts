import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { queryClient } from "@/common/lib/queryClient";
import { CleanupFn } from "@/common/types/cleanup";
import { PRODUCT_QUERY_KEY } from "@/features/product/constants/queryKey";
import { wishlistService } from "@/features/wishlist/services/wishlistService";

interface WishlistMutationParams {
  productId: number;
  newIsWished: boolean;
}

/**
 * @description 선택적 캐시 초기화 전략을 위한 뮤테이션 훅
 * @param shouldClearCache 즉시 캐시 초기화 여부
 * @returns mutation result
 * @returns cleanup function array
 */

export function useWishlistMutation(shouldClearCache: boolean = false) {
  const [cleanupFns, setCleanupFns] = useState<Array<CleanupFn>>([]);

  const getCleanupFns = (productId: number) => {
    return [
      () => queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY.PRODUCT_DETAIL, productId] }),
      () => queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY.PRODUCTS] }),
      () => queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY.RELATED_PRODUCTS, productId] }),
    ];
  };

  const mutation = useMutation({
    mutationFn: (params: WishlistMutationParams) => {
      const { newIsWished, productId } = params;

      if (!shouldClearCache) {
        setCleanupFns(getCleanupFns(productId));
      }

      return newIsWished ? wishlistService.addWishlist(productId) : wishlistService.removeWishlist(productId);
    },
    onSuccess: (_data, variables) => {
      if (shouldClearCache) {
        const { productId } = variables;

        const cleanupFns = getCleanupFns(productId);

        cleanupFns.forEach(cleanupFn => cleanupFn());
      }
    },
  });

  return {
    ...mutation,
    cleanupFns,
  };
}
