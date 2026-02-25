import { apiInstance } from "@/common/lib/apiInstance";
import { PageParams } from "@/common/types/page";
import { CreateCouponRequest } from "@/features/coupon/types/coupon";

export const couponService = {
  getAll: async (params: PageParams) => {
    const { data: response } = await apiInstance.get("/user/coupons", { params });

    return response;
  },
  create: async (data: CreateCouponRequest) => {
    const { data: response } = await apiInstance.post("/user/coupons", data);

    return response;
  },
};
