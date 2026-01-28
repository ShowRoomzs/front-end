import { useCallback, useRef } from "react";
import { debounce } from "remeda";

import { useWishlistMutation } from "@/features/wishlist/hooks/useWishlistMutation";

const DEBOUNCED_WAIT_MS = 500;

export function useUpdateWishlist(shouldClearCache: boolean = false) {
  const { mutateAsync, cleanupFns } = useWishlistMutation(shouldClearCache);

  // productId별 debounce 저장소
  const debouncedMapRef = useRef<Map<number, ReturnType<typeof debounce>>>(new Map());

  const update = useCallback(
    async (productId: number, newIsWished: boolean) => {
      await mutateAsync({ productId, newIsWished: newIsWished });
    },
    [mutateAsync]
  );

  const updateDebounced = useCallback(
    (productId: number, newIsWished: boolean) => {
      let debounced = debouncedMapRef.current.get(productId);

      if (!debounced) {
        debounced = debounce(
          (isWished: boolean) => {
            update(productId, isWished);
          },
          { waitMs: DEBOUNCED_WAIT_MS }
        );

        debouncedMapRef.current.set(productId, debounced);
      }

      debounced.call(newIsWished);
    },
    [update]
  );

  return { update: updateDebounced, cleanupFns };
}
