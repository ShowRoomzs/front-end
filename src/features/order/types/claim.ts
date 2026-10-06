import { ClaimTypeCode, MaskedAddress, TrackingCarrier, TrackingHeadline, UserOrderTone } from "./order";
import { ClaimPaymentStatus, PaymentSelection, PaymentWindow } from "./payment";

/**
 * 반품·교환 — back-end `UserClaimDto`(C10-3 요청 · C10-4 회수 조회 · C10-5 상세).
 *
 * 사유 · 택배사 · 금액 · 라벨 · 버튼은 **서버가 내린다** — 앱에 목록을 박지 않는다. 기획의 사유가
 * 4종에서 5종으로 바뀌어도 앱 배포가 되지 않게 하려는 것이다.
 *
 * 화면의 단위는 **요청(한 박스)**이고 처리의 단위는 항목(클레임)이다. 경로 키는 `claimId`이고,
 * 서버가 그 클레임이 든 요청 전체를 돌려준다.
 */

export type ClaimType = ClaimTypeCode;

/** 고객 귀책이면 배송비가 생기고 반송은 선불, 브랜드 귀책이면 0원 · 착불 */
export type ClaimFeeBearer = "CONSUMER" | "SELLER";

export type ClaimReasonCode =
  | "CHANGE_OF_MIND"
  | "ORDER_MISTAKE"
  | "SIZE_MISMATCH"
  | "DAMAGED_OR_DEFECTIVE"
  | "WRONG_OR_LATE_DELIVERY";

/** 반송 택배비 — 앱이 다루는 돈이 아니라 안내 문구만 갈린다 */
export type CourierPayment = "PREPAID" | "COLLECT";

export type DeliveryCarrierCode =
  | "CJ"
  | "LOTTE"
  | "HANJIN"
  | "EPOST"
  | "KYUNGDONG"
  | "DAESIN"
  | "LOGEN"
  | "HAPDONG"
  | "COUPANG"
  | "WOORI"
  | "CU";

export type ClaimStatus =
  | "PAYMENT_PENDING"
  | "REQUESTED"
  | "COLLECTING"
  | "ARRIVED"
  | "RECEIVED"
  | "REFUND_PENDING"
  | "RESHIP_READY"
  | "RESHIPPING"
  | "REJECT_HOLD"
  | "COMPLETED";

// ─────────────────────────────────────────────── C10-3 폼

export interface ClaimExchangeOption {
  variantId: number;
  optionName: string;
  /** 목록에서 빼지 않고 회색 + 「품절」로 그린다 */
  soldOut: boolean;
  /** 받은 옵션 — 불량·오배송일 때만 같은 옵션으로 다시 받는다 */
  current: boolean;
}

export interface ClaimFormItem {
  orderProductId: number;
  productName: string;
  optionName: string;
  thumbnailUrl: string;
  /** 단가(공구가) */
  unitPrice: number;
  claimableQuantity: number;
  /** 진입한 항목 — 체크된 채로 그린다 */
  preselected: boolean;
  /** 교환 폼만 — 같은 상품 · 같은 가격 옵션(받은 옵션 포함) */
  exchangeOptions: Array<ClaimExchangeOption> | null;
}

export interface ClaimFormReason {
  code: ClaimReasonCode;
  label: string;
  /** 괄호 설명 — 「상품이 필요 없어짐」 */
  hint: string | null;
  feeBearer: ClaimFeeBearer;
  detailRequired: boolean;
  /** 사진은 브랜드 귀책 사유에서만 받는다 */
  photoAllowed: boolean;
}

export interface ClaimFormCarrier {
  code: DeliveryCarrierCode;
  label: string;
}

/** 브랜드 반품 수취 주소 — 송장에 적는 값이라 원문이다 */
export interface ClaimReturnTo {
  name: string;
  contact: string;
  address: string;
  detailAddress: string | null;
}

