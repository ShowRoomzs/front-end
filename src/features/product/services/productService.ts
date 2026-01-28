import { apiInstance } from "@/common/lib/apiInstance";
import { PageParams } from "@/common/types/page";
import { ProductListParams } from "@/features/product/types/params";
import {
  ProductDetailResponse,
  ProductListResponse,
  WishlistProductListResponse,
} from "@/features/product/types/product";

export const productService = {
  getProducts: async (params: ProductListParams) => {
    const { data: response } = await apiInstance.get<ProductListResponse>("/common/products", { params });

    return response;
  },
  getProductDetail: async (productId: number) => {
    const { data: response } = await apiInstance.get<ProductDetailResponse>(`/common/products/${productId}`);

    return response;
  },
  getRelatedProducts: async (productId: number, params: PageParams) => {
    const { data: response } = await apiInstance.get<ProductListResponse>(
      `/common/products/${productId}/related`,
      {
        params,
      }
    );

    return response;
  },
  getWishlist: async (params: PageParams) => {
    const { data: response } = await apiInstance.get<WishlistProductListResponse>(`/user/wishlist`, {
      params,
    });

    return response;
  },
  addWishlist: async (productId: number) => {
    const { data: response } = await apiInstance.post<void>(`/user/wishlist/${productId}`);

    return response;
  },
  removeWishlist: async (productId: number) => {
    const { data: response } = await apiInstance.delete<void>(`/user/wishlist/${productId}`);

    return response;
  },
};
