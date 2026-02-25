import { useQuery } from "@tanstack/react-query";

import { PageParams } from "@/common/types/page";
import { COUPON_QUERY_KEY } from "@/features/coupon/constants/queryKey";
import { couponService } from "@/features/coupon/services/couponService";

export function useGetCoupons(params: PageParams) {
  return useQuery({
    queryKey: [COUPON_QUERY_KEY.COUPONS, params],
    queryFn: () => couponService.getAll(params),
  });
}
