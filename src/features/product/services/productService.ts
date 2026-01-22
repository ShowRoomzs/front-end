import { apiInstance } from "@/common/lib/apiInstance";
import { ProductListParams, ProductListResponse } from "@/features/product/types/params";

export const productService = {
  getProducts: async (params: ProductListParams) => {
    const { data: response } = await apiInstance.get<ProductListResponse>("/common/products", { params });

    return response;
  },
};
