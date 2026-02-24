import { InquiryCategory, Inquiry, InquiryListParams, InquiryRequest } from "../types/inquiry";

import { apiInstance } from "@/common/lib/apiInstance";
import { PageResponse } from "@/common/types/page";

export const inquiryService = {
  getCategories: async () => {
    const { data: response } = await apiInstance.get<Array<InquiryCategory>>("/common/inquiries/categories");

    return response;
  },

  getInquiries: async (params: InquiryListParams) => {
    const { data: response } = await apiInstance.get<PageResponse<Inquiry>>("/user/inquiries", { params });

    return response;
  },

  getInquiryDetail: async (inquiryId: number) => {
    const { data: response } = await apiInstance.get<Inquiry>(`/user/inquiries/${inquiryId}`);

    return response;
  },

  createInquiry: async (requestBody: InquiryRequest) => {
    const { data: response } = await apiInstance.post<{ inquiryId: number }>("/user/inquiries", requestBody);

    return response;
  },

  updateInquiry: async ({ inquiryId, requestBody }: { inquiryId: number; requestBody: InquiryRequest }) => {
    const { data: response } = await apiInstance.put(`/user/inquiries/${inquiryId}`, requestBody);

    return response;
  },

  deleteInquiry: async (inquiryId: number) => {
    const { data: response } = await apiInstance.delete(`/user/inquiries/${inquiryId}`);

    return response;
  },
};