/** 교환받을 배송지 — 요청 화면은 지금 고르는 값이라 원문이다 */
export interface ClaimReshipTo {
  recipientName: string;
  phone: string;
  zipCode: string;
  address: string;
  detailAddress: string | null;
  memo: string | null;
}

export interface ClaimFormResponse {
  type: ClaimType;
  deliveryGroupId: number;
  brandName: string;
  items: Array<ClaimFormItem>;
  reasons: Array<ClaimFormReason>;
  carriers: Array<ClaimFormCarrier>;
  returnTo: ClaimReturnTo;
  reshipTo: ClaimReshipTo | null;
  fees: {
    /** 반품 = 환불액에서 빼는 최초 배송비(무료배송 주문만) · 교환 = 요청 때 결제하는 재발송비 */
    consumerFault: number;
    sellerFault: number;
  };
  courierPayment: {
    consumerFault: CourierPayment;
    sellerFault: CourierPayment;
  };
  /** 「신한카드 결제 취소」 */
  refundMethodLabel: string | null;
  invoiceDueDays: number;
  detailMaxLength: number;
  photoMax: number;
}

export interface ClaimInvoiceRequest {
  carrier: DeliveryCarrierCode;
  trackingNumber: string;
}

export interface CreateClaimRequest {
  idempotencyKey: string;
  type: ClaimType;
  deliveryGroupId: number;
  items: Array<{ orderProductId: number; quantity?: number; exchangeVariantId?: number }>;
  reasonCode: ClaimReasonCode;
  reasonDetail?: string;
  imageUrls?: Array<string>;
  /** null이 「나중에 입력하기」 */
  invoice: ClaimInvoiceRequest | null;
  expectedFee?: number;
  reshipAddressId?: number;
  /** 고객 귀책 교환에서만 */
  payment?: PaymentSelection;
}

export interface CreateClaimResponse {
  requestId: number;
  claimIds: Array<number>;
  /** PAYMENT_PENDING이면 결제가 확정돼야 접수된다 */
  status: ClaimStatus;
  payment: PaymentWindow | null;
}

export interface ClaimPaymentCompleteResponse {
  paymentStatus: ClaimPaymentStatus;
  requestId: number | null;
  /** 요청이 이미 지워졌으면 빈 배열(30분 경과) */
  claimIds: Array<number>;
  claimStatus: ClaimStatus | null;
}

export interface WithdrawClaimResponse {
  claimId: number;
  status: ClaimStatus;
  result: string;
}

// ─────────────────────────────────────────────── C10-5 상세

export type UserClaimPhase =
  | "PAYMENT_PENDING"
  | "REQUESTED"
  | "COLLECTING"
  | "INSPECTING"
  | "APPROVED"
  | "RESHIP_PREPARING"
  | "RESHIPPING"
  | "DONE"
  | "REJECTED_WAITING"
  | "REJECTED_PAY"
  | "REJECTED_PREPARING"
  | "REJECTED_RESHIPPING"
  | "REJECTED_DONE"
  | "REJECTED_DISPOSED"
  | "CANCELLED";

export type ClaimActionType =
  | "WITHDRAW"
  | "REGISTER_COLLECTION_INVOICE"
  | "TRACK_COLLECTION"
  | "TRACK_RESHIP"
  | "INQUIRY";

export interface ClaimAction {
  type: ClaimActionType;
  label: string;
}

export interface ClaimRejection {
  reasonLabel: string;
  /** 법적 근거 한 줄 — 법무 확정 대기(잠정) */
  legalNote: string | null;
  /** 브랜드가 적은 설명 — 그대로 전달한다 */
  sellerMessage: string | null;
  evidenceImageUrls: Array<string>;
  rejectedAt: string;
}

