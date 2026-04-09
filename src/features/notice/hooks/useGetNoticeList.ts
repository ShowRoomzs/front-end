import { useInfiniteQuery } from "@tanstack/react-query";

import { NOTICE_QUERY_KEY } from "../constants/queryKey";
import { noticeService } from "../services/noticeService";
import { NoticeListItem } from "../types/notice";

import { PageInfo, PageResponse } from "@/common/types/page";

export default function useGetNoticeList() {
  const query = useInfiniteQuery({
    queryKey: [NOTICE_QUERY_KEY.NOTICE_LIST],
    queryFn: ({ pageParam }) => noticeService.getNoticeList({ page: pageParam, size: 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: PageResponse<NoticeListItem>) =>
      lastPage.pageInfo.hasNext ? lastPage.pageInfo.currentPage + 1 : undefined,
  });

  const notices: Array<NoticeListItem> = query.data?.pages.flatMap(page => page.content) ?? [];
  const pageInfo: PageInfo | undefined = query.data?.pages.at(-1)?.pageInfo;

  return {
    ...query,
    notices,
    pageInfo,
  };
}
