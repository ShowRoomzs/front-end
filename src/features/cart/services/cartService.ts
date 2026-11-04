import { apiInstance } from "@/common/lib/apiInstance";
import {
  CartRecommendationResponse,
  CartResponse,
  CreateCartRequest,
  UpdateCartRequest,
} from "@/features/cart/types/cart";
import { isDevMockCartId, isDevMockProduct } from "@/features/product/mocks/devMockIds";

/** DEV 목업 장바구니 — DEV에서만 불러온다(`devMockIds` 참고) */
const loadDevMockCart = () => import("@/features/cart/mocks/devMockCart");

/** 목업 항목 번호는 서버로 보내지 않는다 */
const withoutDevMockIds = (cartIds?: Array<number>) => cartIds?.filter(cartId => !isDevMockCartId(cartId));

/**
 * 선택 상태를 서버로 보내는 이유 — 합계·배송비는 선택된 항목만으로 계산되고, 무료배송 조건은
 * 공구 단위라 클라이언트가 다시 계산하면 서버와 어긋난다. 체크를 바꿀 때마다 목록을 다시 받는다.
 */
export const cartService = {
  get: async (selectedCartItemIds?: Array<number>) => {
    const { data } = await apiInstance.get<CartResponse>("/user/cart", {
      params: { selectedCartItemIds: withoutDevMockIds(selectedCartItemIds) },
    });

    if (__DEV__) {
      return (await loadDevMockCart()).mergeDevMockCart(data, selectedCartItemIds);
    }
    return data;
  },

  getRecommendations: async (limit?: number) => {
    const { data } = await apiInstance.get<CartRecommendationResponse>("/user/cart/recommendations", {
      params: { limit },
    });

    return data;
  },

  create: async (body: CreateCartRequest) => {
    if (__DEV__ && body.some(item => isDevMockProduct(item.productId))) {
      (await loadDevMockCart()).addDevMockCartItems(body.filter(item => isDevMockProduct(item.productId)));
      const rest = body.filter(item => !isDevMockProduct(item.productId));

      if (rest.length === 0) {
        return undefined;
      }
      body = rest;
    }
    const { data } = await apiInstance.post("/user/cart", body);

    return data;
  },

  update: async (cartId: number, body: UpdateCartRequest, selectedCartItemIds?: Array<number>) => {
    if (isDevMockCartId(cartId)) {
      (await loadDevMockCart()).updateDevMockCartItem(cartId, body);
      return;
    }
    await apiInstance.patch(`/user/cart/${cartId}`, body, {
      params: { selectedCartItemIds: withoutDevMockIds(selectedCartItemIds) },
    });
  },

  deleteMany: async (cartItemIds: Array<number>, selectedCartItemIds?: Array<number>) => {
    if (__DEV__ && cartItemIds.some(isDevMockCartId)) {
      (await loadDevMockCart()).removeDevMockCartItems(cartItemIds.filter(isDevMockCartId));
      cartItemIds = cartItemIds.filter(cartId => !isDevMockCartId(cartId));

      if (cartItemIds.length === 0) {
        return undefined;
      }
    }
    const { data } = await apiInstance.delete("/user/cart", {
      params: { cartItemIds, selectedCartItemIds: withoutDevMockIds(selectedCartItemIds) },
    });

    return data;
  },
};
