export interface SizeParams {
  size: number;
}

export interface PageParams extends SizeParams {
  page: number;
}

/**
 * 페이징 메타데이터 — back-end `global.dto.PaginationInfo`(`PageResponse.pageInfo`).
 * 장바구니 `CartDto.PageInfo`(totalElements · isLast · pageSize)는 다른 꼴이라 여기에 섞지 않는다.
 */
export type PageInfo = {
  /** 1부터 */
  currentPage: number;
  totalPages: number;
  /** 전체 항목 수 — 화면의 「N건」 */
  totalResults: number;
  /** 페이지당 항목 수 */
  limit: number;
  hasNext: boolean;
};

export interface PageResponse<T> {
  pageInfo: PageInfo;
  content: Array<T>;
}
