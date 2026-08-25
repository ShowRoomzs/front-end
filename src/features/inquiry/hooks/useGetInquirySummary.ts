import { useQuery } from "@tanstack/react-query";

import { INQUIRY_QUERY_KEY } from "@/features/inquiry/constants/queryKey";
import { inquiryService } from "@/features/inquiry/services/inquiryService";

/** 문의 내역 탭 배지 — 1:1·상품 건수를 한 번에 받아 두 탭이 같은 값을 쓴다 */
export function useGetInquirySummary() {
  return useQuery({
    queryKey: [INQUIRY_QUERY_KEY.INQUIRY_SUMMARY],
    queryFn: inquiryService.getSummary,
  });
}
