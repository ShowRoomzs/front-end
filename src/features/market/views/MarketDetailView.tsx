import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useRef } from "react";
import { View } from "react-native";

import { usePermissionPress } from "@/common/hooks/usePermissionPress";
import { useCommonNavigation } from "@/common/router";
import { COMMON_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";
import { useUpdateFollowing } from "@/features/following/hooks/useUpdateFollowing";
import MarketContent from "@/features/market/components/MarketContent/MarketContent";
import MarketDetailHeader from "@/features/market/components/MarketDetailHeader/MarketDetailHeader";
import { useGetMarketDetail } from "@/features/market/hooks/useGetMarketDetail";

export default function MarketDetailView() {
  const navigation = useCommonNavigation();
  const route = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.MARKET_DETAIL>>();
  const { marketId } = route.params;
  const { data: marketDetail } = useGetMarketDetail(marketId);
  const { update: updateFollowing, cleanupFns: followingCleanupFns } = useUpdateFollowing();

  const handlePressBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePressSearch = useCallback(() => {
    navigation.navigate(COMMON_ROUTES.SEARCH, { keyword: "" });
  }, [navigation]);

  const handlePressCart = useCallback(() => {
    navigation.navigate(COMMON_ROUTES.CART);
  }, [navigation]);

  const handlePressFollow = usePermissionPress(async (newIsFollowed: boolean) => {
    await updateFollowing(marketId, newIsFollowed);
  });

  const followCleanupFnsRef = useRef(followingCleanupFns);

  followCleanupFnsRef.current = followingCleanupFns;

  useEffect(() => {
    return () => {
      followCleanupFnsRef.current?.forEach((fn: () => void) => fn());
    };
  }, []);

  return (
    <View className="flex-1">
      <MarketDetailHeader
        onPressBack={handlePressBack}
        onPressSearch={handlePressSearch}
        onPressCart={handlePressCart}
      />
      <MarketContent wrapperClassName="mt-20 px-20" market={marketDetail} onPressFollow={handlePressFollow} />
    </View>
  );
}
