import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { PRODUCT_QUERY_KEY } from "@/features/product/constants/queryKey";
import { productService } from "@/features/product/services/productService";
import { ProductListParams } from "@/features/product/types/params";

export function useGetProducts(params: ProductListParams) {
  const queryFn = useCallback(async () => {
    const response = await productService.getProducts(params);

    // TODO : response dto 개선되면 해당 파싱 로직 제거
    return {
      ...response,
      products: response.products.map(product => ({
        ...product,
        productNotice:
          typeof product.productNotice === "string"
            ? JSON.parse(product.productNotice)
            : product.productNotice,
        tags: typeof product.tags === "string" ? JSON.parse(product.tags) : [],
      })),
    };
  }, [params]);

  return useQuery({
    queryKey: [PRODUCT_QUERY_KEY.PRODUCTS, params],
    queryFn: queryFn,
  });
}
