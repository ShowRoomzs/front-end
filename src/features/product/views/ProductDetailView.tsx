import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback } from "react";
import { View } from "react-native";

import { useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";
import ProductDetailHeader from "@/features/product/components/ProductDetailHeader/ProductDetailHeader";

export default function ProductDetailView() {
  const { params } = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.PRODUCT_DETAIL>>();
  const { productId } = params;

  const navigation = useMainNavigation();
  const handlePressBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePressSearch = useCallback(() => {
    navigation.navigate(ROOT_ROUTES.COMMON, {
      screen: COMMON_ROUTES.SEARCH,
    });
  }, [navigation]);

  const handlePressCart = useCallback(() => {
    navigation.navigate(ROOT_ROUTES.COMMON, {
      screen: COMMON_ROUTES.CART,
    });
  }, [navigation]);

  return (
    <View className="flex-1">
      <ProductDetailHeader
        onPressBack={handlePressBack}
        onPressSearch={handlePressSearch}
        onPressCart={handlePressCart}
      />
    </View>
  );
}
