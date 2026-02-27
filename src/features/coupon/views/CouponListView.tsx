import { useCallback } from "react";
import { View } from "react-native";

import PagingList from "@/common/components/PagingList/PagingList";
import { useCouponNavigation } from "@/common/router";
import { COUPON_ROUTES } from "@/common/router/routes";
import CouponListActions from "@/features/coupon/components/CouponListActions/CouponListActions";
import CouponListHeader from "@/features/coupon/components/CouponListHeader/CouponListHeader";
import { useGetCoupons } from "@/features/coupon/hooks/useGetCoupons";
import { Coupon } from "@/features/coupon/types/coupon";

export default function CouponListView() {
  const navigation = useCouponNavigation();
  const { coupons, pageInfo, isFetching, fetchNextPage } = useGetCoupons();

  const handlePressBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleLoadMore = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  const handlePressRegister = useCallback(() => {
    navigation.navigate(COUPON_ROUTES.REGISTER);
  }, [navigation]);

  const renderItem = useCallback(() => <View />, []);

  return (
    <View className="flex-1 bg-gray0">
      <CouponListHeader onPressBack={handlePressBack} wrapperClassName="px-20" />
      <PagingList<Coupon>
        data={coupons}
        pageInfo={pageInfo}
        isLoading={isFetching}
        onLoadMore={handleLoadMore}
        renderItem={renderItem}
        keyExtractor={item => item.couponId.toString()}
      />
      <CouponListActions onPress={handlePressRegister} />
    </View>
  );
}
