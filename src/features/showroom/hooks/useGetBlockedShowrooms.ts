import { useInfiniteList } from "@/common/hooks/useInfiniteList";
import { SHOWROOM_QUERY_KEY } from "@/features/showroom/constants/queryKey";
import { showroomService } from "@/features/showroom/services/showroomService";
import { BlockedShowroom } from "@/features/showroom/types/showroom";

const PAGE_SIZE = 20;

export function useGetBlockedShowrooms() {
  return useInfiniteList<BlockedShowroom>({
    queryKey: [SHOWROOM_QUERY_KEY.BLOCKED_SHOWROOMS],
    queryFn: page => showroomService.getBlocked({ page, size: PAGE_SIZE }),
  });
}
