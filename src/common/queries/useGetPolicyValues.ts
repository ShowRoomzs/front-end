import { useQuery } from "@tanstack/react-query";

import { POLICY_QUERY_KEY } from "@/common/constants/queryKey";
import { policyService } from "@/common/services/policyService";

/** 서버 설정값이라 앱을 켜 둔 동안 바뀌지 않는다 — 한 번 받아 두고, 못 받으면 화면이 숫자 없는 문구로 둔다 */
export function useGetPolicyValues() {
  return useQuery({
    queryKey: [POLICY_QUERY_KEY.VALUES],
    queryFn: policyService.getValues,
    staleTime: Infinity,
    retry: false,
  });
}
