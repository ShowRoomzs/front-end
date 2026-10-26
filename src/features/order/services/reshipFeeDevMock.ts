import { ClaimDetailResponse } from "@/features/order/types/claim";

/**
 * 검수 반려 재발송비 결제(C10-5 b''') — **DEV 빌드 전용 목업**.
 *
 * 서버는 전체 반려 + 재발송비가 있을 때만 결제 필요(`PAYABLE`)를 내리는데, 개발 서버에는 배송비 있는 공구가
 * 없어 이 상태를 만들 수 없다. 그래서 반려된 실제 클레임의 상세 응답 위에 결제 필요 · 기한 지남 · 결제 완료를
 * 덧씌워 화면을 확인한다. 결제창은 서버가 결제 건을 만들어야 열리므로(`POST /reship-fee/payments`) 목업에서는
 * 결제창 대신 결과(성공 · 실패 · 자동 취소)를 골라 화면의 후속 처리를 확인한다.
 *
 * 값은 시안 그대로다 — 재발송 배송비 3,000원 · 결제 기한 14일 · 미결제 보관 3개월.
 *
 * 「착불」 두 가지는 불량 · 오배송(착불)으로 보냈다가 반려된 경우다(1021 기-93) — 브랜드가 낸 착불 운임 3,000원을
 * 전체 반려는 재발송 배송비와 합쳐 결제하고(6,000원), 일부 반려는 환불액에서 함께 뺀다. 서버가 이 금액을 아직
 * 내리지 않아(`ClaimReshipFee.collectFreight`) 목업으로만 확인한다.
 */
export type DevReshipMock = "OFF" | "PAYABLE" | "OVERDUE" | "PAID" | "PAYABLE_COLLECT" | "DEDUCTED_COLLECT";

export const DEV_RESHIP_MOCK_OPTIONS: Array<{ mock: DevReshipMock; label: string }> = [
  { mock: "OFF", label: "실제" },
  { mock: "PAYABLE", label: "결제 필요" },
  { mock: "OVERDUE", label: "기한 지남" },
  { mock: "PAID", label: "결제 완료" },
  { mock: "PAYABLE_COLLECT", label: "전체 반려 · 착불" },
  { mock: "DEDUCTED_COLLECT", label: "일부 반려 · 착불" },
];

const AMOUNT = 3000;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/** 오늘(KST)에서 며칠 떨어진 날 — `yyyy-MM-dd` */
function kstDate(offsetDays: number) {
  return new Date(Date.now() + KST_OFFSET_MS + offsetDays * DAY_MS).toISOString().slice(0, 10);
}

function kstNow() {
  return new Date(Date.now() + KST_OFFSET_MS).toISOString().slice(0, 19);
}

/** 반려된 항목이 있는 상세에만 덧씌운다 — 반려가 없으면 「상품 다시 받기」 자체가 없는 화면이다 */
export function canApplyDevReshipMock(detail: ClaimDetailResponse | undefined) {
  return __DEV__ && !!detail && detail.items.some(item => !!item.rejection);
}

export function applyDevReshipMock(
  detail: ClaimDetailResponse,
  mock: DevReshipMock,
  paidMethodLabel: string | null
): ClaimDetailResponse {
  if (mock === "OFF" || !canApplyDevReshipMock(detail)) {
    return detail;
  }
  if (mock === "DEDUCTED_COLLECT") {
    return applyDeductedCollect(detail);
  }
  const isPaid = mock === "PAID";
  const isOverdue = mock === "OVERDUE";
  const isCollect = mock === "PAYABLE_COLLECT";

  return {
    ...detail,
    items: detail.items.map(item =>
      item.rejection
        ? {
            ...item,
            phase: isPaid ? "REJECTED_PREPARING" : "REJECTED_PAY",
            statusSub: isPaid ? "반려 상품 발송 준비 중" : "재발송 배송비 결제 필요",
            statusSubTone: isPaid ? "MUTED" : "ACTIVE",
            // 결제 전후 모두 상품 아래 버튼은 이의 제기용 [1:1 문의하기] 하나다(시안)
            actions: [{ type: "INQUIRY", label: "1:1 문의하기" }],
          }
        : item
    ),
    // 결제 전 · 결제 직후(발송 준비)에는 아직 재발송 송장이 없다 — 덧씌운 원본 클레임의 송장은 지운다
    info: { ...detail.info, reshipInvoice: null },
    reshipFee: {
      state: isPaid ? "PAID" : "PAYABLE",
      amount: AMOUNT,
      dueDate: isPaid ? null : kstDate(isOverdue ? -1 : 14),
      overdue: isOverdue,
      settledAt: isPaid ? kstNow() : null,
      methodLabel: isPaid ? (paidMethodLabel ?? "신한카드") : null,
      storage: isOverdue ? { noticeCount: 2, storageDueAt: kstDate(90), phase: "STORING" } : null,
      ...(isCollect ? { collectFreight: AMOUNT } : {}),
    },
    // 반품 전체 반려는 환불액이 없다 — 착불 운임은 결제로 받는다
    ...(isCollect && detail.refund ? { refund: { ...detail.refund, amount: 0, reshipDeduction: 0 } } : {}),
  };
}

/**
 * 일부 반려 · 착불 — 승인된 상품의 환불액에서 재발송 배송비와 착불 운임을 함께 뺀다(시안 8,500원 예시와 같은 식).
 * 반려 항목이 하나뿐인 실제 클레임에도 보이도록, 반려가 없는 항목을 하나 「승인」으로 두고 금액을 맞춘다.
 */
function applyDeductedCollect(detail: ClaimDetailResponse): ClaimDetailResponse {
  const approvedAmount = detail.refund?.approvedAmount || detail.items[0]?.amount || 0;
  const rejectedAmount = detail.items
    .filter(item => item.rejection)
    .reduce((sum, item) => sum + item.amount, 0);

  return {
    ...detail,
    reshipFee: {
      state: "DEDUCTED",
      amount: AMOUNT,
      dueDate: null,
      overdue: false,
      settledAt: null,
      methodLabel: null,
      storage: null,
      collectFreight: AMOUNT,
    },
    refund: {
      rejectedAmount: rejectedAmount || null,
      returnDeduction: detail.refund?.returnDeduction ?? 0,
      approvedAmount,
      reshipDeduction: AMOUNT,
      amount: Math.max(0, approvedAmount - (detail.refund?.returnDeduction ?? 0) - AMOUNT * 2),
      confirmed: false,
      refundMethodLabel: detail.refund?.refundMethodLabel ?? "신한카드 결제 취소",
    },
  };
}
