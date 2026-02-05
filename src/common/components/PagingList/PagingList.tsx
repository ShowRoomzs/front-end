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
      ListEmptyComponent={<EmptyComponent isLoading={isLoading} hasItems={(data?.length || 0) > 0} />}
      ListFooterComponent={<FooterComponent isLoading={isLoading} hasItems={(data?.length || 0) > 0} />}
    />
  );
}
