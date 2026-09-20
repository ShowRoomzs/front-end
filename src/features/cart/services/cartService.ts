import { apiInstance } from "@/common/lib/apiInstance";
import {
  CartRecommendationResponse,
  CartResponse,
  CreateCartRequest,
  UpdateCartRequest,
} from "@/features/cart/types/cart";

/**
 * 선택 상태를 서버로 보내는 이유 — 합계·배송비는 선택된 항목만으로 계산되고, 무료배송 조건은
 * 공구 단위라 클라이언트가 다시 계산하면 서버와 어긋난다. 체크를 바꿀 때마다 목록을 다시 받는다.
 */
export const cartService = {
  get: async (selectedCartItemIds?: Array<number>) => {
    const { data } = await apiInstance.get<CartResponse>("/user/cart", {
      params: { selectedCartItemIds },
    });

    return data;
  },

  getRecommendations: async (limit?: number) => {
    const { data } = await apiInstance.get<CartRecommendationResponse>("/user/cart/recommendations", {
      params: { limit },
    });

    return data;
  },

  create: async (body: CreateCartRequest) => {
    const { data } = await apiInstance.post("/user/cart", body);

    return data;
  },

  update: async (cartId: number, body: UpdateCartRequest, selectedCartItemIds?: Array<number>) => {
    await apiInstance.patch(`/user/cart/${cartId}`, body, { params: { selectedCartItemIds } });
  },

  deleteMany: async (cartItemIds: Array<number>, selectedCartItemIds?: Array<number>) => {
    const { data } = await apiInstance.delete("/user/cart", {
      params: { cartItemIds, selectedCartItemIds },
    });

    return data;
  },
};
