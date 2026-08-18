import { useQuery } from "@tanstack/react-query";

import { SHOWROOM_QUERY_KEY } from "@/features/showroom/constants/queryKey";
import { showroomService } from "@/features/showroom/services/showroomService";

export function useGetShowroomDetail(showroomId: number) {
  return useQuery({
    queryKey: [SHOWROOM_QUERY_KEY.SHOWROOM_DETAIL, showroomId],
    queryFn: () => showroomService.getDetail(showroomId),
    enabled: !!showroomId,
  });
}
