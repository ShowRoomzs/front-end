import { InfiniteData, QueryKey, useInfiniteQuery, UseInfiniteQueryOptions } from "@tanstack/react-query";

import { PageInfo, PageResponse } from "@/common/types/page";

interface UseInfiniteListProps<T> extends Omit<
  UseInfiniteQueryOptions<PageResponse<T>, Error, InfiniteData<PageResponse<T>, number>, QueryKey, number>,
  "queryFn" | "initialPageParam" | "getNextPageParam"
> {
  queryFn: (page: number) => Promise<PageResponse<T>>;
}

export function useInfiniteList<T>(props: UseInfiniteListProps<T>) {
  const { queryFn, ...restQueryOptions } = props;

  const query = useInfiniteQuery({
    queryFn: ({ pageParam }) => queryFn(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage: PageResponse<T>) =>
      lastPage.pageInfo.hasNext ? lastPage.pageInfo.currentPage + 1 : undefined,
    ...restQueryOptions,
  });

  const content: Array<T> = query.data?.pages.flatMap(page => page.content) ?? [];
  const pageInfo: PageInfo | undefined = query.data?.pages.at(-1)?.pageInfo;

  return {
    ...query,
    data: { content, pageInfo },
    content,
    pageInfo,
  };
}
