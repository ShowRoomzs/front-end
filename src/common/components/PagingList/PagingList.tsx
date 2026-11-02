import { forwardRef, isValidElement, ReactElement, Ref, useCallback, useState } from "react";
import { FlatList, FlatListProps, StyleSheet, View } from "react-native";

import { DEFAULT_ON_END_REACHED_THRESHOLD } from "@/common/components/PagingList/config";
import EmptyComponent from "@/common/components/PagingList/EmptyComponent";
import FooterComponent from "@/common/components/PagingList/FooterComponent";
import { SkeletonOverlay, SkeletonRepeat } from "@/common/components/Skeleton/Skeleton";
import { PageInfo } from "@/common/types/page";

interface PagingListProps<T> extends Omit<FlatListProps<T>, "data"> {
  data: Array<T> | undefined;
  pageInfo: PageInfo | undefined;
  onLoadMore: () => void;
  isLoading: boolean;
  /**
   * 항목 하나의 자리 표시(§07 스켈레톤). 주면 첫 진입에는 `skeletonCount`개를, 다음 페이지에는
   * 목록 끝에 하나를 그린다. 안 주면 공용 스피너로 떨어진다.
   *
   * 첫 진입 자리 표시는 목록 안(빈 상태 자리)이 아니라 **목록 위에 겹쳐** 그린다 — 목록이
   * 빈 상태 자리를 걷어낼 때는 퇴장 애니메이션이 돌지 않아, 안에 두면 200ms 크로스페이드 없이
   * 뚝 끊긴다. 흰 바탕째 흐려지므로 그 아래로 막 그려진 항목과 그대로 섞인다.
   * 머리말(개수 · 정렬 줄 등)은 가리지 않도록 그 높이만큼 내려 둔다.
   */
  skeleton?: ReactElement;
  /** 첫 진입에 그릴 자리 표시 개수 — 한 화면을 채울 만큼 */
  skeletonCount?: number;
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
    ListHeaderComponent,
    ListFooterComponent,
    skeleton,
    skeletonCount = 3,
    onEndReachedThreshold = DEFAULT_ON_END_REACHED_THRESHOLD,
    ...flatListProps
  } = props;

  const hasItems = (data?.length || 0) > 0;
  const isFirstLoading = isLoading && !hasItems;
  const [headerHeight, setHeaderHeight] = useState(0);

  const header = ListHeaderComponent ? (
    <View onLayout={e => setHeaderHeight(e.nativeEvent.layout.height)}>
      {isValidElement(ListHeaderComponent) ? ListHeaderComponent : <ListHeaderComponent />}
    </View>
  ) : null;

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
    <View style={styles.container}>
      <FlatList
        ref={ref}
        {...flatListProps}
        data={data || []}
        onEndReachedThreshold={onEndReachedThreshold}
        onEndReached={handleEndReached}
        removeClippedSubviews
        ListHeaderComponent={header}
        // 화면마다 빈 상태 문구가 달라야 하므로 부르는 쪽이 넘기면 그걸 쓰고,
        // 안 넘기면(=로딩 중이거나 문구를 안 정한 목록) 공용 스피너·기본 문구로 떨어진다
        ListEmptyComponent={
          ListEmptyComponent ?? (
            <EmptyComponent isLoading={isLoading} hasItems={hasItems} hasSkeleton={!!skeleton} />
          )
        }
        // 다음 페이지 스피너는 언제나 마지막 항목 바로 뒤에 붙고, 부르는 쪽이 넘긴 꼬리말은
        // 그 아래로 간다 — 둘 중 하나를 고르게 하면 목록 끝에 고지를 붙일 수가 없다
        ListFooterComponent={
          <View>
            <FooterComponent isLoading={isLoading} hasItems={hasItems} skeleton={skeleton} />
            {ListFooterComponent as ReactElement}
          </View>
        }
      />

      {!!skeleton && (
        <SkeletonOverlay visible={isFirstLoading} top={header ? headerHeight : 0}>
          <SkeletonRepeat count={skeletonCount}>{skeleton}</SkeletonRepeat>
        </SkeletonOverlay>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // FlatList(ScrollView)의 기본 늘어남을 그대로 물려받는다 — 감싸도 부모 배치가 바뀌지 않게
  container: { flexGrow: 1, flexShrink: 1 },
});

// forwardRef가 제네릭을 지워 버리므로 캐스팅으로 되살린다
const PagingList = forwardRef(PagingListInner) as <T>(
  props: PagingListProps<T> & { ref?: Ref<FlatList<T>> }
) => ReactElement;

export default PagingList;
