import { apiInstance } from "@/common/lib/apiInstance";
import { ProductListParams } from "@/features/product/types/params";
import { ProductDetailResponse, ProductListResponse } from "@/features/product/types/product";

export const productService = {
  getProducts: async (params: ProductListParams) => {
    const { data: response } = await apiInstance.get<ProductListResponse>("/common/products", { params });

    return response;
  },
  getProductDetail: async (productId: number) => {
    const { data: response } = await apiInstance.get<ProductDetailResponse>(`/common/products/${productId}`);

    return response;
  },
};
