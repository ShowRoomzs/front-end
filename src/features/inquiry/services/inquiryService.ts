import { apiInstance } from "@/common/lib/apiInstance";
import { PageParams, PageResponse } from "@/common/types/page";
import { IS_DEMO } from "@/demo/config";
import { demoInquiryService } from "@/demo/services/content";
import {
  InquiryCategoryResponse,
  InquiryDetail,
  InquiryHistory,
  InquiryHistoryParams,
  InquiryRequest,
  InquirySummary,
} from "@/features/inquiry/types/inquiry";

const realInquiryService = {
  getCategories: async () => {
    const { data: response } = await apiInstance.get<InquiryCategoryResponse>("/common/inquiries/categories");

    return response;
  },

  create: async (data: InquiryRequest) => {
    const { data: response } = await apiInstance.post<{ inquiryId: number }>("/user/inquiries", data);

    return response;
  },

  getHistory: async (params: PageParams & InquiryHistoryParams) => {
    const { data: response } = await apiInstance.get<PageResponse<InquiryHistory>>("/user/inquiries", {
      params,
    });

    return response;
  },

  getSummary: async () => {
    const { data: response } = await apiInstance.get<InquirySummary>("/user/inquiries/summary");

    return response;
  },

  getDetail: async (inquiryId: number) => {
    const { data: response } = await apiInstance.get<InquiryDetail>(`/user/inquiries/${inquiryId}`);

    return response;
  },

  update: async (inquiryId: number, data: InquiryRequest) => {
    const { data: response } = await apiInstance.put(`/user/inquiries/${inquiryId}`, data);

    return response;
  },

  delete: async (inquiryId: number) => {
    const { data: response } = await apiInstance.delete(`/user/inquiries/${inquiryId}`);

    return response;
  },
};

/**
 * 데모 모드에서는 서버 대신 `src/demo`의 구현을 쓴다.
 *
 * 타입을 `typeof realInquiryService`로 묶어 두어 데모 구현이 실제 계약에서 벗어나면
 * 컴파일이 잡는다 — 화면 코드는 지금과 하나도 달라지지 않는다.
 */
export const inquiryService: typeof realInquiryService = IS_DEMO
  ? { ...realInquiryService, ...demoInquiryService }
  : realInquiryService;
