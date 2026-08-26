/**
 * 소비자 게시물 타입 — back-end `PostDto`(showroomz.api.app.post.DTO)를 그대로 옮긴 것이다.
 *
 * 서버가 `wishlistCount`/`isWishlisted`를 `likeCount`/`isLiked`로 통일했다(§24 용어 통일) —
 * 상품 위시리스트와 같은 말이라 게시물 지표에서 무엇의 수인지 흐려졌기 때문이다.
 * 경로만 옛 계약(`/posts/{postId}/wishlist`)으로 남아 있다.
 */

/**
 * 콘텐츠 타입 판별자.
 *
 * 서버는 아직 `GENERAL`만 내려준다 — 공구 게시물(`GROUP_BUY`)과 게시물에 붙는 상품 목록 필드가
 * `PostDto`에 없다. 화면은 목업으로 먼저 그려 두었고(`mocks/groupBuyMock.ts`), 실물 필드가
 * 생기면 그 파일만 지우면 된다.
 */
export type PostContentType = "GENERAL" | "GROUP_BUY";

/** 공구 진행 상태 — 마감되면 하트·상품이 모두 죽은 표기로 바뀐다 */
export type GroupBuyStatus = "OPEN" | "CLOSED";

/**
 * 게시물에 묶인 상품 한 건.
 *
 * 정가는 단위를 생략하고(38,000) 실제로 낼 금액에만 "원"을 붙인다 — 디자인 시스템 02.
 */
export interface PostProduct {
  productId: number;
  name: string;
  imageUrl: string | null;
  /** 정가 — 취소선 */
  listPrice: number;
  /** 공구가 */
  price: number;
  /** 할인율(%) — 가격과 같은 크기(700/15)로 로즈다 */
  discountRate: number;
  soldOut: boolean;
}

/**
 * 공구 게시물에만 붙는 묶음. 일반 게시물은 이 값이 null이다.
 *
 * D-day 배지는 **콘텐츠 카드에서만 로즈 채움**이다(디자인 시스템 §05 D-day 3형태).
 * 대가관계 표시(`isPaidAd`)는 규정상 항상 중립 배지이고 로즈를 쓰지 않는다.
 */
export interface GroupBuyInfo {
  /** 공구 게시물의 제목 — 일반 게시물에는 제목이 없다 */
  title: string;
  /** 마감까지 남은 일수 */
  dday: number;
  status: GroupBuyStatus;
  isPaidAd: boolean;
  products: Array<PostProduct>;
}

export interface PostListItem {
  postId: number;
  showroomId: number;
  showroomName: string;
  showroomImageUrl: string | null;
  /** false일 때만 카드 헤더에 팔로우 버튼을 그린다 */
  isFollowing: boolean;
  /**
   * 이 쇼룸이 진행 중인 공구를 갖고 있는지 — 아바타 로즈 링 표시용.
   * 게시물이 아니라 쇼룸의 상태다. C4 쇼룸 안에서는 모든 카드가 같은 쇼룸이라 링을 그리지 않는다.
   */
  hasOngoingGroupBuy: boolean;
  content: string | null;
  imageUrls: Array<string>;
  imageCount: number;
  /** 가로/세로 (1.91 ~ 0.80). 카드 높이를 이 값으로 잡는다 — 고정 높이로 구현하면 안 된다 */
  aspectRatio: number;
  impressionCount: number;
  isLiked: boolean;
  likeCount: number;
  /** true면 해제만 된다(마감된 공구). 품절은 제한하지 않는다 */
  likeLocked: boolean;
  publishedAt: string;
  /** 공구 게시물이 아니면 null */
  groupBuy: GroupBuyInfo | null;
}

export interface FeedItem {
  contentType: PostContentType;
  post: PostListItem;
}

export interface PostDetail {
  postId: number;
  showroomId: number;
  showroomName: string;
  showroomImageUrl: string | null;
  content: string | null;
  imageUrls: Array<string>;
  imageCount: number;
  aspectRatio: number;
  impressionCount: number;
  isLiked: boolean;
  likeCount: number;
  likeLocked: boolean;
  publishedAt: string;
  modifiedAt: string;
  /** 공구 게시물이 아니면 null */
  groupBuy: GroupBuyInfo | null;
}

/**
 * 신고 사유 — 서버가 목록을 내려준다. 사유는 운영정책과 함께 움직이는 값이라
 * 앱이 문구를 들고 있으면 규정이 바뀌어도 화면이 따라가지 못한다.
 */
export type PostReportReasonCode =
  | "AD_DISCLOSURE"
  | "MEDICAL_CLAIM"
  | "MISLEADING_AD"
  | "COPYRIGHT"
  | "SEXUAL_CONTENT"
  | "VIOLENCE_HATE"
  | "PERSONAL_INFO"
  | "OTHER";

export interface PostReportReasonItem {
  code: PostReportReasonCode;
  label: string;
  /** true면 상세 사유 입력란을 필수로 연다(기타) */
  detailRequired: boolean;
}

export interface PostReportRequest {
  reasonCode: PostReportReasonCode;
  reasonDetail?: string;
}

/** C3 좋아요 화면의 정렬 바텀시트 */
export type LikedPostSort = "DEFAULT" | "LIKED_OLDEST" | "MOST_LIKED" | "GROUP_BUY_FIRST";

export const LIKED_POST_SORT_LABEL: Record<LikedPostSort, string> = {
  DEFAULT: "기본",
  LIKED_OLDEST: "좋아요한 날짜 : 오래된순",
  MOST_LIKED: "좋아요 많은순",
  GROUP_BUY_FIRST: "공구 게시물 먼저",
};

/** 라벨만으로는 무엇이 기준인지 알 수 없다 — C2 팔로잉 시트와 같은 규격으로 설명을 함께 둔다 */
export const LIKED_POST_SORT_DESCRIPTION: Record<LikedPostSort, string> = {
  DEFAULT: "최근에 좋아요한 순서",
  LIKED_OLDEST: "가장 먼저 좋아요한 게시물부터",
  MOST_LIKED: "많은 사람이 좋아한 게시물부터",
  GROUP_BUY_FIRST: "진행 중 공구를 위로 모아서",
};
