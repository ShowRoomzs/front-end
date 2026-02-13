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
  delete: async (cartId: number) => {
    const { data: response } = await apiInstance.delete(`/user/cart/${cartId}`);

    return response;
  },
  deleteAll: async () => {
    const { data: response } = await apiInstance.delete("/user/cart");

    return response;
  },
};
