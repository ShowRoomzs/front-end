import { InfiniteData, QueryKey, useInfiniteQuery, UseInfiniteQueryOptions } from "@tanstack/react-query";

import { PageInfo, PageResponse } from "@/common/types/page";

type ContentOf<R> = R extends PageResponse<infer T> ? T : never;

interface UseInfiniteListProps<R extends PageResponse<unknown>> extends Omit<
  UseInfiniteQueryOptions<R, Error, InfiniteData<R, number>, QueryKey, number>,
  "queryFn" | "initialPageParam" | "getNextPageParam"
> {
  queryFn: (page: number) => Promise<R>;
}

export function useInfiniteList<R extends PageResponse<unknown>>(props: UseInfiniteListProps<R>) {
  const { queryFn, ...restQueryOptions } = props;

  const query = useInfiniteQuery({
    queryFn: ({ pageParam }) => queryFn(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage: R) =>
      lastPage.pageInfo.hasNext ? lastPage.pageInfo.currentPage + 1 : undefined,
    ...restQueryOptions,
  });

  const content = (query.data?.pages.flatMap(page => page.content) ?? []) as Array<ContentOf<R>>;
  const pageInfo: PageInfo | undefined = query.data?.pages.at(-1)?.pageInfo;

  return {
    ...query,
    data: { content, pageInfo },
    content,
    pageInfo,
  };
}
