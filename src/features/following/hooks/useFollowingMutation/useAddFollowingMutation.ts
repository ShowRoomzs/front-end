import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/common/lib/queryClient";
import { FOLLOWING_QUERY_KEY } from "@/features/following/constants/queryKey";
import { followingService } from "@/features/following/services/followingService";

export function useAddFollowingMutation() {
  return useMutation({
    mutationFn: followingService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FOLLOWING_QUERY_KEY.FOLLOWING_LIST] });
    },
  });
}
