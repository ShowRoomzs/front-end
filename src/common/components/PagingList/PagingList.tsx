import { UseQueryResult } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, FlatListProps } from "react-native";

import { DEFAULT_ON_END_REACHED_THRESHOLD } from "@/common/components/PagingList/config";
import EmptyComponent from "@/common/components/PagingList/EmptyComponent";
import FooterComponent from "@/common/components/PagingList/FooterComponent";
import RefreshControl from "@/common/components/PagingList/RefreshControl";
import { PageParams, PageResponse } from "@/common/types/page";

interface PagingListProps<T, P extends PageParams> extends Omit<FlatListProps<T>, "data"> {
  query: (params: P) => UseQueryResult<PageResponse<T>, Error>;
  params: P;
  updateParams: (key: keyof P, value: P[keyof P]) => void;
}

/**
 * @description 페이징 처리를 위한 리스트 컴포넌트
 * @param query 쿼리 함수
 * @param params 파라미터 (from useParams hook)
 * @param updateParams 파라미터 업데이트 함수 (from useParams hook)
 * @param flatListProps FlatList 컴포넌트의 속성 (ex. renderItem, etc.)
 */

export default function PagingList<T, P extends PageParams>(props: PagingListProps<T, P>) {
  const {
    query,
    updateParams,
    params,
    onEndReachedThreshold = DEFAULT_ON_END_REACHED_THRESHOLD,
    ...flatListProps
  } = props;
  const { data, isLoading, refetch } = query(params);
  const [items, setItems] = useState<Array<T>>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const prevPageRef = useRef<number>(params.page);

  // TODO : products > data로 변경 필요
  useEffect(() => {
    if (!data?.products || data.products.length === 0) {
      return;
    }

    const isInitialLoad = params.page === 1;
    const isNewPage = params.page !== prevPageRef.current;

    if (isInitialLoad) {
      setItems(data.products);
    } else if (isNewPage) {
      setItems(prev => [...prev, ...data.products]);
    }

    prevPageRef.current = params.page;
  }, [data?.products, params.page]);

  const handleEndReached = useCallback(
    (e: { distanceFromEnd: number }) => {
      props.onEndReached?.(e);

      if (isLoading || !data?.pageInfo) {
        return;
      }

      const { hasNext, isLast, currentPage } = data.pageInfo;

      if (!hasNext || isLast) {
        return;
      }

      updateParams("page", (currentPage + 1) as P["page"]);
    },
    [data?.pageInfo, isLoading, props, updateParams]
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    updateParams("page", 1 as P["page"]);
    await refetch();
    setIsRefreshing(false);
  }, [refetch, updateParams]);

  return (
    <FlatList
      {...flatListProps}
      data={items}
      onEndReachedThreshold={onEndReachedThreshold}
      onEndReached={handleEndReached}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
      ListEmptyComponent={<EmptyComponent isLoading={isLoading} hasItems={items.length > 0} />}
      ListFooterComponent={<FooterComponent isLoading={isLoading} hasItems={items.length > 0} />}
    />
  );
}
