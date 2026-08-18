import { useInfiniteList } from "@/common/hooks/useInfiniteList";
import { SHOWROOM_QUERY_KEY } from "@/features/showroom/constants/queryKey";
import { showroomService } from "@/features/showroom/services/showroomService";
import { FollowingShowroom, FollowingShowroomSort } from "@/features/showroom/types/showroom";

const PAGE_SIZE = 20;

export function useGetFollowingShowrooms(sort: FollowingShowroomSort = "DEFAULT", enabled = true) {
  return useInfiniteList<FollowingShowroom>({
    queryKey: [SHOWROOM_QUERY_KEY.FOLLOWING_SHOWROOMS, sort],
    queryFn: page => showroomService.getFollowing({ page, size: PAGE_SIZE, sort }),
    enabled,
  });
}
