import { NoticeDetail, NoticeListItem } from "../types/notice";

import { apiInstance } from "@/common/lib/apiInstance";
import { PageParams, PageResponse } from "@/common/types/page";

export const noticeService = {
  getNoticeList: async (params: PageParams) => {
    const { data: response } = await apiInstance.get<PageResponse<NoticeListItem>>("/common/notices", {
      params,
    });

    return response;
  },

  getNoticeDetail: async (noticeId: number) => {
    const { data: response } = await apiInstance.get<NoticeDetail>(`/common/notices/${noticeId}`);

    return response;
  },
};
