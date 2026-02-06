import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/common/lib/queryClient";
import { FOLLOWING_QUERY_KEY } from "@/features/following/constants/queryKey";
import { followingService } from "@/features/following/services/followingService";

export function useDeleteFollowingMutation() {
  return useMutation({
    mutationFn: followingService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FOLLOWING_QUERY_KEY.FOLLOWING_LIST] });
    },
  });
}
