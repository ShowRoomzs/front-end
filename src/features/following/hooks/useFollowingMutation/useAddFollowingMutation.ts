import { useMutation } from "@tanstack/react-query";

import { getInvalidateFns } from "./config";

import { followingService } from "@/features/following/services/followingService";

export function useAddFollowingMutation(invalidateOnSuccess = true) {
  return useMutation({
    mutationFn: followingService.create,
    onSuccess: (_data, shopId) => {
      if (invalidateOnSuccess) {
        getInvalidateFns(shopId).forEach(fn => fn());
      }
    },
  });
}
