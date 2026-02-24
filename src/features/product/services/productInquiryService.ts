import { apiInstance } from "@/common/lib/apiInstance";
import { PageParams, PageResponse } from "@/common/types/page";
import {
  ProductInquiryCategoryResponse,
  ProductInquiryHistory,
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
  getHistory: async (params: PageParams) => {
    const { data: response } = await apiInstance.get<PageResponse<ProductInquiryHistory>>(
      "/user/product-inquiries",
      { params }
    );

    return response;
  },
};
