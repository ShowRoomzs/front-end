import { useCallback } from "react";
import { FlatList, FlatListProps } from "react-native";

import { DEFAULT_ON_END_REACHED_THRESHOLD } from "@/common/components/PagingList/config";
import EmptyComponent from "@/common/components/PagingList/EmptyComponent";
import FooterComponent from "@/common/components/PagingList/FooterComponent";
import { PageInfo } from "@/common/types/page";

interface PagingListProps<T> extends Omit<FlatListProps<T>, "data"> {
  data: Array<T> | undefined;
  pageInfo: PageInfo | undefined;
  onLoadMore: () => void;
  isLoading: boolean;
}

export default function PagingList<T>(props: PagingListProps<T>) {
  const {
    data,
    pageInfo,
    onLoadMore,
    isLoading,
    ListEmptyComponent,
    onEndReachedThreshold = DEFAULT_ON_END_REACHED_THRESHOLD,
    ...flatListProps
  } = props;

  const handleEndReached = useCallback(
    (e: { distanceFromEnd: number }) => {
      props.onEndReached?.(e);

      if (isLoading || !pageInfo) {
        return;
      }

      const { hasNext, isLast } = pageInfo;

      if (!hasNext || isLast) {
        return;
      }

      onLoadMore();
    },
    [isLoading, onLoadMore, pageInfo, props]
  );

  return (
    <FlatList
      {...flatListProps}
      data={data || []}
      onEndReachedThreshold={onEndReachedThreshold}
      onEndReached={handleEndReached}
      removeClippedSubviews
      // 화면마다 빈 상태 문구가 달라야 하므로 부르는 쪽이 넘기면 그걸 쓰고,
      // 안 넘기면(=로딩 중이거나 문구를 안 정한 목록) 공용 스피너·기본 문구로 떨어진다
      ListEmptyComponent={
        ListEmptyComponent ?? <EmptyComponent isLoading={isLoading} hasItems={(data?.length || 0) > 0} />
      }
      ListFooterComponent={<FooterComponent isLoading={isLoading} hasItems={(data?.length || 0) > 0} />}
    />
  );
}
