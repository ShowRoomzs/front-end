import { ReactElement, useCallback, useMemo, useState } from "react";
import { ListRenderItemInfo, RefreshControl, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BOTTOM_TABS_HEIGHT } from "@/common/components/BottomTabs/config";
import ErrorState from "@/common/components/ErrorState/ErrorState";
import GroupBand from "@/common/components/GroupBand/GroupBand";
import PagingList from "@/common/components/PagingList/PagingList";
import SectionLabel from "@/common/components/SectionLabel/SectionLabel";
import { useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { useUserStore } from "@/common/stores/useUserStore";
import { useCartItemCount } from "@/features/cart/hooks/useGetCart";
import FeedCaughtUp from "@/features/home/components/FeedCaughtUp/FeedCaughtUp";
import FeedHeader from "@/features/home/components/FeedHeader/FeedHeader";
import FollowingEmptyState from "@/features/home/components/FollowingEmptyState/FollowingEmptyState";
import { useHomeSummary } from "@/features/home/hooks/useHomeSummary";
import { HomeSummary } from "@/features/home/types/home";
import { useNotificationBadge } from "@/features/notification/hooks/useNotificationBadge";
import PostCard from "@/features/post/components/PostCard/PostCard";
import PostCardSkeleton from "@/features/post/components/PostCardSkeleton/PostCardSkeleton";
import { useFeedActions } from "@/features/post/hooks/useFeedActions";
import { useGetFollowingFeed } from "@/features/post/hooks/useGetFollowingFeed";
import { useGetRecommendedFeed } from "@/features/post/hooks/useGetRecommendedFeed";
import { usePostImpressions } from "@/features/post/hooks/usePostImpressions";
import { FeedItem } from "@/features/post/types/post";

/**
 * C1 홈 — 팔로잉 피드.
 *
 * 팔로잉 게시물을 다 보면 "새 게시물을 모두 확인했어요" 구분 블록이 나오고, 그 아래
 * [회원님을 위한 추천]으로 팔로우하지 않은 쇼룸의 게시물이 이어진다. 8px 회색 밴드로 위아래를
 * 끊어 내가 팔로우한 소식과 추천이 섞이지 않게 한다 — 이 구분이 없으면 팔로우한 적 없는 쇼룸의
 * 게시물이 내 피드에 낀 광고처럼 느껴진다.
 *
 * 팔로잉이 0이면 쇼룸 목록을 나열하는 대신 추천 피드를 그대로 이어 붙인다. 이름만 있는 목록으로는
 * 팔로우를 결정할 근거가 없지만, 게시물을 보면 무엇을 파는 쇼룸인지 바로 판단할 수 있다 —
 * 빈 상태가 곧 발견(discovery) 피드가 된다.
 *
 * 빈 상태는 "팔로잉 피드가 비었다"가 아니라 "팔로우한 쇼룸이 없다"(홈 요약 `followingCount`)로
 * 가른다. 팔로우는 했는데 그 쇼룸들이 아직 글을 안 올렸으면 [팔로우한 쇼룸이 없어요]는 거짓이라
 * "모두 확인했어요" 블록을 둔다. 구버전 서버라 값이 없으면 피드가 비었는지로 판정한다.
 */
type FeedRow =
  | { key: string; type: "post"; item: FeedItem; isRecommended: boolean }
  | { key: string; type: "caughtUp" }
  | { key: string; type: "emptyFollowing" }
  | { key: string; type: "band" }
  | { key: string; type: "sectionLabel"; label: string };

const selectFollowingCount = (summary: HomeSummary) => summary.followingCount;

export default function HomeView() {
  const inset = useSafeAreaInsets();
  const navigation = useMainNavigation();
  const { user } = useUserStore();

  const followingFeed = useGetFollowingFeed(!!user);
  const recommendedFeed = useGetRecommendedFeed();
  const cartItemCount = useCartItemCount();
  const notificationBadge = useNotificationBadge();
  const followingCountQuery = useHomeSummary(selectFollowingCount);

  const [isRefreshing, setIsRefreshing] = useState(false);

  /** 당겨서 새로고침 — 두 피드가 한 목록으로 이어져 있어 함께 받아 온다 */
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([followingFeed.refetch(), recommendedFeed.refetch()]);
    } finally {
      setIsRefreshing(false);
    }
  }, [followingFeed, recommendedFeed]);

  const {
    handlePressPost,
    handlePressShowroom,
    handlePressProduct,
    handlePressLike,
    handlePressFollow,
    handlePressMore,
  } = useFeedActions();
  const { handleViewableItemsChanged, viewabilityConfig } = usePostImpressions();

  const hasFollowingPosts = followingFeed.content.length > 0;
  const isFollowingExhausted = !followingFeed.pageInfo?.hasNext;
  const hasFollowedShowroom = hasFollowingPosts || (followingCountQuery.data ?? 0) > 0;

  const rows = useMemo((): Array<FeedRow> => {
    const followingRows: Array<FeedRow> = followingFeed.content.map(item => ({
      key: `following-${item.post.postId}`,
      type: "post",
      item,
      isRecommended: false,
    }));

    // 팔로잉을 아직 더 받아올 게 남아 있으면 추천을 붙이지 않는다 — 아래로 계속 팔로잉이 이어진다
    if (!user || (hasFollowingPosts && !isFollowingExhausted)) {
      return followingRows;
    }

    const recommendedRows: Array<FeedRow> = recommendedFeed.content.map(item => ({
      key: `recommended-${item.post.postId}`,
      type: "post",
      item,
      isRecommended: true,
    }));

    if (recommendedRows.length === 0) {
      return followingRows;
    }

    const divider: Array<FeedRow> = hasFollowedShowroom
      ? [
          { key: "band-top", type: "band" },
          { key: "caught-up", type: "caughtUp" },
          { key: "band-bottom", type: "band" },
        ]
      : [
          { key: "empty-following", type: "emptyFollowing" },
          { key: "band-bottom", type: "band" },
        ];

    return [
      ...followingRows,
      ...divider,
      { key: "recommended-label", type: "sectionLabel", label: "회원님을 위한 추천" },
      ...recommendedRows,
    ];
  }, [
    followingFeed.content,
    hasFollowedShowroom,
    hasFollowingPosts,
    isFollowingExhausted,
    recommendedFeed.content,
    user,
  ]);

  const handlePressSearch = useCallback(() => {
    navigation.navigate(ROOT_ROUTES.COMMON, {
      screen: COMMON_ROUTES.SEARCH,
      params: { keyword: "" },
    });
  }, [navigation]);

  const handlePressNotification = useCallback(() => {
    navigation.navigate(ROOT_ROUTES.COMMON, { screen: COMMON_ROUTES.NOTIFICATION });
  }, [navigation]);

  const handlePressCart = useCallback(() => {
    navigation.navigate(ROOT_ROUTES.COMMON, { screen: COMMON_ROUTES.CART });
  }, [navigation]);

  const handleLoadMore = useCallback(() => {
    // 팔로잉을 끝까지 받은 뒤에야 추천으로 넘어간다
    if (user && followingFeed.pageInfo?.hasNext && !followingFeed.isFetchingNextPage) {
      void followingFeed.fetchNextPage();
      return;
    }
    if (recommendedFeed.pageInfo?.hasNext && !recommendedFeed.isFetchingNextPage) {
      void recommendedFeed.fetchNextPage();
    }
  }, [followingFeed, recommendedFeed, user]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<FeedRow>) => {
      switch (item.type) {
        case "post":
          return (
            <PostCard
              item={item.item}
              onPressPost={handlePressPost}
              onPressShowroom={handlePressShowroom}
              onPressFollow={handlePressFollow}
              onPressLike={handlePressLike}
              onPressProduct={handlePressProduct}
              onPressMore={handlePressMore}
            />
          );
        case "caughtUp":
          return <FeedCaughtUp />;
        case "emptyFollowing":
          return <FollowingEmptyState onPressSearch={handlePressSearch} />;
        case "band":
          return <GroupBand height={5} />;
        case "sectionLabel":
          return (
            <View className="bg-white">
              <SectionLabel label={item.label} className="pb-4 pt-18" />
            </View>
          );
      }
    },
    [
      handlePressFollow,
      handlePressLike,
      handlePressMore,
      handlePressPost,
      handlePressProduct,
      handlePressSearch,
      handlePressShowroom,
    ]
  );

  const pageInfo =
    user && followingFeed.pageInfo?.hasNext ? followingFeed.pageInfo : recommendedFeed.pageInfo;
  const isEmpty = rows.length === 0;
  const isFetchingFeed = (!!user && followingFeed.isFetching) || recommendedFeed.isFetching;
  const isLoading =
    followingCountQuery.isLoading ||
    followingFeed.isLoading ||
    recommendedFeed.isLoading ||
    followingFeed.isFetchingNextPage ||
    recommendedFeed.isFetchingNextPage ||
    // 오류 뒤 [다시 시도] — 상태가 error로 남아 isLoading이 서지 않으므로 받는 중이면 자리 표시를 띄운다
    (isEmpty && isFetchingFeed);

  /*
    한 번도 못 받았을 때만 전체 오류(§07) — 실패를 빈 피드로 그리면 「팔로우한 쇼룸이 없어요」라는
    거짓 안내가 된다. 이미 받은 게시물이 있으면 갱신 실패로 지우지 않는다.
  */
  const failedFeed = [recommendedFeed, ...(user ? [followingFeed] : [])].find(feed => feed.isError);
  const handleRetry = useCallback(() => {
    void followingCountQuery.refetch();
    if (user) {
      void followingFeed.refetch();
    }
    void recommendedFeed.refetch();
  }, [followingCountQuery, followingFeed, recommendedFeed, user]);

  /*
    팔로잉 게시물도 추천도 비었을 때 — 목록 행이 하나도 없어 구분 줄이 들어가지
    못하는 경우다. 이때만은 밑에 이어질 피드가 없으므로 안내를 가운데로 둔다 —
    위쪽에 붙여 두면 아래가 통째로 빈 화면이 된다.
  */
  const emptyFeed = hasFollowedShowroom ? (
    <View className="flex-1 justify-center bg-white pb-60">
      <FeedCaughtUp />
    </View>
  ) : (
    <FollowingEmptyState fill onPressSearch={handlePressSearch} />
  );

  let listEmpty: ReactElement | undefined = emptyFeed;

  if (isLoading) {
    listEmpty = undefined;
  } else if (failedFeed) {
    listEmpty = <ErrorState error={failedFeed.error} onRetry={handleRetry} />;
  }

  return (
    <View className="flex-1 bg-white">
      <FeedHeader
        cartCount={cartItemCount}
        notificationCount={notificationBadge}
        onPressSearch={handlePressSearch}
        onPressNotification={handlePressNotification}
        onPressCart={handlePressCart}
      />
      <PagingList
        data={rows}
        pageInfo={pageInfo}
        isLoading={isLoading}
        skeleton={<PostCardSkeleton />}
        skeletonCount={2}
        onLoadMore={handleLoadMore}
        keyExtractor={row => row.key}
        renderItem={renderItem}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        ListEmptyComponent={listEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={["#F2456E"]}
            tintColor="#F2456E"
          />
        }
        contentContainerStyle={{ flexGrow: 1, paddingBottom: inset.bottom + BOTTOM_TABS_HEIGHT }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
