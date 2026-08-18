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
import { useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { useUserStore } from "@/common/stores/useUserStore";
import ShowroomRow from "@/features/showroom/components/ShowroomRow/ShowroomRow";
import { useGetFollowingShowrooms } from "@/features/showroom/hooks/useGetFollowingShowrooms";
import { useUpdateShowroomFollow } from "@/features/showroom/hooks/useUpdateShowroomFollow";
import {
  FOLLOWING_SHOWROOM_SORT_DESCRIPTION,
  FOLLOWING_SHOWROOM_SORT_LABEL,
  FollowingShowroom,
  FollowingShowroomSort,
} from "@/features/showroom/types/showroom";

/**
 * C2 팔로잉 — 팔로우한 쇼룸 목록.
 *
 * [팔로잉]을 누르면 즉시 언팔로우되고 행은 남은 채 버튼만 [팔로우]로 바뀐다. 잘못 눌렀을 때
 * 그 자리에서 되돌릴 수 있어야 하기 때문이고, 목록에서 실제로 빠지는 것은 화면을 떠난 뒤다.
 *
 * 행에 아이디(@handle)를 넣지 않는 것은 서버의 팔로잉 목록 응답이 쇼룸명까지만 내려주기 때문이다.
 */
const SORT_SHEET_ID = "followingSortSheet";
const SORT_OPTIONS: Array<FollowingShowroomSort> = ["DEFAULT", "FOLLOW_LATEST", "FOLLOW_OLDEST"];

export default function FollowingView() {
  const inset = useSafeAreaInsets();
  const navigation = useMainNavigation();
  const { user } = useUserStore();
  const { close: closeSheet } = useBottomSheetContext();

  const [sort, setSort] = useState<FollowingShowroomSort>("DEFAULT");
  /** 이 화면에 머무는 동안 언팔로우한 쇼룸 — 행은 남기고 버튼만 되돌린다 */
  const [unfollowedIds, setUnfollowedIds] = useState<Set<number>>(new Set());

  const { content, pageInfo, isLoading, isFetchingNextPage, fetchNextPage } = useGetFollowingShowrooms(
    sort,
    !!user
  );
  const { toggle: toggleFollow } = useUpdateShowroomFollow(true);

  const handleSelectSort = useCallback(
    (value: string) => {
      setSort(value as FollowingShowroomSort);
      closeSheet();
    },
    [closeSheet]
  );

  const sortItems = useMemo(
    () =>
      SORT_OPTIONS.map(option => ({
        value: option,
        label: FOLLOWING_SHOWROOM_SORT_LABEL[option],
        description: FOLLOWING_SHOWROOM_SORT_DESCRIPTION[option],
      })),
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

  const handlePressShowroom = useCallback(
    (showroomId: number) => {
      navigation.navigate(ROOT_ROUTES.COMMON, {
        screen: COMMON_ROUTES.SHOWROOM_DETAIL,
        params: { showroomId },
      });
    },
    [navigation]
  );

  const handlePressFollow = useCallback(
    (showroomId: number, isFollowing: boolean) => {
      setUnfollowedIds(prev => {
        const next = new Set(prev);

        if (isFollowing) {
          next.add(showroomId);
        } else {
          next.delete(showroomId);
        }
        return next;
      });
      toggleFollow(showroomId, isFollowing);
    },
    [toggleFollow]
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<FollowingShowroom>) => (
      <ShowroomRow
        showroomId={item.showroomId}
        showroomName={item.showroomName}
        showroomImageUrl={item.showroomImageUrl}
        hasOngoingGroupBuy={item.hasOngoingGroupBuy}
        isFollowing={!unfollowedIds.has(item.showroomId)}
        onPress={handlePressShowroom}
        onPressFollow={handlePressFollow}
      />
    ),
    [handlePressFollow, handlePressShowroom, unfollowedIds]
  );

  if (!user) {
    return (
      <View className="flex-1 bg-white">
        <ScreenHeaderBar title="팔로잉" />
        <LoginPrompt
          title={"로그인하고\n공구 소식을 받아보세요"}
          description={"팔로우한 쇼룸의 새 공구와 주문 내역을\n한곳에서 확인할 수 있어요"}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScreenHeaderBar title="팔로잉" />
      <PagingList
        data={content}
        pageInfo={pageInfo}
        isLoading={isLoading || isFetchingNextPage}
        onLoadMore={fetchNextPage}
        keyExtractor={item => String(item.showroomId)}
        renderItem={renderItem}
        ListHeaderComponent={
          <ListHeaderBar
            countLabel={`팔로잉 쇼룸 ${pageInfo?.totalElements ?? content.length}`}
            sortLabel={FOLLOWING_SHOWROOM_SORT_LABEL[sort]}
            onPressSort={openSortSheet}
          />
        }
        contentContainerStyle={{ paddingBottom: inset.bottom + BOTTOM_TABS_HEIGHT }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
