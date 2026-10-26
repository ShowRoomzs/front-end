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

/** 상품별 공개 문의 목록 API(`GET /v1/common/products/{productId}/inquiries`)가 서버에 생겼는가 */
const PUBLIC_INQUIRY_LIST_AVAILABLE = false;

export const productInquiryService = {
  /**
   * 상품 상세에 공개되는 문의 목록 (C7 문의 탭 · C7-2 문의 전체).
   *
   * ⚠️ 서버 미제공(2026-10-21 main · feat/add 모두) — 상품별 **공개** 목록 API가 없다. 남의 문의가 보이지 않는
   * `/user/product-inquiries`를 여기에 가져다 쓰지 않는다 — 그걸로 목록을 만들면 머리의 건수가 사람마다 달라져 거짓이 된다.
   *
   * - DEV 빌드: `mocks/productInquiryMock.ts`로 채워 아코디언 · 비밀글 · 답변 상태를 확인한다.
   * - 배포본: `null`을 돌려준다 — 화면은 「준비 중」 안내를 그린다(「등록된 문의가 없어요」라고 쓰면 거짓이다).
   *
   * **API가 열리면** `PUBLIC_INQUIRY_LIST_AVAILABLE`을 true로 바꾸고 목업 분기와 파일을 지운다.
   */
  getPublicList: async (productId: number): Promise<PublicProductInquiryList | null> => {
    if (PUBLIC_INQUIRY_LIST_AVAILABLE) {
      const { data: response } = await apiInstance.get<PageResponse<PublicProductInquiry>>(
        `/common/products/${productId}/inquiries`
      );

      return { totalCount: response.pageInfo.totalElements, items: response.content };
    }
    if (__DEV__) {
      const { buildProductInquiryMock } = await import("@/features/product/mocks/productInquiryMock");

      return buildProductInquiryMock(productId);
    }
    return null;
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
