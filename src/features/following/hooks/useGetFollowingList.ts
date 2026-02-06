import { useQuery } from "@tanstack/react-query";

import { FOLLOWING_QUERY_KEY } from "@/features/following/constants/queryKey";
import { followingService } from "@/features/following/services/followingService";

export function useGetFollowingList() {
  return useQuery({
    queryKey: [FOLLOWING_QUERY_KEY.FOLLOWING_LIST],
    queryFn: followingService.get,
  });
}
