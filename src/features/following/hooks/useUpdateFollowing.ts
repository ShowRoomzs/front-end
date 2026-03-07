import { useCallback, useRef } from "react";
import { debounce } from "remeda";

import { useUserStore } from "@/common/stores/useUserStore";
import { useFollowingMutation } from "@/features/following/hooks/useFollowingMutation/useFollowingMutation";
import { userService } from "@/features/user/services/userService";

const DEBOUNCED_WAIT_MS = 500;

export function useUpdateFollowing(shouldClearCache = false) {
  const { mutateAsync, cleanupFns } = useFollowingMutation(shouldClearCache);
  const { setUser } = useUserStore();
  const debouncedMapRef = useRef<Map<number, ReturnType<typeof debounce>>>(new Map());

  const update = useCallback(
    async (shopId: number, newIsFollowing: boolean) => {
      await mutateAsync({ shopId, newIsFollowing });
      // user.followingCount는 Zustand store로만 관리되어 invalidateQueries로 갱신 불가.
      // useUpdateUserMutation과 동일한 패턴으로 직접 갱신.
      const userInfo = await userService.get();

      setUser(userInfo);
    },
    [mutateAsync, setUser]
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
