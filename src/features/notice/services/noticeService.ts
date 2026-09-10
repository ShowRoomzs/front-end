import { NoticeDetail, NoticeListItem } from "../types/notice";

import { apiInstance } from "@/common/lib/apiInstance";
import { PageParams, PageResponse } from "@/common/types/page";
import { IS_DEMO } from "@/demo/config";
import { demoNoticeService } from "@/demo/services/content";

const realNoticeService = {
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

/**
 * 데모 모드에서는 서버 대신 `src/demo`의 구현을 쓴다.
 *
 * 타입을 `typeof realNoticeService`로 묶어 두어 데모 구현이 실제 계약에서 벗어나면
 * 컴파일이 잡는다 — 화면 코드는 지금과 하나도 달라지지 않는다.
 */
export const noticeService: typeof realNoticeService = IS_DEMO
  ? { ...realNoticeService, ...demoNoticeService }
  : realNoticeService;
