import { useCallback, useState } from "react";
import { ListRenderItemInfo, TouchableOpacity, View } from "react-native";

import Avatar from "@/common/components/Avatar/Avatar";
import { StorefrontIcon } from "@/common/components/DsIcon/icons";
import EmptyState from "@/common/components/EmptyState/EmptyState";
import PagingList from "@/common/components/PagingList/PagingList";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Typography from "@/common/components/Typography/Typography";
import { useMainNavigation, useSettingsNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import ShowroomRowSkeleton from "@/features/showroom/components/ShowroomRowSkeleton/ShowroomRowSkeleton";
import { useGetBlockedShowrooms } from "@/features/showroom/hooks/useGetBlockedShowrooms";
import { useShowroomBlock } from "@/features/showroom/hooks/useShowroomBlock";
import { BlockedShowroom } from "@/features/showroom/types/showroom";

const HIT_SLOP_PADDING = 7;

/**
 * 설정 > 차단한 쇼룸 — 게시물 ⋯ [이 쇼룸의 게시물 그만 보기]로 차단한 쇼룸을 모아 풀 수 있는 곳(App Store 심사 1.2).
 *
 * ⚠️ 시안이 없는 화면이다 — 행 · 버튼은 C2 팔로잉 목록(아바타 44 · 이름 · 오른쪽 높이 30 외곽선 버튼)을 따랐다.
 * [차단 해제]를 눌러도 행은 남기고 버튼만 [차단]으로 바뀐다(C2 언팔로우와 같은 규칙) — 잘못 눌렀을 때 그 자리에서
 * 되돌릴 수 있어야 해서다. 목록에서 실제로 빠지는 것은 다시 들어왔을 때다.
 */
export default function BlockedShowroomsView() {
  const navigation = useSettingsNavigation();
  const mainNavigation = useMainNavigation();
  const { blockShowroom, unblockShowroom } = useShowroomBlock();
  const { content, pageInfo, isLoading, isFetchingNextPage, fetchNextPage } = useGetBlockedShowrooms();
  /** 이 화면에서 해제한 쇼룸 — 행은 남기고 버튼만 [차단]으로 */
  const [unblockedIds, setUnblockedIds] = useState<Set<number>>(new Set());

  const handleToggle = useCallback(
    (showroomId: number) => {
      const isUnblocked = unblockedIds.has(showroomId);

      setUnblockedIds(prev => {
        const next = new Set(prev);

        if (isUnblocked) {
          next.delete(showroomId);
        } else {
          next.add(showroomId);
        }
        return next;
      });
      if (isUnblocked) {
        blockShowroom(showroomId);
      } else {
        unblockShowroom(showroomId);
      }
    },
    [blockShowroom, unblockShowroom, unblockedIds]
  );

  const handlePressShowroom = useCallback(
    (showroomId: number) => {
      mainNavigation.navigate(ROOT_ROUTES.COMMON, {
        screen: COMMON_ROUTES.SHOWROOM_DETAIL,
        params: { showroomId },
      });
    },
    [mainNavigation]
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<BlockedShowroom>) => {
      const isUnblocked = unblockedIds.has(item.showroomId);

      return (
        <TouchableOpacity
          onPress={() => handlePressShowroom(item.showroomId)}
          activeOpacity={0.55}
          className="flex-row items-center px-14 py-8"
          style={{ gap: 12 }}
        >
          <Avatar imageUrl={item.showroomImageUrl} size={44} />
          <Typography
            variant="rowName"
            style={{ letterSpacing: -0.2 }}
            className="min-w-0 flex-1 text-ink"
            numberOfLines={1}
          >
            {item.showroomName}
          </Typography>
          <TouchableOpacity
            onPress={() => handleToggle(item.showroomId)}
            activeOpacity={0.55}
            style={{ paddingVertical: HIT_SLOP_PADDING, marginVertical: -HIT_SLOP_PADDING }}
          >
            <View className="h-30 flex-row items-center justify-center rounded-base border-[1px] border-borderButton bg-white px-12">
              <Typography variant="button" className="text-ink76">
                {isUnblocked ? "차단" : "차단 해제"}
              </Typography>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      );
    },
    [handlePressShowroom, handleToggle, unblockedIds]
  );

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="차단한 쇼룸" onPressBack={navigation.goBack} />
      <PagingList
        data={content}
        pageInfo={pageInfo}
        isLoading={isLoading || isFetchingNextPage}
        skeleton={<ShowroomRowSkeleton withButton />}
        skeletonCount={8}
        onLoadMore={fetchNextPage}
        keyExtractor={item => String(item.showroomId)}
        renderItem={renderItem}
        contentContainerStyle={{ flexGrow: 1, paddingTop: 8 }}
        ListEmptyComponent={
          isLoading ? undefined : (
            <EmptyState
              fill
              icon={<StorefrontIcon size={52} />}
              title="차단한 쇼룸이 없어요"
              description={"게시물 ⋯의 [이 쇼룸의 게시물 그만 보기]로\n차단한 쇼룸이 여기 모여요"}
            />
          )
        }
      />
    </View>
  );
}
