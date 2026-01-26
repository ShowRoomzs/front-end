import { useCallback } from "react";
import { FlatList, FlatListProps } from "react-native";

import { DEFAULT_ON_END_REACHED_THRESHOLD } from "@/common/components/PagingList/config";
import EmptyComponent from "@/common/components/PagingList/EmptyComponent";
import FooterComponent from "@/common/components/PagingList/FooterComponent";
import { PageInfo } from "@/common/types/page";

interface PagingListProps<T> extends Omit<FlatListProps<T>, "data"> {
  data: Array<T> | undefined;
  pageInfo: PageInfo | undefined;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

/**
 * @description 페이징 처리를 위한 리스트 컴포넌트
 * @param query 쿼리 함수
 * @param params 파라미터 (from useParams hook)
 * @param updateParams 파라미터 업데이트 함수 (from useParams hook)
 * @param flatListProps FlatList 컴포넌트의 속성 (ex. renderItem, etc.)
 */

export default function PagingList<T>(props: PagingListProps<T>) {
  const {
    data,
    pageInfo,
    onPageChange,
    isLoading,
    onEndReachedThreshold = DEFAULT_ON_END_REACHED_THRESHOLD,
    ...flatListProps
  } = props;

  const handleEndReached = useCallback(
    (e: { distanceFromEnd: number }) => {
      props.onEndReached?.(e);

      if (isLoading || !pageInfo) {
        return;
      }

      const { hasNext, isLast, currentPage } = pageInfo;

      if (!hasNext || isLast) {
        return;
      }

      onPageChange(currentPage + 1);
    },
    [isLoading, onPageChange, pageInfo, props]
  );

  return (
    <FlatList
      {...flatListProps}
      data={data || []}
      onEndReachedThreshold={onEndReachedThreshold}
      onEndReached={handleEndReached}
      removeClippedSubviews
      ListEmptyComponent={<EmptyComponent isLoading={isLoading} hasItems={(data?.length || 0) > 0} />}
      ListFooterComponent={<FooterComponent isLoading={isLoading} hasItems={(data?.length || 0) > 0} />}
    />
  );
}
