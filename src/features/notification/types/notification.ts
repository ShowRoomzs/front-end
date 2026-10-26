/**
 * C11 알림 — back-end `NotificationItem`(`GET /v1/user/notifications`, 2026-10-24 main · 개발 서버 미배포).
 *
 * 문장은 서버가 만들고(`title`), 앱은 굵게 둘 부분(`emphasis`)과 앞 이미지 종류만 가른다.
 * `createdAt` · `todoDueAt`은 이벤트 시각이라 `…Z`(UTC)로 온다 — dayjs가 기기 시간대로 옮겨 읽는다.
 */
export type NotificationImageKind = "THUMB" | "AVATAR" | "ICON";

export type NotificationTargetType =
  | "ORDER_GROUP"
  | "CLAIM"
  | "INQUIRY"
  | "POST"
  | "SHOWROOM"
  | "GROUP_BUY"
  | "PRODUCT"
  | "TERMS"
  | "SETTINGS"
  | "ACCOUNT_STATUS"
  | string;

export interface NotificationItem {
  notificationId: number;
  type: string;
  /** 소비자 아이콘 분기 — 주문 · 반품·교환 · 문의 · 쇼룸 · 혜택 · 계정 · 서비스 */
  category: string;
  actorType: string;
  actorLabel: string;
  title: string;
  /** 보조 줄 · 할 일 문구(「회수 송장 등록 필요」) */
  body: string | null;
  /** 굵게 둘 부분(상품명 · 쇼룸명 · 금액) — `title` 안의 부분 문자열 */
  emphasis: string | null;
  /** 누르면 갈 곳 — 없으면 이동하지 않는다. `sub`는 문의 종류(ONE_TO_ONE · PRODUCT) 등 */
  target: { type: NotificationTargetType | null; id: number | null; sub: string | null };
  imageKind: NotificationImageKind | null;
  imageUrl: string | null;
  /** AVATAR — 그 쇼룸에 진행 중인 공구가 있으면 로즈 링 */
  liveGroupBuy: boolean;
  /** 광고성 — 시간 앞 「광고」 */
  advertising: boolean;
  /** 할 일 기한 — 있으면 로즈 한 줄 */
  todoDueAt: string | null;
  read: boolean;
  createdAt: string;
}

/** 서버 공통 `PageResponse`(앱 공통 타입과 pageInfo 키가 다르다) */
export interface NotificationListResponse {
  content: Array<NotificationItem>;
  pageInfo: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    limit: number;
    hasNext: boolean;
  };
}
