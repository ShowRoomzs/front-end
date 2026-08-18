import { ProductPrice } from "@/features/product/types/product";

export interface CreateCartItem {
  productId?: number;
  variantId: number;
  quantity: number;
}
export type CreateCartRequest = Array<CreateCartItem>;
export type UpdateCartRequest = Pick<CreateCartItem, "variantId" | "quantity">;

export interface CartStockInfo {
  stock: number;
  isOutOfStock: boolean;
  isOutOfStockForced: boolean;
}

/** 담은 뒤 마감·품절된 항목의 사유 — 복구 경로가 달라 둘을 구분한다 */
export type CartUnavailableReason = "GROUP_BUY_CLOSED" | "SOLD_OUT";

/**
 * 구매 가능 여부.
 *
 * 장바구니는 담은 시점과 결제 시점 사이의 시차가 가장 큰 화면이라, 여기서 걸러 주지 않으면
 * 결제 단계에서야 막혀 이탈이 크다. 라벨·문구는 서버가 완성해 내려준다 — 사유별 문구가
 * 운영 정책과 함께 움직이기 때문이다.
 */
export interface CartAvailability {
  isPurchasable: boolean;
  reason: CartUnavailableReason | null;
  /** 썸네일 위 라벨 */
  label: string | null;
  /** 수량·가격 자리를 대신하는 사유 문구 */
  message: string | null;
}

export interface CartItem {
  cartId: number;
  productId: number;
  variantId: number;
  productName: string;
  thumbnailUrl: string;
  marketId: number;
  marketName: string;
  optionName: string;
  quantity: number;
  price: ProductPrice;
  deliveryFee: number;
  stock: CartStockInfo;
  availability: CartAvailability;
  /** 이번 응답의 합계에 포함된 항목인지 — 구매 불가 항목은 요청에 담겨 있어도 항상 false */
  isSelected: boolean;
}

/**
 * 그룹(공구)별 배송비.
 *
 * 결제 화면에서 처음 알게 되는 배송비가 가장 흔한 이탈 원인이라 담는 단계에서 내려준다.
 * 무료 조건 미달이면 `amountToFreeShipping`으로 "○○원 더 담으면 무료"를 그린다.
 */
export interface CartGroupShipping {
  deliveryFee: number;
  freeShippingThreshold: number | null;
  /** false면 배송비 줄을 "—"로 그린다 */
  hasSelectedItems: boolean;
  selectedProductTotal: number;
  chargedDeliveryFee: number;
  isFreeShipping: boolean;
  /** 무료 기준이 없거나 이미 충족했거나 선택된 항목이 없으면 null */
  amountToFreeShipping: number | null;
}

/**
 * 공구(쇼룸) 단위 묶음.
 *
 * 상품이 아니라 공동구매별로 묶는다 — 배송비·마감일·발송 시점이 공구마다 다르기 때문이고,
 * 일반 쇼핑몰의 "판매자별 묶음"과 같은 역할이다.
 */
export interface CartGroup {
  marketId: number;
  marketName: string;
  marketImageUrl: string | null;
  /** true면 D-day 배지를 그리지 않는다 — 끝난 공구에 회색 라벨을 남기면 자리만 차지한다 */
  isClosed: boolean;
  items: Array<CartItem>;
  shipping: CartGroupShipping;
}

export interface CartSummary {
  regularTotal: number;
  saleTotal: number;
  discountTotal: number;
  deliveryFeeTotal: number;
  finalTotal: number;
}

/** 항목은 공구(쇼룸) 단위로 묶여 내려온다. 요약은 선택된 항목 기준이다 */
export interface CartResponse {
  groups: Array<CartGroup>;
  summary: CartSummary;
}

/** 팔로우한 쇼룸의 진행 중 공구 상품 — 목록 아래 가로 스크롤 */
export interface CartRecommendedProduct {
  productId: number;
  productName: string;
  thumbnailUrl: string;
  marketId: number;
  marketName: string;
  price: ProductPrice;
  /** 무료배송 조건을 채우는 데 도움이 되는 상품인지 */
  helpsFreeShipping: boolean;
}

export interface CartRecommendationResponse {
  products: Array<CartRecommendedProduct>;
}
