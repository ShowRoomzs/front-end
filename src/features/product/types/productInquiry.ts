import { SizeParams } from "@/common/types/page";

/**
 * 상품 문의 (C7-1 · C12) — back-end `showroomz.api.app.inquiry.dto`.
 *
 * 1:1 문의와 **답하는 주체와 공개 범위가 다르다** — 1:1은 운영팀이 비공개로 답하고,
 * 상품 문의는 판매자가 답하며 상품 상세에 공개된다. 그래서 타입도 따로 둔다.
 *
 * 유형은 1:1과 마찬가지로 **단일 레벨**이다 — 서버가 `key`·`description`만 내려준다.
 */
export type ProductInquiryStatus = "WAITING" | "ANSWERED";

/** @deprecated `ProductInquiryStatus`를 쓴다 — 이름만 남겨 둔 별칭 */
export type ProductInquiryHistoryStatus = ProductInquiryStatus;

export interface ProductInquiryCategory {
  key: string;
  description: string;
}

export type ProductInquiryCategoryResponse = Array<ProductInquiryCategory>;

export interface ProductInquiryRequest {
  type: string;
  /** 최대 250자 */
  content: string;
  /** 작성자와 브랜드만 볼 수 있다. 답변해도 공개로 바뀌지 않는다 */
  secret?: boolean;
  /** 최대 3장 */
  imageUrls?: Array<string>;
}

export interface ProductInquiry {
  id: number;
  productId: number;
  shopName: string;
  productName: string;
  productImageUrl: string;
  type: string;
  typeName: string;
  content: string;
  secret: boolean;
  imageUrls: Array<string>;
  status: ProductInquiryStatus;
  answerContent: string | null;
  createdAt: string;
  answeredAt: string | null;
}

/** 서버가 목록과 상세에 같은 응답을 쓴다 */
export type ProductInquiryHistory = ProductInquiry;
export type ProductInquiryDetail = ProductInquiry;

export type ProductInquiryHistoryParams = SizeParams & {
  /** 없으면 전체 — [답변 대기만] 필터는 서버가 건다 */
  status?: ProductInquiryStatus;
};
