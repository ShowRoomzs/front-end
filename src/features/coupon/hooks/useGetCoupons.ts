import { useInfiniteQuery } from "@tanstack/react-query";

import { PageInfo, PageResponse } from "@/common/types/page";
import { COUPON_QUERY_KEY } from "@/features/coupon/constants/queryKey";
import { couponService } from "@/features/coupon/services/couponService";
import { Coupon } from "@/features/coupon/types/coupon";

export function useGetCoupons() {
  const query = useInfiniteQuery({
    queryKey: [COUPON_QUERY_KEY.COUPONS],
    queryFn: ({ pageParam }) => couponService.getAll({ page: pageParam, limit: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: PageResponse<Coupon>) =>
      lastPage.pageInfo.hasNext ? lastPage.pageInfo.currentPage + 1 : undefined,
  });

  const coupons: Array<Coupon> = query.data?.pages.flatMap(page => page.content) ?? [];
  const pageInfo: PageInfo | undefined = query.data?.pages.at(-1)?.pageInfo;

  return {
    ...query,
    coupons,
    pageInfo,
  };
}
