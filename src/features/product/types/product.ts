import { Gender } from "@/common/types/gender";
import { PageResponse } from "@/common/types/page";

export interface ProductPrice {
  regularPrice: number;
  discountRate: number;
  salePrice: number;
  maxBenefitPrice: number;
}

export interface ProductStockStatus {
  isOutOfStock: boolean;
  isOutOfStockForced: boolean;
}

/** 상품정보제공고시 — 카테고리마다 항목이 달라 서버가 JSON 객체로 내려준다 */
export type ProductNotice = Record<string, string>;

export type DeliveryType = string;

/** 목록 항목 (`GET /v1/common/products`) */
export interface Product {
  id: number;
  productNumber: string;
  name: string;
  sellerProductCode: string;
  representativeImageUrl: string;
  thumbnailUrl: string;
  categoryId: number;
  categoryName: string;
  marketId: number;
  marketName: string;
  price: ProductPrice;
  discountRate: number;
  gender: Gender;
  isDisplay: boolean;
  isRecommended: boolean;
  productNotice: string | ProductNotice;
  description: string;
  createdAt: string;
  status: ProductStockStatus;
  likeCount: number;
  wishCount: number;
  reviewCount: number;
  isWished: boolean;
}

/**
 * 배송 · 교환 · 반품 정보.
 *
 * 서버가 한 덩어리로 내려준다 — 배송비와 반품비는 같은 표에서 함께 읽히는 값이라
 * 화면마다 따로 조립하면 어느 하나가 빠진 채로 표시되기 쉽다.
 */
export interface DeliveryInfo {
  /** 발송까지 걸리는 영업일 수 — "N일 이내 출발 예정" */
  shippingLeadDays: number;
  deliveryFee: number;
  /** null이면 무료배송 기준이 없다 */
  freeShippingThreshold: number | null;
  remoteAreaSurcharge: number;
  returnFee: number;
  exchangeFee: number;
}

/** 판매자 정보 (전자상거래법 표시 항목) */
export interface SellerInfo {
  companyName: string;
  representativeName: string;
  businessRegistrationNumber: string;
  mailOrderRegNumber: string;
  businessAddress: string;
  csNumber: string;
  email: string;
}

export interface OptionInfo {
  optionId: number;
  name: string;
  /** 추가 가격 */
  price: number;
}

export interface OptionGroup {
  optionGroupId: number;
  name: string;
  options: Array<OptionInfo>;
}

export interface Variant {
  variantId: number;
  name: string;
  regularPrice: number;
  salePrice: number;
  stock: number;
  /** 재고 0이거나 강제 품절. 옵션 시트에서 취소선·회색으로 남기고 지우지 않는다 */
  isOutOfStock: boolean;
  isRepresentative: boolean;
  optionIds: Array<number>;
}

export interface LocalVariant extends Variant {
  count: number;
}

/** 공구 상태 — 공구에 연결된 상품만 조회되므로 NOT_CONNECTED는 내려오지 않는다 */
export type GroupBuyStatus = "PREPARING" | "READY" | "IN_PROGRESS";

/**
 * C7 상품 상세 (`GET /v1/common/products/{productId}`).
 *
 * 목록 항목과 필드가 겹치지만 같은 타입이 아니다 — 상세는 화면에 그려지는 값만 담는다.
 * 찜(♥)이 없는 것도 그래서다: 찜은 게시물 단위라 상품 상세에 두지 않는다.
 * 문의는 별도 API(`/v1/common/products/{productId}/inquiries`)가 담당한다.
 */
export interface ProductDetail {
  id: number;
  name: string;
  /** 갤러리 대표 이미지(첫 장) */
  representativeImageUrl: string;
  /** 갤러리 나머지 이미지 (2번째 장부터) */
  coverImageUrls: Array<string>;
  /** 브랜드(마켓) ID — 소비자 화면에서 마켓은 조회되지 않으므로 이동 대상이 아니다 */
  marketId: number;
  marketName: string;
  /** 브랜드 사이트 링크 — 없으면 [브랜드 사이트] 버튼을 숨긴다 */
  brandSiteUrl: string | null;
  /** 취소선으로 표시 */
  regularPrice: number;
  /** 서버가 계산해 내려준다. 할인이 없으면 0 */
  discountRate: number;
  salePrice: number;
  groupBuyStatus: GroupBuyStatus;
  /** 하단 CTA를 [구매하기]와 판매 종료 상태로 가르는 값 */
  status: ProductStockStatus;
  delivery: DeliveryInfo;
  /** 상세정보 탭 본문 HTML */
  description: string;
  productNotice: ProductNotice | null;
  optionGroups: Array<OptionGroup>;
  variants: Array<Variant>;
  sellerInfo: SellerInfo;
}

export interface Stock {
  productId: number;
  variantId: number;
  stock: number;
  isOutOfStock: boolean;
  isOutOfStockForced: boolean;
  price: ProductPrice;
}

export type StockResponse = { variants: Array<Stock> };
export type ProductDetailResponse = ProductDetail;
export type ProductListResponse = PageResponse<Product>;
