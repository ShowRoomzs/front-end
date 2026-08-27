import { useQuery } from "@tanstack/react-query";

import { PRODUCT_INQUIRY_QUERY_KEY } from "@/features/product/constants/queryKey";
import { productInquiryService } from "@/features/product/services/productInquiryService";
import { ProductInquiryCategory } from "@/features/product/types/productInquiry";

/**
 * 상품 문의 유형 5종.
 *
 * **문구는 서버가 들고 있고 순서는 앱이 정한다.** 서버의 enum 선언 순서는 도메인 편의대로라
 * 사용자가 고르는 순서와 맞지 않는다 — 구매 전 질문에서 가장 잦은 것부터 놓아야
 * 대부분의 사람이 목록 위쪽에서 멈춘다.
 *
 * 목록에 없는 키가 새로 생기면 **맨 뒤로 밀되 지우지는 않는다** — 앱이 모르는 유형이라고
 * 고를 수 없게 하면, 서버가 유형을 늘릴 때마다 앱 배포가 필요해진다.
 */
const TYPE_ORDER = ["INGREDIENT_USAGE", "DELIVERY", "RESTOCK", "OPTION", "ETC"];

function sortByDisplayOrder(categories: Array<ProductInquiryCategory>) {
  return [...categories].sort((a, b) => rank(a.key) - rank(b.key));
}

function rank(key: string) {
  const index = TYPE_ORDER.indexOf(key);

  return index === -1 ? TYPE_ORDER.length : index;
}

export function useGetProductInquiryCategory() {
  return useQuery({
    queryKey: [PRODUCT_INQUIRY_QUERY_KEY.PRODUCT_INQUIRY_CATEGORY],
    queryFn: productInquiryService.getCategories,
    select: sortByDisplayOrder,
  });
}
