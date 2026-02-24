import {
  InquiryCategoryResponse,
  InquiryHistory,
  InquiryHistoryParams,
  InquiryRequest,
} from "../types/inquiry";

import { apiInstance } from "@/common/lib/apiInstance";
import { PageResponse } from "@/common/types/page";

export const inquiryService = {
  getCategories: async () => {
    const { data: response } = await apiInstance.get<InquiryCategoryResponse>("/common/inquiries/categories");

    return response;
  },

  create: async (data: InquiryRequest) => {
    const { data: response } = await apiInstance.post<{ inquiryId: number }>("/user/inquiries", data);

    return response;
  },

  getHistory: async (params: InquiryHistoryParams) => {
    const { data: response } = await apiInstance.get<PageResponse<InquiryHistory>>("/user/inquiries", {
      params,
    });

    return response;
  },

  getDetail: async (inquiryId: number) => {
    const { data: response } = await apiInstance.get<InquiryHistory>(`/user/inquiries/${inquiryId}`);

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
