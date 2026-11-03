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

/**
 * C7 문의 탭의 **공개 목록** 항목 — BE `PublicProductInquiryResponse`(`GET /v1/common/products/{productId}/inquiries`).
 *
 * 비밀글은 작성자 본인에게만 `content` · `imageUrls` · `answer`가 실린다. 남의 비밀글이면 셋 다 비어 오고
 * 대체 문구는 화면이 채운다.
 */
export interface PublicProductInquiry {
  id: number;
  type: string;
  /** 작성 화면에서 고른 유형 — 목록에서 첫 단서가 된다 */
  typeName: string;
  status: ProductInquiryStatus;
  /** 지우지 않고 자물쇠 + 회색 대체 문구로 자리를 남긴다 — 숨기면 건수와 목록이 어긋난다 */
  secret: boolean;
  /** 로그인한 소비자 본인이 쓴 문의 */
  mine: boolean;
  /** 남의 비밀글이면 null */
  content: string | null;
  imageUrls: Array<string>;
  /** 서버가 앞 절반만 남기고 가려서 준다(수민초록 → 수민**) */
  authorName: string;
  createdAt: string;
  /** 답변 전이거나 남의 비밀글이면 null */
  answer: { content: string; answeredAt: string | null } | null;
}

export interface PublicProductInquiryList {
  /** 목록을 3건으로 잘라도 머리의 건수는 **전체 기준**이다 */
  totalCount: number;
  items: Array<PublicProductInquiry>;
}
