import { apiInstance } from "@/common/lib/apiInstance";
import { PageParams, PageResponse } from "@/common/types/page";
import {
  ProductInquiryCategoryResponse,
  ProductInquiryDetail,
  ProductInquiryHistory,
  ProductInquiryHistoryParams,
  ProductInquiryRequest,
  PublicProductInquiry,
  PublicProductInquiryList,
} from "@/features/product/types/productInquiry";

/**
 * 공개 목록은 한 번에 받아 C7 미리보기 · C7-2 유형 칩이 같이 쓴다. 상품 하나의 문의가 이만큼을 넘기면
 * C7-2를 서버 페이지 · `type` 필터로 바꾼다.
 */
const PUBLIC_INQUIRY_PAGE_SIZE = 100;

export const productInquiryService = {
  /**
   * 상품 상세에 공개되는 문의 목록 (C7 문의 탭 · C7-2 문의 전체). 비로그인도 열린다 — 로그인했으면
   * 내 비밀글의 본문 · 답변이 함께 온다.
   */
  getPublicList: async (productId: number): Promise<PublicProductInquiryList> => {
    const { data: response } = await apiInstance.get<PageResponse<PublicProductInquiry>>(
      `/common/products/${productId}/inquiries`,
      { params: { page: 1, size: PUBLIC_INQUIRY_PAGE_SIZE } }
    );

    return { totalCount: response.pageInfo.totalResults, items: response.content };
  },
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
