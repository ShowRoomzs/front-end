import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { QUERY_KEY } from "@/features/category/constants/queryKey";
import { productService } from "@/features/product/services/productService";
import { ProductListParams } from "@/features/product/types/params";

export function useGetProducts(params: ProductListParams) {
  const queryFn = useCallback(async () => {
    const response = await productService.getProducts(params);

    return {
      ...response,
      products: response.products.map(product => ({
        ...product,
        productNotice: JSON.parse(product.productNotice),
        tags: product.tags ? JSON.parse(product.tags) : [],
      })),
    };
  }, [params]);

  return useQuery({
    queryKey: [QUERY_KEY.PRODUCTS, params],
    queryFn: queryFn,
  });
}
