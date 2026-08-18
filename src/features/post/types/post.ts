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
 * 현재 서버는 `GENERAL`만 내려준다 — 공구 게시물(`GROUP_BUY`)은 아직 만들어지지 않았고,
 * 게시물에 붙는 상품 목록 필드도 DTO에 없다. 값을 미리 두는 이유는 공구 게시물이 들어올 때
 * 응답 구조를 바꾸지 않고 확장하기 위해서다.
 */
export type PostContentType = "GENERAL" | "GROUP_BUY";

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
