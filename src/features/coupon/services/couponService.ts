import { apiInstance } from "@/common/lib/apiInstance";
import { PageParams, PageResponse } from "@/common/types/page";
import { IS_DEMO } from "@/demo/config";
import { demoCouponService } from "@/demo/services/settings";
import { Coupon, CreateCouponRequest, ProductByCouponResponse } from "@/features/coupon/types/coupon";

const realCouponService = {
  getAll: async (params: PageParams): Promise<PageResponse<Coupon>> => {
    const { data: response } = await apiInstance.get("/user/coupons", { params });

    return response;
  },
  create: async (data: CreateCouponRequest) => {
    const { data: response } = await apiInstance.post("/user/coupons", data);

    return response;
  },
  getByProductId: async (productId: number) => {
    const { data: response } = await apiInstance.get<ProductByCouponResponse>(
      `/common/products/${productId}/coupons`
    );

    return response;
  },
};

/** 데모 모드에서는 서버 대신 `src/demo`의 구현을 쓴다 */
export const couponService: typeof realCouponService = IS_DEMO
  ? { ...realCouponService, ...demoCouponService }
  : realCouponService;
