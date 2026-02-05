import { PageResponse } from "@/common/types/page";

export interface RecentSearchItemResponse {
  id: number;
  term: string;
  createdAt: string;
}
export type RecentSearchResponse = PageResponse<RecentSearchItemResponse>;

export interface RecentSearchItem extends Omit<RecentSearchItemResponse, "id"> {
  id: string | number;
}

interface RecentSearchSyncItem {
  keyword: string;
  createdAt: string;
}

export type RecentSearchSyncRequest = Array<RecentSearchSyncItem>;
