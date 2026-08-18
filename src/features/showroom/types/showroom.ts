/**
 * 쇼룸 타입 — back-end `showroomz.api.app.showroom.DTO`를 옮긴 것이다.
 *
 * 구 마켓/샵(`/v1/user/shops`)을 대체한다. 경로가 `/shops`에서 `/showrooms`로 바뀐 것은 이름만
 * 다듬은 것이 아니라 조회 대상이 마켓에서 쇼룸으로 바뀐 것이고, 그 결과 팔로우·방문·게시물 API와
 * 같은 ID 공간(쇼룸 ID)을 쓴다. 예전에는 샵 ID와 쇼룸 ID가 서로 다른 값이었다.
 */

export interface ShowroomListItem {
  showroomId: number;
  showroomName: string;
  /** 쇼룸 아이디(@handle) — 중복 불가 */
  showroomAddress: string;
  showroomImageUrl: string | null;
  introduction: string | null;
  /** 아바타 로즈 링 표시용 */
  hasOngoingGroupBuy: boolean;
  /** false일 때만 팔로우 버튼을 그린다. 비로그인은 항상 false */
  isFollowing: boolean;
}

export interface ShowroomDetail {
  showroomId: number;
  showroomName: string;
  showroomAddress: string;
  showroomImageUrl: string | null;
  /** 미등록이면 null — 앱이 "소개 미등록" 문구로 대체한다 */
  introduction: string | null;
  /** 없으면 채널 버튼을 그리지 않는다. 쇼룸이 공개하는 채널은 인스타그램 하나다 */
  instagramUrl: string | null;
  postCount: number;
  /** 이 쇼룸을 팔로우한 사용자 수 — 크리에이터가 신고한 SNS 팔로워 수와는 다른 값 */
  followerCount: number;
  /** false면 아바타 로즈 링과 진행 중 공구 섹션을 모두 감춘다 */
  hasOngoingGroupBuy: boolean;
  isFollowing: boolean;
}

export interface FollowingShowroom {
  showroomId: number;
  showroomName: string;
  showroomImageUrl: string | null;
  hasOngoingGroupBuy: boolean;
  followedAt: string;
}

/** C14 검색 결과 한 행 — 행 전체가 쇼룸으로 가는 단일 액션이라 팔로우 버튼을 두지 않는다 */
export interface ShowroomSearchItem {
  showroomId: number;
  showroomName: string;
  showroomAddress: string;
  showroomImageUrl: string | null;
  hasOngoingGroupBuy: boolean;
}

/** C2 팔로잉 화면의 정렬 바텀시트 */
export type FollowingShowroomSort = "DEFAULT" | "FOLLOW_LATEST" | "FOLLOW_OLDEST";

export const FOLLOWING_SHOWROOM_SORT_LABEL: Record<FollowingShowroomSort, string> = {
  DEFAULT: "기본",
  FOLLOW_LATEST: "팔로우한 날짜 : 최신순",
  FOLLOW_OLDEST: "팔로우한 날짜 : 오래된순",
};

export const FOLLOWING_SHOWROOM_SORT_DESCRIPTION: Record<FollowingShowroomSort, string> = {
  DEFAULT: "최근에 게시물을 올린 쇼룸부터",
  FOLLOW_LATEST: "최근에 팔로우한 쇼룸부터",
  FOLLOW_OLDEST: "먼저 팔로우한 쇼룸부터",
};
