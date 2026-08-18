import { useCallback, useMemo, useState } from "react";
import { ListRenderItemInfo, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BOTTOM_TABS_HEIGHT } from "@/common/components/BottomTabs/config";
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
import { FeedItem, LIKED_POST_SORT_LABEL, LikedPostSort } from "@/features/post/types/post";

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

  const { content, pageInfo, isLoading, isFetchingNextPage, fetchNextPage } = useGetLikedPosts(sort, !!user);
  const { handlePressPost, handlePressShowroom, handlePressLike, handlePressFollow, handlePressMore } =
    useFeedActions();

  const handleSelectSort = useCallback(
    (value: string) => {
      setSort(value as LikedPostSort);
      closeSheet();
    },
    [closeSheet]
  );

  const sortItems = useMemo(
    () => SORT_OPTIONS.map(option => ({ value: option, label: LIKED_POST_SORT_LABEL[option] })),
    []
  );

  const { open: openSortSheet } = useBottomSheet({
    id: SORT_SHEET_ID,
    render: (
      <SheetList
        title="정렬"
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
        onPressMore={handlePressMore}
      />
    ),
    [handlePressFollow, handlePressLike, handlePressMore, handlePressPost, handlePressShowroom]
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
        contentContainerStyle={{ paddingBottom: inset.bottom + BOTTOM_TABS_HEIGHT }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
