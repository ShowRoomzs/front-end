import { apiInstance } from "@/common/lib/apiInstance";
import { PageParams } from "@/common/types/page";
import { getVisitorId } from "@/common/utils/visitorId";
import { isDevMockProduct } from "@/features/product/mocks/devMockIds";
import { ProductListParams } from "@/features/product/types/params";
import { ProductDetailResponse, ProductListResponse, StockResponse } from "@/features/product/types/product";

/** DEV 목업 상품 — DEV에서만 불러온다(`devMockIds` 참고). 서버 실패를 가리는 대체가 아니라 정해진 번호에만 쓴다 */
const loadDevMockProduct = () => import("@/features/product/mocks/devMockProduct");

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
    if (isDevMockProduct(productId)) {
      return (await loadDevMockProduct()).getDevMockProductDetail();
    }
    const { data: response } = await apiInstance.get<ProductDetailResponse>(`/common/products/${productId}`, {
      params: { groupBuyId },
    });

    return response;
  },
  /**
   * 상품 상세 조회 기록 — 상세가 열릴 때 한 번. 스튜디오 · 파트너센터 성과 관리의 「상세 조회」가 이 기록이다.
   * `groupBuyId`는 상세 조회에 넘긴 값 그대로 보낸다(서버가 상세와 같은 판정으로 공구를 정한다).
   * 30분 안에 다시 열면 서버가 세지 않는다.
   */
  recordView: async (productId: number, params: { source?: string; groupBuyId?: number }) => {
    if (isDevMockProduct(productId)) {
      return;
    }
    const visitorId = await getVisitorId();

    await apiInstance.post<void>(`/user/products/${productId}/views`, { ...params, visitorId });
  },
  getStock: async (productId: number, variantIds: Array<number>, groupBuyId?: number | null) => {
    if (isDevMockProduct(productId)) {
      return (await loadDevMockProduct()).getDevMockStock(variantIds);
    }
    const { data: response } = await apiInstance.get<StockResponse>(
      `/common/products/${productId}/variants`,
      {
        params: { variantIds, groupBuyId: groupBuyId ?? undefined },
      }
    );

    return response;
  },
};
