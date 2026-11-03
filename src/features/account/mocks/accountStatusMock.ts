import { DevAccountStatusMock } from "@/features/account/stores/useAccountStatusDevStore";
import { AccountStatusResponse } from "@/features/account/types/accountStatus";

/**
 * ⚠️ DEV 전용 목업 — `accountStatusService.get`이 `__DEV__`일 때만 동적 `import()`로 부른다.
 *
 * 값은 시안(C20 1c)에 맞춘 예시다 — 사유 「욕설·비방」, 정지 7일, 이의 신청 기한 통지 + 3영업일.
 * 날짜는 오늘 기준으로 만든다(목업을 언제 열어도 「자동 해제」가 미래에 있게).
 */
const DAY_MS = 24 * 60 * 60 * 1000;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** 오늘(KST)에서 며칠 떨어진 날 — `yyyy-MM-dd` */
function kstDate(offsetDays: number) {
  return new Date(Date.now() + KST_OFFSET_MS + offsetDays * DAY_MS).toISOString().slice(0, 10);
}

/** 그 한국 날짜의 한국 시각 HH:mm:ss를 서버처럼 UTC 순간(`…Z`)으로 */
function kstAt(date: string, time: string) {
  return new Date(Date.parse(`${date}T${time}+09:00`)).toISOString().slice(0, 19) + "Z";
}

export function buildAccountStatusMock(mock: Exclude<DevAccountStatusMock, "OFF">): AccountStatusResponse {
  if (mock === "RELEASED") {
    return {
      status: "NORMAL",
      suspension: null,
      releaseNotice: { releasedAt: new Date().toISOString().slice(0, 19) + "Z" },
    };
  }
  const endsOn = kstDate(6);

  return {
    status: "SUSPENDED",
    suspension: {
      reasonCode: "ABUSIVE_LANGUAGE",
      reasonLabel: "욕설·비방",
      // 이벤트 시각은 서버가 UTC(…Z)로 내린다
      suspendedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString().slice(0, 19) + "Z",
      noticePending: mock === "SUSPENDED_FIRST",
      pendingAppealInquiryId: null,
      term: {
        endsOn,
        autoReleaseAt: kstAt(kstDate(7), "00:00:00"),
        periodDays: 7,
        appealDeadlineAt: kstAt(kstDate(3), "23:59:59"),
        appealReviewBusinessDays: null,
      },
    },
    releaseNotice: null,
  };
}
