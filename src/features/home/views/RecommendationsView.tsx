import { useCallback, useEffect, useRef } from "react";
import { View } from "react-native";

import { useParams } from "@/common/hooks/useParams";
import { useGetRecommendationMarket } from "@/common/queries/useGetRecommendationMarket";
import { useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { RecommendationParams } from "@/common/types/recommendation";
import { useUpdateFollowing } from "@/features/following/hooks/useUpdateFollowing";
import BannerCarousel from "@/features/home/components/BannerCarousel/BannerCarousel";
import RecommendedProducts from "@/features/home/components/RecommendedProducts/RecommendedProducts";
import RecommendedShowroom from "@/features/home/components/RecommendedShowroom/RecommendedShowroom";

const RECOMMENDATION_MARKET_PARAMS: RecommendationParams = {
  page: 1,
  limit: 10,
  categoryId: null,
};

export default function RecommendationsView() {
  const { params } = useParams<RecommendationParams>(RECOMMENDATION_MARKET_PARAMS);
  const { data: recommendedMarkets, isLoading } = useGetRecommendationMarket(params);
  const { update: updateFollowing, cleanupFns: followingCleanupFns } = useUpdateFollowing();

  const handlePressFollow = useCallback(
    (marketId: number) => {
      updateFollowing(marketId, true);
    },
    [updateFollowing]
  );

  const mainNavigation = useMainNavigation();

  const handlePressProduct = useCallback(
    (productId: number) => {
      mainNavigation.navigate(ROOT_ROUTES.COMMON, {
        screen: COMMON_ROUTES.PRODUCT_DETAIL,
        params: {
          productId,
        },
      });
    },
    [mainNavigation]
  );

  const handlePressProfile = useCallback((marketId: number) => {
    // TODO : 쇼룸 상세 페이지 구현 후 네비게이션 추가
    console.log(marketId);
  }, []);

  const handlePressMore = useCallback(() => {
    // TODO : 추천 쇼룸 더 보기 페이지 구현 후 네비게이션 추가
    console.log("more");
  }, []);

  const followingCleanupFnsRef = useRef(followingCleanupFns);

  followingCleanupFnsRef.current = followingCleanupFns;

  useEffect(() => {
    return () => {
      followingCleanupFnsRef.current?.forEach((fn: () => void) => fn());
    };
  }, []);

  return (
    <View>
      <BannerCarousel />
      <RecommendedShowroom
        onPressMore={handlePressMore}
        onPressFollow={handlePressFollow}
        onPressProduct={handlePressProduct}
        onPressProfile={handlePressProfile}
        isLoading={isLoading}
        item={recommendedMarkets?.content[0]}
        containerClassName="mt-25 px-20"
      />
      <RecommendedProducts containerClassName="mt-30" />
    </View>
  );
}
