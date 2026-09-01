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
 * C7 문의 탭의 **공개 목록** 항목.
 *
 * ⚠️ 서버 미제공 — `GET /v1/common/products/{productId}/inquiries`가 아직 없다.
 * 지금 있는 `/v1/user/product-inquiries`는 로그인한 사람의 **자기 문의**만 주므로 남의 문의가
 * 보이지 않고, 응답에 작성자 이름도 없어 `수민** · 2026.08.08` 표기를 만들 수 없다.
 * 그래서 `productInquiryService.getPublicList`가 실패하면 `mocks/productInquiryMock.ts`로
 * 떨어진다 — 상품 상세·재고가 쓰는 방식과 같다.
 *
 * 필드는 BE `ProductInquiryResponse`를 그대로 따르고 **`authorName` 하나만 더했다.**
 * 서버가 공개 목록을 열 때 이 필드만 채워 주면 목업을 지우는 것으로 교체가 끝난다.
 */
export interface PublicProductInquiry {
  id: number;
  /** 작성 화면에서 고른 유형 — 목록에서 첫 단서가 된다 */
  typeName: string;
  content: string;
  /** 지우지 않고 자물쇠 + 회색 대체 문구로 자리를 남긴다 — 숨기면 건수와 목록이 어긋난다 */
  secret: boolean;
  status: ProductInquiryStatus;
  answerContent: string | null;
  /** 마스킹은 서버가 하는 편이 안전하지만, 화면에서도 `maskAuthorName`으로 한 번 더 가린다 */
  authorName: string;
  createdAt: string;
  answeredAt: string | null;
}

export interface PublicProductInquiryList {
  /** 목록을 3건으로 잘라도 머리의 건수는 **전체 기준**이다 */
  totalCount: number;
  items: Array<PublicProductInquiry>;
}
