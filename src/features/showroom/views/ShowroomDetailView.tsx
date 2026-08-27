import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useMemo } from "react";
import { ListRenderItemInfo, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { EmptyBoxIcon } from "@/common/components/DsIcon/icons";
import EmptyState from "@/common/components/EmptyState/EmptyState";
import HeaderActions from "@/common/components/HeaderActions/HeaderActions";
import InfoBanner from "@/common/components/InfoBanner/InfoBanner";
import PagingList from "@/common/components/PagingList/PagingList";
import Typography from "@/common/components/Typography/Typography";
import { usePermissionPress } from "@/common/hooks/usePermissionPress";
import { useCommonNavigation } from "@/common/router";
import { COMMON_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";
import PostCard from "@/features/post/components/PostCard/PostCard";
import { useFeedActions } from "@/features/post/hooks/useFeedActions";
import { useGetShowroomPosts } from "@/features/post/hooks/useGetShowroomPosts";
import { usePostImpressions } from "@/features/post/hooks/usePostImpressions";
import { FeedItem } from "@/features/post/types/post";
import ShowroomLegalFooter from "@/features/showroom/components/ShowroomLegalFooter/ShowroomLegalFooter";
import ShowroomProfile from "@/features/showroom/components/ShowroomProfile/ShowroomProfile";
import { useGetShowroomDetail } from "@/features/showroom/hooks/useGetShowroomDetail";
import { useUpdateShowroomFollow } from "@/features/showroom/hooks/useUpdateShowroomFollow";
import { showroomService } from "@/features/showroom/services/showroomService";

/**
 * C4 쇼룸 — SNS 링크로 바로 착지하는 화면이다.
 *
 * 비로그인으로 열 수 있고, 팔로우·좋아요는 로그인으로 보낸 뒤 원래 액션을 이어서 실행한다.
 * 쇼룸 안에서는 모든 카드가 같은 쇼룸이라 아바타 로즈 링과 카드 팔로우 버튼을 그리지 않는다 —
 * 프로필이 이미 두 정보를 다 갖고 있고, 게시물마다 링이 달랐다면 다른 쇼룸처럼 보인다.
 *
 * **진행 중인 공구를 위로 고정한다.** 이 화면에 온 사람의 첫 용건이 "지금 살 수 있는 게 있나"
 * 이기 때문이다. 아래는 일반 게시물이 최신순으로 이어진다.
 *
 * 일반 게시물 쪽에는 섹션 제목을 두지 않는다 — 공구 영역 아래로 이어지는 기본 피드라 5px
 * 밴드만으로 경계가 충분하고, 카드마다 붙은 헤더가 이미 목록의 시작을 알린다.
 *
 * 진행 중 공구가 없는 쇼룸은 **섹션 자체를 감춘다**(제목만 남기고 "없어요"를 적으면 화면 상단에
 * 빈칸이 생겨 쇼룸이 죽은 것처럼 보인다). 대신 프로필 아래에 팔로우 유도 한 줄을 둔다.
 */
export default function ShowroomDetailView() {
  const route = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.SHOWROOM_DETAIL>>();
  const { showroomId } = route.params;

  const commonNavigation = useCommonNavigation();

  const { data: showroom } = useGetShowroomDetail(showroomId);
  const { content, pageInfo, isLoading, isFetchingNextPage, fetchNextPage } = useGetShowroomPosts(showroomId);
  const { toggle: toggleFollow } = useUpdateShowroomFollow();
  const { handlePressPost, handlePressShowroom, handlePressProduct, handlePressLike, handlePressMore } =
    useFeedActions();
  const { handleViewableItemsChanged, viewabilityConfig } = usePostImpressions();

  // 쇼룸 방문은 크리에이터에게 나가는 지표다 — 같은 사람이 30분 안에 다시 와도 서버가 접는다
  useEffect(() => {
    void showroomService.recordVisit(showroomId).catch(() => undefined);
  }, [showroomId]);

  const handlePressFollow = usePermissionPress((id: number, isFollowing: boolean) => {
    toggleFollow(id, isFollowing);
  });

  /**
   * 진행 중인 공구는 위로 고정하고 목록에서는 뺀다 — 같은 게시물이 두 번 보이면
   * 고정 영역이 강조가 아니라 중복이 된다.
   */
  const { ongoingGroupBuys, generalPosts } = useMemo(() => {
    const ongoing = content.filter(item => item.post.groupBuy?.status === "OPEN");
    const ongoingIds = new Set(ongoing.map(item => item.post.postId));

    return {
      ongoingGroupBuys: ongoing,
      generalPosts: content.filter(item => !ongoingIds.has(item.post.postId)),
    };
  }, [content]);

  const renderPostCard = useCallback(
    (item: FeedItem) => (
      <PostCard
        item={item}
        hideRing
        hideFollowButton
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

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<FeedItem>) => renderPostCard(item),
    [renderPostCard]
  );

  const hasPosts = content.length > 0;

  return (
    <View className="flex-1 bg-white">
      <View className="border-b-[0.5px] border-divider bg-white">
        <View className="h-46 flex-row items-center" style={{ gap: 6, paddingLeft: 2, paddingRight: 12 }}>
          <TouchableOpacity onPress={() => commonNavigation.goBack()} activeOpacity={0.4} className="p-11">
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M15 5l-7 7 7 7"
                stroke="#0F0F0F"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
          <View className="min-w-0 flex-1" />
          <HeaderActions />
        </View>
      </View>

      <PagingList
        data={generalPosts}
        pageInfo={pageInfo}
        isLoading={isLoading || isFetchingNextPage}
        onLoadMore={fetchNextPage}
        keyExtractor={item => String(item.post.postId)}
        renderItem={renderItem}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        showsVerticalScrollIndicator={false}
        // 게시물이 없으면 내용이 짧아 하단 고지가 프로필 바로 밑에 붙는다.
        // 목록을 화면 높이만큼 늘리고 빈 자리를 빈 상태가 차지하게 해 고지를 아래로 민다
        contentContainerStyle={{ flexGrow: 1 }}
        ListHeaderComponent={
          showroom ? (
            <View>
              <ShowroomProfile showroom={showroom} onPressFollow={handlePressFollow} />

              {!showroom.hasOngoingGroupBuy && (
                <View className="px-14 pb-18">
                  <InfoBanner message="지금은 진행 중인 공구가 없어요. 팔로우하면 새 공구가 열릴 때 알려드려요." />
                </View>
              )}

              {ongoingGroupBuys.length > 0 && (
                <>
                  <View className="h-5 bg-band" />
                  <View className="px-14 pb-12 pt-18">
                    <Typography
                      style={{ fontSize: 15, fontWeight: "700", lineHeight: 15, letterSpacing: -0.2 }}
                      className="text-ink"
                    >
                      진행 중인 공구
                    </Typography>
                  </View>
                  {ongoingGroupBuys.map(item => (
                    <View key={item.post.postId}>{renderPostCard(item)}</View>
                  ))}
                </>
              )}

              <View className="h-5 bg-band" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          // 게시물이 전부 고정 영역으로 올라가 아래만 빈 경우와, 정말 글이 없는 쇼룸을 구분한다
          isLoading || hasPosts ? undefined : (
            <EmptyState
              className="flex-1"
              icon={<EmptyBoxIcon size={50} />}
              title="아직 올라온 게시물이 없어요"
              description={"팔로우해 두면 첫 공구가 열릴 때\n가장 먼저 알려드려요"}
              paddingTop={70}
            />
          )
        }
        ListFooterComponent={showroom ? <ShowroomLegalFooter /> : null}
      />
    </View>
  );
}
