import { apiInstance } from "@/common/lib/apiInstance";
import { PageParams } from "@/common/types/page";
import { IS_DEMO } from "@/demo/config";
import { demoWishlistService } from "@/demo/services/content";
import { WishlistParams } from "@/features/wishlist/types/params";
import { WishlistResponse } from "@/features/wishlist/types/wishlist";

const realWishlistService = {
  get: async (params: WishlistParams & Pick<PageParams, "page">) => {
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

/**
 * 데모 모드에서는 서버 대신 `src/demo`의 구현을 쓴다.
 *
 * 타입을 `typeof realWishlistService`로 묶어 두어 데모 구현이 실제 계약에서 벗어나면
 * 컴파일이 잡는다 — 화면 코드는 지금과 하나도 달라지지 않는다.
 */
export const wishlistService: typeof realWishlistService = IS_DEMO
  ? { ...realWishlistService, ...demoWishlistService }
  : realWishlistService;
