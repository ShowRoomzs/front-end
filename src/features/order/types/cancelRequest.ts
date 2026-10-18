/**
 * 소비자 취소 요청 · 취소 상세 — back-end `UserCancelDto`(C10 1b~1d · 1009 기획 수정본 3-1).
 *
 * 상품준비중(브랜드가 출고 준비를 시작한 뒤)의 취소는 즉시 취소가 아니라 **요청 → 브랜드 승인**으로 확정된다.
 * 취소 상세는 **항목 기준**이다 — 그 항목이 어떤 경로로 취소됐는지(요청 · 직접 취소 · 직권 취소)에 따라
 * 같은 화면이 다른 값을 그린다. 문구(상태 라벨 · 안내 · 사유)는 서버가 내린다.
 */

/** 서버 `CancelRequestReason` — 시안의 사유 4택과 같다 */
export type CancelRequestReason = "CHANGE_OF_MIND" | "ORDER_MISTAKE" | "PAYMENT_CHANGE" | "ETC";

export const CANCEL_REQUEST_REASONS: Array<{ code: CancelRequestReason; label: string; text: string }> = [
  { code: "CHANGE_OF_MIND", label: "단순 변심 (상품이 필요 없어졌어요)", text: "단순 변심" },
  { code: "ORDER_MISTAKE", label: "주문 실수 (상품·옵션·수량을 잘못 골랐어요)", text: "주문 실수" },
  { code: "PAYMENT_CHANGE", label: "다른 결제 수단으로 변경", text: "다른 결제 수단으로 변경" },
  { code: "ETC", label: "기타", text: "기타" },
];

/** 상세 사유 — 기타면 필수 · 300자(서버 `OrderCancelRequestService`) */
export const CANCEL_REASON_DETAIL_MAX = 300;

/** `POST /user/orders/{orderId}/cancel-requests` — 한 하위주문의 결제된 항목 중 고른 것, **항목 전량**이다 */
export interface CreateCancelRequestBody {
  deliveryGroupId: number;
  orderProductIds: Array<number>;
  reasonCode: CancelRequestReason;
  reasonDetail?: string;
}

/** REQUEST 소비자 취소 요청 · CONSUMER_CANCEL 준비 전 직접 취소 · SELLER_CANCEL 브랜드 직권 취소 */
export type CancelKind = "REQUEST" | "CONSUMER_CANCEL" | "SELLER_CANCEL";

/** REVIEWING 브랜드 확인 중 · CANCELLED 취소 완료 · REJECTED 브랜드 거부(상품은 발송된다) */
export type CancelPhase = "REVIEWING" | "CANCELLED" | "REJECTED";

export interface CancelDetailItem {
  orderProductId: number;
  productName: string;
  optionName: string | null;
  thumbnailUrl: string;
  quantity: number;
  /** 단가 × 수량 */
  amount: number;
}

export interface CancelDetailRefund {
  /** 전 항목 취소면 배송비 포함 */
  amount: number;
  status: "PROCESSING" | "DONE";
  statusLabel: string;
  /** 「신한카드 결제 취소」 */
  methodLabel: string | null;
  refundedAt: string | null;
}

/** `GET /user/orders/{orderId}/items/{orderProductId}/cancel` */
export interface CancelDetail {
  orderId: number;
  orderNumber: string;
  /** 취소 요청이면 그 id — 직접 · 직권 취소는 null */
  cancelRequestId: number | null;
  kind: CancelKind;
  phase: CancelPhase;
  /** 「확인 중」 · 「취소 요청 거부」 · 「취소 완료」 */
  phaseLabel: string;
  /** 브랜드가 응답 기한 안에 확인하지 않아 자동으로 취소됐다 */
  autoApproved: boolean;
  /** [취소 요청 철회] 노출 — 브랜드 확인 중인 취소 요청만 */
  withdrawable: boolean;
  /** 안내 문구 — 없으면 빈 목록 */
  notices: Array<string>;
  /** 요청 시각 — 직접 · 직권 취소는 null(취소 시각은 `decidedAt`) */
  requestedAt: string | null;
  /** 브랜드 응답 기한 — 확인 중일 때만 */
  respondDueAt: string | null;
  /** 취소 · 거부 확정 시각 */
  decidedAt: string | null;
  reasonLabel: string;
  reasonDetail: string | null;
  /** 거부 사유 — 거부됐을 때만 */
  rejection: { reasonLabel: string; detail: string | null } | null;
  items: Array<CancelDetailItem>;
  /** 거부 · 확인 중이면 null */
  refund: CancelDetailRefund | null;
}

/** `POST /user/orders/{orderId}/cancel-requests/{cancelRequestId}/withdraw` — 요청 단위로 철회된다 */
export interface CancelWithdrawResponse {
  orderId: number;
  cancelRequestId: number;
  deliveryGroupId: number;
  orderProductIds: Array<number>;
  withdrawnAt: string;
}
