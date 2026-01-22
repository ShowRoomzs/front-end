export interface PageParams {
  page: number;
  limit: number;
}

export type PageInfo = {
  currentPage: number;
  hasNext: boolean;
  isLast: boolean;
  pageSize: number;
  totalElements: number;
  totalPages: number;
};

export interface PageResponse<T> {
  pageInfo: PageInfo;
  products: Array<T>; // 추후 DTO 수정 가능성 있음 products > data
}
