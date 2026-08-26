import { PageResponse } from "@/common/types/page";
import { ShowroomSearchItem } from "@/features/showroom/types/showroom";

/**
 * 최근 검색 (C14) — back-end `RecentSearchResponse`.
 *
 * 쇼룸과 검색어가 **한 목록에 시간순으로 섞인다.** 행 종류는 `type`으로 갈리고, 쇼룸 행은
 * 아바타 44 + 이름 + @handle로, 검색어 행은 Fill 원 44 + 돋보기 + 단어 한 줄로 그린다.
 * 탭했을 때 가는 곳도 다르다 — 쇼룸은 C4 쇼룸, 검색어는 그 단어로 재검색.
 */
export type RecentSearchType = "TERM" | "SHOWROOM";

export interface RecentSearchItemResponse {
  id: number;
  type: RecentSearchType;
  /** SHOWROOM 행에서는 저장 시점의 쇼룸명 스냅샷이다 — 표시는 `showroom`을 쓴다 */
  term: string;
  /** SHOWROOM 행에만 채워진다 */
  showroom: ShowroomSearchItem | null;
  createdAt: string;
}

export type RecentSearchResponse = PageResponse<RecentSearchItemResponse>;

/** 비로그인 기록은 기기에만 남아 id가 문자열(UUID)이고, 쇼룸 행을 만들 수 없어 항상 TERM이다 */
export interface RecentSearchItem extends Omit<RecentSearchItemResponse, "id"> {
  id: string | number;
}

export interface RecentSearchSyncItem {
  keyword: string;
  createdAt: string;
}

export interface RecentSearchSyncRequest {
  keywords: Array<RecentSearchSyncItem>;
}
