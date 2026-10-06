import { PaymentMethod, PaymentMethods, PaymentSelection, PaymentStatus, PaymentWindow } from "./payment";

import { ProductPrice } from "@/features/product/types/product";

/**
 * 주문 — back-end `OrderDto` · `UserOrderDto` · `PaymentDto`.
 *
 * 시각은 전부 `yyyy-MM-dd'T'HH:mm:ss` **KST · 오프셋 없음**이다. UTC로 읽으면 9시간 어긋나므로
 * 문자열을 직접 쪼개 쓴다(`utils/orderDate.ts`). 날짜만 있는 필드는 `yyyy-MM-dd`.
 *
 * 라벨·색·보조 문구·버튼은 서버가 내린다 — 앱이 상태→버튼 매핑을 들지 않는다.
 */

// ─────────────────────────────────────────────── C9 주문서 · 주문 생성

export interface DirectItem {
  variantId: number;
  quantity: number;
  /** 바로 구매는 공구가 필수다 — 상품 상세 응답의 값 */
  groupBuyId: number;
}

/** `cartItemIds`와 `direct` 중 **하나만** 채운다 */
export interface CheckoutRequest {
  cartItemIds?: Array<number>;
  direct?: DirectItem;
  /** 생략하면 기본 배송지 */
  deliveryAddressId?: number;
}

export interface OrderAddressInfo {
  /** 주문 상세의 스냅샷이면 null */
  id: number | null;
  recipientName: string;
  phoneNumber: string;
  zipCode: string;
  address: string;
  detailAddress: string;
  /** 저장된 배송 메모 — 요청사항의 초기값 */
  memo: string | null;
  isDefault: boolean | null;
}

export interface OrderItem {
  /** 장바구니 진입이면 장바구니 항목 ID, 바로 구매·주문 상세면 null */
  cartId: number | null;
  orderProductId: number | null;
  variantId: number;
  productId: number;
  productName: string;
  optionName: string;
  thumbnailUrl: string;
  quantity: number;
  price: Pick<ProductPrice, "regularPrice" | "salePrice" | "discountRate">;
  status: string | null;
}

export interface OrderShipping {
  productTotal: number;
  /** 실제 부과액 — 무료면 0 */
  deliveryFee: number;
  freeShippingThreshold: number | null;
  isFreeShipping: boolean;
}

/** 공구(쇼룸) 단위 묶음 — 배송비는 그룹마다 매긴다 */
export interface OrderGroup {
  marketId: number;
  marketName: string;
  groupBuyId: number;
  groupBuyNumber: string | null;
  items: Array<OrderItem>;
  shipping: OrderShipping;
}

/** C9 「결제 금액」 4줄 — `productTotal`은 **정가 합** */
export interface OrderSummary {
  productTotal: number;
  discountTotal: number;
  deliveryFeeTotal: number;
  totalAmount: number;
  itemCount: number;
  /** 할인율(%) — 주문 상세에만 */
  discountRate: number | null;
}

export interface CheckoutResponse {
  /** 없으면 null — 에러가 아니다. 「배송지 없음」을 그리고 CTA만 잠근다 */
  deliveryAddress: OrderAddressInfo | null;
  memoPresets: Array<string>;
  groups: Array<OrderGroup>;
  summary: OrderSummary;
  paymentMethods: PaymentMethods;
  ctaLabel: string;
}

export interface CreateOrderRequest {
  /** 「결제하기」를 누를 때마다 새로, 같은 요청을 재전송할 때는 그대로 */
  idempotencyKey: string;
  cartItemIds?: Array<number>;
  direct?: DirectItem;
  deliveryAddressId?: number;
  deliveryMemo?: string;
  payment: PaymentSelection;
  expectedTotalAmount: number;
}

export type OrderStatus = "PAYMENT_PENDING" | "PAID" | "CANCELLED" | "EXPIRED";

