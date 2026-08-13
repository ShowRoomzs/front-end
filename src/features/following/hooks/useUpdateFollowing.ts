import { useCallback, useRef } from "react";
import { debounce } from "remeda";

import { loadUser } from "@/common/utils/loadUser";
import { useFollowingMutation } from "@/features/following/hooks/useFollowingMutation/useFollowingMutation";

const DEBOUNCED_WAIT_MS = 500;

export function useUpdateFollowing(shouldClearCache = false) {
  const { mutateAsync, cleanupFns } = useFollowingMutation(shouldClearCache);
  const debouncedMapRef = useRef<Map<number, ReturnType<typeof debounce>>>(new Map());

  const update = useCallback(
    async (shopId: number, newIsFollowing: boolean) => {
      await mutateAsync({ shopId, newIsFollowing });
      await loadUser();
    },
    [mutateAsync]
  );

  const updateDebounced = useCallback(
    (shopId: number, newIsFollowing: boolean) => {
      let debounced = debouncedMapRef.current.get(shopId);

      if (!debounced) {
        debounced = debounce(
          (isFollowing: boolean) => {
            update(shopId, isFollowing);
          },
          { waitMs: DEBOUNCED_WAIT_MS }
        );

        debouncedMapRef.current.set(shopId, debounced);
      }

      debounced.call(newIsFollowing);
    },
    [update]
  );

  return { update: updateDebounced, cleanupFns };
}
