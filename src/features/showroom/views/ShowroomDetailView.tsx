import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback, useEffect } from "react";
import { ListRenderItemInfo, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { CartIcon, SearchIcon } from "@/common/components/DsIcon/icons";
import InfoBanner from "@/common/components/InfoBanner/InfoBanner";
import PagingList from "@/common/components/PagingList/PagingList";
import Typography from "@/common/components/Typography/Typography";
import { usePermissionPress } from "@/common/hooks/usePermissionPress";
import { useCommonNavigation, useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";
import PostCard from "@/features/post/components/PostCard/PostCard";
import { useFeedActions } from "@/features/post/hooks/useFeedActions";
import { useGetShowroomPosts } from "@/features/post/hooks/useGetShowroomPosts";
import { usePostImpressions } from "@/features/post/hooks/usePostImpressions";
import { FeedItem } from "@/features/post/types/post";
import ShowroomProfile from "@/features/showroom/components/ShowroomProfile/ShowroomProfile";
import { useGetShowroomDetail } from "@/features/showroom/hooks/useGetShowroomDetail";
import { useUpdateShowroomFollow } from "@/features/showroom/hooks/useUpdateShowroomFollow";
import { showroomService } from "@/features/showroom/services/showroomService";

/**
 * C4 쇼룸 — SNS 링크로 바로 착지하는 화면이다.
 *
 * 비로그인으로 열 수 있고, 팔로우·좋아요는 로그인으로 보낸 뒤 원래 액션을 이어서 실행한다.
 * 쇼룸 안에서는 모든 카드가 같은 쇼룸이라 아바타 로즈 링과 카드 팔로우 버튼을 그리지 않는다 —
 * 프로필이 이미 두 정보를 다 갖고 있다.
 *
 * [진행 중인 공구] 고정 영역은 공구 게시물(GROUP_BUY)이 서버에 아직 없어 자리만 잡아 두었다.
 */
export default function ShowroomDetailView() {
  const route = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.SHOWROOM_DETAIL>>();
  const { showroomId } = route.params;

  const navigation = useMainNavigation();
  const commonNavigation = useCommonNavigation();

  const { data: showroom } = useGetShowroomDetail(showroomId);
  const { content, pageInfo, isLoading, isFetchingNextPage, fetchNextPage } = useGetShowroomPosts(showroomId);
  const { toggle: toggleFollow } = useUpdateShowroomFollow();
  const { handlePressPost, handlePressShowroom, handlePressLike, handlePressMore } = useFeedActions();
  const { handleViewableItemsChanged, viewabilityConfig } = usePostImpressions();

  // 쇼룸 방문은 크리에이터에게 나가는 지표다 — 같은 사람이 30분 안에 다시 와도 서버가 접는다
  useEffect(() => {
    void showroomService.recordVisit(showroomId).catch(() => undefined);
  }, [showroomId]);

  const handlePressFollow = usePermissionPress((id: number, isFollowing: boolean) => {
    toggleFollow(id, isFollowing);
  });

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<FeedItem>) => (
      <PostCard
        item={item}
        hideRing
        hideFollowButton
        onPressPost={handlePressPost}
        onPressShowroom={handlePressShowroom}
        onPressFollow={handlePressFollow}
        onPressLike={handlePressLike}
        onPressMore={handlePressMore}
      />
    ),
    [handlePressFollow, handlePressLike, handlePressMore, handlePressPost, handlePressShowroom]
  );

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
          <View className="flex-row" style={{ gap: 18 }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(ROOT_ROUTES.COMMON, {
                  screen: COMMON_ROUTES.SEARCH,
                  params: { keyword: "" },
                })
              }
              activeOpacity={0.6}
              style={{ padding: 9, margin: -9 }}
            >
              <SearchIcon size={25} color="#0F0F0F" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate(ROOT_ROUTES.COMMON, { screen: COMMON_ROUTES.CART })}
              activeOpacity={0.6}
              style={{ padding: 9, margin: -9 }}
            >
              <CartIcon size={25} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <PagingList
        data={content}
        pageInfo={pageInfo}
        isLoading={isLoading || isFetchingNextPage}
        onLoadMore={fetchNextPage}
        keyExtractor={item => String(item.post.postId)}
        renderItem={renderItem}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          showroom ? (
            <View>
              <ShowroomProfile showroom={showroom} onPressFollow={handlePressFollow} />
              {!showroom.hasOngoingGroupBuy && (
                <View className="px-14 pb-14">
                  <InfoBanner message="지금은 진행 중인 공구가 없어요. 팔로우하면 새 공구가 열릴 때 알려드려요." />
                </View>
              )}
              <View className="h-5 bg-band" />
              <View className="flex-row items-baseline px-14 pb-12 pt-18" style={{ gap: 7 }}>
                <Typography style={{ fontSize: 15, fontWeight: "700", lineHeight: 15, letterSpacing: -0.2 }}>
                  게시물
                </Typography>
              </View>
            </View>
          ) : null
        }
      />
    </View>
  );
}
