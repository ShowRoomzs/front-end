import { StackActions } from "@react-navigation/native";
import { useCallback } from "react";
import { View } from "react-native";

import { useBottomTab } from "@/common/hooks/useBottomTab";
import { HOME_ROUTES, useMainNavigation } from "@/common/router";
import CartHeader from "@/features/cart/components/CartHeader/CartHeader";

export default function CartView() {
  const navigation = useMainNavigation();
  const { navigate } = useBottomTab();
  const handlePressBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePressHome = useCallback(() => {
    // 현재 스택 초기화
    navigation.dispatch(StackActions.popToTop());
    // home tab navigator > home 으로 라우팅
    navigate(HOME_ROUTES.HOME);
  }, [navigate, navigation]);

  return (
    <View className="flex-1">
      <CartHeader
        wrapperClassName="px-20 border-b-[1px] border-gray2 py-10"
        onPressBack={handlePressBack}
        onPressHome={handlePressHome}
      />
    </View>
  );
}