export interface CreateOrderResponse {
  orderId: number;
  orderNumber: string;
  status: OrderStatus;
  /** 결제 대기 만료 — 5분 전부터 CTA를 잠근다 */
  expiresAt: string;
  payment: PaymentWindow;
}

export interface PaymentCompleteResponse {
  orderId: number;
  orderNumber: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  failReason: string | null;
}

// ─────────────────────────────────────────────── C10 · C10-1 항목 행

export type UserOrderItemStatus =
  | "CANCELLED"
  | "RETURNED"
  | "RETURN_IN_PROGRESS"
  | "EXCHANGE_IN_PROGRESS"
  | "CANCEL_REQUESTED"
  | "PAID"
  | "PREPARING"
  | "SHIPPING"
  | "RETURNING"
  | "DELIVERED"
  | "CONFIRMED"
  | "PAYMENT_PENDING";

/** 색은 2단뿐 — ACTIVE(로즈 · 지금 볼·할 것이 있다) / MUTED(#737373 · 개입 불가) */
export type UserOrderTone = "ACTIVE" | "MUTED";

export type UserOrderAction =
  | "CANCEL"
  | "CANCEL_REQUEST"
  | "TRACK_DELIVERY"
  | "RETURN_EXCHANGE"
  | "RETURN_REQUEST"
  | "EXCHANGE_REQUEST"
  | "CLAIM_DETAIL"
  | "CANCEL_DETAIL";

export interface OrderItemAction {
  type: UserOrderAction;
  label: string;
  /** false면 비활성 — label이 사유를 담는다(「교환 불가 (재고 없음)」) */
  enabled: boolean;
}

export type ClaimTypeCode = "RETURN" | "EXCHANGE";

export interface OrderItemClaim {
  claimId: number;
  type: ClaimTypeCode;
  claimStatus: string;
  quantity: number;
  exchangeOptionName: string | null;
}

export interface OrderItemCancelRejection {
  cancelRequestId: number;
  rejectedAt: string;
}

export interface OrderItemClaimRejection {
  claimId: number;
  type: ClaimTypeCode;
  rejectedAt: string;
}

export type OrderTodoType = "REGISTER_COLLECTION_INVOICE" | "PAY_RESHIP_FEE";

/** 고객이 해야 할 일 — 상태 아래 로즈 한 줄, 누르면 반품·교환 상세 */
export interface OrderItemTodo {
  type: OrderTodoType;
  /** 완성 문구 — 「회수 송장 등록 필요 · 10.11까지」 */
  label: string;
  dueDate: string | null;
  claimId: number;
}

export interface OrderItemDates {
  shipDueAt: string | null;
  shippedAt: string | null;
  arrivalDueDate: string | null;
  deliveredAt: string | null;
  confirmDueAt: string | null;
  confirmedAt: string | null;
  cancelledAt: string | null;
}

/** 주문 항목 행 — 목록·상세 공용(`UserOrderDto.ItemRow`) */
export interface OrderItemRow {
  orderProductId: number;
  productId: number;
  variantId: number;
  brandName: string | null;
  productName: string;
  optionName: string;
  quantity: number;
  /** 환불로 끝난 수량 — 0이면 그리지 않는다 */
  returnedQuantity: number;
  thumbnailUrl: string;
  status: UserOrderItemStatus;
  statusLabel: string;
  statusTone: UserOrderTone;
  statusSub: string | null;
  /** 취소·반품으로 끝났거나 반품·교환 진행 중 — 썸네일·이름·금액을 탈색한다 */
  dimmed: boolean;
  amount: number;
  /** 「24,900원」 · 취소면 「환불 18,900원」 */
  amountLabel: string;
  cancelRejection: OrderItemCancelRejection | null;
  cancelRequestId: number | null;
  claim: OrderItemClaim | null;
  claimRejection: OrderItemClaimRejection | null;
  todo: OrderItemTodo | null;
  dates: OrderItemDates;
  actions: Array<OrderItemAction>;
}

