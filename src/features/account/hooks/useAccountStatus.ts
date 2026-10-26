import { useQuery } from "@tanstack/react-query";

import { queryClient } from "@/common/lib/queryClient";
import { useUserStore } from "@/common/stores/useUserStore";
import { ACCOUNT_STATUS_QUERY_KEY } from "@/features/account/constants/suspension";
import { accountStatusService } from "@/features/account/services/accountStatusService";
import { useAccountStatusDevStore } from "@/features/account/stores/useAccountStatusDevStore";

/**
 * C20 계정 이용 상태 — 로그인했을 때만 부른다.
 *
 * 다시 부르는 때(서버 문서): 앱 시작 · 포그라운드 복귀(`AccountStatusHost`) · 409 `USER_SUSPENDED`
 * (`apiInstance`). 그 사이에는 캐시를 쓴다 — 버튼마다 서버에 묻지 않는다.
 */
export function useAccountStatus() {
  const isLoggedIn = !!useUserStore(state => state.user);
  const devMock = useAccountStatusDevStore(state => state.mock);

  return useQuery({
    queryKey: [ACCOUNT_STATUS_QUERY_KEY, devMock],
    queryFn: accountStatusService.get,
    enabled: isLoggedIn,
    staleTime: Infinity,
  });
}

/** 정지 중이면 그 정보, 아니면 null — 배너 · 비활성 · 배지가 이것 하나로 갈린다 */
export function useSuspension() {
  const { data } = useAccountStatus();

  return data?.status === "SUSPENDED" ? (data.suspension ?? EMPTY_SUSPENSION) : null;
}

/** 사유 기록 없이 정지된 옛 회원 — 상태만 SUSPENDED이고 정보가 비어 온다 */
const EMPTY_SUSPENSION = {
  reasonCode: null,
  reasonLabel: null,
  suspendedAt: null,
  noticePending: false,
  pendingAppealInquiryId: null,
  term: null,
};

export function invalidateAccountStatus() {
  void queryClient.invalidateQueries({ queryKey: [ACCOUNT_STATUS_QUERY_KEY] });
}
