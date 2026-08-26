import { forwardRef, ReactElement, Ref, useCallback } from "react";
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

/**
 * ref를 넘길 수 있게 열어 둔다 — 정렬이 바뀌었을 때 목록의 처음으로 되돌리는 것처럼,
 * 부르는 쪽만 아는 시점에 스크롤을 조작해야 하는 경우가 있다.
 */
function PagingListInner<T>(props: PagingListProps<T>, ref: Ref<FlatList<T>>) {
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
      ref={ref}
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

// forwardRef가 제네릭을 지워 버리므로 캐스팅으로 되살린다
const PagingList = forwardRef(PagingListInner) as <T>(
  props: PagingListProps<T> & { ref?: Ref<FlatList<T>> }
) => ReactElement;

export default PagingList;
