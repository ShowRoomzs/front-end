import { PageParams } from "@/common/types/page";

export interface FilterParam {
  key: string;
  values: Array<string>;
}

export interface ProductListParams extends PageParams {
  q: string; // 검색 조건
  categoryId: number | null; // 카테고리 아이디
  marketId: number | null; // 쇼룸 아이디
  filters: Array<FilterParam>;
}
