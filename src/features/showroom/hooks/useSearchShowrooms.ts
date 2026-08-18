import { useQuery } from "@tanstack/react-query";

import { useInfiniteList } from "@/common/hooks/useInfiniteList";
import { SHOWROOM_QUERY_KEY } from "@/features/showroom/constants/queryKey";
import { showroomService } from "@/features/showroom/services/showroomService";
import { ShowroomSearchItem } from "@/features/showroom/types/showroom";

const PAGE_SIZE = 20;
const ACTIVE_SHOWROOM_SIZE = 5;

export function useSearchShowrooms(keyword: string) {
  return useInfiniteList<ShowroomSearchItem>({
    queryKey: [SHOWROOM_QUERY_KEY.SHOWROOM_SEARCH, keyword],
    queryFn: page => showroomService.search({ page, size: PAGE_SIZE, keyword }),
    enabled: keyword.trim().length > 0,
  });
}

/** 결과 없음 화면의 "이런 쇼룸은 어떠세요" */
export function useGetActiveShowrooms(enabled = true) {
  return useQuery({
    queryKey: [SHOWROOM_QUERY_KEY.ACTIVE_SHOWROOMS],
    queryFn: () => showroomService.getActive(ACTIVE_SHOWROOM_SIZE),
    enabled,
  });
}
