import { apiInstance } from "@/common/lib/apiInstance";
import { PageParams } from "@/common/types/page";
import { WishlistProductListResponse } from "@/features/product/types/product";

export const wishlistService = {
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