/** 주문 내역의 묶음 — 주문 1건 + 항목 행. 페이지 단위도 주문이다 */
export interface OrderCard {
  orderId: number;
  orderNumber: string;
  orderedAt: string;
  items: Array<OrderItemRow>;
}

/** 주문 내역 응답 — 서버 공통 `PageResponse`(앱 공통 타입과 pageInfo 키가 다르다) */
export interface OrderListResponse {
  content: Array<OrderCard>;
  pageInfo: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    limit: number;
    hasNext: boolean;
  };
}

/** C10-1은 원문 대신 이것을 그린다 — 김수* · 010-****-5678 · ****** */
export interface MaskedAddress {
  recipientName: string;
  phoneNumber: string;
  address: string;
  detailAddress: string | null;
  memo: string | null;
}

export type OrderNoticeType = "CONFIRM_DUE" | "CANCEL_BY_REQUEST";

/** 상단 안내 — 조건 판정은 서버, 문구는 앱 */
export interface OrderNotice {
  type: OrderNoticeType;
  tone: UserOrderTone;
  date: string | null;
}

export interface OrderPaymentInfo {
  paymentId: string;
  status: PaymentStatus;
  method: PaymentMethod;
  /** 「신한카드」·「카카오페이」 그대로 띄운다 */
  methodLabel: string;
  amount: number;
  paidAt: string | null;
}

export interface OrderDetailResponse {
  orderId: number;
  orderNumber: string;
  status: OrderStatus;
  orderedAt: string;
  paidAt: string | null;
  expiresAt: string;
  deliveryAddress: OrderAddressInfo;
  deliveryMemo: string | null;
  groups: Array<OrderGroup>;
  summary: OrderSummary;
  payment: OrderPaymentInfo | null;
  /** 지금 취소 버튼을 보여도 되는가 — 전액 취소만 된다 */
  cancellable: boolean;
  /** 결제완료이고 브랜드가 준비를 시작하기 전 — 거짓이면 「주문 시점 정보」로 고정 */
  addressChangeable: boolean;
  items: Array<OrderItemRow>;
  itemCount: number;
  maskedAddress: MaskedAddress;
  notices: Array<OrderNotice>;
}

export interface CancelOrderResponse {
  orderId: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus | null;
  /** 그대로 띄워도 되는 문구 */
  message: string;
}

// ─────────────────────────────────────────────── C10-2 배송 조회

export type TrackingState = "NOT_SHIPPED" | "IN_TRANSIT" | "DELIVERED";
export type TrackingContext = "ORDER" | "EXCHANGE_RESHIP" | "REJECT_RESHIP";

export interface TrackingHeadline {
  /** 도착 예정일(배송중) 또는 배송완료일 — `yyyy-MM-dd` */
  date: string | null;
  text: string;
  sub: string | null;
}

export interface TrackingCarrier {
  code: string;
  label: string;
  /** [택배사 전화하기] — 없으면 버튼을 그리지 않는다 */
  tel: string | null;
  /** [택배사에서 조회] */
  trackingUrl: string | null;
}

export interface TrackingScan {
  location: string;
  description: string;
  occurredAt: string;
}

export interface TrackingResponse {
  state: TrackingState;
  context: TrackingContext;
  contextLabel: string | null;
  contextNote: string | null;
  headline: TrackingHeadline;
  /** 3구간 바의 현재 칸 — -1은 전부 빈 칸 */
  stageIndex: number;
  orderedAt: string;
  orderId: number;
  item: {
    brandName: string | null;
    productName: string;
    optionName: string;
    quantity: number;
    amount: number;
    thumbnailUrl: string;
  };
  carrier: TrackingCarrier | null;
  trackingNumber: string | null;
  /** 최신순 전체 — 앱이 4건으로 접는다 */
  scans: Array<TrackingScan>;
  shipDueAt: string | null;
  groupBuyEndAt: string | null;
}
