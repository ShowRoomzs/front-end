import { isAxiosError } from "axios";

import { apiInstance } from "@/common/lib/apiInstance";
import { useAccountStatusDevStore } from "@/features/account/stores/useAccountStatusDevStore";
import { AccountStatusResponse } from "@/features/account/types/accountStatus";

const NORMAL: AccountStatusResponse = { status: "NORMAL", suspension: null, releaseNotice: null };

export const accountStatusService = {
  /**
   * C20 계정 이용 상태.
   *
   * - DEV 빌드에서 목업 스위치가 켜져 있으면 목업을 돌려준다(`useAccountStatusDevStore`).
   * - 서버에 아직 이 경로가 없으면(404 · 개발 서버 미배포 2026-10-24) 정상으로 본다 — 배너 · 비활성이
   *   하나도 그려지지 않으니 배포본에서는 정지 기능이 드러나지 않는다. 배포되는 순간 그대로 동작한다.
   */
  get: async (): Promise<AccountStatusResponse> => {
    const mock = useAccountStatusDevStore.getState().mock;

    if (__DEV__ && mock !== "OFF") {
      const { buildAccountStatusMock } = await import("@/features/account/mocks/accountStatusMock");

      return buildAccountStatusMock(mock);
    }
    try {
      const { data } = await apiInstance.get<AccountStatusResponse>("/user/account-status");

      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        return NORMAL;
      }
      throw error;
    }
  },
  /** 정지 안내 시트를 자동으로 1회 띄운 뒤 */
  ackSuspensionNotice: async () => {
    const { mock, setMock } = useAccountStatusDevStore.getState();

    if (__DEV__ && mock !== "OFF") {
      if (mock === "SUSPENDED_FIRST") {
        setMock("SUSPENDED");
      }
      return;
    }
    await apiInstance.post("/user/account-status/suspension-notice/ack");
  },
  /** 해제 토스트를 1회 보여준 뒤 */
  ackReleaseNotice: async () => {
    const { mock, setMock } = useAccountStatusDevStore.getState();

    if (__DEV__ && mock !== "OFF") {
      setMock("OFF");
      return;
    }
    await apiInstance.post("/user/account-status/release-notice/ack");
  },
};
