import { useInfiniteList } from "@/common/hooks/useInfiniteList";
import { PRODUCT_QUERY_KEY } from "@/features/product/constants/queryKey";
import { productService } from "@/features/product/services/productService";
import { ProductListParams } from "@/features/product/types/params";
import { ProductListResponse } from "@/features/product/types/product";

function parseProductListResponse(response: ProductListResponse): ProductListResponse {
  return {
    ...response,
    content: response.content.map(product => ({
      ...product,
      productNotice:
        typeof product.productNotice === "string" ? JSON.parse(product.productNotice) : product.productNotice,
      tags: typeof product.tags === "string" ? JSON.parse(product.tags as string) : [],
    })),
  };
}

export function useGetProducts(params: ProductListParams) {
  return useInfiniteList<ProductListResponse>({
    queryKey: [PRODUCT_QUERY_KEY.PRODUCTS, params],
    queryFn: async page => {
      const response = await productService.get({ ...params, page });

      return parseProductListResponse(response);
    },
  });
}
