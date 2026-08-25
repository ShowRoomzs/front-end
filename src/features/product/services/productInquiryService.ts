import { apiInstance } from "@/common/lib/apiInstance";
import { PageParams, PageResponse } from "@/common/types/page";
import {
  ProductInquiryCategoryResponse,
  ProductInquiryDetail,
  ProductInquiryHistory,
  ProductInquiryHistoryParams,
  ProductInquiryRequest,
} from "@/features/product/types/productInquiry";

export const productInquiryService = {
  getCategories: async () => {
    const { data: response } = await apiInstance.get<ProductInquiryCategoryResponse>(
      "/common/product-inquiries/categories"
    );

    return response;
  },
  create: async (productId: number, data: ProductInquiryRequest) => {
    const { data: response } = await apiInstance.post(`/user/products/${productId}/inquiries`, data);

    return response;
  },
  update: async (inquiryId: number, data: ProductInquiryRequest) => {
    const { data: response } = await apiInstance.put(`/user/product-inquiries/${inquiryId}`, data);

    return response;
  },
  getDetail: async (inquiryId: number) => {
    const { data: response } = await apiInstance.get<ProductInquiryDetail>(
      `/user/product-inquiries/${inquiryId}`
    );

    return response;
  },
  getHistory: async (params: PageParams & ProductInquiryHistoryParams) => {
    const { data: response } = await apiInstance.get<PageResponse<ProductInquiryHistory>>(
      "/user/product-inquiries",
      { params }
    );

    return response;
  },
  delete: async (inquiryId: number) => {
    const { data: response } = await apiInstance.delete(`/user/product-inquiries/${inquiryId}`);

    return response;
  },
};
