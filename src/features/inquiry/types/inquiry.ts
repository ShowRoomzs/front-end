import { SizeParams } from "@/common/types/page";

/**
 * 1:1 문의 (C12) — back-end `showroomz.api.app.inquiry.dto`.
 *
 * 유형은 **5종 단일 레벨**이다(CsCategory). 소분류(detailType)는 폐기된 스펙으로,
 * 서버 응답에 없다 — 대분류를 고른 뒤 소분류를 또 고르게 하면 사용자가 같은 분류를
 * 두 번 배우게 되고, 유형별 집계도 잘게 쪼개져 쓸모가 없어진다.
 */
export type InquiryStatus = "WAITING" | "ANSWERED";

export interface InquiryCategory {
  key: string;
  description: string;
}

export type InquiryCategoryResponse = Array<InquiryCategory>;

/**
 * 문의에 연결된 주문 카드 — 주문을 연결하지 않은 문의는 `order`가 null이며 블록 자체를 그리지 않는다.
 *
 * ⚠️ 소비자 앱에 **주문 목록 조회 API가 아직 없어** 작성 화면에서는 주문을 고를 수 없다.
 * 목록·상세는 서버가 내려주는 값을 그리기만 하므로, 주문 API가 붙는 순간 그대로 살아난다.
 */
export interface InquiryOrderSummary {
  orderId: number;
  /** 주문일자 + 주문 ID 4자리 — "20260803-1147" */
  orderNumber: string;
  orderDate: string;
  productName: string | null;
  productImageUrl: string | null;
  /** 2 이상이면 화면에서 `외 N건`으로 표기한다 */
  productCount: number;
}

export interface InquiryRequest {
  type: string;
  /** 최대 1000자 */
  content: string;
  /** 최대 5장 */
  imageUrls?: Array<string>;
  orderId?: number;
}

export type InquiryHistoryParams = SizeParams & {
  /** 없으면 전체 — [답변 대기만] 필터는 서버가 건다 */
  status?: InquiryStatus;
};

export interface InquiryHistory {
  id: number;
  type: string;
  typeName: string;
  content: string;
  imageUrls: Array<string>;
  orderId: number | null;
  order: InquiryOrderSummary | null;
  status: InquiryStatus;
  answerContent: string | null;
  answeredAt: string | null;
  createdAt: string;
}

export interface InquiryDetail extends InquiryHistory {
  writerNickname: string;
  writerProfileImageUrl: string | null;
  /** 1:1 답변 주체는 마켓이 아니라 운영팀 고정 — 미답변이면 null */
  answererName: string | null;
}

/** 문의 내역 상단 탭 배지용 건수 — 탭을 눌러 보기 전에 어느 쪽에 내역이 있는지 보여야 한다 */
export interface InquirySummary {
  oneToOneTotal: number;
  oneToOneWaiting: number;
  productTotal: number;
  productWaiting: number;
}
