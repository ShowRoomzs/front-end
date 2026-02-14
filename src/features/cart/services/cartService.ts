import { apiInstance } from "@/common/lib/apiInstance";
import { CartResponse, CreateCartRequest, UpdateCartRequest } from "@/features/cart/types/cart";

export const cartService = {
  get: async () => {
    const { data: response } = await apiInstance.get<CartResponse>("/user/cart");

    return response;
  },
  create: async (data: CreateCartRequest) => {
    const { data: response } = await apiInstance.post("/user/cart", data);

    return response;
  },
  update: async (cartId: number, data: UpdateCartRequest) => {
    await apiInstance.patch(`/user/cart/${cartId}`, data);
  },
  deleteMany: async (cartItemIds: Array<number>) => {
    const { data: response } = await apiInstance.delete("/user/cart", {
      params: { cartItemIds },
    });

    return response;
  },
};
