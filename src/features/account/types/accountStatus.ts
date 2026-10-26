/**
 * C20 계정 이용 상태 — back-end `AccountStatusResponse`(`GET /v1/user/account-status`).
 *
 * 배너 · 비활성 버튼 · 안내 시트 · 소명 유형 · 배지 · 해제 토스트가 전부 이 응답 하나로 갈린다.
 * 「할 수 없는 것 / 할 수 있는 것」은 고정 문구라 앱이 든다(`constants/suspension.ts`).
 *
 * 시각은 두 종류다 — `suspendedAt` · `releasedAt`은 이벤트 시각(UTC, `…Z`)이라 KST로 옮겨 읽고,
 * `endsOn` · `autoReleaseAt` · `appealDeadlineAt`은 날짜 기준 값이라 앞 10자리를 그대로 쓴다.
 */
export type UserAccountStatus = "NORMAL" | "DORMANT" | "WITHDRAWN" | "SUSPENDED";

export interface SuspensionTerm {
  /** 정지 종료일(포함) — 기간 없는 정지면 null */
  endsOn: string | null;
  /** 자동 해제 시각 = 종료일 다음 날 00:00 */
  autoReleaseAt: string | null;
  /** 정지 기간(일) — 시작일 · 종료일 포함 */
  periodDays: number | null;
  /** 이의 신청 기한 — 통지 + N영업일 23:59:59(기한 뒤에도 접수한다) */
  appealDeadlineAt: string | null;
  /** 소명 검토 N영업일 — 미정이면 null */
  appealReviewBusinessDays: number | null;
}

export interface Suspension {
  /** 정형 사유 코드 — 사유 기록 없이 정지된 옛 회원은 null */
  reasonCode: string | null;
  /** 배너 · 시트에 그대로 쓰는 사유 — 옛 회원은 null(배너는 사유 없이 그린다) */
  reasonLabel: string | null;
  suspendedAt: string | null;
  /** true면 안내 시트를 자동으로 1회 띄우고 ack를 부른다 */
  noticePending: boolean;
  /** 답변 전 정지 문의 — 있으면 [이의 신청]이 새 작성 대신 이 문의 수정으로 간다 */
  pendingAppealInquiryId: number | null;
  term: SuspensionTerm | null;
}

export interface AccountStatusResponse {
  status: UserAccountStatus;
  /** SUSPENDED일 때만 */
  suspension: Suspension | null;
  /** 해제 토스트 1회 — 보여준 뒤 release-notice/ack */
  releaseNotice: { releasedAt: string } | null;
}
