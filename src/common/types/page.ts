export interface LimitParams {
  limit: number;
}

export interface PageParams extends LimitParams {
  page: number;
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
  content: Array<T>;
}
