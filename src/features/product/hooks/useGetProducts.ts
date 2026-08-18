import { useInfiniteList } from "@/common/hooks/useInfiniteList";
import { PRODUCT_QUERY_KEY } from "@/features/product/constants/queryKey";
import { productService } from "@/features/product/services/productService";
import { ProductListParams } from "@/features/product/types/params";
import { Product, ProductListResponse } from "@/features/product/types/product";

/**
 * 목록 응답의 productNotice는 문자열로 온다 — 상세는 객체(JsonNode)로 오는 것과 다르다.
 * 파싱은 여기서 한 번만 하고, 화면은 항상 객체를 받는다.
 */
function parseProductListResponse(response: ProductListResponse): ProductListResponse {
  return {
    ...response,
    content: response.content.map(product => ({
      ...product,
      productNotice:
        typeof product.productNotice === "string" ? JSON.parse(product.productNotice) : product.productNotice,
    })),
  };
}

export function useGetProducts(params: ProductListParams) {
  return useInfiniteList<Product>({
    queryKey: [PRODUCT_QUERY_KEY.PRODUCTS, params],
    queryFn: async page => {
      const response = await productService.get({ ...params, page });

      return parseProductListResponse(response);
    },
  });
}
