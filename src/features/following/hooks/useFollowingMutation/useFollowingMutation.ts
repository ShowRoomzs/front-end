import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { getInvalidateFns } from "./config";

import { CleanupFn } from "@/common/types/cleanup";
import { followingService } from "@/features/following/services/followingService";

interface FollowingMutationParams {
  shopId: number;
  newIsFollowing: boolean;
}

export function useFollowingMutation(shouldClearCache = false) {
  const [cleanupFns, setCleanupFns] = useState<ReturnType<typeof getInvalidateFns>>([]);

  const mutation = useMutation({
    mutationFn: (params: FollowingMutationParams) => {
      const { newIsFollowing, shopId } = params;

      if (!shouldClearCache) {
        setCleanupFns(getInvalidateFns(shopId));
      }

      return newIsFollowing ? followingService.create(shopId) : followingService.delete(shopId);
    },
    onSuccess: (_data, variables) => {
      if (shouldClearCache) {
        getInvalidateFns(variables.shopId).forEach((fn: CleanupFn) => fn());
      }
    },
  });

  return {
    ...mutation,
    cleanupFns,
  };
}
