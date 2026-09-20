import { apiInstance } from "@/common/lib/apiInstance";
import { PageParams, PageResponse } from "@/common/types/page";
// ⚠️ 임시 — 공개 문의 목록 API가 열릴 때까지만 쓴다
import { buildProductInquiryMock } from "@/features/product/mocks/productInquiryMock";
import {
  ProductInquiryCategoryResponse,
  ProductInquiryDetail,
  ProductInquiryHistory,
  ProductInquiryHistoryParams,
  ProductInquiryRequest,
  PublicProductInquiry,
  PublicProductInquiryList,
} from "@/features/product/types/productInquiry";

export const productInquiryService = {
  /**
   * 상품 상세에 공개되는 문의 목록 (C7 문의 탭 · C7-2 문의 전체).
   *
   * ⚠️ 서버 미제공 — 이 주소는 아직 없고, 실패하면 `mocks/productInquiryMock.ts`로
   * 떨어진다. 남의 문의가 보이지 않는 `/user/product-inquiries`를 여기에 가져다 쓰지
   * 않는다 — 그걸로 목록을 만들면 머리의 건수가 사람마다 달라져 거짓이 된다.
   *
   * **삭제하는 법** — 공개 목록 API가 열리면 catch 한 블록과 목업 파일을 지우면 된다.
   */
  getPublicList: async (productId: number): Promise<PublicProductInquiryList> => {
    try {
      const { data: response } = await apiInstance.get<PageResponse<PublicProductInquiry>>(
        `/common/products/${productId}/inquiries`
      );

      return { totalCount: response.pageInfo.totalElements, items: response.content };
    } catch (error) {
      // ⚠️ 임시 — 공개 문의 목록 API가 없다. 생기면 이 catch와 목업을 함께 지운다
      console.warn(`[product] ${productId} 문의 목록 조회 실패 — 샘플 데이터로 대체합니다`, error);
      return buildProductInquiryMock(productId);
    }
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
