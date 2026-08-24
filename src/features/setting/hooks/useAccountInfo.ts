import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "@/common/lib/queryClient";
import { SETTING_QUERY_KEY } from "@/features/setting/constants/queryKey";
import { settingService } from "@/features/setting/services/settingService";
import { AccountInfo } from "@/features/setting/types/notification";

export function useGetAccountInfo() {
  return useQuery({
    queryKey: [SETTING_QUERY_KEY.ACCOUNT_INFO],
    queryFn: settingService.getAccountInfo,
  });
}

/**
 * 재인증 성공 시 서버가 갱신된 회원정보를 그대로 돌려주므로, 다시 조회하지 않고 캐시에 꽂는다.
 * 이름·생년월일이 바뀌는 화면이라 한 박자 늦게 반영되면 방금 한 인증이 안 먹은 것처럼 보인다.
 */
export function useReverifyIdentityMutation() {
  return useMutation({
    mutationFn: (agreeConsent: boolean) => settingService.reverifyIdentity(agreeConsent),
    onSuccess: (data: AccountInfo) => {
      queryClient.setQueryData([SETTING_QUERY_KEY.ACCOUNT_INFO], data);
    },
  });
}
