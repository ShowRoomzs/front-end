import { PageResponse } from "@/common/types/page";

export interface RecentSearch {
  id: number;
  term: string;
  createdAt: string;
}
export type RecentSearchResponse = PageResponse<RecentSearch>;
