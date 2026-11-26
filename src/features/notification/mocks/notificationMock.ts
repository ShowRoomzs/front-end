import { NotificationItem, NotificationListResponse } from "@/features/notification/types/notification";

/**
 * ⚠️ DEV 전용 목업 — `NotificationView`가 `__DEV__`일 때만 동적 `import()`로 부른다.
 *
 * 알림 API가 개발 서버에 아직 없고(2026-10-24 BE main), 있어도 종류별 알림을 한 번에 만들기 어렵다.
 * 문장은 시안(C11 1a, 11-26 백엔드 알림 유형 대조판) 예시 그대로이고, 시각은 지금 기준으로 만들어
 * 오늘 · 최근 7일 · 이전에 고루 들어가게 한다.
 *
 * 「배송 추적 정지 · 선택 필요」(5)와 「회수 송장 미등록 자동 취소」(9)는 시안이 새로 넣은 알림인데 백엔드
 * `NotificationType`에 아직 없다(요청 필요) — 유형 이름은 목업에서만 쓰는 임시 값이다.
 */
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

function ago(ms: number) {
  return new Date(Date.now() - ms).toISOString().slice(0, 19) + "Z";
}

function item(
  id: number,
  fields: Partial<NotificationItem> & Pick<NotificationItem, "title" | "createdAt">
): NotificationItem {
  return {
    notificationId: id,
    type: "ORDER_SHIPPED",
    category: "주문",
    actorType: "SYSTEM",
    actorLabel: "SHOWROOMZ",
    body: null,
    emphasis: null,
    target: { type: null, id: null, sub: null },
    imageKind: "THUMB",
    imageUrl: null,
    liveGroupBuy: false,
    advertising: false,
    todoDueAt: null,
    read: true,
    ...fields,
  };
}

export function buildNotificationMock(): NotificationListResponse {
  const content = [
    // ── 오늘
    item(1, {
      type: "FOLLOW_GROUP_BUY_OPENED",
      category: "쇼룸",
      title: "제니의 뷰티룸에 새 공구가 열렸어요 · 시카 리페어 앰플 외 2개",
      emphasis: "제니의 뷰티룸",
      imageKind: "AVATAR",
      liveGroupBuy: true,
      advertising: true,
      read: false,
      createdAt: ago(10 * 60 * 1000),
    }),
    item(2, {
      title: "주문하신 시카 리페어 앰플 30ml이 발송되었어요",
      emphasis: "시카 리페어 앰플 30ml",
      read: false,
      createdAt: ago(HOUR_MS),
    }),
    item(3, {
      type: "CLAIM_COLLECT_INVOICE_NEEDED",
      category: "반품·교환",
      title: "반품할 수분 진정 마스크 10매의 회수 송장을 등록해 주세요",
      emphasis: "수분 진정 마스크 10매",
      body: "회수 송장 등록 필요",
      todoDueAt: ago(-4 * DAY_MS),
      read: false,
      createdAt: ago(3 * HOUR_MS),
    }),
    // 백엔드 없음 — 지금 TRACKING_STALLED는 브랜드에게만 간다. 할 일(로즈) 줄은 기한(todoDueAt)이 있어야 그린다
    item(5, {
      type: "MOCK_ORDER_STALL_CHOICE_NEEDED",
      title: "배리어 크림 50ml 배송 추적이 멈췄어요 · 재발송 또는 환불을 선택해 주세요",
      emphasis: "배리어 크림 50ml",
      body: "처리 방법 선택 필요",
      todoDueAt: ago(-7 * DAY_MS),
      read: false,
      createdAt: ago(5 * HOUR_MS),
    }),
    // ── 최근 7일
    item(6, {
      type: "ORDER_DELIVERED",
      title: "진정 토너 패드 60매 배송이 완료되었어요",
      emphasis: "진정 토너 패드 60매",
      createdAt: ago(DAY_MS),
    }),
    item(7, {
      type: "INQUIRY_ANSWERED",
      category: "문의",
      title: "문의하신 내용에 답변이 등록됐어요",
      emphasis: "답변",
      imageKind: "ICON",
      createdAt: ago(2 * DAY_MS),
    }),
    // 백엔드 없음 — ClaimInvoiceExpiryScheduler가 요청을 닫지만 소비자 알림은 만들지 않는다
    item(9, {
      type: "MOCK_CLAIM_INVOICE_EXPIRED",
      category: "반품·교환",
      title: "회수 송장이 등록되지 않아 수분 진정 마스크 10매 반품 요청이 취소되었어요",
      emphasis: "수분 진정 마스크 10매",
      createdAt: ago(2 * DAY_MS + HOUR_MS),
    }),
    item(10, {
      type: "INQUIRY_IN_PROGRESS",
      category: "문의",
      title: "문의하신 내용을 확인 중이에요 · 답변까지 조금 더 걸려요",
      emphasis: "확인 중",
      imageKind: "ICON",
      createdAt: ago(3 * DAY_MS),
    }),
    item(11, {
      type: "GROUP_BUY_ENDING_D1",
      category: "쇼룸",
      title: "장바구니에 담은 진정 토너 패드 60매 공구가 내일 마감돼요",
      emphasis: "진정 토너 패드 60매",
      advertising: true,
      createdAt: ago(3 * DAY_MS + HOUR_MS),
    }),
    item(12, {
      type: "REFUND_COMPLETED",
      title: "반품 검수가 끝나 11,000원 환불이 진행돼요",
      emphasis: "11,000원",
      createdAt: ago(5 * DAY_MS),
    }),
    item(13, {
      type: "CANCEL_REQUEST_REJECTED",
      title: "취소 요청이 반려되었어요 · 주문은 그대로 배송돼요",
      emphasis: "반려",
      createdAt: ago(6 * DAY_MS),
    }),
    item(14, {
      type: "CLAIM_REFUND_TRANSFERRED",
      category: "반품·교환",
      title: "운임 환급 3,000원을 계좌로 송금했어요",
      emphasis: "3,000원",
      createdAt: ago(6 * DAY_MS + HOUR_MS),
    }),
    // ── 이전
    item(15, {
      type: "FOLLOW_POST_PUBLISHED",
      category: "쇼룸",
      title: "미아 스킨노트에 새 게시물 3개가 올라왔어요",
      emphasis: "미아 스킨노트",
      imageKind: "AVATAR",
      advertising: true,
      createdAt: ago(20 * DAY_MS),
    }),
    item(16, {
      type: "ORDER_CONFIRM_D1",
      title: "내일 자동으로 구매확정돼요 · 반품 · 교환은 오늘까지 신청할 수 있어요",
      emphasis: "내일 자동으로 구매확정",
      createdAt: ago(23 * DAY_MS),
    }),
    item(17, {
      type: "USER_ACCOUNT_RELEASED",
      category: "계정",
      title: "계정 이용 정지가 해제되었어요 · 지금부터 모든 기능을 다시 이용할 수 있어요",
      emphasis: "계정 이용 정지",
      imageKind: "ICON",
      createdAt: ago(24 * DAY_MS),
    }),
    item(18, {
      type: "TERMS_CHANGED",
      category: "서비스",
      title: "개인정보 처리방침이 11.01부터 바뀌어요",
      emphasis: "개인정보 처리방침",
      imageKind: "ICON",
      createdAt: ago(26 * DAY_MS),
    }),
  ];

  return {
    content,
    pageInfo: { currentPage: 1, totalPages: 1, totalResults: content.length, limit: 20, hasNext: false },
  };
}
