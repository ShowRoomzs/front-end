import { useMutation } from "@tanstack/react-query";

import { getInvalidateFns } from "./config";

import { followingService } from "@/features/following/services/followingService";

export function useDeleteFollowingMutation(invalidateOnSuccess = true) {
  return useMutation({
    mutationFn: followingService.delete,
    onSuccess: (_data, shopId) => {
      if (invalidateOnSuccess) {
        getInvalidateFns(shopId).forEach(fn => fn());
      }
    },
  });
}
