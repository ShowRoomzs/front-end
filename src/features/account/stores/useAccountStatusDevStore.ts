import { createStore } from "@/common/stores/createStore";

/**
 * C20 계정 이용 정지 — **DEV 빌드 전용** 목업 스위치.
 *
 * 계정 상태 API는 back-end main(2026-10-24)에 있지만 개발 서버에 아직 배포되지 않았고, 배포돼도 정지 계정을
 * 만들려면 어드민에서 실제로 정지해야 한다. 그래서 DEV에서는 응답을 골라 덮어 화면을 확인한다.
 * 앱을 다시 켜도 고른 값이 남도록 저장한다(첫 로그인 직후 시트 1회를 다시 보려면 「정지 · 첫 진입」을 다시 고른다).
 */
export type DevAccountStatusMock = "OFF" | "SUSPENDED" | "SUSPENDED_FIRST" | "RELEASED";

export const DEV_ACCOUNT_STATUS_OPTIONS: Array<{ value: DevAccountStatusMock; label: string }> = [
  { value: "OFF", label: "실제" },
  { value: "SUSPENDED", label: "정지" },
  { value: "SUSPENDED_FIRST", label: "정지 · 첫 진입" },
  { value: "RELEASED", label: "해제 알림" },
];

interface AccountStatusDevStore {
  mock: DevAccountStatusMock;
  setMock: (mock: DevAccountStatusMock) => void;
}

export const useAccountStatusDevStore = createStore<AccountStatusDevStore>({
  creator: set => ({
    mock: "OFF",
    setMock: mock => set({ mock }),
  }),
  storageKey: "dev-account-status-mock",
});
