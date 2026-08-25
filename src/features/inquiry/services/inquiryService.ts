import { apiInstance } from "@/common/lib/apiInstance";
import { PageParams, PageResponse } from "@/common/types/page";
import {
  InquiryCategoryResponse,
  InquiryDetail,
  InquiryHistory,
  InquiryHistoryParams,
  InquiryRequest,
  InquirySummary,
} from "@/features/inquiry/types/inquiry";

export const inquiryService = {
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
