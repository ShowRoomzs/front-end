import { apiInstance } from "@/common/lib/apiInstance";
import { PageParams } from "@/common/types/page";
import { ProductListParams } from "@/features/product/types/params";
import { ProductDetailResponse, ProductListResponse, StockResponse } from "@/features/product/types/product";

/**
 * 상품 목록 · 상세 · 재고. 실패는 그대로 던진다 — 화면이 오류를 보여준다.
 * (예전에는 목업 공구의 상품 ID가 서버에 없어 샘플 상품으로 대체했지만, 공구 게시물이 실데이터가 되면서 걷어 냈다.
 * 대체하면 실제 404도 가짜 상품으로 보인다.)
 */
export const productService = {
  get: async (params: ProductListParams & Pick<PageParams, "page">) => {
    const { data: response } = await apiInstance.get<ProductListResponse>("/common/products", { params });

    return response;
  },
  getDetail: async (productId: number, groupBuyId?: number) => {
    const { data: response } = await apiInstance.get<ProductDetailResponse>(`/common/products/${productId}`, {
      params: { groupBuyId },
    });

    return response;
  },
  getStock: async (productId: number, variantIds: Array<number>, groupBuyId?: number | null) => {
    const { data: response } = await apiInstance.get<StockResponse>(
      `/common/products/${productId}/variants`,
      {
        params: { variantIds, groupBuyId: groupBuyId ?? undefined },
      }
    );

    return response;
  },
};
