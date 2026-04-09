import { useQuery } from "@tanstack/react-query";

import { COUPON_QUERY_KEY } from "@/features/coupon/constants/queryKey";
import { couponService } from "@/features/coupon/services/couponService";

export function useGetProductByCoupons(productId: number) {
  return useQuery({
    queryKey: [COUPON_QUERY_KEY.PRODUCT_BY_COUPONS, productId],
    queryFn: () => couponService.getByProductId(productId),
  });
}
