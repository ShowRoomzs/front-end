import { useInfiniteList } from "@/common/hooks/useInfiniteList";
import { PageResponse } from "@/common/types/page";
import { COUPON_QUERY_KEY } from "@/features/coupon/constants/queryKey";
import { couponService } from "@/features/coupon/services/couponService";
import { Coupon } from "@/features/coupon/types/coupon";

export function useGetCoupons() {
  return useInfiniteList<PageResponse<Coupon>>({
    queryKey: [COUPON_QUERY_KEY.COUPONS],
    queryFn: page => couponService.getAll({ page, limit: 10 }),
  });
}
