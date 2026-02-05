import { apiInstance } from "@/common/lib/apiInstance";
import { WishlistParams } from "@/features/wishlist/types/params";
import { WishlistResponse } from "@/features/wishlist/types/wishlist";

export const wishlistService = {
  get: async (params: WishlistParams) => {
    const { data: response } = await apiInstance.get<WishlistResponse>(`/user/wishlist`, {
      params,
    });

    return response;
  },
  create: async (productId: number) => {
    const { data: response } = await apiInstance.post<void>(`/user/wishlist/${productId}`);

    return response;
  },
  delete: async (productId: number) => {
    const { data: response } = await apiInstance.delete<void>(`/user/wishlist/${productId}`);

    return response;
  },
};
