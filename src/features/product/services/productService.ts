import { apiInstance } from "@/common/lib/apiInstance";
import { PageParams } from "@/common/types/page";
import { buildProductMock, buildStockMock } from "@/features/product/mocks/productMock";
import { ProductListParams } from "@/features/product/types/params";
// ⚠️ 임시 — 서버에 없는 상품(목업 공구의 상품)만 샘플로 채운다
import { ProductDetailResponse, ProductListResponse, StockResponse } from "@/features/product/types/product";

export const productService = {
  get: async (params: ProductListParams & Pick<PageParams, "page">) => {
    const { data: response } = await apiInstance.get<ProductListResponse>("/common/products", { params });

    return response;
  },
  getDetail: async (productId: number) => {
    try {
      const { data: response } = await apiInstance.get<ProductDetailResponse>(
        `/common/products/${productId}`
      );

      return response;
    } catch (error) {
      // ⚠️ 임시 — 공구 게시물이 목업이라 그 상품 ID가 서버에 없다. 없는 상품만 샘플로 떨어진다.
      //    실제 데이터가 붙으면 이 catch와 mocks/productMock.ts를 함께 지운다
      console.warn(`[product] ${productId} 조회 실패 — 샘플 데이터로 대체합니다`, error);
      return buildProductMock(productId);
    }
  },
  getStock: async (productId: number, variantIds: Array<number>) => {
    try {
      const { data: response } = await apiInstance.get<StockResponse>(
        `/common/products/${productId}/variants`,
        { params: { variantIds } }
      );

      return response;
    } catch (error) {
      // ⚠️ 임시 — 상세와 같은 이유(목업 공구의 상품). 재고를 못 받으면 옵션이 전부 잠겨
      //    옵션 시트를 열어도 아무것도 고를 수 없다
      console.warn(`[product] ${productId} 재고 조회 실패 — 샘플 데이터로 대체합니다`, error);
      return buildStockMock(productId, variantIds);
    }
  },
};
