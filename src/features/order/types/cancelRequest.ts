/**
 * 소비자 취소 요청 — 상품준비중(브랜드가 출고 준비를 시작한 뒤)의 취소는 즉시 취소가 아니라
 * **요청 → 브랜드 승인**으로 확정된다(시안 C10 1c · 1d).
 *
 * ⚠️ 앱용 API가 아직 없다(서버 「결제 연동 앱 전달사항」 10절 「아직 없는 것」). 아래 모양은 서버 도메인
 * (`order_cancel_request` · `CancelRequestReason` · `CancelRequestStatus`)과 시안에서 잡은 **잠정 계약**이고,
 * 데이터는 DEV에서만 `cancelRequestService`의 목업이 채운다. API가 생기면 그 서비스만 바꾼다.
 */

/** 서버 `CancelRequestReason` — 시안의 사유 4택과 같다 */
export type CancelRequestReason = "CHANGE_OF_MIND" | "ORDER_MISTAKE" | "PAYMENT_CHANGE" | "ETC";

export const CANCEL_REQUEST_REASONS: Array<{ code: CancelRequestReason; label: string; text: string }> = [
  { code: "CHANGE_OF_MIND", label: "단순 변심 (상품이 필요 없어졌어요)", text: "단순 변심" },
  { code: "ORDER_MISTAKE", label: "주문 실수 (상품·옵션·수량을 잘못 골랐어요)", text: "주문 실수" },
  { code: "PAYMENT_CHANGE", label: "다른 결제 수단으로 변경", text: "다른 결제 수단으로 변경" },
  { code: "ETC", label: "기타", text: "기타" },
];

/** 서버 `CancelRequestStatus`(VOIDED는 시스템 종료라 소비자 화면에 오지 않는다) */
export type CancelRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

/** 브랜드 어드민의 거부 사유 4종 — 문구 그대로 표시한다(시안 1d · 서버 C10 설계서 7-2 C4) */
export type CancelRejectReason = "ALREADY_PACKED" | "ALREADY_PICKED_UP" | "CUSTOM_MADE" | "ETC";

export const CANCEL_REJECT_REASON_LABEL: Record<CancelRejectReason, string> = {
  ALREADY_PACKED: "이미 포장·출고가 완료됨",
  ALREADY_PICKED_UP: "택배사 집화가 완료됨",
  CUSTOM_MADE: "주문 제작·맞춤 상품",
  ETC: "기타",
};

export interface CreateCancelRequest {
  orderId: number;
  items: Array<{ orderProductId: number; quantity: number }>;
  reason: CancelRequestReason;
  reasonDetail?: string;
}

export interface CancelRequestDetail {
  cancelRequestId: number;
  orderId: number;
  orderNumber: string;
  status: CancelRequestStatus;
  requestedAt: string;
  /** 승인·반려 일시 — 확인 중이면 null */
  decidedAt: string | null;
  reason: CancelRequestReason;
  reasonDetail: string | null;
  rejectReason: CancelRejectReason | null;
  /** 브랜드가 적은 상세 사유 — 기타는 필수, 나머지는 있을 때만 */
  rejectMessage: string | null;
  items: Array<{
    orderProductId: number;
    productId: number;
    brandName: string;
    productName: string;
    optionName: string;
    quantity: number;
    amount: number;
    thumbnailUrl: string;
  }>;
  paidAmount: number;
  refundAmount: number;
  refundMethodLabel: string;
}
