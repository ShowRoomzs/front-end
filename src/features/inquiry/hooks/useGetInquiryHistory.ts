import { useInfiniteQuery } from "@tanstack/react-query";

import { INQUIRY_QUERY_KEY } from "../constants/queryKey";
import { inquiryService } from "../services/inquiryService";
import { InquiryHistoryParams, InquiryHistory } from "../types/inquiry";

import { PageInfo, PageResponse } from "@/common/types/page";

export function useGetInquiryHistory(params: InquiryHistoryParams) {
  const query = useInfiniteQuery({
    queryKey: [INQUIRY_QUERY_KEY.INQUIRY_HISTORY, params],
    queryFn: async ({ pageParam }) => {
      const response = await inquiryService.getHistory({ ...params, page: pageParam });

      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: PageResponse<InquiryHistory>) =>
      lastPage.pageInfo.hasNext ? lastPage.pageInfo.currentPage + 1 : undefined,
  });

  const inquiries: Array<InquiryHistory> = query.data?.pages.flatMap(page => page.content) ?? [];
  const pageInfo: PageInfo | undefined = query.data?.pages.at(-1)?.pageInfo;

  return {
    ...query,
    inquiries,
    pageInfo,
  };
}
