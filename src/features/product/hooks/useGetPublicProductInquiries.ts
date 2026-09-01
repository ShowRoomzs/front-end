import { useQuery } from "@tanstack/react-query";

import { PRODUCT_INQUIRY_QUERY_KEY } from "@/features/product/constants/queryKey";
import { productInquiryService } from "@/features/product/services/productInquiryService";

/**
 * 상품 상세에 공개되는 문의 목록.
 *
 * C7 문의 탭(최근 3건 미리보기)과 C7-2 문의 전체가 **같은 질의를 공유한다** — 전체 보기로
 * 넘어갈 때 다시 부르지 않아야 목록의 순서와 건수가 두 화면에서 어긋나지 않는다.
 *
 * 문의를 새로 쓰면 `useCreateProductInquiryMutation`이 이 키를 무효화한다.
 */
export function useGetPublicProductInquiries(productId: number) {
  return useQuery({
    queryKey: [PRODUCT_INQUIRY_QUERY_KEY.PUBLIC_INQUIRIES, productId],
    queryFn: () => productInquiryService.getPublicList(productId),
  });
}
