import { PageResponse } from "@/common/types/page";

/** 서버의 페이지 응답을 흉내낸다 — 페이지 번호는 1부터다(`useInfiniteList`의 initialPageParam) */
export function demoPage<T>(items: Array<T>, params?: { page?: number; size?: number }): PageResponse<T> {
  const size = params?.size ?? 20;
  const current = params?.page ?? 1;
  const start = (current - 1) * size;
  const totalPages = Math.max(1, Math.ceil(items.length / size));

  return {
    content: items.slice(start, start + size),
    pageInfo: {
      currentPage: current,
      pageSize: size,
      totalElements: items.length,
      totalPages,
      hasNext: current < totalPages,
      isLast: current >= totalPages,
    },
  };
}
