import { useQuery } from "@tanstack/react-query";

import { CART_QUERY_KEY } from "@/features/cart/constants/queryKey";
import { cartService } from "@/features/cart/services/cartService";

const RECOMMENDATION_LIMIT = 10;

/**
 * 팔로우한 쇼룸의 진행 중 공구 상품.
 *
 * 무료배송 조건이 공구 단위라 "13,200원 더 담으면 무료"를 본 직후 같은 쇼룸의 다른 상품이
 * 바로 아래 있으면 실제로 도움이 된다. 팔로우한 쇼룸이 없거나 권할 공구가 없으면 빈 배열이다.
 */
export function useGetCartRecommendations(enabled: boolean) {
  return useQuery({
    queryKey: [CART_QUERY_KEY.CART_RECOMMENDATIONS],
    queryFn: () => cartService.getRecommendations(RECOMMENDATION_LIMIT),
    enabled,
  });
}
