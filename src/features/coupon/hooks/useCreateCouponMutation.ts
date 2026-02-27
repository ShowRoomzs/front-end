import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/common/lib/queryClient";
import { COUPON_QUERY_KEY } from "@/features/coupon/constants/queryKey";
import { couponService } from "@/features/coupon/services/couponService";

export function useCreateCouponMutation() {
  return useMutation({
    mutationFn: couponService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COUPON_QUERY_KEY.COUPONS] });
    },
  });
}
