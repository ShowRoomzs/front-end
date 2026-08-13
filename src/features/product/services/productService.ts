import { apiInstance } from "@/common/lib/apiInstance";
import { PageParams } from "@/common/types/page";
import { ProductListParams } from "@/features/product/types/params";
import { ProductDetailResponse, ProductListResponse, StockResponse } from "@/features/product/types/product";

export const productService = {
  get: async (params: ProductListParams & Pick<PageParams, "page">) => {
    const { data: response } = await apiInstance.get<ProductListResponse>("/common/products", { params });

    return response;
  },
  getDetail: async (productId: number) => {
    const { data: response } = await apiInstance.get<ProductDetailResponse>(`/common/products/${productId}`);

    return response;
  },
  getRelated: async (productId: number, params: PageParams) => {
    const { data: response } = await apiInstance.get<ProductListResponse>(
      `/common/products/${productId}/related`,
      {
        params,
      }
    );

    return response;
  },
  getStock: async (productId: number, variantIds: Array<number>) => {
    const { data: response } = await apiInstance.get<StockResponse>(
      `/common/products/${productId}/variants`,
      { params: { variantIds } }
    );

    return response;
  },
};
