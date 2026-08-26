import { useCallback, useMemo, useRef, useState } from "react";
import { FlatList, ListRenderItemInfo, RefreshControl, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BOTTOM_TABS_HEIGHT } from "@/common/components/BottomTabs/config";
import { HeartIcon } from "@/common/components/DsIcon/icons";
import EmptyState from "@/common/components/EmptyState/EmptyState";
import ListHeaderBar from "@/common/components/ListHeaderBar/ListHeaderBar";
import LoginPrompt from "@/common/components/LoginPrompt/LoginPrompt";
import PagingList from "@/common/components/PagingList/PagingList";
import ScreenHeaderBar from "@/common/components/ScreenHeaderBar/ScreenHeaderBar";
import SheetList from "@/common/components/SheetList/SheetList";
import { useBottomSheet } from "@/common/hooks/useBottomSheet";
import { useBottomSheetContext } from "@/common/providers/BottomSheetProvider";
import { useUserStore } from "@/common/stores/useUserStore";
import PostCard from "@/features/post/components/PostCard/PostCard";
import { useFeedActions } from "@/features/post/hooks/useFeedActions";
import { useGetLikedPosts } from "@/features/post/hooks/useGetLikedPosts";
import {
  FeedItem,
  LIKED_POST_SORT_DESCRIPTION,
  LIKED_POST_SORT_LABEL,
  LikedPostSort,
} from "@/features/post/types/post";

/**
 * C3 좋아요 — 좋아요한 게시물 모아보기.
 *
 * 마감된 공구도 목록에 남는다. 하트는 회색으로 낮춰 새 좋아요를 막되 이미 누른 것의 해제는
 * 허용하고(PostCard의 likeLocked), 품절은 제한하지 않는다 — 재입고·다음 공구로 되살아날 수 있어
 * 저장 가치가 남는다.
 */
const SORT_SHEET_ID = "likedPostSortSheet";
const SORT_OPTIONS: Array<LikedPostSort> = ["DEFAULT", "LIKED_OLDEST", "MOST_LIKED", "GROUP_BUY_FIRST"];

export default function LikeView() {
  const inset = useSafeAreaInsets();
  const { user } = useUserStore();
  const { close: closeSheet } = useBottomSheetContext();
  const [sort, setSort] = useState<LikedPostSort>("DEFAULT");

  const { content, pageInfo, isLoading, isFetchingNextPage, fetchNextPage, refetch } = useGetLikedPosts(
    sort,
    !!user
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const listRef = useRef<FlatList<FeedItem>>(null);
  const {
    handlePressPost,
    handlePressShowroom,
    handlePressProduct,
    handlePressLike,
    handlePressFollow,
    handlePressMore,
  } = useFeedActions();

  const handleSelectSort = useCallback(
    (value: string) => {
      setSort(value as LikedPostSort);
      closeSheet();
      // 정렬을 바꾸면 목록의 처음으로 되돌린다 — 스크롤 위치가 남아 있으면 새 순서의 중간부터
      // 보게 되어 정렬이 먹지 않은 것처럼 읽힌다
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
    },
    [closeSheet]
  );

  /**
   * 당겨서 새로고침 — 좋아요를 해제한 항목이 **실제로 목록에서 빠지는 시점**이다.
   *
   * 하트를 끄는 즉시 행을 지우지 않는 이유는 잘못 눌렀을 때 되돌릴 자리가 없어지기 때문이고,
   * 그래서 정리는 사용자가 스스로 요청할 때(당기기) 한다. 별도 버튼은 두지 않는다.
   */
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  const sortItems = useMemo(
    () =>
      SORT_OPTIONS.map(option => ({
        value: option,
        label: LIKED_POST_SORT_LABEL[option],
        description: LIKED_POST_SORT_DESCRIPTION[option],
      })),
    []
  );

  const { open: openSortSheet } = useBottomSheet({
    id: SORT_SHEET_ID,
    render: (
      <SheetList
        title="정렬 기준"
        items={sortItems}
        mode="select"
        selectedValue={sort}
        onSelect={handleSelectSort}
      />
    ),
    sheetProps: { enableDynamicSizing: true, snapPoints: undefined },
  });

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<FeedItem>) => (
      <PostCard
        item={item}
        onPressPost={handlePressPost}
        onPressShowroom={handlePressShowroom}
        onPressFollow={handlePressFollow}
        onPressLike={handlePressLike}
        onPressProduct={handlePressProduct}
        onPressMore={handlePressMore}
      />
    ),
    [
      handlePressFollow,
      handlePressLike,
      handlePressMore,
      handlePressPost,
      handlePressProduct,
      handlePressShowroom,
    ]
  );

  if (!user) {
    return (
      <View className="flex-1 bg-white">
        <ScreenHeaderBar title="좋아요" />
        <LoginPrompt
          title={"로그인하고\n좋아한 게시물을 모아보세요"}
          description={"마음에 든 공구와 게시물을\n한곳에 저장해 둘 수 있어요"}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScreenHeaderBar title="좋아요" />
      <PagingList
        ref={listRef}
        data={content}
        pageInfo={pageInfo}
        isLoading={isLoading || isFetchingNextPage}
        onLoadMore={fetchNextPage}
        keyExtractor={item => String(item.post.postId)}
        renderItem={renderItem}
        ListHeaderComponent={
          <ListHeaderBar
            countLabel={`좋아요한 게시물 ${pageInfo?.totalElements ?? content.length}`}
            sortLabel={LIKED_POST_SORT_LABEL[sort]}
            onPressSort={openSortSheet}
          />
        }
        ListEmptyComponent={
          isLoading ? undefined : (
            <EmptyState
              icon={<HeartIcon size={52} color="#D8D8DA" />}
              title="아직 좋아요한 게시물이 없어요"
              description={"마음에 드는 게시물의 하트를 누르면\n여기에 모여요"}
              paddingTop={120}
            />
          )
        }
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#F2456E" />
        }
        contentContainerStyle={{ paddingBottom: inset.bottom + BOTTOM_TABS_HEIGHT }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
