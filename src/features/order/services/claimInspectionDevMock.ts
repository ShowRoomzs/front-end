import { ClaimDetailResponse, ClaimInspection } from "@/features/order/types/claim";

/**
 * 검수 판정(C10-5 사유 번복 · 귀책 변경 · 교환 번복 결제) — **DEV 빌드 전용 목업**.
 *
 * `inspection`은 back-end main(2026-10-24)에 있지만 개발 서버에 아직 배포되지 않았고, 배포돼도 착불로 보낸 클레임을
 * 브랜드가 번복해야 생기는 상태라 만들기 어렵다. 그래서 실제 클레임 상세 위에 판정을 덧씌워 화면을 확인한다.
 *
 * 금액은 시안 예시(기본 배송비 3,000원)다 — 반품 사유 번복 = 결제 금액 − 최초 배송비 − 착불 운임,
 * 귀책 변경 = 결제 금액 − 최초 배송비 + (최초 배송비 + 선불 운임), 넘는 몫은 계좌 송금.
 */
export type DevInspectionMock =
  | "OFF"
  | "RETURN_OVERTURNED"
  | "RETURN_FAULT_CHANGED"
  | "EXCHANGE_OVERTURNED"
  | "EXCHANGE_OVERTURNED_PAID";

export const DEV_INSPECTION_RETURN_OPTIONS: Array<{ value: DevInspectionMock; label: string }> = [
  { value: "OFF", label: "실제" },
  { value: "RETURN_OVERTURNED", label: "사유 번복" },
  { value: "RETURN_FAULT_CHANGED", label: "귀책 변경" },
];

export const DEV_INSPECTION_EXCHANGE_OPTIONS: Array<{ value: DevInspectionMock; label: string }> = [
  { value: "OFF", label: "실제" },
  { value: "EXCHANGE_OVERTURNED", label: "사유 번복" },
];

const FEE = 3000;
const DAY_MS = 24 * 60 * 60 * 1000;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

function kstDate(offsetDays: number) {
  return new Date(Date.now() + KST_OFFSET_MS + offsetDays * DAY_MS).toISOString().slice(0, 10);
}

const BASE: Omit<ClaimInspection, "state"> = {
  result: "REASON_OVERTURNED",
  resultLabel: "사유 번복",
  headline: "",
  explanation: null,
  attachments: [],
  freight: { collectFreight: 0, prepaidFreightRefund: 0, initialFeeRestored: 0 },
  payment: null,
  refundSplit: null,
};

export function applyDevInspectionMock(
  detail: ClaimDetailResponse,
  mock: DevInspectionMock
): ClaimDetailResponse {
  if (!__DEV__ || mock === "OFF") {
    return detail;
  }
  const approved = detail.refund?.approvedAmount ?? detail.items.reduce((sum, item) => sum + item.amount, 0);
  const done = (statusSub: string, tone: "ACTIVE" | "MUTED") =>
    detail.items.map(item => ({
      ...item,
      phase: "DONE" as const,
      statusLabel: "반품 완료",
      statusSub,
      statusSubTone: tone,
      actions: [],
      rejection: null,
    }));

  if (mock === "RETURN_OVERTURNED") {
    return {
      ...detail,
      guide: { ...detail.guide, visible: false },
      items: done("사유 변경 · 착불 운임 차감", "ACTIVE"),
      reshipFee: null,
      refund: {
        rejectedAmount: null,
        returnDeduction: FEE,
        approvedAmount: approved,
        reshipDeduction: 0,
        amount: Math.max(0, approved - FEE * 2),
        confirmed: true,
        refundMethodLabel: detail.refund?.refundMethodLabel ?? "신한카드 결제 취소",
      },
      inspection: {
        ...BASE,
        state: "REASON_OVERTURNED",
        headline: "반품 사유가 변경되었어요 · 착불 운임과 최초 배송비가 차감돼요",
        explanation: "상품에서 하자가 확인되지 않았고, 주문하신 옵션과 같은 상품이 발송되었어요.",
        freight: { collectFreight: FEE, prepaidFreightRefund: 0, initialFeeRestored: 0 },
      },
    };
  }
  if (mock === "RETURN_FAULT_CHANGED") {
    return {
      ...detail,
      guide: { ...detail.guide, visible: false },
      items: done("귀책 변경 · 운임 환급", "MUTED"),
      reshipFee: null,
      refund: {
        rejectedAmount: null,
        returnDeduction: FEE,
        approvedAmount: approved,
        reshipDeduction: 0,
        amount: approved - FEE + FEE * 2,
        confirmed: true,
        refundMethodLabel: detail.refund?.refundMethodLabel ?? "신한카드 결제 취소",
      },
      inspection: {
        ...BASE,
        result: "PASSED",
        resultLabel: "검수 통과",
        state: "FAULT_CHANGED",
        headline: "검수 결과 상품 불량으로 확인되었어요",
        freight: { collectFreight: 0, prepaidFreightRefund: FEE, initialFeeRestored: FEE },
        refundSplit: {
          pgCancel: FEE,
          bankTransfer: FEE,
          bankTransferStatus: "송금 대기",
          bankTransferRefundTaskId: null,
          inquiryNeeded: true,
        },
      },
    };
  }
  const isPaid = mock === "EXCHANGE_OVERTURNED_PAID";

  return {
    ...detail,
    guide: { ...detail.guide, visible: false },
    items: detail.items.map(item => ({
      ...item,
      statusLabel: isPaid ? "재발송 준비" : "교환 보류",
      statusSub: isPaid ? "새 상품을 보내드려요" : "재발송비 결제 필요",
      statusSubTone: isPaid ? "MUTED" : "ACTIVE",
      actions: [],
      rejection: null,
    })),
    reshipFee: null,
    inspection: {
      ...BASE,
      state: "OVERTURN_PAYMENT_PENDING",
      headline: "교환 사유가 변경되었어요",
      explanation: "주문하신 옵션과 같은 상품이 발송되었고, 상품에서 하자가 확인되지 않았어요.",
      freight: { collectFreight: FEE, prepaidFreightRefund: 0, initialFeeRestored: 0 },
      payment: {
        reshipFee: FEE,
        collectFreight: FEE,
        total: FEE * 2,
        status: isPaid ? "PAID" : "PENDING",
        dueDate: isPaid ? null : kstDate(14),
        overdue: false,
      },
    },
  };
}
