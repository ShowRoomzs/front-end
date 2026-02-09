import { queryClient } from "@/common/lib/queryClient";
import { FOLLOWING_QUERY_KEY } from "@/features/following/constants/queryKey";
import { PRODUCT_QUERY_KEY } from "@/features/product/constants/queryKey";

export function getInvalidateFns(shopId: number) {
  return [
    () => queryClient.invalidateQueries({ queryKey: [FOLLOWING_QUERY_KEY.FOLLOWING_LIST] }),
    () => queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY.PRODUCT_DETAIL] }),

    // TODO: Shop 피쳐 구현 후 특정 shopId만 무효화
    // () => queryClient.invalidateQueries({ queryKey: [SHOP_QUERY_KEY.SHOP_DETAIL, shopId] }),
    // TODO: Profile 피쳐 구현 후 추가
  ];
}