export interface ClaimDetailItem {
  claimId: number;
  focused: boolean;
  brandName: string;
  productName: string;
  optionName: string;
  exchangeOptionName: string | null;
  quantity: number;
  amount: number;
  thumbnailUrl: string;
  phase: UserClaimPhase;
  statusLabel: string;
  statusSub: string | null;
  /** ACTIVE면 로즈 — 고객이 해야 할 일이 있다 */
  statusSubTone: UserOrderTone;
  actions: Array<ClaimAction>;
  rejection: ClaimRejection | null;
}

export interface ClaimInvoice {
  carrier: DeliveryCarrierCode;
  carrierLabel: string;
  trackingNumber: string;
}

export interface ClaimInfo {
  reasonLabel: string;
  /** 「고객 직접 발송」 */
  methodLabel: string;
  collectionInvoice: ClaimInvoice | null;
  /** 미등록일 때만 — 「10.11(일)까지 등록해 주세요」 */
  invoiceDueDate: string | null;
  reshipInvoice: ClaimInvoice | null;
  pickupFrom: MaskedAddress | null;
  returnTo: ClaimReturnTo;
  reshipTo: MaskedAddress | null;
  reshipAddressChangeable: boolean;
}

export interface ClaimRefund {
  /** 반려 상품 금액 — 환불에서 빠진다(취소선) */
  rejectedAmount: number | null;
  returnDeduction: number;
  approvedAmount: number;
  reshipDeduction: number;
  amount: number;
  /** false면 「환불 예정 금액」, true면 「환불 금액」 */
  confirmed: boolean;
  refundMethodLabel: string | null;
}

export interface ClaimExchangePayment {
  reshipFee: number;
  paidAmount: number;
  /** 「신한카드」 · 결제가 없었으면 「결제 없음」 */
  methodLabel: string;
}

export type ReshipFeeState = "PAYABLE" | "WAITING" | "PAID" | "DEDUCTED" | "COVERED";

export interface ClaimReshipFee {
  state: ReshipFeeState;
  amount: number | null;
  /** PAYABLE의 결제 기한 */
  dueDate: string | null;
  settledAt: string | null;
  methodLabel: string | null;
  storage: {
    noticeCount: number;
    storageDueAt: string | null;
    phase: "NOTICE_PENDING" | "STORING" | "EXPIRED";
  } | null;
}

export interface ClaimDetailResponse {
  requestId: number;
  type: ClaimType;
  requestedAt: string;
  /** 없으면 「검수 후 표시돼요」 */
  completedAt: string | null;
  orderId: number;
  orderNumber: string;
  guide: { visible: boolean; courierPayment: CourierPayment };
  items: Array<ClaimDetailItem>;
  info: ClaimInfo;
  refund: ClaimRefund | null;
  exchangePayment: ClaimExchangePayment | null;
  reshipFee: ClaimReshipFee | null;
}

export interface ReshipFeePaymentRequest extends PaymentSelection {
  expectedAmount?: number;
}

// ─────────────────────────────────────────────── C10-4 회수 조회

export interface CollectionEvent {
  /** COURIER = 택배 스캔 · BRAND = 브랜드 처리(입고 · 검수) */
  source: "COURIER" | "BRAND";
  location: string | null;
  description: string;
  occurredAt: string;
}

export interface CollectionTrackingResponse {
  type: ClaimType;
  /** false면 「아직 조회되지 않아요」 */
  trackable: boolean;
  stageIndex: number;
  /** 칸 이름 5개 — 마지막은 「환불」 · 「새 상품」 */
  stages: Array<string>;
  headline: TrackingHeadline;
  requestedAt: string;
  claimId: number;
  item: {
    brandName: string;
    productName: string;
    /** 교환이면 「받은 옵션 → 바꿀 옵션」 */
    optionLabel: string;
    thumbnailUrl: string;
  };
  carrier: TrackingCarrier | null;
  trackingNumber: string | null;
  invoiceRegisteredAt: string | null;
  sender: string;
  receiver: string;
  events: Array<CollectionEvent>;
  /** [송장 수정] — 회수 중 · 택배 이력 없음 · 등록 기한 전 */
  invoiceEditable: boolean;
}
