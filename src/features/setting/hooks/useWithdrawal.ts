import { useQuery } from "@tanstack/react-query";

import { SETTING_QUERY_KEY } from "@/features/setting/constants/queryKey";
import { settingService } from "@/features/setting/services/settingService";

/**
 * 탈퇴 1·2단계가 함께 쓰는 진입 데이터.
 *
 * 화면마다 따로 받지 않는다 — 1단계에서 이유를 고르는 동안 주문 상태가 바뀌어 2단계에서
 * 갑자기 차단되면, 사용자는 방금 한 선택이 왜 사라졌는지 알 수 없다.
 */
export function useGetWithdrawalInfo() {
  return useQuery({
    queryKey: [SETTING_QUERY_KEY.WITHDRAWAL_INFO],
    queryFn: settingService.getWithdrawalInfo,
  });
}
