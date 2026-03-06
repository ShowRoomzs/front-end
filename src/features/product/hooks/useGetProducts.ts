import { useInfiniteQuery } from "@tanstack/react-query";

import { PageInfo } from "@/common/types/page";
import { PRODUCT_QUERY_KEY } from "@/features/product/constants/queryKey";
import { productService } from "@/features/product/services/productService";
import { ProductListParams } from "@/features/product/types/params";
import { Product, ProductListResponse } from "@/features/product/types/product";

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
  const query = useInfiniteQuery({
    queryKey: [PRODUCT_QUERY_KEY.PRODUCTS, params],
    queryFn: async ({ pageParam }) => {
      const response = await productService.get({ ...params, page: pageParam });

      return parseProductListResponse(response);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: ProductListResponse) =>
      lastPage.pageInfo.hasNext ? lastPage.pageInfo.currentPage + 1 : undefined,
  });

  const products: Array<Product> = query.data?.pages.flatMap(page => page.content) ?? [];
  const pageInfo: PageInfo | undefined = query.data?.pages.at(-1)?.pageInfo;

  return {
    ...query,
    data: { products, pageInfo },
    products,
    pageInfo,
  };
}
